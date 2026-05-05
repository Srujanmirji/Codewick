"use client";

import { motion } from "framer-motion";
import { HandHelping, GraduationCap, PlayCircle, ShieldAlert } from "lucide-react";

const actions = [
  { label: "Request Skill", icon: HandHelping, color: "text-cyan-400" },
  { label: "Offer Skill", icon: GraduationCap, color: "text-indigo-400" },
  { label: "Start Session", icon: PlayCircle, color: "text-teal-400" },
  { label: "Raise Dispute", icon: ShieldAlert, color: "text-amber-400" },
];

export function QuickActions() {
  return (
    <div className="liquid-glass-static p-6 h-full flex flex-col justify-center">
      <h3 className="text-sm font-semibold bg-gradient-to-r from-cyan-100 to-white/40 bg-clip-text text-transparent mb-4 uppercase tracking-widest drop-shadow-sm">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.96 }}
            className="flex flex-col items-center justify-center gap-3 p-4 glass-button group relative overflow-hidden h-32"
          >
            <div className="relative z-10 p-3 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <action.icon className={`w-5 h-5 ${action.color} drop-shadow-[0_0_5px_rgba(34,213,238,0.3)]`} />
            </div>
            <span className="text-sm font-medium text-white/65 group-hover:text-white transition-colors relative z-10">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
