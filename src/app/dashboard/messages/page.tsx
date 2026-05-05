"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Search, Send, Plus, MoreVertical, Paperclip, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const CHATS = [
  { id: 1, name: "Sarah Jenkins", lastMsg: "See you at the React session!", time: "2:45 PM", unread: 2, avatar: "https://i.pravatar.cc/150?u=sarah", online: true },
  { id: 2, name: "Michael Chen", lastMsg: "The design looks much better now.", time: "11:30 AM", unread: 0, avatar: "https://i.pravatar.cc/150?u=michael", online: false },
  { id: 3, name: "Emma Wilson", lastMsg: "Thanks for the help with Python!", time: "Yesterday", unread: 0, avatar: "https://i.pravatar.cc/150?u=emma", online: true },
  { id: 4, name: "David Lee", lastMsg: "Can we reschedule to Tuesday?", time: "May 03", unread: 0, avatar: "https://i.pravatar.cc/150?u=david", online: false },
];

const INITIAL_CONVERSATIONS: Record<number, any[]> = {
  1: [
    { id: 1, sender: "Sarah Jenkins", text: "Hi! I was looking at your React Mentoring session. Are you available this Thursday?", time: "2:30 PM", isMe: false },
    { id: 2, sender: "Me", text: "Yes, Thursday works perfectly for me. What topics would you like to cover?", time: "2:35 PM", isMe: true },
    { id: 3, sender: "Sarah Jenkins", text: "I'd like to dive into Server Components and the new App Router patterns. See you at the React session!", time: "2:45 PM", isMe: false },
  ],
  2: [
    { id: 1, sender: "Michael Chen", text: "Hey, did you see the new design system update?", time: "10:15 AM", isMe: false },
    { id: 2, sender: "Me", text: "Checking it now! Looks very clean.", time: "10:20 AM", isMe: true },
  ],
  3: [
    { id: 1, sender: "Emma Wilson", text: "The Python scripts are working perfectly! Thanks so much.", time: "Yesterday", isMe: false },
  ],
  4: [
    { id: 1, sender: "David Lee", text: "Can we reschedule our session to Tuesday?", time: "May 03", isMe: false },
  ]
};

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
  const [activeChatId, setActiveChatId] = useState(1);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = CHATS.find(c => c.id === activeChatId) || CHATS[0];
  const activeMessages = conversations[activeChatId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "Me",
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setConversations(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));
    setMessageInput("");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 h-[calc(100vh-140px)] w-full max-w-7xl mx-auto flex gap-6 pb-4"
    >
      {/* Sidebar - Chats List */}
      <motion.div variants={itemVariants} className="w-80 liquid-glass flex flex-col overflow-hidden border-r border-white/5">
        <div className="p-5 border-b border-white/10">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-xl font-fustat font-black text-white/95 tracking-tight">Messages</h1>
            <button className="p-2 rounded-xl glass-button text-cyan-400 hover:scale-110 active:scale-95 transition-all">
              <Plus size={20} />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white/95 placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {CHATS.map((chat) => {
            const isActive = chat.id === activeChatId;
            return (
              <div 
                key={chat.id} 
                onClick={() => setActiveChatId(chat.id)}
                className={cn(
                  "p-4 flex items-center gap-4 cursor-pointer transition-all relative group",
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div layoutId="active-chat-indicator" className="absolute left-0 w-1 h-10 bg-cyan-400 rounded-r-full shadow-[0_0_15px_rgba(34,213,238,0.6)]" />
                )}
                <div className="relative">
                  <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full border border-white/10 shadow-lg" />
                  {chat.online && (
                    <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#1a1c2e]"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={cn("text-sm font-bold truncate transition-colors", isActive ? "text-cyan-400" : "text-white/90")}>{chat.name}</h3>
                    <span className="text-[10px] text-white/40">{chat.time}</span>
                  </div>
                  <p className="text-xs text-white/40 truncate group-hover:text-white/60 transition-colors">
                    {conversations[chat.id]?.[conversations[chat.id].length - 1]?.text || chat.lastMsg}
                  </p>
                </div>
                {chat.unread > 0 && !isActive && (
                  <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center text-[10px] font-bold text-black shadow-[0_0_10px_rgba(34,213,238,0.5)]">
                    {chat.unread}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <motion.div variants={itemVariants} className="flex-1 liquid-glass flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeChatId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
          >
            {/* Chat Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/2 backdrop-blur-md relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full border border-white/10" />
                  {activeChat.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1a1c2e]"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white/95">{activeChat.name}</h3>
                  <p className={cn("text-[10px] font-medium", activeChat.online ? "text-emerald-400" : "text-white/30")}>
                    {activeChat.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl glass-button text-white/40 hover:text-white/95 transition-all">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 bg-gradient-to-b from-transparent to-white/1">
              <div className="flex justify-center mb-2">
                <span className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-[10px] text-white/40 uppercase tracking-widest font-black">Today</span>
              </div>
              
              <AnimatePresence initial={false}>
                {activeMessages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex flex-col gap-1.5 max-w-[75%]",
                      msg.isMe ? "self-end items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-2xl text-sm shadow-lg border",
                      msg.isMe 
                        ? "bg-cyan-500/10 border-cyan-400/30 text-white/95 rounded-tr-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                        : "bg-white/5 border-white/10 text-white/90 rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-white/30 px-1">{msg.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-5 border-t border-white/10 relative z-10 bg-white/2">
              <form onSubmit={handleSendMessage} className="relative group flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <button type="button" className="p-2 text-white/30 hover:text-cyan-400 transition-all hover:scale-110 active:scale-95"><Paperclip size={20} /></button>
                    <button type="button" className="p-2 text-white/30 hover:text-cyan-400 transition-all hover:scale-110 active:scale-95"><Smile size={20} /></button>
                </div>
                <div className="relative flex-1">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm text-white/95 placeholder:text-white/20 focus:outline-none focus:border-cyan-400/50 transition-all shadow-[inset_0_1px_4px_rgba(0,0,0,0.2)]"
                    />
                    <button 
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-black p-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(34,213,238,0.3)] active:scale-90"
                    >
                      <Send size={18} />
                    </button>
                </div>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
