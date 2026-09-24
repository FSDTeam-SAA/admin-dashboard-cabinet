import { Suspense } from "react";
import { AuthShell } from "@/components/auth-shell";
import { ResetForm } from "@/components/auth-forms";
export default function Page() { return <AuthShell back><Suspense><ResetForm /></Suspense></AuthShell>; }
