"use client";

import { useEffect, useState } from "react";
import { fetchDashboardData, Session, Activity, Dispute } from "@/lib/api";
import { UserSummaryCard } from "@/components/dashboard/UserSummaryCard";
import { CreditWalletCard } from "@/components/dashboard/CreditWalletCard";
import { ActiveSessions } from "@/components/dashboard/ActiveSessions";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PerformanceAnalytics } from "@/components/dashboard/PerformanceAnalytics";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { motion, AnimatePresence } from "framer-motion";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

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

  return (
    <AnimatePresence mode="wait">
      {loading || !data ? (
        <motion.div 
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex-1 w-full max-w-7xl mx-auto flex flex-col space-y-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center liquid-glass-static p-6 rounded-[24px] gap-4">
            <div>
              <div className="h-9 w-48 bg-white/5 rounded-lg animate-pulse"></div>
              <div className="h-4 w-64 bg-white/5 rounded-lg animate-pulse mt-2"></div>
            </div>
            <div className="h-10 w-40 bg-white/5 rounded-full animate-pulse border border-white/10"></div>
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
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 w-full max-w-7xl mx-auto flex flex-col space-y-6 pb-20"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center liquid-glass-static p-6 rounded-[24px] gap-4">
            <div>
              <h1 className="text-3xl font-fustat font-bold text-white/95 mb-1 drop-shadow-sm">Dashboard</h1>
              <p className="text-white/65">Welcome back! Here's what's happening with your account.</p>
            </div>
            <div className="text-sm text-white/65 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/80 animate-pulse shadow-[0_0_5px_rgba(34,213,238,0.5)]"></span>
              Live updating connected
            </div>
          </motion.div>

          {/* Top Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col justify-between">
              <UserSummaryCard />
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col justify-between">
              <CreditWalletCard data={data.walletHistory} />
            </motion.div>
          </div>

          {/* Middle Row (Quick Actions & Sessions) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <QuickActions />
            </motion.div>
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <ActiveSessions sessions={data.sessions} />
            </motion.div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <PerformanceAnalytics data={data.performance} />
            </motion.div>
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <RecentActivity activities={data.activities} disputes={data.disputes} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
