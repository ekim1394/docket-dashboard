/**
 * CommentChart — Bar chart showing yearly public comment volume.
 * A single blue bar per year makes it easy to spot spikes in public
 * engagement (e.g. net-neutrality years).
 *
 * Data: CommentsByYear[] (public/data/comments-by-year.json)
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
} from "recharts";
import administrations from "@/../public/data/administrations.json";
import type { Administration, CommentsByYear } from "@/lib/types";
import { formatCount } from "@/lib/utils";
import Card from "@/components/ui/Card";

interface CommentChartProps {
  data: CommentsByYear[];
  activeAdmin: string | null;
}

export default function CommentChart({ data, activeAdmin }: CommentChartProps) {
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
    <Card title="Public Comment Volume">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={filtered}>
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
            formatter={(value) => [formatCount(Number(value)), "Comments"]}
            labelFormatter={(label) => `Year: ${label}`}
          />
          <Bar dataKey="total" fill="#3b82f6" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
