"use client";

import { useToastStore, ToastType } from "@/store/useToastStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<ToastType, any> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const COLORS: Record<ToastType, string> = {
  success: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5 shadow-[0_0_20px_rgba(52,211,153,0.1)]",
  error: "text-red-400 border-red-400/20 bg-red-400/5 shadow-[0_0_20px_rgba(248,113,113,0.1)]",
  warning: "text-amber-400 border-amber-400/20 bg-amber-400/5 shadow-[0_0_20px_rgba(251,191,36,0.1)]",
  info: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5 shadow-[0_0_20px_rgba(34,213,238,0.1)]",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.2 } }}
              className={cn(
                "pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-[20px] border liquid-glass-static min-w-[320px] max-w-[420px] group",
                COLORS[toast.type]
              )}
            >
              <div className="flex-shrink-0">
                <Icon size={20} className="drop-shadow-[0_0_8px_currentColor]" />
              </div>
              <p className="flex-1 text-sm font-medium text-white/90 leading-snug">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/20 hover:text-white/60 transition-colors p-1"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
