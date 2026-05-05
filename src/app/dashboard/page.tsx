"use client";

import { useEffect, useState } from "react";
import { fetchDashboardData, Session, Activity, Dispute } from "@/lib/api";
import { UserSummaryCard } from "@/components/dashboard/UserSummaryCard";
import { CreditWalletCard } from "@/components/dashboard/CreditWalletCard";
import { ActiveSessions } from "@/components/dashboard/ActiveSessions";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PerformanceAnalytics } from "@/components/dashboard/PerformanceAnalytics";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    sessions: Session[];
    activities: Activity[];
    disputes: Dispute[];
    performance: any[];
    walletHistory: any[];
  } | null>(null);

  useEffect(() => {
    fetchDashboardData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center liquid-glass-static p-6 rounded-[24px] gap-4">
          <div>
            <h1 className="text-3xl font-fustat font-bold text-white/95 mb-1 drop-shadow-sm">Dashboard</h1>
            <p className="text-white/65">Welcome back! Here's what's happening with your account.</p>
          </div>
          <div className="text-sm text-white/65 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/80 animate-pulse shadow-[0_0_5px_rgba(34,213,238,0.5)]"></span>
            Live updating connected
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[200px] liquid-glass-static rounded-2xl animate-pulse"></div>
          <div className="h-[200px] liquid-glass-static rounded-2xl animate-pulse"></div>
        </div>

        <div className="h-[120px] liquid-glass-static rounded-[24px] animate-pulse"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[350px] liquid-glass-static rounded-2xl animate-pulse"></div>
          <div className="h-[350px] liquid-glass-static rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center liquid-glass-static p-6 rounded-[24px] gap-4">
        <div>
          <h1 className="text-3xl font-fustat font-bold text-white/95 mb-1 drop-shadow-sm">Dashboard</h1>
          <p className="text-white/65">Welcome back! Here's what's happening with your account.</p>
        </div>
        <div className="text-sm text-white/65 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/80 animate-pulse shadow-[0_0_5px_rgba(34,213,238,0.5)]"></span>
          Live updating connected
        </div>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col justify-between">
          <UserSummaryCard />
        </div>
        <div className="flex flex-col justify-between">
          <CreditWalletCard data={data.walletHistory} />
        </div>
      </div>

      {/* Middle Row (Quick Actions & Sessions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <div className="lg:col-span-1">
          <ActiveSessions sessions={data.sessions} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceAnalytics data={data.performance} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={data.activities} disputes={data.disputes} />
        </div>
      </div>
    </div>
  );
}
