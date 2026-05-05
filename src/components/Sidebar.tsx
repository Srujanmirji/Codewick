"use client";

import { useUserStore } from "@/store/useUserStore";
import { motion } from "framer-motion";
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
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const { sidebarOpen, toggleSidebar } = useUserStore();
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 260 : 80 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      className="h-full liquid-glass-static flex flex-col relative flex-shrink-0 z-50 overflow-visible"
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 glass-button w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/95 z-50 transition-colors"
      >
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Logo */}
      <div className="h-20 flex items-center px-6 overflow-hidden mt-2">
        <div className="flex items-center gap-3 w-48">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-[0_4px_20px_rgba(34,213,238,0.15)]">
            <span className="font-bold text-white/95 font-fustat text-xl">S</span>
          </div>
          {sidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-fustat font-bold text-xl text-white/95 whitespace-nowrap tracking-tight"
            >
              SkillSwap
            </motion.span>
          )}
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1.5 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-4 px-3 py-3 rounded-2xl transition-all duration-300 group relative cursor-pointer",
                  isActive 
                    ? "text-cyan-400 bg-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10" 
                    : "text-white/60 hover:bg-white/5 hover:text-white/95"
                )}
                title={!sidebarOpen ? item.name : undefined}
              >
                {isActive && (
                  <div className="absolute left-1.5 w-1 h-5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,213,238,0.6)]"></div>
                )}
                <item.icon size={22} className={cn("flex-shrink-0 transition-all duration-300 ml-1", isActive ? "drop-shadow-[0_0_8px_rgba(34,213,238,0.4)]" : "group-hover:text-white/95")} />
                {sidebarOpen && (
                  <span className="font-inter font-medium whitespace-nowrap text-sm">
                    {item.name}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
}
