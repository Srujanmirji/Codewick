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
      type: "spring" as const,
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
    <div className="relative w-full h-full">
      {/* Background Orbs (Lava Lamp Effect) */}
      <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-cyan-500/20 blur-[120px] animate-float-slow pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] max-w-[350px] max-h-[350px] rounded-full bg-indigo-500/20 blur-[120px] animate-float-slow-reverse pointer-events-none -z-10" />
      <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] rounded-full bg-fuchsia-500/10 blur-[100px] animate-float-slow pointer-events-none -z-10" style={{ animationDelay: '5s' }} />

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
              <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse"></div>
              <div className="h-4 w-80 bg-white/5 rounded-lg animate-pulse mt-3"></div>
            </div>
            <div className="h-10 w-40 bg-white/5 rounded-full animate-pulse border border-white/10 hidden"></div>
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
              <h1 className="text-4xl font-fustat font-extrabold bg-gradient-to-r from-white via-cyan-300 to-indigo-400 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_15px_rgba(34,213,238,0.3)]">Welcome Fam!! 🚀</h1>
              <p className="text-white/70 font-medium tracking-wide">You're crushing it today. Ready for your next swap?</p>
            </div>
            <div></div>
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
    </div>
  );
}
