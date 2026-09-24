import { Suspense } from "react";
import { AuthShell } from "@/components/auth-shell";
import { OtpForm } from "@/components/auth-forms";
export default function Page() { return <AuthShell back><Suspense><OtpForm /></Suspense></AuthShell>; }
