"use client";

import { motion } from "framer-motion";
import { Settings, Bell, Lock, Eye, Globe, CreditCard, Info, LogOut } from "lucide-react";

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

const SETTINGS_GROUPS = [
  {
    title: "Account",
    items: [
      { name: "Profile Visibility", icon: Eye, desc: "Manage who can see your profile and skills.", action: "Public" },
      { name: "Notifications", icon: Bell, desc: "Email and push notification preferences.", action: "Configure" },
      { name: "Security", icon: Lock, desc: "Password, 2FA and active sessions.", action: "Secure" },
    ]
  },
  {
    title: "Preferences",
    items: [
      { name: "Language & Region", icon: Globe, desc: "Set your local language and timezone.", action: "English" },
      { name: "Billing & Wallet", icon: CreditCard, desc: "Manage payout methods and transaction settings.", action: "Manage" },
    ]
  },
  {
    title: "Support",
    items: [
      { name: "Help Center", icon: Info, desc: "FAQs, guides and contact support.", action: "Visit" },
      { name: "Logout", icon: LogOut, desc: "Sign out of your account on this device.", action: "Exit", danger: true },
    ]
  }
];

export default function SettingsPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 w-full max-w-4xl mx-auto flex flex-col space-y-8 pb-20"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center liquid-glass-static p-6 rounded-[24px] gap-4">
        <div>
          <h1 className="text-3xl font-fustat font-bold text-white/95 mb-1 drop-shadow-sm flex items-center gap-3">
            <Settings className="text-cyan-400 w-8 h-8" />
            Settings
          </h1>
          <p className="text-white/65 text-sm">Customize your SkillSwap experience and account security.</p>
        </div>
      </motion.div>

      {/* Settings Groups */}
      {SETTINGS_GROUPS.map((group) => (
        <motion.div key={group.title} variants={itemVariants} className="space-y-4">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest ml-2">{group.title}</h3>
          <div className="liquid-glass overflow-hidden divide-y divide-white/5">
            {group.items.map((item) => (
              <div key={item.name} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group">
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-cyan-400/30 group-hover:bg-white/10 transition-all ${item.danger ? 'group-hover:border-red-400/30 text-red-400/60' : 'text-white/60 group-hover:text-cyan-400'}`}>
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${item.danger ? 'text-red-400/80' : 'text-white/95'}`}>{item.name}</h4>
                    <p className="text-xs text-white/40 mt-1">{item.desc}</p>
                  </div>
                </div>
                <button className={`text-xs font-bold px-4 py-2 rounded-xl glass-button transition-all ${item.danger ? 'text-red-400/60 hover:text-red-400 hover:bg-red-400/10' : 'text-cyan-400 hover:text-cyan-300'}`}>
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Footer Info */}
      <motion.div variants={itemVariants} className="text-center pt-8">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">SkillSwap v2.4.0 • Built with Passion</p>
      </motion.div>
    </motion.div>
  );
}
