import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" | "danger"; size?: "default" | "icon" | "sm" };

export function Button({ className, variant = "default", size = "default", ...props }: Props) {
  return <button className={cn("inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:pointer-events-none disabled:opacity-50", variant === "default" && "bg-brand text-white hover:bg-brand-dark", variant === "outline" && "border border-brand bg-white text-brand hover:bg-brand-soft", variant === "ghost" && "hover:bg-brand-soft", variant === "danger" && "bg-red-500 text-white hover:bg-red-600", size === "default" && "h-11 px-5", size === "sm" && "h-9 px-3 text-sm", size === "icon" && "size-9 p-0", className)} {...props} />;
}
