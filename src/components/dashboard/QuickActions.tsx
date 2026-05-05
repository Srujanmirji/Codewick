"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HandHelping, GraduationCap, PlayCircle, ShieldAlert, Send } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

const actions = [
  { id: "request", label: "Request Skill", icon: HandHelping, color: "text-cyan-400" },
  { id: "offer", label: "Offer Skill", icon: GraduationCap, color: "text-indigo-400" },
  { id: "start", label: "Start Session", icon: PlayCircle, color: "text-teal-400" },
  { id: "dispute", label: "Raise Dispute", icon: ShieldAlert, color: "text-amber-400" },
];

export function QuickActions() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const renderModalContent = () => {
    switch (activeModal) {
      case "request":
        return (
          <div className="space-y-4">
            <p className="text-white/60 text-sm">What skill are you looking for today?</p>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/50 transition-all"
              placeholder="e.g. React Development, Piano, Cooking..."
            />
            <button 
              onClick={() => {
                alert("Request sent successfully!");
                setActiveModal(null);
              }}
              className="w-full glass-button-primary py-3 flex items-center justify-center gap-2 font-bold active:scale-[0.98] transition-transform"
            >
              <Send size={18} /> Send Request
            </button>
          </div>
        );
      case "offer":
        return (
          <div className="space-y-4">
            <p className="text-white/60 text-sm">List a skill you want to teach others.</p>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-400/50 transition-all"
              placeholder="What are you an expert in?"
            />
            <button 
              onClick={() => {
                alert("Listing created successfully!");
                setActiveModal(null);
              }}
              className="w-full glass-button py-3 border-indigo-400/30 text-indigo-400 hover:bg-indigo-400/10 flex items-center justify-center gap-2 font-bold active:scale-[0.98] transition-transform"
            >
               Create Listing
            </button>
          </div>
        );
      case "start":
        return (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 bg-teal-400/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-400/30 animate-pulse">
              <PlayCircle className="text-teal-400 w-10 h-10" />
            </div>
            <h4 className="text-white text-lg font-bold">Ready to learn?</h4>
            <p className="text-white/60 text-sm">We'll connect you with your mentor in just a moment.</p>
            <button 
              onClick={() => {
                alert("Searching for mentors...");
                setActiveModal(null);
              }}
              className="w-full glass-button-primary bg-teal-500 hover:bg-teal-400 py-3 font-bold mt-4 active:scale-[0.98] transition-transform"
            >
              Join Waiting Room
            </button>
          </div>
        );
      case "dispute":
        return (
          <div className="space-y-4">
            <p className="text-white/60 text-sm">We're sorry something went wrong. Please describe the issue.</p>
            <textarea 
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 transition-all resize-none"
              placeholder="Tell us what happened..."
            />
            <button 
              onClick={() => {
                alert("Dispute submitted. Our team will review it shortly.");
                setActiveModal(null);
              }}
              className="w-full bg-amber-500/20 border border-amber-500/30 text-amber-500 hover:bg-amber-500/30 py-3 rounded-xl font-bold transition-all active:scale-[0.98] transition-transform"
            >
              Submit Dispute
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="liquid-glass-static p-6 h-full flex flex-col justify-center">
      <h3 className="text-sm font-semibold bg-gradient-to-r from-cyan-100 to-white/40 bg-clip-text text-transparent mb-4 uppercase tracking-widest drop-shadow-sm">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => (
          <motion.button
            key={idx}
            onClick={() => setActiveModal(action.id)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center gap-3 p-5 glass-button group relative overflow-hidden min-h-[110px]"
          >
            <div className="relative z-10 p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300 group-hover:bg-cyan-400/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <action.icon className={`w-5 h-5 ${action.color} drop-shadow-[0_0_8px_rgba(34,213,238,0.4)]`} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70 group-hover:text-white transition-colors relative z-10">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>

      <Modal 
        isOpen={activeModal !== null} 
        onClose={() => setActiveModal(null)} 
        title={actions.find(a => a.id === activeModal)?.label || ""}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
}
