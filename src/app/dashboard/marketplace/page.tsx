"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Search, Filter, Star, Clock, ArrowRight, Plus, User, MessageSquare, Loader2, Send, Shield } from "lucide-react";
import { toast } from "@/store/useToastStore";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

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

const CATEGORIES = ['All Skills', 'Design', 'Development', 'Marketing', 'Languages', 'Business', 'Photography'];

export default function MarketplacePage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Skills");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newListing, setNewListing] = useState({
    skillOffered: "",
    skillWanted: "",
    description: "",
    category: "Development",
    creditCost: 1,
  });
  const [requestMessage, setRequestMessage] = useState("");

  useEffect(() => {
    fetchListings();
  }, [searchQuery, activeCategory]);

  const fetchListings = async () => {
    try {
      const categoryParam = activeCategory !== 'All Skills' ? `&category=${activeCategory}` : '';
      const res = await fetch(`/api/marketplace/listings?q=${searchQuery}${categoryParam}`);
      const data = await res.json();
      setListings(data);
    } catch (error) {
      toast.error("Failed to load marketplace listings");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/marketplace/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListing),
      });
      if (!res.ok) throw new Error("Failed to create listing");
      
      toast.success("Listing created successfully!");
      setIsCreateModalOpen(false);
      fetchListings();
    } catch (error) {
      toast.error("Error creating listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/marketplace/listings/${selectedListing._id}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: requestMessage }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to send request");
      }
      
      toast.success("Swap request sent! Check your Messages.");
      setIsRequestModalOpen(false);
      setRequestMessage("");
      
      // Redirect to messages so the user can see the request
      setTimeout(() => router.push('/dashboard/messages'), 1000);
    } catch (error: any) {
      toast.error(error.message || "Error sending request");
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
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center liquid-glass-static p-6 rounded-[24px] gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-fustat font-black text-white/95 mb-1 drop-shadow-sm flex items-center gap-3">
            <Store className="text-cyan-400 w-8 h-8" />
            Marketplace
          </h1>
          <p className="text-white/65 text-sm font-medium">Discover new skills and connect with mentors across the community.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, mentors, or tags..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-11 pr-4 text-sm text-white/95 placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            />
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="glass-button-primary bg-cyan-500 p-3 text-white transition-all active:scale-95 shadow-lg flex items-center gap-2 px-5"
          >
            <Plus size={20} /> <span className="hidden sm:inline">Create Listing</span>
          </button>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div variants={itemVariants} className="flex gap-3 overflow-x-auto pb-4 px-1 custom-scrollbar no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all relative group overflow-hidden border",
                isActive 
                  ? "bg-cyan-400 text-black border-cyan-400 shadow-[0_0_20px_rgba(34,213,238,0.4)]" 
                  : "text-white/40 border-white/5 hover:text-white/80 hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          );
        })}
      </motion.div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array.isArray(listings) && listings.map((listing) => (
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
                whileTap={{ scale: 0.98 }}
                className="liquid-glass group relative overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_20px_rgba(34,213,238,0.1)] hover:border-cyan-400/30"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 p-0.5 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                       <div className="w-full h-full rounded-[14px] bg-black/20 backdrop-blur-md flex items-center justify-center text-white font-black text-xl">
                         {listing.skillOffered.charAt(0)}
                       </div>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1.5 backdrop-blur-md border px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg transition-colors",
                      (listing.userId?.trustScore || 50) >= 70 ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/5" :
                      (listing.userId?.trustScore || 50) >= 40 ? "text-amber-400 border-amber-400/30 bg-amber-400/5" :
                      "text-red-400 border-red-400/30 bg-red-400/5"
                    )}>
                      <Shield size={14} className={cn(
                        (listing.userId?.trustScore || 50) >= 70 ? "text-emerald-400" :
                        (listing.userId?.trustScore || 50) >= 40 ? "text-amber-400" :
                        "text-red-400"
                      )} />
                      {listing.userId?.trustScore || 50}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white/95 group-hover:text-cyan-400 transition-colors mb-1 tracking-tight">{listing.skillOffered}</h3>
                  <p className="text-xs text-white/40 mb-3 font-medium flex items-center gap-2">
                    wants <span className="text-white/70 font-bold bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">{listing.skillWanted}</span>
                  </p>
                  
                  <p className="text-sm text-white/50 mb-5 line-clamp-2 min-h-[40px]">{listing.description}</p>

                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 border border-white/10">
                        <img src={listing.userId?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} alt="User" />
                     </div>
                     <span className="text-xs text-white/60 font-semibold">{listing.userId?.name || "Member"}</span>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-white/10 relative z-10">
                    <div className="flex items-center gap-2 text-white/90">
                      <div className="p-1.5 rounded-lg bg-cyan-400/10 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all duration-300">
                         <Clock size={16} />
                      </div>
                      <span className="text-sm font-bold tracking-tight">{listing.creditCost} Credits</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedListing(listing);
                        setIsRequestModalOpen(true);
                      }}
                      className="group/btn relative px-5 py-2.5 overflow-hidden rounded-xl"
                    >
                      <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                      <span className="relative flex items-center gap-2 text-sm font-black text-cyan-400 group-hover:gap-3 transition-all">
                        Swap <ArrowRight size={16} />
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {listings.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
            <Search className="text-white/20 w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-white/95 mb-2">No skills found</h2>
          <p className="text-white/40 max-w-xs">Be the first to offer a skill in this community!</p>
        </motion.div>
      )}

      {/* Create Listing Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => !isSubmitting && setIsCreateModalOpen(false)}
        title="Share Your Expertise"
      >
        <form onSubmit={handleCreateListing} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">What skill can you teach?</label>
            <input
              required
              placeholder="e.g. Next.js, UI Design, Cooking"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400/50 outline-none transition-all"
              value={newListing.skillOffered}
              onChange={(e) => setNewListing({...newListing, skillOffered: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">What do you want to learn?</label>
            <input
              required
              placeholder="e.g. Python, Yoga, Piano"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400/50 outline-none transition-all"
              value={newListing.skillWanted}
              onChange={(e) => setNewListing({...newListing, skillWanted: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Description</label>
            <textarea
              required
              rows={3}
              placeholder="Tell us about what you offer and what you expect..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400/50 outline-none transition-all resize-none"
              value={newListing.description}
              onChange={(e) => setNewListing({...newListing, description: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Category</label>
            <select
              value={newListing.category}
              onChange={(e) => setNewListing({...newListing, category: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400/50 outline-none transition-all appearance-none cursor-pointer"
            >
              {CATEGORIES.filter(c => c !== 'All Skills').map(cat => (
                <option key={cat} value={cat} className="bg-[#0f172a]">{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Credit Cost</label>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-1">
              <input 
                type="range" min="1" max="10" step="1" 
                className="flex-1 accent-cyan-400"
                value={newListing.creditCost}
                onChange={(e) => setNewListing({...newListing, creditCost: Number(e.target.value)})}
              />
              <span className="text-cyan-400 font-bold min-w-[3rem] text-center">{newListing.creditCost} Cr</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full glass-button-primary bg-cyan-500 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Post Listing"}
          </button>
        </form>
      </Modal>

      {/* Request Swap Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => !isSubmitting && setIsRequestModalOpen(false)}
        title={`Request swap with ${selectedListing?.userId?.name}`}
      >
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-cyan-400/5 border border-cyan-400/20">
            <p className="text-xs text-cyan-400 font-bold uppercase mb-1">Swap Summary</p>
            <p className="text-white text-sm">
              You will learn <span className="font-bold text-cyan-400">{selectedListing?.skillOffered}</span> 
              {" "}in exchange for teaching them <span className="font-bold text-white/90">{selectedListing?.skillWanted}</span>.
            </p>
            <p className="text-xs text-white/40 mt-2">Cost: {selectedListing?.creditCost} Time Credits</p>
          </div>

          <div className="flex items-center gap-2 px-1">
            <MessageSquare size={14} className="text-white/30" />
            <p className="text-xs text-white/40">This request will be sent via <span className="text-cyan-400 font-bold">Messages</span></p>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Message to Mentor</label>
            <textarea
              required
              rows={4}
              placeholder="Hi! I'd love to swap skills. I have experience in..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400/50 outline-none transition-all resize-none"
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />
          </div>

          <button
            onClick={handleSendRequest}
            disabled={isSubmitting || !requestMessage}
            className="w-full glass-button-primary bg-cyan-500 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Swap Request</>}
          </button>
        </div>
      </Modal>
    </motion.div>
  );
}
