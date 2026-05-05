"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, History, Info, ChevronRight, MessageSquare } from "lucide-react";

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

const DISPUTES = [
  { id: 1, title: "No-show for 'SEO Audit'", partner: "Sarah Jenkins", status: "In Review", date: "Today", severity: "Medium" },
  { id: 2, title: "Poor connection quality", partner: "Michael Chen", status: "Resolved", date: "May 02", severity: "Low" },
];

export default function DisputesPage() {
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
            <AlertTriangle className="text-amber-400 w-8 h-8" />
            Dispute Management
          </h1>
          <p className="text-white/65 text-sm">Review and manage session disputes or quality issues.</p>
        </div>
        <button className="glass-button-primary px-6 py-2.5 text-sm font-semibold text-white/95">
          Raise New Dispute
        </button>
      </motion.div>

      {/* Info Box */}
      <motion.div variants={itemVariants} className="liquid-glass p-5 border-amber-400/20 bg-amber-400/5 flex items-center gap-4">
        <Info className="text-amber-400 flex-shrink-0" size={24} />
        <p className="text-sm text-amber-200/80">
          Our team typically reviews disputes within 24-48 hours. Please ensure you have attached relevant proof or chat logs to your case.
        </p>
      </motion.div>

      {/* Disputes List */}
      <div className="grid grid-cols-1 gap-4">
        {DISPUTES.map((dispute) => (
          <motion.div
            key={dispute.id}
            variants={itemVariants}
            className="liquid-glass p-6 group flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 ${
                dispute.status === 'Resolved' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'
              }`}>
                {dispute.status === 'Resolved' ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white/95 group-hover:text-amber-400 transition-colors">{dispute.title}</h3>
                <div className="flex items-center gap-3 text-sm text-white/40 mt-1">
                  <span>with {dispute.partner}</span>
                  <span>•</span>
                  <span>{dispute.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto md:gap-12">
              <div className="flex flex-col md:items-end">
                <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md border ${
                  dispute.status === 'Resolved' ? 'text-emerald-400 border-emerald-400/20' : 'text-amber-400 border-amber-400/20'
                }`}>
                  {dispute.status}
                </span>
                <p className="text-xs text-white/40 mt-1">Severity: {dispute.severity}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="glass-button p-2 text-white/40 hover:text-white/95 transition-all">
                   <MessageSquare size={18} />
                </button>
                <button className="glass-button px-5 py-2 text-xs font-semibold text-white/95">
                  Manage Case
                </button>
                <button className="p-2 rounded-full glass-button text-white/40 hover:text-white/95 transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
