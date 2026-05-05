"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, Star, Edit3, Camera, MapPin, Globe } from "lucide-react";
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
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export default function ProfilePage() {
  const { user } = useUserStore();

  if (!user) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 w-full max-w-5xl mx-auto flex flex-col space-y-6 pb-20"
    >
      {/* Profile Header Card */}
      <motion.div variants={itemVariants} className="liquid-glass relative overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-cyan-400/20 via-indigo-500/20 to-purple-500/20 w-full relative">
           <button className="absolute bottom-4 right-4 glass-button px-4 py-2 text-xs font-semibold text-white/95 flex items-center gap-2 backdrop-blur-xl">
             <Edit3 size={14} /> Edit Banner
           </button>
        </div>
        
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex flex-col md:flex-row items-end md:items-center gap-6">
            <div className="relative group">
              <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-[32px] border-4 border-[#1a1c2e] shadow-2xl object-cover" />
              <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] flex items-center justify-center text-white">
                <Camera size={24} />
              </button>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-fustat font-bold text-white/95 flex items-center gap-3">
                {user.name}
                <Shield className="w-6 h-6 text-cyan-400" />
              </h1>
              <p className="text-white/60 font-medium flex items-center gap-2 mt-1">
                <Mail size={14} /> {user.email}
              </p>
            </div>
            <div className="flex gap-3 mb-2">
              <button className="glass-button-primary px-6 py-2.5 text-sm font-semibold text-white/95">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Trust Score</p>
              <p className="text-xl font-bold text-cyan-400">{user.trustScore}/100</p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Total Earned</p>
              <p className="text-xl font-bold text-white/95">124 <span className="text-xs opacity-60">CR</span></p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Sessions</p>
              <p className="text-xl font-bold text-white/95">42</p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Avg Rating</p>
              <p className="text-xl font-bold text-amber-400 flex items-center justify-center gap-1">
                4.9 <Star size={16} className="fill-amber-400" />
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About & Skills */}
        <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">
          <div className="liquid-glass p-6">
            <h3 className="text-lg font-bold text-white/95 mb-4">About Me</h3>
            <p className="text-white/65 leading-relaxed">
              Senior UI/UX Designer and Frontend Developer with 5+ years of experience. I love sharing my knowledge of React, Figma, and modern web design. Always looking to learn more about backend systems and SEO.
            </p>
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <MapPin size={14} /> San Francisco, CA
              </div>
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <Globe size={14} /> portfolio.design
              </div>
            </div>
          </div>

          <div className="liquid-glass p-6">
            <h3 className="text-lg font-bold text-white/95 mb-4">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {['UI Design', 'Figma', 'React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Motion Design'].map(skill => (
                <span key={skill} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80 hover:border-cyan-400/50 transition-colors cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Socials & Info */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="liquid-glass p-6">
            <h3 className="text-lg font-bold text-white/95 mb-4">Connect</h3>
            <div className="space-y-4">
              <a href="#" className="flex items-center gap-3 text-white/60 hover:text-cyan-400 transition-colors group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-cyan-400/30 transition-all">
                  <Globe size={18} />
                </div>
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-white/60 hover:text-cyan-400 transition-colors group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-cyan-400/30 transition-all">
                  <Globe size={18} />
                </div>
                <span className="text-sm font-medium">Twitter</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-white/60 hover:text-cyan-400 transition-colors group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-cyan-400/30 transition-all">
                  <Globe size={18} />
                </div>
                <span className="text-sm font-medium">GitHub</span>
              </a>
            </div>
          </div>

          <div className="liquid-glass p-6 bg-gradient-to-br from-cyan-400/5 to-indigo-500/5">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">Member Since</h3>
            <p className="text-white/95 font-inter font-medium text-lg">January 2024</p>
            <p className="text-xs text-white/40 mt-1">Trusted Member (Elite Tier)</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
