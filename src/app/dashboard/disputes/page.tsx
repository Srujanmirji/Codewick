"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck, History, Info, ChevronRight, MessageSquare, Send, FileText, User as UserIcon, Loader2, Cpu, CheckCircle2, Plus } from "lucide-react";
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

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newDispute, setNewDispute] = useState({
    sessionId: "",
    reason: "Partner did not show up",
    description: ""
  });

  useEffect(() => {
    fetchDisputes();
    fetchSessions();
  }, []);

  const fetchDisputes = async () => {
    try {
      const res = await fetch('/api/disputes');
      const data = await res.json();
      setDisputes(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load disputes");
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      setSessions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load sessions for dispute selection");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDispute.sessionId) {
      toast.error("Please select a session to dispute");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: newDispute.sessionId,
          reason: newDispute.reason,
          evidence: newDispute.description
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      toast.success("Dispute filed successfully!");
      setIsModalOpen(false);
      setNewDispute({ sessionId: "", reason: "Partner did not show up", description: "" });
      fetchDisputes();
    } catch (error: any) {
      toast.error(error.message || "Failed to file dispute");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async (id: string) => {
    setIsSubmitting(true);
    toast.info("AI Mediator is analyzing your case...");
    try {
      const res = await fetch(`/api/disputes/${id}/resolve`, { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success("AI Verdict Issued: " + data.resolution.verdict);
      fetchDisputes();
    } catch (error) {
      toast.error("AI mediation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          Our AI Mediator analyzes session context and evidence to provide fair, neutral resolutions within seconds.
        </p>
      </motion.div>

      {/* Disputes List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
             <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-amber-400 w-10 h-10" /></div>
          ) : disputes.length > 0 ? (
            disputes.map((dispute) => (
              <motion.div
                key={dispute._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                variants={itemVariants}
                className="liquid-glass p-6 group flex flex-col gap-6 relative"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10",
                      dispute.status === 'resolved' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'
                    )}>
                      {dispute.status === 'resolved' ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white/95 group-hover:text-amber-400 transition-colors">{dispute.reason}</h3>
                      <div className="flex items-center gap-3 text-sm text-white/40 mt-1">
                        <span>Against {dispute.filedAgainst?.name}</span>
                        <span>•</span>
                        <span>{new Date(dispute.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md border",
                      dispute.status === 'resolved' ? 'text-emerald-400 border-emerald-400/20' : 'text-amber-400 border-amber-400/20'
                    )}>
                      {dispute.status}
                    </span>
                    {dispute.status === 'open' && (
                      <button 
                        onClick={() => handleResolve(dispute._id)}
                        disabled={isSubmitting}
                        className="glass-button-primary bg-cyan-500/10 border-cyan-400/30 text-cyan-400 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-cyan-500/20"
                      >
                        <Cpu size={14} /> AI Mediate
                      </button>
                    )}
                  </div>
                </div>

                {/* Dispute Content */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs text-white/40 uppercase font-bold mb-2">Evidence & Context</p>
                  <p className="text-sm text-white/70 italic">"{dispute.evidence}"</p>
                </div>

                {/* AI Verdict UI */}
                {dispute.status === 'resolved' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-cyan-400/5 border border-cyan-400/20 shadow-[0_0_40px_rgba(34,213,238,0.05)]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-cyan-400/20 text-cyan-400">
                        <Cpu size={18} />
                      </div>
                      <span className="text-sm font-black text-cyan-400 uppercase tracking-tighter">AI Mediator Verdict</span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed mb-4">
                      {dispute.resolution}
                    </p>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                          <CheckCircle2 size={14} /> Refund: {dispute.creditRefund} Credits
                       </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center liquid-glass">
              <p className="text-white/40">No disputes found. Everything looks good!</p>
            </div>
          )}
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
                value={newDispute.sessionId}
                onChange={(e) => setNewDispute({ ...newDispute, sessionId: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white appearance-none focus:outline-none focus:border-amber-400/50 transition-all cursor-pointer"
              >
                <option value="" className="bg-[#0f172a]">Select a session...</option>
                {sessions.map(s => (
                  <option key={s._id} value={s._id} className="bg-[#0f172a]">
                    {s.listingId?.skillOffered || 'Session'} with {s.providerId?.name || s.learnerId?.name}
                  </option>
                ))}
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
