"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Bell, Lock, Eye, Globe, CreditCard, Info, LogOut, Check, X, ChevronRight, Shield, Moon, Sun, Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/store/useToastStore";
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
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
};

function Toggle({ enabled, onChange, label }: { enabled: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
        enabled 
          ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,213,238,0.4)]' 
          : 'bg-white/10'
      }`}
    >
      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
        enabled ? 'left-6' : 'left-1'
      }`} />
    </button>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const { user } = useUserStore();
  const router = useRouter();

  // Settings state
  const [profilePublic, setProfilePublic] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [requestNotifs, setRequestNotifs] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [language, setLanguage] = useState("English");
  
  // Modal states
  const [showVisibility, setShowVisibility] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to log out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSaveSettings = (settingName: string) => {
    toast.success(`${settingName} updated successfully!`);
  };

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
        {session?.user && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <img src={session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.name}`} alt="" className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-sm font-bold text-white/90">{session.user.name}</p>
              <p className="text-[10px] text-white/40">{session.user.email}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* ACCOUNT */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest ml-2">Account</h3>
        <div className="liquid-glass overflow-hidden divide-y divide-white/5">
          
          {/* Profile Visibility */}
          <div 
            onClick={() => setShowVisibility(true)}
            className="p-6 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-cyan-400/30 group-hover:bg-white/10 transition-all text-white/60 group-hover:text-cyan-400">
                <Eye size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white/95">Profile Visibility</h4>
                <p className="text-xs text-white/40 mt-1">Manage who can see your profile and skills.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold ${profilePublic ? 'text-emerald-400' : 'text-amber-400'}`}>
                {profilePublic ? 'Public' : 'Private'}
              </span>
              <ChevronRight size={16} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>

          {/* Notifications */}
          <div 
            onClick={() => setShowNotifications(true)}
            className="p-6 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-cyan-400/30 group-hover:bg-white/10 transition-all text-white/60 group-hover:text-cyan-400">
                <Bell size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white/95">Notifications</h4>
                <p className="text-xs text-white/40 mt-1">Email and push notification preferences.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-cyan-400">Configure</span>
              <ChevronRight size={16} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>

          {/* Security */}
          <div 
            onClick={() => setShowSecurity(true)}
            className="p-6 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-cyan-400/30 group-hover:bg-white/10 transition-all text-white/60 group-hover:text-cyan-400">
                <Lock size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white/95">Security</h4>
                <p className="text-xs text-white/40 mt-1">OAuth provider, session info and account protection.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><Shield size={12} /> Secured</span>
              <ChevronRight size={16} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* PREFERENCES */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest ml-2">Preferences</h3>
        <div className="liquid-glass overflow-hidden divide-y divide-white/5">
          
          {/* Language */}
          <div 
            onClick={() => setShowLanguage(true)}
            className="p-6 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-cyan-400/30 group-hover:bg-white/10 transition-all text-white/60 group-hover:text-cyan-400">
                <Globe size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white/95">Language & Region</h4>
                <p className="text-xs text-white/40 mt-1">Set your local language and timezone.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-cyan-400">{language}</span>
              <ChevronRight size={16} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>

          {/* Wallet */}
          <div 
            onClick={() => router.push('/dashboard/wallet')}
            className="p-6 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-cyan-400/30 group-hover:bg-white/10 transition-all text-white/60 group-hover:text-cyan-400">
                <CreditCard size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white/95">Billing & Wallet</h4>
                <p className="text-xs text-white/40 mt-1">View your credits and transaction history.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-cyan-400">{user?.credits ?? 0} Credits</span>
              <ChevronRight size={16} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* SUPPORT */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest ml-2">Support</h3>
        <div className="liquid-glass overflow-hidden divide-y divide-white/5">
          <div 
            onClick={() => toast.info("Help Center coming soon!")}
            className="p-6 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-cyan-400/30 group-hover:bg-white/10 transition-all text-white/60 group-hover:text-cyan-400">
                <Info size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white/95">Help Center</h4>
                <p className="text-xs text-white/40 mt-1">FAQs, guides and contact support.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-cyan-400">Visit</span>
              <ChevronRight size={16} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>

          {/* Logout */}
          <div 
            onClick={() => setShowLogout(true)}
            className="p-6 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-red-400/30 transition-all text-red-400/60">
                <LogOut size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-400/80">Logout</h4>
                <p className="text-xs text-white/40 mt-1">Sign out of your account on this device.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-red-400/60 group-hover:text-red-400">Exit</span>
              <ChevronRight size={16} className="text-white/20 group-hover:text-red-400 transition-colors" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div variants={itemVariants} className="text-center pt-8">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">SkillSwap v2.4.0 • Built with Passion</p>
      </motion.div>

      {/* ========== MODALS ========== */}

      {/* Profile Visibility Modal */}
      <Modal isOpen={showVisibility} onClose={() => setShowVisibility(false)} title="Profile Visibility">
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <h4 className="text-sm font-bold text-white/90">Public Profile</h4>
              <p className="text-xs text-white/40 mt-1">Allow others to find and view your profile in the marketplace</p>
            </div>
            <Toggle enabled={profilePublic} onChange={(v) => { setProfilePublic(v); handleSaveSettings("Profile visibility"); }} />
          </div>
          <div className="p-4 rounded-xl bg-cyan-400/5 border border-cyan-400/20">
            <p className="text-xs text-cyan-400/80">
              {profilePublic 
                ? "✅ Your profile is visible to all SkillSwap users. Others can find your listings and send you swap requests."
                : "🔒 Your profile is hidden. You won't appear in search results or the marketplace. Existing conversations remain active."
              }
            </p>
          </div>
        </div>
      </Modal>

      {/* Notifications Modal */}
      <Modal isOpen={showNotifications} onClose={() => setShowNotifications(false)} title="Notification Preferences">
        <div className="space-y-3">
          {[
            { label: "Email Notifications", desc: "Receive emails for swap requests and session updates", value: emailNotifs, set: setEmailNotifs },
            { label: "Push Notifications", desc: "Browser push notifications for real-time alerts", value: pushNotifs, set: setPushNotifs },
            { label: "Swap Requests", desc: "Get notified when someone wants to swap skills", value: requestNotifs, set: setRequestNotifs },
            { label: "Session Reminders", desc: "Reminders before scheduled sessions", value: sessionReminders, set: setSessionReminders },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <h4 className="text-sm font-bold text-white/90">{item.label}</h4>
                <p className="text-xs text-white/40 mt-1">{item.desc}</p>
              </div>
              <Toggle enabled={item.value} onChange={(v) => { item.set(v); handleSaveSettings(item.label); }} />
            </div>
          ))}
        </div>
      </Modal>

      {/* Security Modal */}
      <Modal isOpen={showSecurity} onClose={() => setShowSecurity(false)} title="Security">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Shield size={18} className="text-emerald-400" />
              <h4 className="text-sm font-bold text-white/90">Authentication Provider</h4>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <div>
                <p className="text-sm font-bold text-white/90">Google OAuth</p>
                <p className="text-[10px] text-white/40">{session?.user?.email}</p>
              </div>
              <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">Connected</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h4 className="text-sm font-bold text-white/90 mb-2">Active Session</h4>
            <div className="text-xs text-white/50 space-y-1">
              <p>🖥️ Current device • {navigator.userAgent.includes('Windows') ? 'Windows' : navigator.userAgent.includes('Mac') ? 'macOS' : 'Unknown OS'}</p>
              <p>🌐 Browser session active since login</p>
              <p>🔐 JWT token secured with NEXTAUTH_SECRET</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-400/5 border border-emerald-400/20">
            <p className="text-xs text-emerald-400/80">
              ✅ Your account is secured via Google OAuth 2.0. No password is stored on SkillSwap — authentication is handled entirely by Google.
            </p>
          </div>
        </div>
      </Modal>

      {/* Language Modal */}
      <Modal isOpen={showLanguage} onClose={() => setShowLanguage(false)} title="Language & Region">
        <div className="space-y-2">
          {["English", "Hindi", "Tamil", "Telugu", "Marathi", "Kannada", "Bengali", "Gujarati", "Malayalam", "Punjabi", "Spanish", "French", "German", "Arabic", "Chinese", "Japanese"].map((lang) => (
            <button
              key={lang}
              onClick={() => { setLanguage(lang); handleSaveSettings("Language"); setShowLanguage(false); }}
              className={`w-full p-4 rounded-xl text-left text-sm font-bold transition-all flex items-center justify-between ${
                language === lang 
                  ? 'bg-cyan-400/10 border border-cyan-400/30 text-cyan-400' 
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              {lang}
              {language === lang && <Check size={16} />}
            </button>
          ))}
        </div>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={showLogout} onClose={() => !isLoggingOut && setShowLogout(false)} title="Confirm Logout">
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-red-400/5 border border-red-400/20 text-center">
            <LogOut className="w-10 h-10 text-red-400/60 mx-auto mb-3" />
            <p className="text-sm text-white/80">Are you sure you want to sign out of <span className="font-bold text-white">{session?.user?.name}</span>?</p>
            <p className="text-xs text-white/40 mt-2">You'll need to sign in with Google again to access your dashboard.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogout(false)}
              disabled={isLoggingOut}
              className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm font-bold hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-400/30 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
            >
              {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
