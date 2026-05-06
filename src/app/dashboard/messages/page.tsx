"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Search, Send, Plus, MoreVertical, Paperclip, Smile, ArrowRightLeft, CheckCircle2, XCircle, Loader2, Clock, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { toast } from "@/store/useToastStore";

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
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.conversationId === activeConversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch('/api/messages');
        const data = await res.json();
        setConversations(Array.isArray(data) ? data : []);
        // Auto-select first conversation
        if (Array.isArray(data) && data.length > 0 && !activeConversationId) {
          setActiveConversationId(data[0].conversationId);
        }
      } catch (error) {
        console.error("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConversationId) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await fetch(`/api/messages/${activeConversationId}`);
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [activeConversationId]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!activeConversationId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages/${activeConversationId}`);
        const data = await res.json();
        if (Array.isArray(data)) setMessages(data);
      } catch { /* silent */ }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeConversationId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageInput.trim() || !activeConversation || sending) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: activeConversation.partner._id,
          text: messageInput,
          type: 'text'
        })
      });

      if (!res.ok) throw new Error("Failed to send");

      const newMsg = await res.json();
      setMessages(prev => [...prev, newMsg]);
      setMessageInput("");

      // Update last message in conversations list
      setConversations(prev => prev.map(c =>
        c.conversationId === activeConversationId
          ? { ...c, lastMessage: messageInput, lastMessageTime: new Date().toISOString() }
          : c
      ));
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleAcceptRequest = async (msg: any) => {
    if (!msg.metadata?.skillRequestId) return;
    
    try {
      const res = await fetch(`/api/marketplace/requests/${msg.metadata.skillRequestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      toast.success("Swap request accepted! Session scheduled.");

      // Send a system message
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: activeConversation.partner._id,
          text: `✅ Swap request accepted! A session for ${msg.metadata.skillOffered} ↔ ${msg.metadata.skillWanted} has been scheduled.`,
          type: 'system'
        })
      });

      // Refresh messages
      const msgRes = await fetch(`/api/messages/${activeConversationId}`);
      const msgData = await msgRes.json();
      if (Array.isArray(msgData)) setMessages(msgData);

    } catch (error: any) {
      toast.error(error.message || "Failed to accept request");
    }
  };

  const handleRejectRequest = async (msg: any) => {
    if (!msg.metadata?.skillRequestId) return;

    try {
      const res = await fetch(`/api/marketplace/requests/${msg.metadata.skillRequestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      toast.info("Swap request declined.");

      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: activeConversation.partner._id,
          text: `❌ Swap request for ${msg.metadata.skillOffered} ↔ ${msg.metadata.skillWanted} was declined.`,
          type: 'system'
        })
      });

      const msgRes = await fetch(`/api/messages/${activeConversationId}`);
      const msgData = await msgRes.json();
      if (Array.isArray(msgData)) setMessages(msgData);

    } catch (error: any) {
      toast.error(error.message || "Failed to reject request");
    }
  };

  const currentUserId = (session?.user as any)?.id;
  const filteredConversations = conversations.filter(c =>
    c.partner?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 h-[calc(100vh-140px)] w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 pb-4"
    >
      {/* Sidebar - Chats List */}
      <motion.div 
        variants={itemVariants} 
        className={cn(
          "w-full md:w-80 liquid-glass flex flex-col overflow-hidden border-r border-white/5",
          showMobileChat ? "hidden md:flex" : "flex"
        )}
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-xl font-fustat font-black text-white/95 tracking-tight">Messages</h1>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white/95 placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <MessageSquare className="w-10 h-10 text-white/15 mb-3" />
              <p className="text-sm text-white/40">No conversations yet</p>
              <p className="text-xs text-white/25 mt-1">Send a swap request in the Marketplace to start chatting!</p>
            </div>
          ) : (
            filteredConversations.map((chat) => {
              const isActive = chat.conversationId === activeConversationId;
              return (
                <div 
                  key={chat.conversationId} 
                  onClick={() => {
                    setActiveConversationId(chat.conversationId);
                    setShowMobileChat(true);
                  }}
                  className={cn(
                    "p-4 flex items-center gap-4 cursor-pointer transition-all relative group",
                    isActive ? "bg-white/10" : "hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div layoutId="active-chat-indicator" className="absolute left-0 w-1 h-10 bg-cyan-400 rounded-r-full shadow-[0_0_15px_rgba(34,213,238,0.6)]" />
                  )}
                  <div className="relative">
                    <img src={chat.partner.avatar} alt={chat.partner.name} className="w-12 h-12 rounded-full border border-white/10 shadow-lg object-cover bg-black/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className={cn("text-sm font-bold truncate transition-colors", isActive ? "text-cyan-400" : "text-white/90")}>{chat.partner.name}</h3>
                      <span className="text-[10px] text-white/40 flex-shrink-0 ml-2">{formatTime(chat.lastMessageTime)}</span>
                    </div>
                    <p className="text-xs text-white/40 truncate group-hover:text-white/60 transition-colors flex items-center gap-1">
                      {chat.lastMessageType === 'swap-request' && <ArrowRightLeft size={10} className="text-cyan-400 flex-shrink-0" />}
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && !isActive && (
                    <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center text-[10px] font-bold text-black shadow-[0_0_10px_rgba(34,213,238,0.5)]">
                      {chat.unread}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <motion.div 
        variants={itemVariants} 
        className={cn(
          "flex-1 liquid-glass flex flex-col overflow-hidden relative",
          !showMobileChat ? "hidden md:flex" : "flex"
        )}
      >
        {!activeConversationId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-white/15" />
            </div>
            <h2 className="text-xl font-bold text-white/90 mb-2">Welcome to Messages</h2>
            <p className="text-sm text-white/40 max-w-sm">
              Send a swap request from the Marketplace to start a conversation with a mentor.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeConversationId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              {/* Chat Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/2 backdrop-blur-md relative z-10">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Mobile Back Button */}
                  <button 
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden p-2 -ml-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  
                  <div className="relative">
                    <img src={activeConversation?.partner?.avatar} alt={activeConversation?.partner?.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 object-cover bg-black/20" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white/95">{activeConversation?.partner?.name}</h3>
                    <p className="text-[9px] sm:text-[10px] font-medium text-white/30">SkillSwap Partner</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl glass-button text-white/40 hover:text-white/95 transition-all">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 bg-gradient-to-b from-transparent to-white/1">
                {loadingMessages ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm text-white/30">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center mb-2">
                      <span className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-[10px] text-white/40 uppercase tracking-widest font-black">Conversation</span>
                    </div>

                    <AnimatePresence initial={false}>
                      {messages.map((msg) => {
                        const isMe = msg.senderId?._id === currentUserId || msg.senderId === currentUserId;

                        // System messages
                        if (msg.type === 'system') {
                          return (
                            <motion.div
                              key={msg._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-center my-2"
                            >
                              <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white/50 max-w-md text-center">
                                {msg.text}
                              </div>
                            </motion.div>
                          );
                        }

                        // Swap request messages
                        if (msg.type === 'swap-request') {
                          return (
                            <motion.div
                              key={msg._id}
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              className={cn(
                                "flex flex-col gap-1.5 max-w-[80%]",
                                isMe ? "self-end items-end" : "items-start"
                              )}
                            >
                              <div className="p-4 rounded-2xl border bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border-cyan-400/25 shadow-lg w-full max-w-sm">
                                <div className="flex items-center gap-2 mb-3">
                                  <ArrowRightLeft size={16} className="text-cyan-400" />
                                  <span className="text-xs font-black text-cyan-400 uppercase tracking-wide">Swap Request</span>
                                </div>
                                <div className="space-y-2 mb-3">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/50">Offering:</span>
                                    <span className="font-bold text-white/90">{msg.metadata?.skillOffered}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/50">Wanting:</span>
                                    <span className="font-bold text-cyan-400">{msg.metadata?.skillWanted}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/50">Cost:</span>
                                    <span className="font-bold text-white/90 flex items-center gap-1"><Clock size={12} /> {msg.metadata?.creditCost} Credits</span>
                                  </div>
                                </div>
                                <div className="pt-3 border-t border-white/10">
                                  <p className="text-xs text-white/60 italic mb-3">"{msg.text}"</p>
                                  {!isMe && msg.metadata?.status === 'pending' && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleAcceptRequest(msg)}
                                        className="flex-1 py-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-500/30 transition-all active:scale-95"
                                      >
                                        <CheckCircle2 size={14} /> Accept
                                      </button>
                                      <button
                                        onClick={() => handleRejectRequest(msg)}
                                        className="flex-1 py-2 rounded-lg bg-red-500/20 border border-red-400/30 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-500/30 transition-all active:scale-95"
                                      >
                                        <XCircle size={14} /> Decline
                                      </button>
                                    </div>
                                  )}
                                  {msg.metadata?.status === 'accepted' && (
                                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                      <CheckCircle2 size={14} /> Accepted
                                    </div>
                                  )}
                                  {msg.metadata?.status === 'rejected' && (
                                    <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                                      <XCircle size={14} /> Declined
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className="text-[10px] text-white/30 px-1">{formatTime(msg.createdAt)}</span>
                            </motion.div>
                          );
                        }

                        // Regular text messages
                        return (
                          <motion.div 
                            key={msg._id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={cn(
                              "flex flex-col gap-1.5 max-w-[75%]",
                              isMe ? "self-end items-end" : "items-start"
                            )}
                          >
                            <div className={cn(
                              "p-4 rounded-2xl text-sm shadow-lg border",
                              isMe 
                                ? "bg-cyan-500/10 border-cyan-400/30 text-white/95 rounded-tr-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                                : "bg-white/5 border-white/10 text-white/90 rounded-tl-none"
                            )}>
                              {msg.text}
                            </div>
                            <span className="text-[10px] text-white/30 px-1">{formatTime(msg.createdAt)}</span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-5 border-t border-white/10 relative z-10 bg-white/2">
                <form onSubmit={handleSendMessage} className="relative group flex items-center gap-3">
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
                      disabled={!messageInput.trim() || sending}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed text-black p-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(34,213,238,0.3)] active:scale-90"
                    >
                      {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
}
