"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] cursor-pointer"
          />
          <div className="fixed inset-0 flex items-center justify-center z-[10000] pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg max-h-[85vh] pointer-events-auto relative flex flex-col rounded-3xl border border-white/15 border-t-white/30"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.04), rgba(139, 92, 246, 0.03)), linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02))',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 0 20px rgba(34, 211, 238, 0.05)',
              }}
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  // Use portal to render modal at document.body level, avoiding any overflow clipping
  if (mounted && typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
}
