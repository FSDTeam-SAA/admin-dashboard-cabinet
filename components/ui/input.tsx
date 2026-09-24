import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => <input ref={ref} className={cn("h-12 w-full rounded-lg border border-brand/30 bg-white px-4 text-[15px] outline-none transition placeholder:text-zinc-400 focus:border-brand focus:ring-2 focus:ring-brand/15", className)} {...props} />);
Input.displayName = "Input";
