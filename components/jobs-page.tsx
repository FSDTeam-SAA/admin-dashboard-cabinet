"use client";

import { useQuery } from "@tanstack/react-query";
import { BriefcaseBusiness } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { dashboardApi, jobsApi } from "@/lib/api";
import { JobDetailsDialog, JobsTable, useDeleteJob } from "@/components/jobs-table";
import { Pagination, SearchBox } from "@/components/data-controls";
import { Skeleton } from "@/components/ui/skeleton";
import type { Job } from "@/types";

export function JobsPage() {
  const [page, setPage] = useState(1); const [search, setSearch] = useState(""); const [filter, setFilter] = useState(""); const [selected, setSelected] = useState<Job>(); const deferred = useDeferredValue(search);
  const stats = useQuery({ queryKey: ["dashboard"], queryFn: dashboardApi.getStats });
  const jobs = useQuery({ queryKey: ["jobs", page, deferred, filter], queryFn: () => jobsApi.list({ page, limit: 9, search: deferred || undefined, status: filter || undefined }) }); const remove = useDeleteJob();
  const cards = [{ label: "Total Jobs", value: stats.data?.totalJobs, color: "bg-cyan-300" }, { label: "InProgress Jobs", value: stats.data?.activeJobs, color: "bg-brand" }, { label: "Completed Jobs", value: stats.data?.completedJobs, color: "bg-green-500" }];
  return <><section className="grid gap-5 md:grid-cols-3">{cards.map(card => <div key={card.label} className="rounded-xl bg-white p-4"><span className={`grid size-11 place-items-center rounded-xl text-white ${card.color}`}><BriefcaseBusiness size={20} /></span>{stats.isLoading ? <Skeleton className="mt-3 h-7 w-20" /> : <strong className="mt-3 block text-2xl">{card.value || 0}</strong>}<span className="text-sm text-[#8290bd]">{card.label}</span></div>)}</section><div className="my-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><SearchBox value={search} onChange={value => { setSearch(value); setPage(1); }} /><div className="flex rounded-lg bg-white p-1 text-sm text-zinc-500">{[["", "All"], ["In Progress", "InProgress"], ["Completed", "Completed"]].map(([value, label]) => <button key={label} onClick={() => { setFilter(value); setPage(1); }} className={`rounded-lg px-4 py-2 ${filter === value ? "bg-brand text-white" : ""}`}>{label}</button>)}</div></div><JobsTable jobs={jobs.data?.data} loading={jobs.isLoading} onView={setSelected} onDelete={job => { if (confirm(`Delete ${job.jobRef || "this job"}?`)) remove.mutate(job._id); }} /><Pagination page={page} totalPages={jobs.data?.meta?.totalPages || 1} total={jobs.data?.meta?.total || 0} limit={9} onPage={setPage} /><JobDetailsDialog id={selected?._id} open={Boolean(selected)} onOpenChange={open => !open && setSelected(undefined)} /></>;
}
