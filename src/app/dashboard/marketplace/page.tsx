"use client";

import { motion } from "framer-motion";
import { Store, Search, Filter, Star, Clock, ArrowRight } from "lucide-react";

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
  { id: 1, title: "UI/UX Design", mentor: "Sarah Jenkins", rating: 4.9, cost: "2.5 credits/hr", tags: ["Design", "Figma"], color: "from-cyan-400 to-indigo-500" },
  { id: 2, title: "Python Backend", mentor: "David Lee", rating: 4.8, cost: "3.0 credits/hr", tags: ["Python", "Django"], color: "from-indigo-400 to-purple-500" },
  { id: 3, title: "English Fluency", mentor: "Emma Wilson", rating: 5.0, cost: "1.5 credits/hr", tags: ["Language", "Speaking"], color: "from-teal-400 to-emerald-500" },
  { id: 4, title: "Logo Branding", mentor: "Michael Chen", rating: 4.7, cost: "2.0 credits/hr", tags: ["Design", "Logo"], color: "from-rose-400 to-orange-500" },
  { id: 5, title: "React Development", mentor: "Chris Evans", rating: 4.9, cost: "3.5 credits/hr", tags: ["React", "JS"], color: "from-blue-400 to-cyan-500" },
  { id: 6, title: "SEO Strategy", mentor: "Anna Taylor", rating: 4.6, cost: "2.0 credits/hr", tags: ["Marketing", "SEO"], color: "from-amber-400 to-yellow-500" },
];

export default function MarketplacePage() {
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
          <h1 className="text-3xl font-fustat font-bold text-white/95 mb-1 drop-shadow-sm flex items-center gap-3">
            <Store className="text-cyan-400 w-8 h-8" />
            Marketplace
          </h1>
          <p className="text-white/65 text-sm">Discover new skills and connect with mentors across the community.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search skills or mentors..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white/95 placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
            />
          </div>
          <button className="glass-button p-2.5 text-white/40 hover:text-white/95">
            <Filter size={20} />
          </button>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div variants={itemVariants} className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {['All Skills', 'Design', 'Development', 'Marketing', 'Languages', 'Business', 'Photography'].map((cat, i) => (
          <button 
            key={cat} 
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
              i === 0 ? 'bg-white/10 text-white/95 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'text-white/40 hover:text-white/65'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SKILLS.map((skill) => (
          <motion.div
            key={skill.id}
            variants={itemVariants}
            className="liquid-glass group"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${skill.color} p-0.5 shadow-lg`}>
                   <div className="w-full h-full rounded-[14px] bg-black/20 backdrop-blur-md flex items-center justify-center text-white font-bold">
                     {skill.title.charAt(0)}
                   </div>
                </div>
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-xs text-amber-400">
                  <Star size={12} className="fill-amber-400" />
                  {skill.rating}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white/95 group-hover:text-cyan-400 transition-colors mb-1">{skill.title}</h3>
              <p className="text-sm text-white/65 mb-4">by {skill.mentor}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {skill.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold text-white/40 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-white/95">
                  <Clock size={14} className="text-cyan-400" />
                  <span className="text-xs font-medium">{skill.cost}</span>
                </div>
                <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-all group-hover:gap-2">
                  Request <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
