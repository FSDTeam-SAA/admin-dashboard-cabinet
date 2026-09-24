"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Pencil, Shield, UserRound } from "lucide-react";
import { signOut } from "next-auth/react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { authApi, userApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export function SettingsPage() {
  const [tab, setTab] = useState<"profile" | "security">("profile"); const client = useQueryClient();
  const profile = useQuery({ queryKey: ["profile"], queryFn: userApi.profile });
  const update = useMutation({ mutationFn: userApi.update, onSuccess: response => { toast.success(response.message); client.invalidateQueries({ queryKey: ["profile"] }); }, onError: e => toast.error(getErrorMessage(e)) });
  const password = useMutation({ mutationFn: userApi.changePassword, onSuccess: response => toast.success(response.message), onError: e => toast.error(getErrorMessage(e)) });
  async function logout() { try { await authApi.logout(); } catch {} finally { await signOut({ callbackUrl: "/login" }); } }
  function profileSubmit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); update.mutate(new FormData(e.currentTarget)); }
  function passwordSubmit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const form = e.currentTarget; const data = new FormData(form); const payload = { currentPassword: String(data.get("currentPassword")), newPassword: String(data.get("newPassword")), confirmPassword: String(data.get("confirmPassword")) }; if (payload.newPassword !== payload.confirmPassword) return toast.error("Passwords do not match"); password.mutate(payload, { onSuccess: () => form.reset() }); }
  return <div className="grid gap-4 md:grid-cols-[365px_1fr]"><aside className="h-fit rounded-xl bg-white p-3"><h1 className="border-b px-1 pb-3 text-xl font-semibold">Settings</h1><div className="mt-3 space-y-2"><button onClick={() => setTab("profile")} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${tab === "profile" ? "bg-brand text-white" : ""}`}><UserRound size={20} />Profile</button><button onClick={() => setTab("security")} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${tab === "security" ? "bg-brand text-white" : ""}`}><Shield size={20} />Security</button><button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-red-500"><LogOut size={20} />Logout</button></div></aside><section className="rounded-xl bg-white"><h2 className="border-b px-4 py-4 text-xl font-semibold">{tab === "profile" ? "Personal Information" : "Change Password"}</h2>{profile.isLoading ? <div className="space-y-4 p-4">{Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-12" />)}</div> : tab === "profile" ? <form onSubmit={profileSubmit} className="p-4"><div className="grid gap-3 sm:grid-cols-2"><Editable label="First Name" name="firstName" value={profile.data?.firstName} /><Editable label="Last Name" name="lastName" value={profile.data?.lastName} /><Editable label="Email Address" name="email" type="email" value={profile.data?.email} disabled /><label className="space-y-2 text-sm">Language<select name="language" defaultValue="English" className="h-12 w-full rounded-lg border-0 bg-brand-soft px-3 outline-none"><option>English</option></select></label></div><div className="mt-8 border-t pt-4"><Button disabled={update.isPending} className="w-full max-w-[340px]">{update.isPending ? "Saving…" : "Save Changes"}</Button></div></form> : <form onSubmit={passwordSubmit} className="space-y-3 p-4"><label className="block text-sm">Current Password<Input required name="currentPassword" type="password" className="mt-2 border-0 bg-brand-soft" /></label><label className="block text-sm">New Password<Input required minLength={6} name="newPassword" type="password" className="mt-2 border-0 bg-brand-soft" /></label><label className="block text-sm">Confirm New Password<Input required minLength={6} name="confirmPassword" type="password" className="mt-2 border-0 bg-brand-soft" /></label><div className="mt-8 border-t pt-4"><Button disabled={password.isPending} className="w-full max-w-[340px]">{password.isPending ? "Saving…" : "Save Changes"}</Button></div></form>}</section></div>;
}

function Editable({ label, name, value, type, disabled }: { label: string; name: string; value?: string; type?: string; disabled?: boolean }) {
  return <label className="space-y-2 text-sm">{label}<span className="relative block"><Input name={name} type={type} defaultValue={value || ""} disabled={disabled} className="border-0 bg-brand-soft pr-10 disabled:opacity-70" />{!disabled && <Pencil size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />}</span></label>;
}
