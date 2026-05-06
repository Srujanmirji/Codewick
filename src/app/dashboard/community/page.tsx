"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, HelpCircle, MessageCircle, CheckCircle, Clock } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/store/useToastStore";
import { useUserStore } from "@/store/useUserStore";

export default function CommunityPage() {
  const { data: session } = useSession();
  const { user } = useUserStore();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bounty, setBounty] = useState<number>(0);
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/community/questions");
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    
    if (bounty > (user?.credits || 0)) {
      toast.error("Insufficient time credits");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/community/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          bounty,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success("Question posted successfully!");
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setBounty(0);
      setTags("");
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase()) || 
    q.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center liquid-glass-static p-6 rounded-[24px] gap-4">
        <div>
          <h1 className="text-3xl font-fustat font-black text-white drop-shadow-md flex items-center gap-3">
            <HelpCircle className="text-cyan-400" />
            Community Q&A
          </h1>
          <p className="text-white/60 mt-1">Help others, solve bugs, and earn bounties.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(34,213,238,0.4)] transition-all"
        >
          <Plus size={18} />
          Ask a Question
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input 
          type="text"
          placeholder="Search for questions or topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 text-white rounded-[20px] pl-12 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 animate-pulse">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 liquid-glass-static rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 liquid-glass-static rounded-[24px]">
              <HelpCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No questions found.</p>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <Link key={q._id} href={`/dashboard/community/${q._id}`}>
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="liquid-glass-static p-6 rounded-[24px] hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col md:flex-row gap-6 items-start md:items-center"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        q.status === 'resolved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {q.status === 'resolved' ? 'Resolved' : 'Open'}
                      </span>
                      {q.bounty > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
                          💰 {q.bounty} TC Bounty
                        </span>
                      )}
                      <span className="text-white/40 text-xs flex items-center gap-1">
                        <Clock size={12} /> {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 truncate">{q.title}</h3>
                    <p className="text-white/60 text-sm line-clamp-2 mb-3">{q.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {q.tags?.map((tag: string, i: number) => (
                        <span key={i} className="text-xs bg-white/5 text-white/50 px-2 py-1 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 shrink-0 border-l border-white/10 pl-6 h-full min-w-[140px] justify-between">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-white/80">{q.answers?.length || 0}</span>
                      <span className="text-xs text-white/40 uppercase tracking-tighter font-black">Answers</span>
                    </div>
                    
                    <button className="bg-white/5 hover:bg-white/10 text-cyan-400 p-2.5 rounded-xl border border-white/10 transition-all group-hover:border-cyan-500/30">
                      <MessageCircle size={20} />
                    </button>

                    <div className="flex flex-col items-center gap-1">
                      <img src={q.author?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${q.author?.name}`} alt="" className="w-10 h-10 rounded-full border border-white/20" />
                      <span className="text-xs text-white/50 w-16 truncate text-center font-medium">{q.author?.name}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Post Question Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ask the Community">
        <form onSubmit={handlePostQuestion} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-white/50 font-bold uppercase mb-1 block">Title</label>
            <input 
              required
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. How to center a div in Tailwind?"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 font-bold uppercase mb-1 block">Description</label>
            <textarea 
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide more context..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-white/50 font-bold uppercase mb-1 block">Bounty (Time Credits)</label>
              <input 
                type="number"
                min="0"
                step="0.1"
                value={bounty}
                onChange={e => setBounty(parseFloat(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50"
              />
              <p className="text-[10px] text-white/40 mt-1">Available: {user?.credits} TC</p>
            </div>
            <div className="flex-1">
              <label className="text-xs text-white/50 font-bold uppercase mb-1 block">Tags (comma separated)</label>
              <input 
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="react, css"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 rounded-xl text-white/50 bg-white/5 hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="flex-1 py-3 rounded-xl text-black font-bold bg-cyan-500 hover:bg-cyan-400 transition-all disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Question"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
