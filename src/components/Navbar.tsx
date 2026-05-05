"use client";

import { useUserStore } from "@/store/useUserStore";
import { Search, Bell, ChevronDown, LogOut, Settings as SettingsIcon } from "lucide-react";
import Image from "next/image";

import { motion } from "framer-motion";

export function Navbar() {
  const { user } = useUserStore();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="h-16 liquid-glass-static px-6 flex items-center justify-between z-40"
    >
      
      {/* Search Bar */}
      <div className="relative max-w-md w-full group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
        <input 
          type="text" 
          placeholder="Search skills, users, or requests..."
          className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-12 pr-4 text-sm text-white/95 placeholder:text-white/40 focus:outline-none focus:bg-white/10 focus:border-cyan-400/50 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-white/40 hover:text-cyan-400 hover:drop-shadow-[0_0_5px_rgba(34,213,238,0.3)] transition-all p-2 rounded-full glass-button">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,213,238,0.8)]"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-3 cursor-pointer group px-1 py-1 rounded-2xl transition-all">
          <div className="w-10 h-10 rounded-full bg-black/20 overflow-hidden border border-white/15 shadow-[0_4px_15px_rgba(0,0,0,0.2)] group-hover:border-cyan-400/40 group-hover:shadow-[0_0_15px_rgba(34,213,238,0.2)] transition-all p-0.5">
            {user?.avatarUrl && (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full bg-black/20" />
            )}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-white/95 group-hover:text-white transition-colors">{user?.name}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">{user?.credits} Credits</p>
          </div>
          <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors" />
        </div>
      </div>
    </motion.header>
  );
}
