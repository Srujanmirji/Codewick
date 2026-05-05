"use client";

import { useUserStore } from "@/store/useUserStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  CalendarCheck, 
  Store, 
  MessageSquare, 
  Wallet, 
  AlertTriangle, 
  User, 
  Settings,
  ChevronLeft,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "My Sessions", icon: CalendarCheck, href: "/dashboard/sessions" },
  { name: "Marketplace", icon: Store, href: "/dashboard/marketplace" },
  { name: "Messages", icon: MessageSquare, href: "/dashboard/messages" },
  { name: "Wallet", icon: Wallet, href: "/dashboard/wallet" },
  { name: "Disputes", icon: AlertTriangle, href: "/dashboard/disputes" },
  { name: "Profile", icon: User, href: "/dashboard/profile" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, user } = useUserStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      router.push("/");
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 85 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="h-full liquid-glass-static flex flex-col relative flex-shrink-0 z-50 border-r border-white/10"
    >
      {/* Toggle Button - Improved Look */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "absolute -right-4 top-10 w-8 h-8 flex items-center justify-center rounded-full z-50 transition-all shadow-xl",
          "bg-[#0f172a] border border-white/20 text-white/70 hover:text-cyan-400 hover:border-cyan-400/50",
          "before:absolute before:inset-0 before:rounded-full before:bg-cyan-400/20 before:blur-md before:opacity-0 hover:before:opacity-100 before:transition-opacity"
        )}
      >
        <motion.div
          animate={{ rotate: sidebarOpen ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <ChevronLeft size={18} />
        </motion.div>
      </button>

      {/* Logo */}
      <div className="h-24 flex items-center px-[22px] overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(34,213,238,0.2)] border border-white/15 bg-gradient-to-br from-white/10 to-transparent p-0.5">
            <img src="/logo.png" alt="SkillSwap Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-fustat font-black text-2xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] whitespace-nowrap tracking-tighter"
              >
                SkillSwap
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-1.5 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-4 px-3 py-3.5 rounded-2xl transition-all duration-300 group relative cursor-pointer",
                  isActive 
                    ? "text-cyan-400 bg-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10" 
                    : "text-white/50 hover:bg-white/5 hover:text-white/90"
                )}
                title={!sidebarOpen ? item.name : undefined}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-1 w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,213,238,0.8)]"
                  ></motion.div>
                )}
                <item.icon size={22} className={cn("flex-shrink-0 transition-all duration-300 ml-1", isActive ? "drop-shadow-[0_0_10px_rgba(34,213,238,0.5)]" : "group-hover:text-white/90")} />
                
                <AnimatePresence mode="wait">
                  {sidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, delay: 0.05 }}
                      className="font-inter font-semibold whitespace-nowrap text-sm"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </div>

      {/* User Section / Logout */}
      <div className="p-4 mt-auto border-t border-white/10 bg-white/2">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-2xl transition-all duration-300",
          sidebarOpen ? "bg-white/5 border border-white/5" : "justify-center"
        )}>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0 shadow-lg">
            <img src={user?.avatarUrl} alt="User" className="w-full h-full object-cover" />
          </div>
          
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-bold text-white/90 truncate">{user?.name}</p>
                <p className="text-[10px] text-white/40 truncate">{user?.trustLevel} Level</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={handleLogout}
            className={cn(
              "p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all",
              !sidebarOpen && "hidden"
            )}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
        
        {!sidebarOpen && (
          <button 
            onClick={handleLogout}
            className="mt-2 w-10 h-10 flex items-center justify-center rounded-full text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all mx-auto"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </motion.aside>
  );
}
