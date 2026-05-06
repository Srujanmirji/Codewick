"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, CloudUpload, X, FileText, Image as ImageIcon, Video, CheckCircle2, MoreVertical, Trash2, Globe } from "lucide-react";
import { toast } from "@/store/useToastStore";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

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
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

interface Work {
  id: string;
  name: string;
  size: string;
  type: "image" | "video" | "document";
  status: "uploaded" | "uploading";
  date: string;
  thumbnail?: string;
}

const INITIAL_WORKS: Work[] = [
  { id: "1", name: "UI Design Case Study.pdf", size: "4.2 MB", type: "document", status: "uploaded", date: "2 hours ago" },
  { id: "2", name: "Backend Architecture.png", size: "1.8 MB", type: "image", status: "uploaded", date: "Yesterday" },
  { id: "3", name: "Mentoring Intro.mp4", size: "12.5 MB", type: "video", status: "uploaded", date: "3 days ago" },
];

export default function HostHubPage() {
  const [works, setWorks] = useState<Work[]>(INITIAL_WORKS);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const newWork: Work = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
        status: "uploaded",
        date: "Just now"
      };
      
      setWorks([newWork, ...works]);
      setIsUploading(false);
      toast.success(`${file.name} uploaded successfully!`);
    }, 2000);
  };

  const deleteWork = (id: string) => {
    setWorks(works.filter(w => w.id !== id));
    toast.success("Work removed from your hub.");
  };

  const handleSelectPlan = async (planName: string) => {
    const amount = planName === "Pro" ? 1999 : 499;
    
    setLoading(true);
    try {
      // 1. Create order on the server
      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      
      const order = await response.json();
      
      if (order.error) throw new Error(order.error);

      // 2. Initialize Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SlxeAxGll53qqE',
        amount: order.amount,
        currency: order.currency,
        name: "SkillSwap Pro",
        description: `Upgrade to ${planName} Plan`,
        order_id: order.id,
        handler: function (response: any) {
          // 3. Handle payment success
          toast.success(`Payment Successful! Transaction ID: ${response.razorpay_payment_id}`);
          setIsPlansModalOpen(false);
          // Here you would typically verify the payment on the server and update user status
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#22d3ee",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error("Payment failed:", error);
      toast.error(error.message || "Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 w-full max-w-7xl mx-auto flex flex-col space-y-8 pb-20"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center liquid-glass-static p-8 rounded-[32px] gap-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h1 className="text-4xl font-fustat font-black text-white mb-2 tracking-tight flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,213,238,0.3)]">
                <LayoutGrid size={32} />
              </div>
              Host Hub
            </h1>
            <p className="text-white/50 text-lg font-medium ml-1">Showcase your expertise and manage your hosting portfolio.</p>
          </div>
          
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="relative z-10 glass-button group/btn px-8 py-4 text-white hover:text-cyan-400 border-white/10 hover:border-cyan-400/30 flex items-center gap-3 active:scale-95 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-cyan-400/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            {isUploading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <>
                <CloudUpload className="group-hover/btn:scale-110 transition-transform" />
                <span className="font-bold">Upload New Work</span>
              </>
            )}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <motion.h2 variants={itemVariants} className="text-xl font-bold text-white/90 flex items-center gap-2 px-2">
              Your Showcase
              <span className="text-sm font-medium text-white/30 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">
                {works.length}
              </span>
            </motion.h2>

            <AnimatePresence mode="popLayout">
              {works.map((work) => (
                <motion.div
                  key={work.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="liquid-glass group p-5 flex items-center gap-5 hover:border-white/20 transition-all"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform group-hover:scale-105",
                    work.type === "image" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                    work.type === "video" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  )}>
                    {work.type === "image" ? <ImageIcon size={28} /> :
                     work.type === "video" ? <Video size={28} /> :
                     <FileText size={28} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold truncate group-hover:text-cyan-400 transition-colors">{work.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
                      <span className="font-medium">{work.size}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{work.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1.5 bg-cyan-400/10 text-cyan-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-cyan-400/20">
                      <Globe size={12} />
                      Public
                    </div>
                    <button 
                      onClick={() => deleteWork(work.id)}
                      className="p-2.5 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {works.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 bg-white/2 rounded-[32px] border border-dashed border-white/10"
              >
                <CloudUpload size={48} className="text-white/10 mb-4" />
                <p className="text-white/30 font-medium">No works uploaded yet. Start sharing your expertise!</p>
              </motion.div>
            )}
          </div>

          {/* Sidebar / Stats */}
          <div className="flex flex-col gap-6">
            <motion.div variants={itemVariants} className="liquid-glass-static p-6 rounded-[32px]">
              <h3 className="text-lg font-bold text-white mb-6">Host Stats</h3>
              <div className="space-y-6">
                {[
                  { label: "Total Views", value: "1.2k", icon: Globe, color: "text-cyan-400" },
                  { label: "Showcase Items", value: works.length, icon: LayoutGrid, color: "text-indigo-400" },
                  { label: "Profile Completion", value: "85%", icon: CheckCircle2, color: "text-emerald-400" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                        <stat.icon size={18} />
                      </div>
                      <span className="text-sm font-medium text-white/50">{stat.label}</span>
                    </div>
                    <span className="text-sm font-black text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-cyan-500 to-indigo-600 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-1">Pro Host</h3>
                <p className="text-3xl font-black mb-4">₹1,999<span className="text-sm font-medium opacity-60">/year</span></p>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">Unlock unlimited storage, premium analytics, and featured placement in the marketplace.</p>
                <button 
                  onClick={() => setIsPlansModalOpen(true)}
                  className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm hover:shadow-[0_10px_30px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 shadow-xl"
                >
                  Upgrade Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Plans Modal */}
      <Modal
        isOpen={isPlansModalOpen}
        onClose={() => setIsPlansModalOpen(false)}
        title="Choose Your Host Plan"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Starter Plan */}
          <div className="liquid-glass p-6 rounded-3xl border border-white/5 hover:border-cyan-400/30 transition-all flex flex-col">
            <h4 className="text-xl font-black text-white mb-1">Starter</h4>
            <p className="text-2xl font-black text-cyan-400 mb-4">₹499<span className="text-xs font-medium opacity-60 text-white">/month</span></p>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "10 Total Uploads",
                "500MB Total Storage",
                "Max File Size: 100MB",
                "Basic Analytics"
              ].map((benefit, i) => (
                <li key={i} className="text-sm text-white/60 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-400" />
                  {benefit}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSelectPlan("Starter")}
              disabled={loading}
              className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Choose Starter"}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="liquid-glass p-6 rounded-3xl border-2 border-cyan-400/50 relative overflow-hidden flex flex-col bg-cyan-400/5">
            <div className="absolute top-4 right-4 bg-cyan-400 text-black text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
              Popular
            </div>
            <h4 className="text-xl font-black text-white mb-1">Pro</h4>
            <p className="text-2xl font-black text-cyan-400 mb-4">₹1,999<span className="text-xs font-medium opacity-60 text-white">/year</span></p>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Unlimited Uploads",
                "10GB Total Storage",
                "Max File Size: 1GB",
                "Advanced Analytics",
                "Featured in Marketplace"
              ].map((benefit, i) => (
                <li key={i} className="text-sm text-white/90 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-400" />
                  {benefit}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSelectPlan("Pro")}
              disabled={loading}
              className="w-full py-3 bg-cyan-400 text-black rounded-xl font-bold hover:shadow-[0_0_20px_rgba(34,213,238,0.3)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
              {loading ? "Initializing..." : "Choose Pro"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
