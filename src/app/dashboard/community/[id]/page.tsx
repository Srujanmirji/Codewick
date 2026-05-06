"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle, Clock } from "lucide-react";
import { toast } from "@/store/useToastStore";

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, [params.id]);

  const fetchQuestion = async () => {
    try {
      const res = await fetch(`/api/community/questions/${params.id}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestion(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/community/questions/${params.id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: answerContent })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success("Answer posted!");
      setAnswerContent("");
      fetchQuestion();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (answerId: string) => {
    if (!confirm("Are you sure this answer solved your problem? The bounty will be awarded to them.")) return;
    try {
      const res = await fetch(`/api/community/questions/${params.id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answerId })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      toast.success("Bounty awarded!");
      fetchQuestion();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return <div className="p-6 text-white animate-pulse">Loading...</div>;
  }

  if (!question) {
    return <div className="p-6 text-white">Question not found</div>;
  }

  const isAuthor = (session?.user as any)?.id === question.author._id.toString();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pb-20">
      <button 
        onClick={() => router.push("/dashboard/community")}
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors w-fit"
      >
        <ChevronLeft size={16} /> Back to Community
      </button>

      {/* Question Details */}
      <div className="liquid-glass-static p-8 rounded-[32px] relative overflow-hidden">
        {question.bounty > 0 && (
          <div className="absolute top-0 right-0 bg-amber-500 text-amber-950 font-black px-6 py-2 rounded-bl-[24px] shadow-lg">
            {question.bounty} TC BOUNTY
          </div>
        )}
        
        <h1 className="text-3xl font-bold text-white mb-4 pr-32">{question.title}</h1>
        
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
          <img src={question.author.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${question.author.name}`} alt="" className="w-12 h-12 rounded-full border border-white/20" />
          <div>
            <p className="text-white font-bold">{question.author.name}</p>
            <p className="text-white/40 text-xs flex items-center gap-1">
              <Clock size={12} /> {new Date(question.createdAt).toLocaleString()}
            </p>
          </div>
          {question.status === 'resolved' && (
            <div className="ml-auto flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full font-bold text-sm">
              <CheckCircle size={16} /> Resolved
            </div>
          )}
        </div>

        <div className="text-white/80 whitespace-pre-wrap leading-relaxed mb-6">
          {question.description}
        </div>

        <div className="flex gap-2">
          {question.tags?.map((tag: string, i: number) => (
            <span key={i} className="text-xs bg-white/10 text-white/60 px-3 py-1 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Answers Section */}
      <h2 className="text-2xl font-bold text-white mt-4">{question.answers?.length || 0} Answers</h2>

      <div className="flex flex-col gap-4">
        {question.answers?.map((ans: any) => (
          <div key={ans._id} className={`liquid-glass-static p-6 rounded-[24px] ${ans.isAccepted ? 'border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : ''}`}>
            {ans.isAccepted && (
              <div className="flex items-center gap-2 text-green-400 mb-4 font-bold text-sm bg-green-500/10 w-fit px-3 py-1 rounded-full">
                <CheckCircle size={16} /> Accepted Answer & Bounty Winner
              </div>
            )}
            <div className="text-white/90 whitespace-pre-wrap mb-6">
              {ans.content}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <img src={ans.author.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${ans.author.name}`} alt="" className="w-8 h-8 rounded-full border border-white/20" />
                <div>
                  <p className="text-white/80 text-sm font-semibold">{ans.author.name}</p>
                  <p className="text-white/40 text-[10px]">{new Date(ans.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {isAuthor && question.status === 'open' && (
                <button 
                  onClick={() => handleResolve(ans._id)}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Accept & Award Bounty
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Post Answer Form */}
      {question.status === 'open' && (
        <div className="liquid-glass-static p-6 rounded-[24px] mt-8">
          <h3 className="text-lg font-bold text-white mb-4">Submit an Answer</h3>
          <form onSubmit={handlePostAnswer}>
            <textarea
              required
              rows={5}
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="Write your solution here..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 mb-4"
            />
            <button 
              type="submit"
              disabled={submitting}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 float-right"
            >
              {submitting ? "Posting..." : "Post Answer"}
            </button>
          </form>
        </div>
      )}

      {question.status === 'open' && isAuthor && (
        <div className="text-center py-8 text-white/40 bg-white/5 rounded-[24px] mt-4 border border-white/5 border-dashed">
          Waiting for community answers... You can award your bounty to the best response!
        </div>
      )}
    </div>
  );
}
