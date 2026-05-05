"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Search, Filter, Star, Clock, ArrowRight } from "lucide-react";
import { toast } from "@/store/useToastStore";
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

const SKILLS = [
  { id: 1, title: "UI/UX Design", mentor: "Sarah Jenkins", rating: 4.9, cost: "2.5 credits/hr", tags: ["Design", "Figma"], color: "from-cyan-400 to-indigo-500", category: "Design" },
  { id: 2, title: "Python Backend", mentor: "David Lee", rating: 4.8, cost: "3.0 credits/hr", tags: ["Python", "Django"], color: "from-indigo-400 to-purple-500", category: "Development" },
  { id: 3, title: "English Fluency", mentor: "Emma Wilson", rating: 5.0, cost: "1.5 credits/hr", tags: ["Language", "Speaking"], color: "from-teal-400 to-emerald-500", category: "Languages" },
  { id: 4, title: "Logo Branding", mentor: "Michael Chen", rating: 4.7, cost: "2.0 credits/hr", tags: ["Design", "Logo"], color: "from-rose-400 to-orange-500", category: "Design" },
  { id: 5, title: "React Development", mentor: "Chris Evans", rating: 4.9, cost: "3.5 credits/hr", tags: ["React", "JS"], color: "from-blue-400 to-cyan-500", category: "Development" },
  { id: 6, title: "SEO Strategy", mentor: "Anna Taylor", rating: 4.6, cost: "2.0 credits/hr", tags: ["Marketing", "SEO"], color: "from-amber-400 to-yellow-500", category: "Marketing" },
  { id: 7, title: "Next.js Mastery", mentor: "Srujan Mirji", rating: 5.0, cost: "4.0 credits/hr", tags: ["React", "Fullstack"], color: "from-violet-400 to-fuchsia-500", category: "Development" },
  { id: 8, title: "Portrait Photography", mentor: "Lana Rhoades", rating: 4.8, cost: "2.0 credits/hr", tags: ["Photo", "Editing"], color: "from-pink-400 to-rose-500", category: "Photography" },
];

const CATEGORIES = ['All Skills', 'Design', 'Development', 'Marketing', 'Languages', 'Business', 'Photography'];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Skills");

  const filteredSkills = SKILLS.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         skill.mentor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === "All Skills" || skill.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleRequest = (skillTitle: string) => {
    toast.success(`Request sent for ${skillTitle}! The mentor will be notified.`);
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
          <button className="glass-button p-3 text-white/40 hover:text-cyan-400 hover:border-cyan-400/30 transition-all active:scale-95 shadow-lg">
            <Filter size={20} />
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
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              variants={itemVariants}
              className="liquid-glass group relative overflow-hidden active:scale-[0.98] transition-transform"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${skill.color} p-0.5 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                     <div className="w-full h-full rounded-[14px] bg-black/20 backdrop-blur-md flex items-center justify-center text-white font-black text-xl">
                       {skill.title.charAt(0)}
                     </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 shadow-lg">
                    <Star size={14} className="fill-amber-400" />
                    {skill.rating}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white/95 group-hover:text-cyan-400 transition-colors mb-1 tracking-tight">{skill.title}</h3>
                <p className="text-sm text-white/40 mb-5 font-medium">by <span className="text-white/70">{skill.mentor}</span></p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {skill.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest font-black text-white/30 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 group-hover:text-cyan-400/60 group-hover:border-cyan-400/20 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-white/10 relative z-10">
                  <div className="flex items-center gap-2 text-white/90">
                    <div className="p-1.5 rounded-lg bg-cyan-400/10 text-cyan-400">
                       <Clock size={16} />
                    </div>
                    <span className="text-sm font-bold tracking-tight">{skill.cost}</span>
                  </div>
                  <button 
                    onClick={() => handleRequest(skill.title)}
                    className="group/btn relative px-5 py-2.5 overflow-hidden rounded-xl"
                  >
                    <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                    <span className="relative flex items-center gap-2 text-sm font-black text-cyan-400 group-hover:gap-3 transition-all">
                      Request <ArrowRight size={16} />
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Decorative background glow */}
              <div className={cn(
                "absolute -right-20 -bottom-20 w-40 h-40 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] blur-3xl transition-opacity duration-700",
                skill.color
              )} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredSkills.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
            <Search className="text-white/20 w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-white/95 mb-2">No skills found</h2>
          <p className="text-white/40 max-w-xs">Try adjusting your search or category filters to find what you're looking for.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
