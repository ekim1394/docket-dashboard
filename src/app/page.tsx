"use client";

import { useState } from "react";

import type {
  DocketsByYear,
  CommentsByYear,
  AgencyActivity,
  ClustersJson,
} from "@/lib/types";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StatsRow from "@/components/layout/StatsRow";
import TimelineBar from "@/components/charts/TimelineBar";
import DocketVolumeChart from "@/components/charts/DocketVolumeChart";
import CommentChart from "@/components/charts/CommentChart";
import AgencyActivityChart from "@/components/charts/AgencyActivityChart";
import ClusterBreakdown from "@/components/charts/ClusterBreakdown";

import docketsByYearData from "@/../public/data/dockets-by-year.json";
import commentsByYearData from "@/../public/data/comments-by-year.json";
import agencyActivityData from "@/../public/data/agency-activity.json";
import clustersData from "@/../public/data/clusters.json";

const docketsByYear = docketsByYearData as DocketsByYear[];
const commentsByYear = commentsByYearData as CommentsByYear[];
const agencyActivity = agencyActivityData as AgencyActivity[];
const clusters = clustersData as ClustersJson;

export default function Dashboard() {
  const [activeAdmin, setActiveAdmin] = useState<string | null>(null);

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 sm:px-6">
        {/* Hero: presidential timeline */}
        <TimelineBar
          activeAdmin={activeAdmin}
          onAdminClick={setActiveAdmin}
        />

        {/* Summary stats */}
        <StatsRow
          activeAdmin={activeAdmin}
          docketsByYear={docketsByYear}
          commentsByYear={commentsByYear}
        />

        {/* Charts grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <DocketVolumeChart data={docketsByYear} activeAdmin={activeAdmin} />
          <CommentChart data={commentsByYear} activeAdmin={activeAdmin} />
          <AgencyActivityChart
            data={agencyActivity}
            activeAdmin={activeAdmin}
          />
          <ClusterBreakdown data={clusters} activeAdmin={activeAdmin} />
        </div>
      </main>

      <Footer />
    </>
  );
}
