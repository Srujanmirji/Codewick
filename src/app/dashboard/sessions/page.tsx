"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, CheckCircle2, ChevronRight, XCircle, Star, Loader2, MessageSquare, ShieldCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/store/useToastStore";
import { useUserStore } from "@/store/useUserStore";

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

export default function SessionsPage() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeEvidence, setDisputeEvidence] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      const res = await fetch(`/api/sessions/${id}/complete`, { method: 'PATCH' });
      if (!res.ok) throw new Error("Failed to confirm session");
      toast.success("Completion confirmed!");
      fetchSessions();
    } catch (error) {
      toast.error("Error confirming session");
    }
  };

  const handleRate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/sessions/${selectedSession._id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review }),
      });
      if (!res.ok) throw new Error("Failed to submit rating");
      
      toast.success("Thank you for your feedback!");
      setIsRateModalOpen(false);
      setReview("");
      fetchSessions();
    } catch (error) {
      toast.error("Error submitting rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: selectedSession._id,
          reason: disputeReason,
          evidence: disputeEvidence
        }),
      });
      if (!res.ok) throw new Error("Failed to file dispute");
      
      toast.success("Dispute filed. AI Mediator will review it.");
      setIsDisputeModalOpen(false);
      setDisputeReason("");
      setDisputeEvidence("");
      fetchSessions();
    } catch (error) {
      toast.error("Error filing dispute");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSessions = Array.isArray(sessions) ? sessions.filter(s => {
    if (activeTab === "Upcoming") return s.status === 'scheduled' || s.status === 'in-progress';
    if (activeTab === "Completed") return s.status === 'completed';
    return s.status === 'disputed';
  }) : [];

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
        <button 
          onClick={() => fetchSessions()}
          className="glass-button px-6 py-2.5 text-sm font-semibold text-white/95 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Clock size={18} />} Sync Status
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2 p-1 liquid-glass-static w-fit rounded-2xl">
        {["Upcoming", "Completed", "Disputed"].map((tab) => (
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
          {loading ? (
             <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-cyan-400 w-10 h-10" /></div>
          ) : filteredSessions.length > 0 ? (
            filteredSessions.map((session) => {
              const isProvider = session.providerId._id === user?.id;
              const partner = isProvider ? session.learnerId : session.providerId;
              const hasConfirmed = isProvider ? session.providerConfirmed : session.learnerConfirmed;
              const hasRated = isProvider ? session.learnerRating !== undefined : session.providerRating !== undefined;

              return (
                <motion.div
                  key={session._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="liquid-glass p-5 group flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.2)]",
                      session.status === 'scheduled' && 'bg-cyan-400/10 text-cyan-400',
                      session.status === 'in-progress' && 'bg-amber-400/10 text-amber-400',
                      session.status === 'completed' && 'bg-emerald-400/10 text-emerald-400',
                      session.status === 'disputed' && 'bg-red-400/10 text-red-400'
                    )}>
                      {session.status === 'scheduled' && <Clock size={24} />}
                      {session.status === 'in-progress' && <Loader2 className="animate-spin" size={24} />}
                      {session.status === 'completed' && <CheckCircle2 size={24} />}
                      {session.status === 'disputed' && <XCircle size={24} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white/95 group-hover:text-cyan-400 transition-colors">
                        {session.listingId?.skillOffered || "Skill Swap"}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-white/40 mt-1">
                        <span className="flex items-center gap-1"><User size={14} /> {partner.name}</span>
                        <span>•</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          isProvider ? "bg-indigo-400/10 text-indigo-400" : "bg-teal-400/10 text-teal-400"
                        )}>
                          {isProvider ? "Mentor" : "Learner"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto md:gap-12">
                    <div className="text-left md:text-right">
                      <p className="text-sm font-semibold text-white/95">{new Date(session.scheduledAt).toLocaleDateString()}</p>
                      <p className="text-xs text-white/40">{new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {session.status === 'completed' ? (
                        <div className="flex gap-2">
                          <button 
                            disabled={isProvider ? session.learnerRating : session.providerRating}
                            onClick={() => {
                              setSelectedSession(session);
                              setIsRateModalOpen(true);
                            }}
                            className={cn(
                              "glass-button px-5 py-2 text-xs font-semibold flex items-center gap-2",
                              (isProvider ? session.learnerRating : session.providerRating) ? "opacity-50 text-emerald-400" : "text-white/95"
                            )}
                          >
                            {(isProvider ? session.learnerRating : session.providerRating) ? <><ShieldCheck size={14} /> Rated</> : <><Star size={14} /> Rate Partner</>}
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedSession(session);
                              setIsDisputeModalOpen(true);
                            }}
                            className="p-2 rounded-xl glass-button text-red-400/60 hover:text-red-400 transition-all"
                            title="Raise Dispute"
                          >
                            <AlertTriangle size={18} />
                          </button>
                        </div>
                      ) : session.status === 'disputed' ? (
                        <span className="text-xs font-bold text-red-400 bg-red-400/10 px-3 py-1 rounded-lg flex items-center gap-2">
                           <AlertTriangle size={14} /> Under Dispute
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <button 
                            disabled={hasConfirmed}
                            onClick={() => handleConfirm(session._id)}
                            className={cn(
                              "glass-button px-5 py-2 text-xs font-semibold flex items-center gap-2 transition-all",
                              hasConfirmed ? "bg-emerald-400/20 text-emerald-400 border-emerald-400/20" : "text-white/95 hover:bg-white/10"
                            )}
                          >
                            {hasConfirmed ? <><CheckCircle2 size={14} /> Waiting for Partner</> : "Confirm Completion"}
                          </button>

                          <button 
                            onClick={() => {
                              setSelectedSession(session);
                              setIsDisputeModalOpen(true);
                            }}
                            className="p-2 rounded-xl glass-button text-white/20 hover:text-red-400/60 transition-all"
                            title="Raise Dispute"
                          >
                            <AlertTriangle size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
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

      {/* Rating Modal */}
      <Modal
        isOpen={isRateModalOpen}
        onClose={() => !isSubmitting && setIsRateModalOpen(false)}
        title={`Rate your session with ${selectedSession?.providerId?._id === user?.id ? selectedSession?.learnerId?.name : selectedSession?.providerId?.name}`}
      >
        <form onSubmit={handleRate} className="space-y-6">
           <div className="flex flex-col items-center gap-4">
              <p className="text-white/60 text-sm">How was your experience?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform active:scale-90"
                  >
                    <Star 
                      size={32} 
                      className={cn(
                        "transition-colors",
                        star <= rating ? "fill-amber-400 text-amber-400" : "text-white/10"
                      )} 
                    />
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Your Review</label>
            <textarea
              required
              rows={4}
              placeholder="Tell others how it went..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400/50 outline-none transition-all resize-none"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full glass-button-primary bg-cyan-500 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Feedback"}
          </button>
        </form>
      </Modal>

      {/* Dispute Modal */}
      <Modal
        isOpen={isDisputeModalOpen}
        onClose={() => !isSubmitting && setIsDisputeModalOpen(false)}
        title={`File a Dispute for ${selectedSession?.listingId?.skillOffered || "Session"}`}
      >
        <form onSubmit={handleFileDispute} className="space-y-6">
           <div className="p-4 rounded-xl bg-red-400/5 border border-red-400/20 flex gap-4">
              <AlertTriangle className="text-red-400 flex-shrink-0" size={24} />
              <p className="text-xs text-red-200/60 leading-relaxed">
                Filing a dispute will halt any pending credit transfers. Our AI Mediator will review the session context and evidence to issue a verdict.
              </p>
           </div>

           <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Reason</label>
            <select 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-400/50 outline-none transition-all cursor-pointer"
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
            >
              <option value="" className="bg-[#0f172a]">Select a reason...</option>
              <option value="Partner did not show up" className="bg-[#0f172a]">Partner did not show up</option>
              <option value="Poor quality / Not as described" className="bg-[#0f172a]">Poor quality / Not as described</option>
              <option value="Inappropriate behavior" className="bg-[#0f172a]">Inappropriate behavior</option>
              <option value="Technical issues prevented session" className="bg-[#0f172a]">Technical issues prevented session</option>
            </select>
          </div>

           <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Evidence / Details</label>
            <textarea
              required
              rows={4}
              placeholder="Describe what happened in detail..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-400/50 outline-none transition-all resize-none"
              value={disputeEvidence}
              onChange={(e) => setDisputeEvidence(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full glass-button-primary bg-red-500 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "File Dispute"}
          </button>
        </form>
      </Modal>
    </motion.div>
  );
}
