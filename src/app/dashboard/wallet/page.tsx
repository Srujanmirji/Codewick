"use client";

import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownLeft, History, CreditCard, Plus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Week 1', earned: 5, spent: 2 },
  { name: 'Week 2', earned: 8, spent: 4 },
  { name: 'Week 3', earned: 4, spent: 6 },
  { name: 'Week 4', earned: 12, spent: 5 },
];

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

const TRANSACTIONS = [
  { id: 1, title: "English Mentoring", amount: "+2.0", date: "Today, 2:45 PM", status: "Earned" },
  { id: 2, title: "Figma Workshop", amount: "-3.5", date: "Yesterday, 10:15 AM", status: "Spent" },
  { id: 3, title: "React Debugging", amount: "+4.0", date: "May 03, 11:30 AM", status: "Earned" },
  { id: 4, title: "Logo Design", amount: "-2.0", date: "May 01, 4:00 PM", status: "Spent" },
];

export default function WalletPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 w-full max-w-7xl mx-auto flex flex-col space-y-6 pb-20"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center liquid-glass-static p-6 rounded-[24px] gap-4">
        <div>
          <h1 className="text-3xl font-fustat font-bold text-white/95 mb-1 drop-shadow-sm flex items-center gap-3">
            <Wallet className="text-cyan-400 w-8 h-8" />
            Wallet & Credits
          </h1>
          <p className="text-white/65 text-sm">Track your Time Credits and session transactions.</p>
        </div>
        <div className="flex gap-3">
          <button className="glass-button px-5 py-2.5 text-sm font-semibold text-white/95 flex items-center gap-2">
            <History size={18} /> History
          </button>
          <button className="glass-button-primary px-6 py-2.5 text-sm font-semibold text-white/95 flex items-center gap-2">
            <Plus size={18} /> Buy Credits
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="liquid-glass p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-[40px] -mr-10 -mt-10"></div>
          <div>
            <span className="text-sm text-white/40 font-medium uppercase tracking-wider">Total Balance</span>
            <div className="text-5xl font-bold text-white/95 mt-2 flex items-baseline gap-2">
              24.5
              <span className="text-lg text-cyan-400/80 font-medium">Credits</span>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
              <ArrowUpRight size={14} /> +12%
            </div>
            <span className="text-white/40 text-sm flex items-center">Since last month</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2 liquid-glass p-6">
          <h3 className="text-sm font-semibold text-white/65 mb-6 uppercase tracking-widest">Earnings Over Time</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEarned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#22D3EE' }}
                />
                <Area type="monotone" dataKey="earned" stroke="#22D3EE" fillOpacity={1} fill="url(#colorEarned)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div variants={itemVariants} className="liquid-glass overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white/95">Recent Transactions</h3>
          <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">See All</button>
        </div>
        <div className="divide-y divide-white/5">
          {TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/10 shadow-lg ${
                  tx.status === 'Earned' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
                }`}>
                  {tx.status === 'Earned' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white/95 group-hover:text-white transition-colors">{tx.title}</p>
                  <p className="text-xs text-white/40">{tx.date}</p>
                </div>
              </div>
              <div className={`text-sm font-bold ${tx.status === 'Earned' ? 'text-emerald-400' : 'text-white/95'}`}>
                {tx.amount} <span className="text-[10px] uppercase opacity-60">Credits</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
