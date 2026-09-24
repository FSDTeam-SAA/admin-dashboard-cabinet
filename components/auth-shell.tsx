import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export function AuthShell({ children, back = false }: { children: React.ReactNode; back?: boolean }) {
  return <main className="auth-bg grid min-h-screen place-items-center px-4 py-8"><section className="relative w-full max-w-[686px] rounded-xl bg-white px-6 py-8 shadow-2xl sm:px-10">{back && <Link href="/login" className="absolute left-6 top-6 flex items-center gap-3 font-serif text-lg font-bold sm:left-7"><ArrowLeft size={22} /> Back to sign In</Link>}<div className={back ? "pt-12" : ""}><Logo /></div>{children}</section></main>;
}
