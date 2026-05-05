"use client";

import { useRouter } from "next/navigation";
import { Activity, Dispute } from "@/lib/api";
import { MessageSquare, Clock, Star, ShieldAlert, CheckCircle } from "lucide-react";

interface Props {
  activities: Activity[];
  disputes: Dispute[];
}

export function RecentActivity({ activities, disputes }: Props) {
  const router = useRouter();
  const getIcon = (type: string) => {
    switch (type) {
      case 'session': return <MessageSquare className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_3px_rgba(34,213,238,0.3)]" />;
      case 'credit': return <Clock className="w-4 h-4 text-teal-300 drop-shadow-[0_0_3px_rgba(45,212,191,0.3)]" />;
      case 'rating': return <Star className="w-4 h-4 text-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.3)]" />;
      case 'dispute': return <ShieldAlert className="w-4 h-4 text-orange-400 drop-shadow-[0_0_3px_rgba(249,115,22,0.3)]" />;
      default: return <CheckCircle className="w-4 h-4 text-white/40" />;
    }
  };

  return (
    <div className="liquid-glass p-6 h-full flex flex-col group">
      {/* Alerts/Disputes Section */}
      {disputes.length > 0 && (
        <div className="mb-6 p-4 rounded-xl liquid-glass-static bg-red-400/5 border border-red-400/20 shadow-[0_4px_20px_rgba(248,113,113,0.05)] relative overflow-hidden transition-transform hover:bg-red-400/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/10 rounded-full blur-[30px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <ShieldAlert className="w-5 h-5 text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]" />
            <h4 className="font-semibold text-red-400">Action Required</h4>
          </div>
          <div className="space-y-2 relative z-10">
            {disputes.map(d => (
              <div key={d.id} className="flex items-center justify-between text-sm">
                <span className="text-white/95">{d.title}</span>
                <button 
                  onClick={() => router.push("/dashboard/disputes")}
                  className="text-red-400 hover:text-red-300 hover:drop-shadow-[0_0_3px_rgba(248,113,113,0.3)] underline font-medium transition-all active:scale-95"
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-lg font-semibold bg-gradient-to-r from-white via-white/90 to-cyan-100 bg-clip-text text-transparent mb-5 drop-shadow-sm">Recent Activity</h3>
      <div className="flex-1 relative">
        {/* Glowing Timeline Line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-cyan-400/20 via-indigo-500/10 to-transparent rounded-full"></div>
        
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 relative z-10 group/item">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-white/10 transition-colors duration-300">
                {getIcon(activity.type)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white/65 group-hover/item:text-white/95 transition-colors">{activity.description}</span>
                <span className="text-xs text-white/40 mt-1 transition-colors">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={() => router.push("/dashboard/sessions")}
        className="w-full mt-4 pt-4 border-t border-white/10 text-sm text-cyan-400/80 font-medium hover:text-cyan-300 hover:drop-shadow-[0_0_5px_rgba(34,213,238,0.3)] transition-all relative z-10 active:scale-95"
      >
        View All Activity
      </button>
    </div>
  );
}
