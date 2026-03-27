/**
 * ClusterBreakdown — A grid of stat cards showing each regulatory cluster's
 * share of total dockets. Each card has a colored left border, a large
 * percentage, the cluster name, and a list of member agency codes.
 *
 * NOT a Recharts component — built with plain HTML/CSS grid.
 *
 * Data: ClustersJson (public/data/clusters.json)
 */
"use client";

import { useMemo } from "react";
import type { ClustersJson } from "@/lib/types";
import { CLUSTER_COLORS, CLUSTER_LABELS } from "@/lib/colors";
import Card from "@/components/ui/Card";

interface ClusterBreakdownProps {
  data: ClustersJson;
  activeAdmin: string | null;
}

export default function ClusterBreakdown({
  data,
  activeAdmin,
}: ClusterBreakdownProps) {
  /** Aggregate cluster data, optionally filtered to one admin */
  const clusters = useMemo(() => {
    // Step 1: filter byAdmin rows
    const rows = activeAdmin
      ? data.byAdmin.filter((r) => r.adminId === activeAdmin)
      : data.byAdmin;

    // Step 2: sum docketCount per cluster
    const totals = new Map<string, number>();
    let grandTotal = 0;
    for (const row of rows) {
      totals.set(row.cluster, (totals.get(row.cluster) ?? 0) + row.docketCount);
      grandTotal += row.docketCount;
    }

    // Step 3: derive percentage and attach agency codes from mappings
    const agenciesByCluster = new Map<string, string[]>();
    for (const m of data.mappings) {
      const list = agenciesByCluster.get(m.cluster) ?? [];
      list.push(m.agencyCode);
      agenciesByCluster.set(m.cluster, list);
    }

    return Array.from(totals.entries())
      .map(([cluster, count]) => ({
        cluster,
        docketCount: count,
        percentage: grandTotal > 0 ? (count / grandTotal) * 100 : 0,
        agencies: agenciesByCluster.get(cluster) ?? [],
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [data, activeAdmin]);

  return (
    <Card title="Regulatory Focus by Cluster">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {clusters.map((c) => (
          <div
            key={c.cluster}
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3"
            style={{ borderLeftWidth: 4, borderLeftColor: CLUSTER_COLORS[c.cluster] ?? CLUSTER_COLORS.other }}
          >
            <p className="text-2xl font-bold text-zinc-100">
              {c.percentage.toFixed(1)}%
            </p>
            <p className="text-sm font-medium text-zinc-300">
              {CLUSTER_LABELS[c.cluster] ?? c.cluster}
            </p>
            {c.agencies.length > 0 && (
              <p className="mt-1 text-xs text-zinc-500">
                {c.agencies.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
