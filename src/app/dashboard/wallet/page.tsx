"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform, animate } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownLeft, History, CreditCard, Plus, Check, ShieldCheck, Zap, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Modal } from "@/components/ui/Modal";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";
import { toast } from "@/store/useToastStore";

const data = [
  { name: 'Week 1', earned: 5, spent: 2 },
  { name: 'Week 2', earned: 8, spent: 4 },
  { name: 'Week 3', earned: 4, spent: 6 },
  { name: 'Week 4', earned: 12, spent: 5 },
];

const CREDIT_PACKS = [
  { id: 'starter', name: 'Starter Pack', credits: 5, price: '$9.99', icon: Zap, color: 'from-cyan-400 to-blue-500' },
  { id: 'pro', name: 'Pro Pack', credits: 15, price: '$24.99', icon: ShieldCheck, color: 'from-indigo-400 to-purple-500', popular: true },
  { id: 'elite', name: 'Elite Pack', credits: 50, price: '$69.99', icon: CreditCard, color: 'from-amber-400 to-orange-500' },
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
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
};

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
  }, [value]);

  return <span>{displayValue.toFixed(1)}</span>;
}

export default function WalletPage() {
  const { user, updateUser } = useUserStore();
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<{
    credits: number;
    transactions: any[];
  }>({ credits: 0, transactions: [] });

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const res = await fetch('/api/wallet');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setWalletData({
        credits: data.credits,
        transactions: data.transactions
      });
      // Update local store to match
      updateUser({ credits: data.credits });
    } catch (error) {
      console.error("Failed to fetch wallet:", error);
      toast.error("Could not sync wallet data");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    if (!selectedPack) return;
    setIsProcessing(true);
    
    const pack = CREDIT_PACKS.find(p => p.id === selectedPack);
    
    // Simulate API call
    setTimeout(() => {
      if (pack && user) {
        const newTotal = walletData.credits + pack.credits;
        setWalletData(prev => ({ ...prev, credits: newTotal }));
        updateUser({ credits: newTotal });
        toast.success(`Successfully purchased ${pack.credits} credits!`);
        setIsBuyModalOpen(false);
        setIsProcessing(false);
        setSelectedPack(null);
      }
    }, 2000);
  };

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
          <button 
            onClick={() => fetchWalletData()}
            className="glass-button px-5 py-2.5 text-sm font-semibold text-white/95 flex items-center gap-2"
          >
            <History size={18} /> Sync Wallet
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
              {loading ? <Loader2 className="animate-spin text-cyan-400" /> : <AnimatedNumber value={walletData.credits} />}
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
          {loading ? (
             <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-cyan-400 w-10 h-10" /></div>
          ) : walletData.transactions.length === 0 ? (
            <div className="p-10 text-center text-white/40">No transactions found.</div>
          ) : (
            walletData.transactions.map((tx) => (
              <div key={tx._id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border border-white/10 shadow-lg",
                    (tx.type === 'earned' || tx.type === 'bonus') ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
                  )}>
                    {(tx.type === 'earned' || tx.type === 'bonus') ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white/95 group-hover:text-white transition-colors">{tx.description}</p>
                    <p className="text-xs text-white/40">{new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className={cn(
                  "text-sm font-bold",
                  (tx.type === 'earned' || tx.type === 'bonus') ? 'text-emerald-400' : 'text-white/95'
                )}>
                  {(tx.type === 'earned' || tx.type === 'bonus') ? '+' : '-'}{tx.amount.toFixed(1)} <span className="text-[10px] uppercase opacity-60">Credits</span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Buy Credits Modal */}
      <Modal
        isOpen={isBuyModalOpen}
        onClose={() => !isProcessing && setIsBuyModalOpen(false)}
        title="Top Up Your Wallet"
      >
        <div className="space-y-6">
          <p className="text-white/60 text-sm">Select a credit pack to continue swapping skills with the community.</p>
          
          <div className="grid grid-cols-1 gap-4">
            {CREDIT_PACKS.map((pack) => (
              <button
                key={pack.id}
                onClick={() => setSelectedPack(pack.id)}
                className={cn(
                  "relative flex items-center justify-between p-4 rounded-2xl transition-all border group",
                  selectedPack === pack.id 
                    ? "bg-white/10 border-cyan-400/50 shadow-[0_0_20px_rgba(34,213,238,0.15)]" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                )}
              >
                {pack.popular && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-lg z-20">
                    MOST POPULAR
                  </span>
                )}
                <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl bg-gradient-to-br shadow-lg", pack.color)}>
                    <pack.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-sm">{pack.name}</h4>
                    <p className="text-xs text-white/40">{pack.credits} Time Credits</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-fustat font-bold text-lg text-white">{pack.price}</span>
                  <div className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                    selectedPack === pack.id ? "bg-cyan-400 border-cyan-400" : "border-white/20"
                  )}>
                    {selectedPack === pack.id && <Check className="w-3 h-3 text-black font-bold" />}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            disabled={!selectedPack || isProcessing}
            onClick={handlePurchase}
            className={cn(
              "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
              selectedPack && !isProcessing
                ? "glass-button-primary bg-cyan-500 text-white shadow-[0_0_30px_rgba(34,213,238,0.3)] hover:scale-[1.02] active:scale-[0.98]" 
                : "bg-white/5 text-white/20 cursor-not-allowed"
            )}
          >
            {isProcessing ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              <>Complete Purchase</>
            )}
          </button>
          
          <p className="text-[10px] text-white/30 text-center uppercase tracking-widest">
            Secure checkout powered by Stripe
          </p>
        </div>
      </Modal>
    </motion.div>
  );
}
