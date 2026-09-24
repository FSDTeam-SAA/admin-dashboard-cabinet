"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BriefcaseBusiness, PanelsTopLeft, Users, Settings, ChevronRight, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/products", label: "Product Catalog", icon: PanelsTopLeft },
  { href: "/staff", label: "My Staff", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const { data } = useSession(); const [open, setOpen] = useState(false);
  const name = data?.user?.name || [data?.user?.firstName, data?.user?.lastName].filter(Boolean).join(" ") || data?.user?.email || "Admin";
  return <div className="min-h-screen bg-canvas"><header className="sticky top-0 z-40 border-b border-[#eee5de] bg-canvas/95 backdrop-blur"><div className="mx-auto flex h-[92px] max-w-[1408px] items-center justify-between gap-6 px-4 lg:px-8"><Link href="/dashboard" className="shrink-0"><Logo compact /></Link><nav className="hidden flex-1 items-center justify-center md:flex"><div className="flex h-[52px] items-center gap-2 rounded-lg bg-white p-2 shadow-sm">{items.map(item => { const active = path.startsWith(item.href); const Icon = item.icon; return <Link key={item.href} href={item.href} className={cn("flex h-9 items-center gap-2 rounded-lg px-4 text-[15px] font-medium whitespace-nowrap", active ? "border border-brand text-brand" : "hover:bg-brand-soft")}><Icon size={19} />{item.label}</Link>; })}</div></nav><Link href="/settings" className="hidden h-[52px] min-w-[228px] items-center gap-3 rounded-lg bg-white px-4 text-sm shadow-sm lg:flex"><Avatar name={name} src={data?.user?.image} /><span className="min-w-0 flex-1 truncate">{name}</span><ChevronRight size={18} className="text-zinc-500" /></Link><button onClick={() => setOpen(v => !v)} className="grid size-11 place-items-center rounded-lg bg-white md:hidden" aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button></div>{open && <nav className="grid gap-1 border-t bg-white p-3 md:hidden">{items.map(item => { const Icon = item.icon; return <Link onClick={() => setOpen(false)} key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-lg px-4 py-3", path.startsWith(item.href) ? "bg-brand text-white" : "hover:bg-brand-soft")}><Icon size={20} />{item.label}</Link>; })}</nav>}</header><main className="mx-auto max-w-[1408px] px-4 py-6 lg:px-8">{children}</main></div>;
}

export function Avatar({ name, src, size = "md" }: { name: string; src?: string | null; size?: "sm" | "md" | "lg" }) {
  const dimensions = size === "sm" ? "size-8 text-xs" : size === "lg" ? "size-20 text-2xl" : "size-9 text-sm";
  // External profile hosts are controlled by the backend, so a native image is intentional here.
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt={name} className={cn("shrink-0 rounded-full object-cover", dimensions)} /> : <span className={cn("grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-ink font-semibold text-white", dimensions)}>{name.split(" ").map(v => v[0]).join("").slice(0, 2).toUpperCase()}</span>;
}
