"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, Star, Edit3, Camera, MapPin, Globe, Loader2, Sparkles, Clock, Target } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useRef, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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

interface UserProfile {
  name: string;
  email: string;
  image?: string;
  bio?: string;
  skillsOffered?: string[];
  skillsWanted?: string[];
  skillLevel?: string;
  availability?: string[];
  portfolioUrl?: string;
  createdAt?: string;
  banner?: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const { user: localUser, updateUser } = useUserStore();
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (res.ok) {
          setProfile(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        
        // Update local state for immediate feedback
        if (type === 'avatar') {
          updateUser({ avatarUrl: result });
          if (profile) setProfile({ ...profile, image: result });
        } else {
          updateUser({ bannerUrl: result });
          if (profile) setProfile({ ...profile, banner: result });
        }

        // Save to Database
        try {
          await fetch("/api/user/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              type === 'avatar' ? { image: result } : { banner: result }
            )
          });
        } catch (error) {
          console.error("Failed to update profile image", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!profile && !session?.user) return null;

  // Use DB data first, fallback to session data
  const displayName = profile?.name || session?.user?.name || "User";
  const displayEmail = profile?.email || session?.user?.email || "";
  const displayAvatar = profile?.image || localUser?.avatarUrl || session?.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;
  const bannerUrl = profile?.banner || localUser?.bannerUrl;

  const memberSince = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 w-full max-w-5xl mx-auto flex flex-col space-y-6 pb-20"
    >
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={bannerInputRef} 
        onChange={(e) => handleFileChange(e, 'banner')} 
        className="hidden" 
        accept="image/*"
      />
      <input 
        type="file" 
        ref={avatarInputRef} 
        onChange={(e) => handleFileChange(e, 'avatar')} 
        className="hidden" 
        accept="image/*"
      />

      {/* Profile Header Card */}
      <motion.div variants={itemVariants} className="liquid-glass relative overflow-hidden">
        <div 
          className="h-32 w-full relative transition-all duration-500 bg-cover bg-center"
          style={{ 
            backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'none'
          }}
        >
          {!bannerUrl && <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-indigo-500/20 to-purple-500/20" />}
           <button 
            onClick={() => bannerInputRef.current?.click()}
            className="absolute top-4 right-4 glass-button px-4 py-2 text-xs font-semibold text-white/95 flex items-center gap-2 backdrop-blur-xl hover:bg-white/10 transition-all z-20"
           >
             <Edit3 size={14} /> Edit Banner
           </button>
        </div>
        
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6 flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
              <div className="relative group">
                <img src={displayAvatar} alt={displayName} className="w-32 h-32 rounded-[32px] border-4 border-[#1a1c2e] shadow-2xl object-cover bg-[#1a1c2e]" />
                <button 
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] flex items-center justify-center text-white"
                >
                  <Camera size={24} />
                </button>
              </div>
              <div className="pt-4">
                <h1 className="text-3xl font-fustat font-bold text-white/95 flex items-center gap-3">
                  {displayName}
                  <Shield className="w-6 h-6 text-cyan-400" />
                </h1>
                <p className="text-white/60 font-medium flex items-center gap-2 mt-1">
                  <Mail size={14} /> {displayEmail}
                </p>
                {profile?.skillLevel && (
                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-medium text-blue-300">
                    {profile.skillLevel} Level
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Trust Score</p>
              <p className="text-xl font-bold text-cyan-400">100/100</p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Total Earned</p>
              <p className="text-xl font-bold text-white/95">0 <span className="text-xs opacity-60">CR</span></p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Sessions</p>
              <p className="text-xl font-bold text-white/95">0</p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Avg Rating</p>
              <p className="text-xl font-bold text-amber-400 flex items-center justify-center gap-1">
                New <Star size={16} className="fill-amber-400" />
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About & Skills */}
        <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">
          <div className="liquid-glass p-6">
            <h3 className="text-lg font-bold text-white/95 mb-4">About Me</h3>
            <p className="text-white/65 leading-relaxed whitespace-pre-wrap">
              {profile?.bio || "No bio added yet."}
            </p>
            
            {profile?.availability && profile.availability.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {profile.availability.map(avail => (
                  <div key={avail} className="flex items-center gap-2 text-white/60 text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <Clock size={14} className="text-cyan-400" /> Available {avail}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="liquid-glass p-6">
              <h3 className="text-lg font-bold text-white/95 mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-400" /> Skills I Offer
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile?.skillsOffered && profile.skillsOffered.length > 0 ? (
                  profile.skillsOffered.map(skill => (
                    <span key={skill} className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-sm text-blue-300 transition-colors cursor-default">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-white/40">No skills listed</span>
                )}
              </div>
            </div>

            <div className="liquid-glass p-6">
              <h3 className="text-lg font-bold text-white/95 mb-4 flex items-center gap-2">
                <Target size={18} className="text-purple-400" /> Skills I Want
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile?.skillsWanted && profile.skillsWanted.length > 0 ? (
                  profile.skillsWanted.map(skill => (
                    <span key={skill} className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-sm text-purple-300 transition-colors cursor-default">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-white/40">No skills listed</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Socials & Info */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="liquid-glass p-6">
            <h3 className="text-lg font-bold text-white/95 mb-4">Connect</h3>
            <div className="space-y-4">
              {profile?.portfolioUrl ? (
                <a href={profile.portfolioUrl.startsWith('http') ? profile.portfolioUrl : `https://${profile.portfolioUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-cyan-400 transition-colors group">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-cyan-400/30 transition-all">
                    <Globe size={18} />
                  </div>
                  <span className="text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap" title={profile.portfolioUrl}>
                    Portfolio / Website
                  </span>
                </a>
              ) : (
                <p className="text-sm text-white/40 italic">No links added yet.</p>
              )}
            </div>
          </div>

          <div className="liquid-glass p-6 bg-gradient-to-br from-cyan-400/5 to-indigo-500/5">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">Member Since</h3>
            <p className="text-white/95 font-inter font-medium text-lg">{memberSince}</p>
            <p className="text-xs text-white/40 mt-1">New Member</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
