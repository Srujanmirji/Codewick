"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
};

const SESSIONS = [
  { id: 1, skill: "React Mentoring", partner: "Sarah Jenkins", date: "May 12, 2026", time: "2:00 PM", status: "Upcoming", type: "Mentee" },
  { id: 2, skill: "UI Design Review", partner: "Michael Chen", date: "May 14, 2026", time: "10:00 AM", status: "Upcoming", type: "Mentor" },
  { id: 3, skill: "Python Basics", partner: "David Lee", date: "May 02, 2026", time: "4:00 PM", status: "Completed", type: "Mentee" },
  { id: 4, skill: "Logo Design", partner: "Emma Wilson", date: "April 28, 2026", time: "11:00 AM", status: "Completed", type: "Mentor" },
  { id: 5, skill: "SEO Strategy", partner: "Chris Evans", date: "April 15, 2026", time: "9:00 AM", status: "Cancelled", type: "Mentor" },
];

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const filteredSessions = SESSIONS.filter(session => session.status === activeTab);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 w-full max-w-7xl mx-auto flex flex-col space-y-6 pb-20"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center liquid-glass-static p-6 rounded-[24px] gap-4">
        <div>
          <h1 className="text-3xl font-fustat font-bold text-white/95 mb-1 drop-shadow-sm flex items-center gap-3">
            <Calendar className="text-cyan-400 w-8 h-8" />
            My Sessions
          </h1>
          <p className="text-white/65 text-sm">Manage your upcoming and past skill-swap sessions.</p>
        </div>
        <button className="glass-button-primary px-6 py-2.5 text-sm font-semibold text-white/95 transition-all hover:scale-105 active:scale-95">
          Schedule New Session
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2 p-1 liquid-glass-static w-fit rounded-2xl">
        {["Upcoming", "Completed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative",
              activeTab === tab 
                ? "text-white/95 bg-white/10 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                : "text-white/40 hover:text-white/60"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-cyan-400/5 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Sessions List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <motion.div
                key={session.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="liquid-glass p-5 group flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.2)]",
                    session.status === 'Upcoming' && 'bg-cyan-400/10 text-cyan-400',
                    session.status === 'Completed' && 'bg-emerald-400/10 text-emerald-400',
                    session.status === 'Cancelled' && 'bg-red-400/10 text-red-400'
                  )}>
                    {session.status === 'Upcoming' && <Clock size={24} />}
                    {session.status === 'Completed' && <CheckCircle2 size={24} />}
                    {session.status === 'Cancelled' && <XCircle size={24} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white/95 group-hover:text-cyan-400 transition-colors">{session.skill}</h3>
                    <div className="flex items-center gap-3 text-sm text-white/40 mt-1">
                      <span className="flex items-center gap-1"><User size={14} /> {session.partner}</span>
                      <span>•</span>
                      <span>{session.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto md:gap-12">
                  <div className="text-left md:text-right">
                    <p className="text-sm font-semibold text-white/95">{session.date}</p>
                    <p className="text-xs text-white/40">{session.time}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="glass-button px-5 py-2 text-xs font-semibold text-white/95 hover:bg-white/10 transition-all">
                      View Details
                    </button>
                    <button className="p-2 rounded-full glass-button text-white/40 hover:text-white/95 transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center liquid-glass"
            >
              <p className="text-white/40">No {activeTab.toLowerCase()} sessions found.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
