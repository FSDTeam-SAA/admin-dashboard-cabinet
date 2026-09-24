import { auth } from "@/auth";
import { AdminShell } from "@/components/admin-shell";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth(); if (!session) redirect("/login");
  return <AdminShell>{children}</AdminShell>;
}
