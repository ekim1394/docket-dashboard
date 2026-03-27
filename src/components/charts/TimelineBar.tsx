/**
 * TimelineBar — Hero element showing presidential administrations as a
 * proportional horizontal bar. Each segment is sized by years in office
 * and colored by party. Click a segment to filter the entire dashboard
 * to that administration's date range.
 *
 * Data: administrations.json (public/data/)
 */
"use client";

import { useMemo, useState } from "react";
import administrations from "@/../public/data/administrations.json";
import type { Administration } from "@/lib/types";
import { PARTY_COLORS } from "@/lib/colors";

interface TimelineBarProps {
  activeAdmin: string | null;
  onAdminClick: (id: string | null) => void;
}

/** Year tick marks rendered below the bar */
const YEAR_LABELS = [2000, 2004, 2008, 2012, 2016, 2020, 2024];

export default function TimelineBar({
  activeAdmin,
  onAdminClick,
}: TimelineBarProps) {
  const admins = administrations as Administration[];

  // Capture "now" once on mount so render stays pure
  const [now] = useState(() => Date.now());

  /** The earliest start and latest end across all administrations */
  const timelineStart = new Date(admins[0].start).getTime();
  const timelineEnd = now;
  const totalSpan = timelineEnd - timelineStart;

  /** Pre-compute width percentages so we only measure once */
  const segments = useMemo(
    () =>
      admins.map((admin) => {
        const start = new Date(admin.start).getTime();
        const end = admin.end ? new Date(admin.end).getTime() : now;
        const widthPct = ((end - start) / totalSpan) * 100;
        return { ...admin, widthPct };
      }),
    [admins, totalSpan, now],
  );

  /** Convert a calendar year to a percentage offset within the timeline */
  function yearToPercent(year: number): number {
    const ts = new Date(`${year}-01-20`).getTime();
    return ((ts - timelineStart) / totalSpan) * 100;
  }

  return (
    <section className="space-y-2">
      <span className="text-xs uppercase tracking-wider text-zinc-500">
        Presidential Administrations
      </span>

      {/* --- Bar segments --- */}
      <div className="flex h-12 w-full overflow-hidden rounded-lg">
        {segments.map((seg) => {
          const isActive = activeAdmin === seg.id;
          return (
            <button
              key={seg.id}
              type="button"
              onClick={() => onAdminClick(isActive ? null : seg.id)}
              className={`relative flex items-center justify-center overflow-hidden text-xs font-semibold text-white transition-all ${
                isActive ? "ring-2 ring-white" : ""
              } ${activeAdmin && !isActive ? "opacity-40" : "opacity-100"}`}
              style={{
                width: `${seg.widthPct}%`,
                backgroundColor: PARTY_COLORS[seg.party],
              }}
              title={`${seg.fullName} (${seg.start.slice(0, 4)}–${seg.end ? seg.end.slice(0, 4) : "present"})`}
            >
              <span className="truncate px-1">{seg.name}</span>
            </button>
          );
        })}
      </div>

      {/* --- Year labels --- */}
      <div className="relative h-4 w-full">
        {YEAR_LABELS.map((year) => {
          const left = yearToPercent(year);
          if (left < 0 || left > 100) return null;
          return (
            <span
              key={year}
              className="absolute -translate-x-1/2 text-[10px] text-zinc-500"
              style={{ left: `${left}%` }}
            >
              {year}
            </span>
          );
        })}
      </div>
    </section>
  );
}
