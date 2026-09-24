"use client";
/* eslint-disable @next/next/no-img-element */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { jobsApi } from "@/lib/api";
import { formatDate, getErrorMessage, money } from "@/lib/utils";
import type { Job } from "@/types";
import { Avatar } from "@/components/admin-shell";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TableSkeleton } from "@/components/data-controls";

export function StatusBadge({ status }: { status: string }) {
  const complete = status === "Completed" || status === "Active";
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs ${complete ? "bg-green-100 text-green-600" : status === "Suspended" ? "bg-orange-50 text-brand" : "bg-brand-soft text-brand"}`}>{status.replace("In Progress", "InProgress")}</span>;
}

export function JobsTable({ jobs, loading, onView, onDelete }: { jobs?: Job[]; loading?: boolean; onView: (job: Job) => void; onDelete: (job: Job) => void }) {
  if (loading) return <TableSkeleton columns={7} />;
  return <div className="table-scroll overflow-x-auto rounded-xl bg-white"><table className="w-full min-w-[1050px] text-sm"><thead><tr className="h-14 border-b text-left text-base text-brand"><th className="px-6">Staff Name</th><th>Customer Name</th><th>Customer Number</th><th>Customer Email</th><th>Property Address</th><th>Status</th><th className="px-6">Action</th></tr></thead><tbody>{jobs?.map(job => { const staff = job.assignedTo; const staffName = staff ? [staff.firstName, staff.lastName].filter(Boolean).join(" ") : "Unassigned"; return <tr key={job._id} className="h-[58px] border-b border-transparent hover:bg-brand-soft/40"><td className="px-6"><div className="flex items-center gap-3"><Avatar size="sm" name={staffName} src={typeof staff?.profileImage === "object" ? staff.profileImage?.url : staff?.profileImage} /><span>{staffName}</span></div></td><td>{job.customerName}</td><td>{job.phoneNumber || "—"}</td><td>{job.emailAddress || "—"}</td><td><span className="block max-w-[210px] truncate">{job.propertyAddress}</span></td><td><StatusBadge status={job.status} /></td><td className="px-6"><div className="flex gap-2"><button onClick={() => onView(job)} aria-label="View job" className="grid size-7 place-items-center rounded-full bg-blue-50 text-blue-500"><Eye size={16} /></button><button onClick={() => onDelete(job)} aria-label="Delete job" className="grid size-7 place-items-center rounded-full bg-red-50 text-red-400"><Trash2 size={15} /></button></div></td></tr>; })}{!jobs?.length && <tr><td colSpan={7} className="h-40 text-center text-zinc-400">No jobs found</td></tr>}</tbody></table></div>;
}

export function JobDetailsDialog({ id, open, onOpenChange }: { id?: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  const query = useQuery({ queryKey: ["job", id], queryFn: () => jobsApi.get(id!), enabled: Boolean(id && open) }); const job = query.data;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-[640px] p-4 sm:p-6"><DialogTitle className="sr-only">Job Proposal</DialogTitle>{query.isLoading ? <TableSkeleton columns={1} rows={7} /> : job ? <div className="overflow-hidden rounded-lg border border-brand/30 bg-[#fcf8f4] text-sm"><div className="flex items-start justify-between bg-[#ecd9c8] p-3"><div><h2 className="text-lg font-semibold text-brand">CabinetCraft Pro</h2><p className="text-xs text-zinc-500">Professional Kitchen Design &amp; Supply</p></div><div className="text-right text-xs"><p>{formatDate(job.date || job.createdAt)}</p><p className="text-zinc-500">Ref: {job.jobRef}</p></div></div><div className="border-b border-brand/30 p-3"><p className="text-brand">Prepared For</p><h3 className="mt-1 text-lg font-semibold">{job.customerName}</h3><p className="text-zinc-500">{job.propertyAddress}</p><p className="text-zinc-500">{job.phoneNumber} · {job.emailAddress}</p></div><div className="border-b border-brand/30 p-3"><p className="mb-3 text-brand">Cabinet Layout</p>{job.design?.layoutImage?.url ? <><span className="sr-only">Uploaded cabinet layout</span><img src={job.design.layoutImage.url} alt="Cabinet layout" className="h-64 w-full object-contain" /></> : <div className="grid h-56 place-items-center bg-white/70"><div className="w-4/5"><div className="grid grid-cols-5 gap-1">{["600", "800", "800", "800", "1000"].map((n, i) => <div key={i} className="border border-zinc-400 p-4 text-center">{String.fromCharCode(65 + i)}<span className="block text-xs text-zinc-400">{n}</span></div>)}</div><div className="mt-8 h-2 bg-zinc-500" /><div className="grid grid-cols-5 gap-1">{Array.from({length: 5}).map((_, i) => <div key={i} className="h-16 border border-zinc-400" />)}</div></div></div>}</div><div className="space-y-2 p-3"><p className="text-brand">Quotation Summary</p>{job.selectedProducts?.map((item, i) => <div key={i} className="flex justify-between"><span>{item.quantity}× {item.productId?.name || "Cabinet"}</span><span>{money(item.lineTotal)}</span></div>)}<div className="flex justify-between"><span>Tax ({job.estimate?.taxRate || 0}%)</span><span>{money(job.estimate?.taxAmount)}</span></div><div className="flex justify-between"><span>Installation</span><span>{money(job.estimate?.installationCharge)}</span></div><div className="flex justify-between border-t pt-2 text-base font-semibold"><span>Total</span><span>{money(job.estimate?.total)}</span></div><p className="pt-2 text-brand">Terms</p><p className="text-xs leading-5 text-zinc-500">{job.proposal?.terms || "50% deposit required upon acceptance. Balance due on installation completion."}</p></div></div> : <p className="py-20 text-center">Unable to load job</p>}</DialogContent></Dialog>;
}

export function useDeleteJob() {
  const client = useQueryClient();
  return useMutation({ mutationFn: jobsApi.remove, onSuccess: () => { toast.success("Job deleted"); client.invalidateQueries({ queryKey: ["jobs"] }); client.invalidateQueries({ queryKey: ["dashboard"] }); }, onError: e => toast.error(getErrorMessage(e)) });
}
