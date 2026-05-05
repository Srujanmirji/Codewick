"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Props {
  data: { name: string; sessions: number; credits: number }[];
}

export function PerformanceAnalytics({ data }: Props) {
  return (
    <div className="liquid-glass p-6 h-full min-h-[400px] flex flex-col group">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-white/90 to-cyan-100 bg-clip-text text-transparent drop-shadow-sm">Performance Analytics</h3>
        <select className="bg-white/5 border border-white/10 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-colors">
          <option className="bg-[#020617] text-gray-200">This Week</option>
          <option className="bg-[#020617] text-gray-200">Last Week</option>
          <option className="bg-[#020617] text-gray-200">This Month</option>
        </select>
      </div>

      <div className="flex-1 w-full min-h-[250px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fff" vertical={false} opacity={0.05} />
            <XAxis dataKey="name" stroke="#888" tick={{ fill: '#aaa', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#888" tick={{ fill: '#aaa', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              contentStyle={{ backgroundColor: 'rgba(2,6,23,0.8)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', opacity: 0.8 }} />
            <Bar dataKey="sessions" name="Sessions Completed" fill="#22d3ee" radius={[6, 6, 0, 0]} barSize={18} />
            <Bar dataKey="credits" name="Credits Earned" fill="#818cf8" radius={[6, 6, 0, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
