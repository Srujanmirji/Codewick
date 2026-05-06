"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
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
  Users,
  Settings,
  ChevronLeft,
  LogOut,
  X,
  AlertCircle,
  LayoutGrid,
  CloudUpload,
  ShieldAlert,
  ClipboardList
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Modal } from "./ui/Modal";
import { InstallPrompt } from "./InstallPrompt";

const NAV_ITEMS = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "My Sessions", icon: CalendarCheck, href: "/dashboard/sessions" },
  { name: "My Listings", icon: ClipboardList, href: "/dashboard/my-listings" },
  { name: "Marketplace", icon: Store, href: "/dashboard/marketplace" },
  { name: "Community", icon: Users, href: "/dashboard/community" },
  { name: "Host Hub", icon: LayoutGrid, href: "/dashboard/host" },
  { name: "Messages", icon: MessageSquare, href: "/dashboard/messages" },
  { name: "Wallet", icon: Wallet, href: "/dashboard/wallet" },
  { name: "Disputes", icon: AlertTriangle, href: "/dashboard/disputes" },
  { name: "Profile", icon: User, href: "/dashboard/profile" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, user } = useUserStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  
  const isAdmin = (session?.user as any)?.isAdmin;
  const items = isAdmin 
    ? [...NAV_ITEMS, { name: "God Mode", icon: ShieldAlert, href: "/dashboard/admin" }] 
    : NAV_ITEMS;

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      toggleSidebar();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsLoggingOut(true);
    
    // Smooth transition to landing page
    setTimeout(async () => {
      await signOut({ callbackUrl: "/" });
    }, 1500);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-20 md:h-24 flex items-center px-[22px] overflow-hidden">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(34,213,238,0.3)] border border-white/10 p-0.5 group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="SkillSwap Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <AnimatePresence mode="wait">
            {(sidebarOpen || isMobile) && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-fustat font-black text-2xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] whitespace-nowrap tracking-tighter group-hover:text-cyan-400 transition-colors"
              >
                SkillSwap
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="ml-auto p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={22} />
          </button>
        )}
      </div>

      {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-1.5 custom-scrollbar">
          {items.map((item) => {
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
                  title={!sidebarOpen && !isMobile ? item.name : undefined}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-1 w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,213,238,0.8)]"
                    ></motion.div>
                  )}
                  <item.icon size={22} className={cn("flex-shrink-0 transition-all duration-300 ml-1", isActive ? "drop-shadow-[0_0_10px_rgba(34,213,238,0.5)]" : "group-hover:text-white/90")} />
                  
                  <AnimatePresence mode="wait">
                    {(sidebarOpen || isMobile) && (
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

          <AnimatePresence>
            {(sidebarOpen || isMobile) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <InstallPrompt />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      {/* User Section / Logout */}
      <div className="p-4 mt-auto border-t border-white/10 bg-white/2">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-2xl transition-all duration-300",
          (sidebarOpen || isMobile) ? "bg-white/5 border border-white/5" : "justify-center"
        )}>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0 shadow-lg">
            <img src={user?.avatarUrl} alt="User" className="w-full h-full object-cover" />
          </div>
          
          <AnimatePresence>
            {(sidebarOpen || isMobile) && (
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
              !sidebarOpen && !isMobile && "hidden"
            )}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
        
        {!sidebarOpen && !isMobile && (
          <button 
            onClick={handleLogout}
            className="mt-2 w-10 h-10 flex items-center justify-center rounded-full text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all mx-auto"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Logout Transition Overlay */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#F8FAFC] flex items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-64 h-64 sm:w-96 sm:h-96"
            >
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse"></div>
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-contain"
                style={{ filter: "hue-rotate(-55deg) saturate(200%)" }}
              >
                <source src="https://future.co/images/homepage/glassy-orb/orb-purple.webm" type="video/webm" />
              </video>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-20 flex flex-col items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl">
                <img src="/logo.png" alt="" className="w-full h-full object-cover" />
              </div>
              <p className="font-fustat font-black text-2xl tracking-tighter text-[#111827]">SkillSwap</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MOBILE: Drawer Sidebar ===== */}
      {isMobile && (
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleSidebar}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
              />
              {/* Drawer */}
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full w-[280px] liquid-glass-static flex flex-col z-[100] border-r border-white/10 bg-[#0a0e1a]/95"
              >
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      )}

      {/* ===== DESKTOP: Persistent Sidebar ===== */}
      {!isMobile && (
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 260 : 85 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="h-full liquid-glass-static flex-col relative flex-shrink-0 z-50 border-r border-white/10 hidden md:flex"
        >
          {/* Toggle Button */}
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

          {sidebarContent}
        </motion.aside>
      )}

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
      >
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Sign Out?</h3>
          <p className="text-sm text-white/50 mb-8 max-w-[240px]">
            Are you sure you want to log out of your account?
          </p>
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setIsLogoutModalOpen(false)}
              className="flex-1 py-3.5 rounded-xl font-bold text-white/40 bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={confirmLogout}
              className="flex-1 py-3.5 rounded-xl font-bold text-white bg-red-500/80 hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
