import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Image
      src="/cabinetos-logo.png"
      alt="CabinetOS"
      width={77}
      height={51}
      priority
      className={cn(
        "h-auto object-contain",
        compact ? "w-[77px]" : "mx-auto w-[108px]",
        className,
      )}
    />
  );
}
