"use client";

import Link from "next/link";
import { BriefcaseBusiness, PanelsTopLeft, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { dashboardApi, jobsApi } from "@/lib/api";
import { JobDetailsDialog, JobsTable, useDeleteJob } from "@/components/jobs-table";
import { Pagination } from "@/components/data-controls";
import { Skeleton } from "@/components/ui/skeleton";
import type { Job } from "@/types";

export function DashboardPage() {
  const [page, setPage] = useState(1); const [selected, setSelected] = useState<Job>();
  const stats = useQuery({ queryKey: ["dashboard"], queryFn: dashboardApi.getStats });
  const jobs = useQuery({ queryKey: ["jobs", "dashboard", page], queryFn: () => jobsApi.list({ page, limit: 9 }) });
  const remove = useDeleteJob();
  const cards = [
    { label: "Total Catalog", value: stats.data?.totalCatalog, icon: PanelsTopLeft, color: "bg-brand" },
    { label: "Active Jobs", value: stats.data?.activeJobs, icon: BriefcaseBusiness, color: "bg-green-500" },
    { label: "Total Staff", value: stats.data?.totalStaff, icon: Users, color: "bg-violet-400" },
    { label: "Total Jobs", value: stats.data?.totalJobs, icon: BriefcaseBusiness, color: "bg-cyan-300" },
  ];
  return <><section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-xl bg-white/55 p-4"><span className={`grid size-11 place-items-center rounded-xl text-white ${color}`}><Icon size={20} /></span>{stats.isLoading ? <Skeleton className="mt-3 h-7 w-20" /> : <strong className="mt-3 block text-2xl">{value || 0}</strong>}<span className="text-sm text-[#8290bd]">{label}</span></div>)}</section><section className="mt-10"><div className="flex items-center justify-between rounded-t-xl bg-white px-4 py-3"><h1 className="text-lg font-semibold">Recent Jobs</h1><Link href="/jobs" className="font-medium">See all</Link></div><JobsTable jobs={jobs.data?.data} loading={jobs.isLoading} onView={setSelected} onDelete={job => { if (confirm(`Delete ${job.jobRef || "this job"}?`)) remove.mutate(job._id); }} /><Pagination page={page} totalPages={jobs.data?.meta?.totalPages || 1} total={jobs.data?.meta?.total || 0} limit={9} onPage={setPage} /></section><JobDetailsDialog id={selected?._id} open={Boolean(selected)} onOpenChange={open => !open && setSelected(undefined)} /></>;
}
