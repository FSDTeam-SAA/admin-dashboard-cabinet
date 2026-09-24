"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBox({ value, onChange, placeholder = "Search user..." }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="flex h-12 w-full max-w-[400px] items-center gap-2 rounded-lg bg-white px-4 shadow-sm"><Search size={20} className="text-[#8796c0]" /><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8796c0]" /></label>;
}

export function Pagination({ page, totalPages, total, limit, onPage }: { page: number; totalPages: number; total: number; limit: number; onPage: (page: number) => void }) {
  if (!total) return null; const pages = Array.from(new Set([1, page - 1, page, page + 1, totalPages])).filter(v => v > 0 && v <= totalPages).sort((a, b) => a - b);
  return <div className="mt-4 flex flex-col gap-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between"><p>Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results</p><div className="flex items-center gap-2"><button aria-label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)} className="grid size-10 place-items-center rounded border bg-white disabled:opacity-40"><ChevronLeft size={18} /></button>{pages.map((value, i) => <span key={value} className="contents">{i > 0 && pages[i - 1] !== value - 1 && <span className="grid size-10 place-items-center rounded border bg-white">…</span>}<button onClick={() => onPage(value)} className={cn("size-10 rounded border", value === page ? "border-brand bg-brand text-white" : "bg-white")}>{value}</button></span>)}<button aria-label="Next page" disabled={page >= totalPages} onClick={() => onPage(page + 1)} className="grid size-10 place-items-center rounded border bg-white disabled:opacity-40"><ChevronRight size={18} /></button></div></div>;
}

export function TableSkeleton({ columns = 7, rows = 9 }: { columns?: number; rows?: number }) {
  return <div className="overflow-hidden rounded-xl bg-white"><div className="grid h-14 items-center gap-5 border-b px-6" style={{ gridTemplateColumns: `repeat(${columns}, minmax(110px, 1fr))` }}>{Array.from({ length: columns }).map((_, i) => <div key={i} className="h-4 animate-pulse rounded bg-zinc-200" />)}</div>{Array.from({ length: rows }).map((_, row) => <div key={row} className="grid h-14 items-center gap-5 px-6" style={{ gridTemplateColumns: `repeat(${columns}, minmax(110px, 1fr))` }}>{Array.from({ length: columns }).map((_, i) => <div key={i} className="h-3 animate-pulse rounded bg-zinc-100" />)}</div>)}</div>;
}
