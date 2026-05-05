"use client";

import { useUserStore } from "@/store/useUserStore";
import { Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props {
  data: { name: string; earned: number; spent: number }[];
}

export function CreditWalletCard({ data }: Props) {
  const { user } = useUserStore();

  return (
    <div className="liquid-glass p-6 flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Particle Glow Behind Graph */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-cyan-500/5 to-transparent blur-[30px] pointer-events-none transition-all duration-700"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-white/65 text-sm font-medium mb-2 uppercase tracking-widest drop-shadow-sm">
          <Clock className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_3px_rgba(34,213,238,0.3)]" />
          Time Credits
        </div>
        <div className="flex items-end gap-3">
          <h2 className="text-4xl font-fustat font-bold text-white/95">{user?.credits}</h2>
          <span className="text-sm text-white/40 mb-1 font-medium">hrs available</span>
        </div>
        
        <div className="flex gap-4 mt-4 text-sm font-medium">
          <div className="flex items-center gap-1 text-emerald-400/90">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12 earned</span>
          </div>
          <div className="flex items-center gap-1 text-indigo-400/90">
            <ArrowDownRight className="w-4 h-4" />
            <span>-8 spent</span>
          </div>
        </div>
      </div>

      <div className="h-24 w-full mt-6 relative z-10 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEarned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#fff" vertical={false} opacity={0.03} />
            <Area 
              type="monotone" 
              dataKey="earned" 
              stroke="url(#strokeGradient)" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorEarned)" 
              filter="url(#glow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <button className="mt-4 w-full py-2.5 glass-button text-white text-sm font-semibold rounded-xl relative z-10 group-hover:border-cyan-400/30 overflow-hidden">
        <span className="relative z-10 drop-shadow-md">View Transactions</span>
        <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity"></div>
      </button>
    </div>
  );
}
