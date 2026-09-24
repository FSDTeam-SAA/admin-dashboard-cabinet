"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return <div className="relative"><Input {...props} type={show ? "text" : "password"} className="pr-12" /><button type="button" onClick={() => setShow(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" aria-label={show ? "Hide password" : "Show password"}>{show ? <Eye size={18} /> : <EyeOff size={18} />}</button></div>;
}

export function LoginForm() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); const data = new FormData(event.currentTarget);
    try { const result = await signIn("credentials", { email: data.get("email"), password: data.get("password"), redirect: false }); if (result?.error) throw new Error("Invalid email or password"); toast.success("Welcome back"); router.push("/dashboard"); router.refresh(); }
    catch (error) { toast.error(getErrorMessage(error, "Unable to sign in")); } finally { setLoading(false); }
  }
  return <><div className="mb-4 mt-4 text-center"><h1 className="font-serif text-2xl font-bold">Welcome back</h1><p className="mx-auto mt-2 max-w-sm text-sm">Please enter your email &amp; password to access<br className="hidden sm:block" /> your account.</p></div><form onSubmit={submit} className="space-y-3"><label className="block text-sm font-medium">Email<Input required type="email" name="email" placeholder="Enter your email" className="mt-2" /></label><label className="block text-sm font-medium">Password<PasswordInput required name="password" placeholder="••••••••••••••••" className="mt-2" /></label><div className="flex items-center justify-between text-sm text-zinc-500"><label className="flex items-center gap-2"><input type="checkbox" name="remember" className="size-4 rounded" />Remember me</label><Link href="/forgot-password" className="text-brand hover:underline">Forgot Password</Link></div><Button disabled={loading} className="mt-8 w-full" type="submit">{loading ? "Signing in…" : "Sign In"}</Button></form></>;
}

export function ForgotForm() {
  const router = useRouter();
  const mutation = useMutation({ mutationFn: authApi.forgotPassword, onSuccess: (_, email) => { toast.success("Verification code sent"); router.push(`/verify-email?email=${encodeURIComponent(email)}`); }, onError: e => toast.error(getErrorMessage(e)) });
  return <><div className="mb-4 mt-5 text-center"><h1 className="font-serif text-2xl font-bold">Forgot Password?</h1><p className="mt-2 text-sm">Enter your email and we’ll send you a code to reset your password</p></div><form onSubmit={e => { e.preventDefault(); mutation.mutate(String(new FormData(e.currentTarget).get("email"))); }} className="space-y-8"><label className="block text-sm font-medium">Email<Input required type="email" name="email" placeholder="Enter your email" className="mt-2" /></label><Button disabled={mutation.isPending} className="w-full" type="submit">{mutation.isPending ? "Sending…" : "Continue"}</Button></form></>;
}

export function OtpForm() {
  const router = useRouter(); const params = useSearchParams(); const email = params.get("email") || ""; const refs = useRef<Array<HTMLInputElement | null>>([]); const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const verify = useMutation({ mutationFn: () => authApi.verifyResetOtp(email, digits.join("")), onSuccess: () => { toast.success("Code verified"); router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${digits.join("")}`); }, onError: e => toast.error(getErrorMessage(e)) });
  const resend = useMutation({ mutationFn: () => authApi.forgotPassword(email), onSuccess: () => toast.success("A new code was sent"), onError: e => toast.error(getErrorMessage(e)) });
  return <><div className="mb-4 mt-5 text-center"><h1 className="font-serif text-2xl font-bold">Verify your email</h1><p className="mt-2 text-sm">we sent a 6-digit code to {email || "your email"}</p></div><div className="mx-auto flex max-w-[590px] justify-between gap-2">{digits.map((digit, i) => <input key={i} ref={el => { refs.current[i] = el; }} value={digit} onChange={e => { const value = e.target.value.replace(/\D/g, "").slice(-1); setDigits(d => d.map((v, x) => x === i ? value : v)); if (value && i < 5) refs.current[i + 1]?.focus(); }} onKeyDown={e => { if (e.key === "Backspace" && !digit && i > 0) refs.current[i - 1]?.focus(); }} inputMode="numeric" aria-label={`Digit ${i + 1}`} className="h-16 min-w-0 flex-1 rounded-xl bg-[#f3f5fc] text-center text-2xl text-[#8b98bf] outline-none focus:ring-2 focus:ring-brand" />)}</div><div className="my-4 text-right text-sm text-[#8b98bf]">Didn’t receive it ? <button onClick={() => resend.mutate()} className="ml-2 font-semibold text-emerald-700">Resend code</button></div><Button onClick={() => verify.mutate()} disabled={digits.some(v => !v) || verify.isPending} className="w-full">{verify.isPending ? "Verifying…" : "Verify"}</Button></>;
}

export function ResetForm() {
  const router = useRouter(); const params = useSearchParams(); const email = params.get("email") || ""; const otp = params.get("otp") || "";
  const mutation = useMutation({ mutationFn: (payload: { password: string; confirmPassword: string }) => authApi.resetPassword({ email, otp, ...payload }), onSuccess: () => { toast.success("Password changed successfully"); router.push("/login"); }, onError: e => toast.error(getErrorMessage(e)) });
  return <><div className="mb-4 mt-5 text-center"><h1 className="font-serif text-2xl font-bold">Reset Password</h1><p className="mt-2 text-sm">Please enter a new password for your account. Use a strong password to keep your account secure.</p></div><form onSubmit={e => { e.preventDefault(); const d = new FormData(e.currentTarget); const password = String(d.get("password")); const confirmPassword = String(d.get("confirmPassword")); if (password !== confirmPassword) return toast.error("Passwords do not match"); mutation.mutate({ password, confirmPassword }); }} className="space-y-3"><label className="block text-sm font-medium">New Password<PasswordInput required minLength={6} name="password" className="mt-2" /></label><label className="block text-sm font-medium">Confirm Password<PasswordInput required minLength={6} name="confirmPassword" className="mt-2" /></label><Button disabled={mutation.isPending} className="mt-8 w-full" type="submit">{mutation.isPending ? "Saving…" : "Change Password"}</Button></form></>;
}
