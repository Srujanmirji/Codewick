"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bell, ChevronDown, Menu, Loader2, User as UserIcon, Store, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export function Navbar() {
  const { user, toggleSidebar } = useUserStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setResults(data.results || []);
        setShowResults(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="h-14 md:h-16 liquid-glass-static px-4 md:px-6 flex items-center justify-between z-[50]"
    >
      
      {/* Left: Hamburger (mobile) + Search Bar */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile hamburger */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-1 rounded-xl text-white/60 hover:text-cyan-400 hover:bg-white/5 transition-all flex-shrink-0"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar */}
        <div ref={searchRef} className="relative max-w-md w-full group hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            placeholder="Search skills, users, or requests..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-12 pr-10 text-sm text-white/95 placeholder:text-white/40 focus:outline-none focus:bg-white/10 focus:border-cyan-400/50 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            </div>
          )}

          {/* Results Dropdown */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50"
              >
                <div className="p-2 flex flex-col">
                  {results.length > 0 ? (
                    results.map((res) => (
                      <button
                        key={`${res.type}-${res.id}`}
                        onClick={() => {
                          router.push(res.href);
                          setShowResults(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-black/20 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {res.image ? (
                            <img src={res.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            res.type === 'user' ? <UserIcon className="text-white/20" /> : <Store className="text-white/20" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors truncate">{res.title}</p>
                          <p className="text-xs text-white/40 truncate">{res.subtitle}</p>
                        </div>
                        <ArrowRight size={14} className="text-white/0 group-hover:text-white/20 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm text-white/30">No results found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white/5 border-t border-white/5 flex justify-center">
                   <Link href="/dashboard/marketplace" onClick={() => setShowResults(false)} className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60 hover:text-cyan-400 transition-colors">
                     View All Marketplace Listings
                   </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile search icon */}
        <button className="sm:hidden p-2 rounded-full text-white/40 hover:text-cyan-400 transition-all">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
        {/* Notifications */}
        <button className="relative text-white/40 hover:text-cyan-400 hover:drop-shadow-[0_0_5px_rgba(34,213,238,0.3)] transition-all p-2 rounded-full glass-button">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,213,238,0.8)]"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group px-1 py-1 rounded-2xl transition-all">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/20 overflow-hidden border border-white/15 shadow-[0_4px_15px_rgba(0,0,0,0.2)] group-hover:border-cyan-400/40 group-hover:shadow-[0_0_15px_rgba(34,213,238,0.2)] transition-all p-0.5">
            {user?.avatarUrl && (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full bg-black/20" />
            )}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-white/95 group-hover:text-white transition-colors">{user?.name}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">{user?.credits} Credits</p>
          </div>
          <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-cyan-400 transition-colors hidden md:block" />
        </div>
      </div>
    </motion.header>
  );
}
