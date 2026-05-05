"use client";

import { motion } from "framer-motion";
import { MessageSquare, Search, Send, Plus, MoreVertical, Paperclip, Smile } from "lucide-react";

const CHATS = [
  { id: 1, name: "Sarah Jenkins", lastMsg: "See you at the React session!", time: "2:45 PM", unread: 2, avatar: "https://i.pravatar.cc/150?u=sarah" },
  { id: 2, name: "Michael Chen", lastMsg: "The design looks much better now.", time: "11:30 AM", unread: 0, avatar: "https://i.pravatar.cc/150?u=michael" },
  { id: 3, name: "Emma Wilson", lastMsg: "Thanks for the help with Python!", time: "Yesterday", unread: 0, avatar: "https://i.pravatar.cc/150?u=emma" },
  { id: 4, name: "David Lee", lastMsg: "Can we reschedule to Tuesday?", time: "May 03", unread: 0, avatar: "https://i.pravatar.cc/150?u=david" },
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

export default function MessagesPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 h-[calc(100vh-140px)] w-full max-w-7xl mx-auto flex gap-6 pb-4"
    >
      {/* Sidebar - Chats List */}
      <motion.div variants={itemVariants} className="w-80 liquid-glass flex flex-col overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-xl font-bold text-white/95">Messages</h1>
            <button className="p-2 rounded-full glass-button text-cyan-400">
              <Plus size={20} />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white/95 placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {CHATS.map((chat) => (
            <div key={chat.id} className="p-4 flex items-center gap-4 hover:bg-white/5 cursor-pointer transition-colors relative group">
              <div className="relative">
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full border border-white/10" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1a1c2e]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-sm font-bold text-white/95 truncate">{chat.name}</h3>
                  <span className="text-[10px] text-white/40">{chat.time}</span>
                </div>
                <p className="text-xs text-white/40 truncate group-hover:text-white/60 transition-colors">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center text-[10px] font-bold text-black shadow-[0_0_10px_rgba(34,213,238,0.5)]">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <motion.div variants={itemVariants} className="flex-1 liquid-glass flex flex-col overflow-hidden relative">
        {/* Chat Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/2 backdrop-blur-sm relative z-10">
          <div className="flex items-center gap-4">
            <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah" className="w-10 h-10 rounded-full border border-white/10" />
            <div>
              <h3 className="text-sm font-bold text-white/95">Sarah Jenkins</h3>
              <p className="text-[10px] text-emerald-400 font-medium">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full glass-button text-white/40 hover:text-white/95"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Messages Placeholder */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
           <div className="flex justify-center">
             <span className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-[10px] text-white/40 uppercase tracking-widest font-bold">Today</span>
           </div>
           
           <div className="flex flex-col gap-2 max-w-[70%]">
             <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none text-sm text-white/90 shadow-sm">
               Hi! I was looking at your React Mentoring session. Are you available this Thursday?
             </div>
             <span className="text-[10px] text-white/30 ml-2">2:30 PM</span>
           </div>

           <div className="flex flex-col gap-2 max-w-[70%] self-end items-end">
             <div className="bg-cyan-400/10 border border-cyan-400/20 p-4 rounded-2xl rounded-tr-none text-sm text-white/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
               Yes, Thursday works perfectly for me. What topics would you like to cover?
             </div>
             <span className="text-[10px] text-white/30 mr-2">2:35 PM</span>
           </div>

           <div className="flex flex-col gap-2 max-w-[70%]">
             <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none text-sm text-white/90 shadow-sm">
               I'd like to dive into Server Components and the new App Router patterns. See you at the React session!
             </div>
             <span className="text-[10px] text-white/30 ml-2">2:45 PM</span>
           </div>
        </div>

        {/* Message Input */}
        <div className="p-5 border-t border-white/10 relative z-10">
          <div className="relative group flex items-center gap-3">
             <div className="flex items-center gap-1">
                <button className="p-2 text-white/40 hover:text-cyan-400 transition-colors"><Paperclip size={20} /></button>
                <button className="p-2 text-white/40 hover:text-cyan-400 transition-colors"><Smile size={20} /></button>
             </div>
             <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-sm text-white/95 placeholder:text-white/20 focus:outline-none focus:border-cyan-400/50 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-400 hover:bg-cyan-300 text-black p-2 rounded-xl transition-all shadow-[0_0_15px_rgba(34,213,238,0.3)]">
                  <Send size={18} />
                </button>
             </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
