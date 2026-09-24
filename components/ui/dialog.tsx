"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[3px] data-[state=open]:animate-in" /><DialogPrimitive.Content className={cn("fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-6 shadow-2xl outline-none", className)}><DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 hover:bg-zinc-100" aria-label="Close"><X size={21} /></DialogPrimitive.Close>{children}</DialogPrimitive.Content></DialogPrimitive.Portal>;
}

export const DialogTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => <DialogPrimitive.Title className={cn("mb-5 text-2xl font-semibold", className)}>{children}</DialogPrimitive.Title>;
