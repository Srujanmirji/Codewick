"use client";

import { useUserStore } from "@/store/useUserStore";
import { Search, Bell, ChevronDown, LogOut, Settings as SettingsIcon } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const { user } = useUserStore();

  return (
    <header className="h-20 liquid-glass-static px-8 flex items-center justify-between sticky top-0 z-40 rounded-[24px] mx-2 mt-4">
      
      {/* Search Bar */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
        <input 
          type="text" 
          placeholder="Search skills, users, or requests..."
          className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-gray-200 placeholder:text-gray-400 focus:outline-none focus:bg-white/10 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] group"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-gray-400 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(34,213,238,0.5)] transition-all">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[#020617] animate-pulse shadow-[0_0_8px_rgba(34,213,238,0.8)]"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-3 cursor-pointer group hover:bg-white/5 px-2 py-1.5 rounded-2xl transition-all">
          <div className="w-10 h-10 rounded-full bg-black/40 overflow-hidden border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] group-hover:border-cyan-400/50 group-hover:shadow-[0_0_15px_rgba(34,213,238,0.3)] transition-all">
            {user?.avatarUrl && (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors">{user?.name}</p>
            <p className="text-xs text-cyan-400/80">{user?.credits} Credits</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
        </div>
      </div>
    </header>
  );
}
