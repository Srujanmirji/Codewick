"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck, History, Info, ChevronRight, MessageSquare, Send, FileText, User as UserIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { toast } from "@/store/useToastStore";

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

const INITIAL_DISPUTES = [
  { id: 1, title: "No-show for 'SEO Audit'", partner: "Sarah Jenkins", status: "In Review", date: "Today", severity: "Medium" },
  { id: 2, title: "Poor connection quality", partner: "Michael Chen", status: "Resolved", date: "May 02", severity: "Low" },
];

export default function DisputesPage() {
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [newDispute, setNewDispute] = useState({
    session: "UX Mentoring (Sarah)",
    reason: "Partner did not show up",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      const id = disputes.length + 1;
      const newItem = {
        id,
        title: `${newDispute.reason} in '${newDispute.session.split(': ')[1] || newDispute.session}'`,
        partner: newDispute.session.match(/\((.*?)\)/)?.[1] || "Partner",
        status: "In Review",
        date: "Just Now",
        severity: "High"
      };

      setDisputes([newItem, ...disputes]);
      setIsModalOpen(false);
      setIsSubmitting(false);
      setNewDispute({ session: "UX Mentoring (Sarah)", reason: "Partner did not show up", description: "" });
      toast.success("Dispute raised successfully! It is now visible in your list.");
    }, 1500);
  };

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
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glass-button-primary bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 px-7 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} /> Raise New Dispute
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
        <AnimatePresence mode="popLayout">
          {disputes.map((dispute) => (
            <motion.div
              key={dispute.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              variants={itemVariants}
              className="liquid-glass p-6 group flex flex-col md:flex-row items-center justify-between gap-6 relative"
            >
              {dispute.date === "Just Now" && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                </div>
              )}
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
        </AnimatePresence>
      </div>

      {/* New Dispute Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title="Raise a New Dispute"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Select Session</label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/60" size={18} />
              <select 
                value={newDispute.session}
                onChange={(e) => setNewDispute({ ...newDispute, session: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white appearance-none focus:outline-none focus:border-amber-400/50 transition-all cursor-pointer"
              >
                <option value="UX Mentoring (Sarah)" className="bg-[#0f172a]">Recent Session: UX Mentoring (Sarah)</option>
                <option value="Python Basics (Alex)" className="bg-[#0f172a]">May 04: Python Basics (Alex)</option>
                <option value="Logo Review (John)" className="bg-[#0f172a]">May 01: Logo Review (John)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Reason for Dispute</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/60" size={18} />
              <select 
                value={newDispute.reason}
                onChange={(e) => setNewDispute({ ...newDispute, reason: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white appearance-none focus:outline-none focus:border-amber-400/50 transition-all cursor-pointer"
              >
                <option value="Partner did not show up" className="bg-[#0f172a]">Partner did not show up</option>
                <option value="Technical issues during session" className="bg-[#0f172a]">Technical issues during session</option>
                <option value="Poor quality of instruction" className="bg-[#0f172a]">Poor quality of instruction</option>
                <option value="Inappropriate behavior" className="bg-[#0f172a]">Inappropriate behavior</option>
                <option value="Other" className="bg-[#0f172a]">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Detailed Description</label>
            <textarea 
              required
              value={newDispute.description}
              onChange={(e) => setNewDispute({ ...newDispute, description: e.target.value })}
              placeholder="Please describe exactly what happened..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400/50 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
              isSubmitting 
                ? "bg-white/5 text-white/20 cursor-not-allowed" 
                : "bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)] active:scale-95"
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              <>
                <Send size={18} /> Submit Dispute
              </>
            )}
          </button>
        </form>
      </Modal>
    </motion.div>
  );
}

function Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
