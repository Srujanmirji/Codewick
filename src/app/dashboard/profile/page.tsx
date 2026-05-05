"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Shield, Star, Edit3, Camera, MapPin, Globe, Loader2, Sparkles, Clock, Target, Briefcase, Code2, ExternalLink, Plus, AlertTriangle } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useRef, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/Modal";
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
  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [socialInputs, setSocialInputs] = useState({
    linkedin: localUser?.linkedinUrl || "",
    github: localUser?.githubUrl || "",
    portfolio: localUser?.portfolioUrl || ""
  });

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(localUser?.bio || "");

  useEffect(() => {
    if (localUser) {
      setSocialInputs({
        linkedin: localUser.linkedinUrl || "",
        github: localUser.githubUrl || "",
        portfolio: localUser.portfolioUrl || ""
      });
      setBioInput(localUser.bio || "");
    }
  }, [localUser]);

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
        
        if (type === 'avatar') {
          updateUser({ avatarUrl: result });
          if (profile) setProfile({ ...profile, image: result });
        } else {
          updateUser({ bannerUrl: result });
          if (profile) setProfile({ ...profile, banner: result });
        }

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

  const handleSaveSocials = () => {
    updateUser({
      linkedinUrl: socialInputs.linkedin,
      githubUrl: socialInputs.github,
      portfolioUrl: socialInputs.portfolio
    });
    setIsEditingSocials(false);
    toast.success("Connect links updated successfully!");
  };

  const handleSaveBio = () => {
    updateUser({
      bio: bioInput
    });
    setIsEditingBio(false);
    toast.success("Bio updated successfully!");
  };

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  const displayName = profile?.name || localUser?.name || session?.user?.name || "User";
  const displayEmail = profile?.email || localUser?.email || session?.user?.email || "";
  const displayAvatar = profile?.image || localUser?.avatarUrl || session?.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;
  const bannerUrl = profile?.banner || localUser?.bannerUrl; 
  
  const linkedinUrl = localUser?.linkedinUrl;
  const githubUrl = localUser?.githubUrl;
  const portfolioUrl = localUser?.portfolioUrl || profile?.portfolioUrl;

  const memberSince = profile?.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
    : "May 2026";

  return (
    <>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 w-full max-w-5xl mx-auto flex flex-col space-y-6 pb-20"
    >
      <input type="file" ref={bannerInputRef} onChange={(e) => handleFileChange(e, 'banner')} className="hidden" accept="image/*" />
      <input type="file" ref={avatarInputRef} onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" accept="image/*" />

      <motion.div variants={itemVariants} className="liquid-glass relative overflow-hidden">
        <div 
          className="h-32 w-full relative transition-all duration-500 bg-cover bg-center"
          style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'none' }}
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
                
                {localUser && localUser.trustScore < 30 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-3 px-4 py-2 rounded-xl bg-red-400/10 border border-red-400/20 flex items-center gap-2 text-red-400 text-xs font-bold"
                  >
                    <AlertTriangle size={14} />
                    Low Trust — Complete sessions to improve
                  </motion.div>
                )}
                
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
              <p className="text-xl font-bold text-cyan-400">{localUser?.trustScore || 100}/100</p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">Total Earned</p>
              <p className="text-xl font-bold text-white/95">{localUser?.credits || 0} <span className="text-xs opacity-60">CR</span></p>
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
        <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">
          <div className="liquid-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white/95">About Me</h3>
              <button onClick={() => setIsEditingBio(true)} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                <Edit3 size={12} /> Edit
              </button>
            </div>
            <p className="text-white/65 leading-relaxed whitespace-pre-wrap">
              {localUser?.bio || profile?.bio || "No bio added yet."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="liquid-glass p-6">
              <h3 className="text-lg font-bold text-white/95 mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-400" /> Skills I Offer
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile?.skillsOffered?.map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-sm text-blue-300">{skill}</span>
                )) || <span className="text-sm text-white/40">No skills listed</span>}
              </div>
            </div>
            <div className="liquid-glass p-6">
              <h3 className="text-lg font-bold text-white/95 mb-4 flex items-center gap-2">
                <Target size={18} className="text-purple-400" /> Skills I Want
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile?.skillsWanted?.map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-sm text-purple-300">{skill}</span>
                )) || <span className="text-sm text-white/40">No skills listed</span>}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <div className="liquid-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white/95">Connect</h3>
              <button onClick={() => setIsEditingSocials(true)} className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                <Edit3 size={12} /> Edit
              </button>
            </div>
            <div className="space-y-3">
              {linkedinUrl && <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-[#0077b5]"><Briefcase size={18} /> LinkedIn</a>}
              {githubUrl && <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-white"><Code2 size={18} /> GitHub</a>}
              {portfolioUrl && <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-cyan-400"><Globe size={18} /> Portfolio</a>}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>

    <Modal isOpen={isEditingSocials} onClose={() => setIsEditingSocials(false)} title="Update Connect Links">
      <div className="space-y-6 py-4">
        <input value={socialInputs.linkedin} onChange={(e) => setSocialInputs({...socialInputs, linkedin: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="LinkedIn URL" />
        <input value={socialInputs.github} onChange={(e) => setSocialInputs({...socialInputs, github: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="GitHub URL" />
        <input value={socialInputs.portfolio} onChange={(e) => setSocialInputs({...socialInputs, portfolio: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="Portfolio URL" />
        <button onClick={handleSaveSocials} className="w-full glass-button-primary py-4 font-bold">Save Connections</button>
      </div>
    </Modal>
    </>
  );
}
