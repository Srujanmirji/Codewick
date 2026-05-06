"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Star, Clock, ArrowRight, Plus, User, Loader2, Edit3, Trash2, Shield } from "lucide-react";
import { toast } from "@/store/useToastStore";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 15,
      mass: 0.8
    }
  }
};

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const res = await fetch('/api/user/listings');
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load your listings");
    } finally {
      setLoading(false);
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
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center liquid-glass-static p-6 rounded-[24px] gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-fustat font-black text-white/95 mb-1 drop-shadow-sm flex items-center gap-3">
            <ClipboardList className="text-cyan-400 w-8 h-8" />
            My Listings
          </h1>
          <p className="text-white/65 text-sm font-medium">Manage the skills you offer and want to learn.</p>
        </div>
      </motion.div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        ) : listings.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {listings.map((listing) => (
              <motion.div
                key={listing._id}
                layout
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                className="liquid-glass group relative overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_20px_rgba(34,213,238,0.1)] hover:border-cyan-400/30 flex flex-col"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 p-0.5 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                       <div className="w-full h-full rounded-[14px] bg-black/20 backdrop-blur-md flex items-center justify-center text-white font-black text-xl">
                         {listing.skillOffered.charAt(0)}
                       </div>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1.5 backdrop-blur-md border px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg",
                      listing.status === 'open' ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/5" :
                      listing.status === 'in-progress' ? "text-amber-400 border-amber-400/30 bg-amber-400/5" :
                      "text-white/40 border-white/10 bg-white/5"
                    )}>
                      {listing.status.toUpperCase()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white/95 group-hover:text-cyan-400 transition-colors mb-1 tracking-tight">{listing.skillOffered}</h3>
                  <p className="text-xs text-white/40 mb-3 font-medium flex items-center gap-2 flex-wrap">
                    wants <span className="text-white/70 font-bold bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">{listing.skillWanted}</span>
                  </p>
                  
                  <p className="text-sm text-white/50 mb-5 line-clamp-3 min-h-[60px] flex-1">{listing.description}</p>

                  <div className="flex items-center justify-between pt-5 border-t border-white/10 relative z-10 mt-auto">
                    <div className="flex items-center gap-2 text-white/90">
                      <div className="p-1.5 rounded-lg bg-cyan-400/10 text-cyan-400">
                         <Clock size={16} />
                      </div>
                      <span className="text-sm font-bold tracking-tight">{listing.creditCost} Credits</span>
                    </div>
                    
                    <div className="flex gap-2">
                       <button className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-white/90 hover:bg-white/10 transition-colors">
                          <Edit3 size={16} />
                       </button>
                       <button className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center liquid-glass rounded-3xl"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
              <ClipboardList className="text-white/20 w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-white/95 mb-2">You haven't posted any listings</h2>
            <p className="text-white/40 max-w-xs mb-6">Create a listing in the Marketplace to start offering your skills.</p>
            <a 
              href="/dashboard/marketplace"
              className="glass-button-primary bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 px-6 py-2 rounded-xl font-bold hover:bg-cyan-500/30 transition-all"
            >
              Go to Marketplace
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
