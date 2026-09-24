import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = { title: "CabinetOS Admin", description: "Cabinet design and job management" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body><Providers>{children}</Providers></body></html>;
}
