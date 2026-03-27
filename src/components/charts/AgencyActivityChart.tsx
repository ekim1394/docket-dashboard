/**
 * AgencyActivityChart — Horizontal bar chart showing the top 10 agencies
 * by docket count. Bars are colored by the agency's regulatory cluster.
 * When an administration is selected the data is filtered to that admin;
 * otherwise counts are aggregated across all administrations.
 *
 * Data: AgencyActivity[] (public/data/agency-activity.json)
 */
"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { AgencyActivity } from "@/lib/types";
import { CLUSTER_COLORS, CLUSTER_LABELS } from "@/lib/colors";
import { formatCount } from "@/lib/utils";
import Card from "@/components/ui/Card";

interface AgencyActivityChartProps {
  data: AgencyActivity[];
  activeAdmin: string | null;
}

export default function AgencyActivityChart({
  data,
  activeAdmin,
}: AgencyActivityChartProps) {
  /** Aggregate and sort to get the top 10 agencies */
  const top10 = useMemo(() => {
    // Step 1: filter to selected admin or keep all
    const subset = activeAdmin
      ? data.filter((d) => d.adminId === activeAdmin)
      : data;

    // Step 2: aggregate docket counts per agency
    const map = new Map<
      string,
      { agencyCode: string; agencyName: string; cluster: string; total: number }
    >();
    for (const row of subset) {
      const existing = map.get(row.agencyCode);
      if (existing) {
        existing.total += row.docketCount;
      } else {
        map.set(row.agencyCode, {
          agencyCode: row.agencyCode,
          agencyName: row.agencyName,
          cluster: row.cluster,
          total: row.docketCount,
        });
      }
    }

    // Step 3: sort descending and take top 10
    return Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [data, activeAdmin]);

  return (
    <Card title="Top Agencies">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={top10} layout="vertical">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#27272a"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fill: "#71717a", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#27272a" }}
            tickFormatter={formatCount}
          />
          <YAxis
            type="category"
            dataKey="agencyCode"
            tick={{ fill: "#71717a", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#e4e4e7" }}
            itemStyle={{ color: "#a1a1aa" }}
            formatter={(value) => [formatCount(Number(value)), "Dockets"]}
            labelFormatter={(label) => String(label)}
          />
          <Bar dataKey="total" radius={[0, 4, 4, 0]}>
            {top10.map((entry) => (
              <Cell
                key={entry.agencyCode}
                fill={CLUSTER_COLORS[entry.cluster] ?? CLUSTER_COLORS.other}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Color legend for clusters represented in top 10 */}
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500">
        {Array.from(new Set(top10.map((d) => d.cluster))).map((cluster) => (
          <span key={cluster} className="flex items-center gap-1">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  CLUSTER_COLORS[cluster] ?? CLUSTER_COLORS.other,
              }}
            />
            {CLUSTER_LABELS[cluster] ?? cluster}
          </span>
        ))}
      </div>
    </Card>
  );
}
