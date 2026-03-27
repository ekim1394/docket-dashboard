/**
 * DocketVolumeChart — Stacked area chart showing docket volume by
 * regulatory cluster over time. Each cluster (environment, health,
 * finance, etc.) gets its own colored area.
 *
 * Data: DocketsByYear[] (public/data/dockets-by-year.json)
 */
"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import administrations from "@/../public/data/administrations.json";
import type { Administration, DocketsByYear } from "@/lib/types";
import { CLUSTER_COLORS, CLUSTER_LABELS } from "@/lib/colors";
import { formatCount } from "@/lib/utils";
import Card from "@/components/ui/Card";

interface DocketVolumeChartProps {
  data: DocketsByYear[];
  activeAdmin: string | null;
}

/** The cluster keys that correspond to stacked areas */
const CLUSTERS = [
  "environment",
  "health",
  "finance",
  "defense",
  "transportation",
  "communications",
  "other",
] as const;

export default function DocketVolumeChart({
  data,
  activeAdmin,
}: DocketVolumeChartProps) {
  const admins = administrations as Administration[];

  /** Filter data to the active administration's year range when set */
  const filtered = useMemo(() => {
    if (!activeAdmin) return data;
    const admin = admins.find((a) => a.id === activeAdmin);
    if (!admin) return data;
    const startYear = new Date(admin.start).getFullYear();
    const endYear = admin.end
      ? new Date(admin.end).getFullYear()
      : new Date().getFullYear();
    return data.filter((d) => d.year >= startYear && d.year <= endYear);
  }, [data, activeAdmin, admins]);

  return (
    <Card title="Docket Volume by Cluster">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={filtered}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="year"
            tick={{ fill: "#71717a", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#27272a" }}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatCount}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#e4e4e7" }}
            itemStyle={{ color: "#a1a1aa" }}
            formatter={(value, name) => [
              formatCount(Number(value)),
              CLUSTER_LABELS[String(name)] ?? String(name),
            ]}
            labelFormatter={(label) => `Year: ${label}`}
          />
          <Legend
            formatter={(value: string) => (
              <span className="text-xs text-zinc-400">
                {CLUSTER_LABELS[value] ?? value}
              </span>
            )}
          />
          {CLUSTERS.map((cluster) => (
            <Area
              key={cluster}
              type="monotone"
              dataKey={cluster}
              stackId="1"
              stroke={CLUSTER_COLORS[cluster]}
              fill={CLUSTER_COLORS[cluster]}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
