"use client";

import type { DocketsByYear, CommentsByYear, Administration } from "@/lib/types";
import { formatCount } from "@/lib/utils";
import administrations from "@/../public/data/administrations.json";

interface StatsRowProps {
  activeAdmin: string | null;
  docketsByYear: DocketsByYear[];
  commentsByYear: CommentsByYear[];
}

/** Return the start/end years for an administration, or null if not found. */
function getAdminRange(
  adminId: string
): { start: number; end: number } | null {
  const admin = (administrations as Administration[]).find(
    (a) => a.id === adminId
  );
  if (!admin) return null;

  const start = new Date(admin.start).getFullYear();
  const end = admin.end ? new Date(admin.end).getFullYear() : new Date().getFullYear();
  return { start, end };
}

/** Filter a yearly array to rows that fall within a year range (inclusive). */
function filterByRange<T extends { year: number }>(
  data: T[],
  range: { start: number; end: number } | null
): T[] {
  if (!range) return data;
  return data.filter((d) => d.year >= range.start && d.year <= range.end);
}

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

export default function StatsRow({
  activeAdmin,
  docketsByYear,
  commentsByYear,
}: StatsRowProps) {
  const range = activeAdmin ? getAdminRange(activeAdmin) : null;

  const filteredDockets = filterByRange(docketsByYear, range);
  const filteredComments = filterByRange(commentsByYear, range);

  const totalDockets = sum(filteredDockets.map((d) => d.total));
  const totalComments = sum(filteredComments.map((c) => c.total));

  const timeSpan = range
    ? `${range.start}–${range.end}`
    : "2000–Present";

  const stats = [
    { label: "Total Dockets", value: formatCount(totalDockets) },
    { label: "Total Comments", value: formatCount(totalComments) },
    { label: "Active Agencies", value: "21" },
    { label: "Time Span", value: timeSpan },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-xs text-zinc-500">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
