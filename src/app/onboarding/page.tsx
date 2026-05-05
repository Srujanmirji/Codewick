"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Lightbulb, BarChart3, Clock, PenLine, Link2, Phone,
  ArrowRight, ArrowLeft, Check, Loader2, SkipForward,
} from "lucide-react";
import { TagInput } from "@/components/onboarding/TagInput";

const TOTAL_STEPS = 7;

const STEP_META = [
  { title: "Skills You Offer", subtitle: "What can you teach others?", icon: Sparkles },
  { title: "Skills You Want", subtitle: "What do you want to learn?", icon: Lightbulb },
  { title: "Your Skill Level", subtitle: "How experienced are you overall?", icon: BarChart3 },
  { title: "Availability", subtitle: "When are you free to swap?", icon: Clock },
  { title: "Short Bio", subtitle: "Tell us about yourself", icon: PenLine },
  { title: "Phone Number", subtitle: "So your matches can reach you", icon: Phone },
  { title: "Portfolio Link", subtitle: "Optional — share your work", icon: Link2 },
];

const LEVELS = ["Beginner", "Intermediate", "Expert"] as const;
const LEVEL_DETAILS = {
  Beginner: { emoji: "🌱", desc: "Just starting out" },
  Intermediate: { emoji: "🚀", desc: "Solid foundation" },
  Expert: { emoji: "⚡", desc: "Deep expertise" },
};

const AVAILABILITY_OPTIONS = ["Weekdays", "Weekends", "Evenings"] as const;
const AVAIL_EMOJI: Record<string, string> = { Weekdays: "💼", Weekends: "🏖️", Evenings: "🌙" };

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<string>("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  // Redirect if not logged in or already onboarded
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && (session?.user as any)?.onboardingComplete) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return skillsOffered.length >= 1;
      case 1: return skillsWanted.length >= 1;
      case 2: return skillLevel !== "";
      case 3: return availability.length >= 1;
      case 4: return bio.trim().length > 0;
      case 5: return true; // phone is optional
      case 6: return true; // portfolio is optional
      default: return false;
    }
  };

  const isSkippable = step === 5 || step === 6;

  const goNext = () => {
    if (step < TOTAL_STEPS - 1 && canProceed()) {
      setError("");
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setError("");
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillsOffered, skillsWanted, skillLevel, availability, bio, phone, portfolioUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setSubmitting(false);
        return;
      }
      // Hard navigation to force fresh session read from cookie
      // (router.push would use stale useSession cache on the dashboard)
      await update({ onboardingComplete: true });
      window.location.href = "/dashboard";
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const toggleAvailability = (opt: string) => {
    setAvailability((prev) =>
      prev.includes(opt) ? prev.filter((a) => a !== opt) : [...prev, opt]
    );
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </main>
    );
  }

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  const StepIcon = STEP_META[step].icon;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center selection:bg-blue-500/30">
      {/* Background Video */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60 z-0 backdrop-blur-[2px]" />

      {/* Floating orbs */}
      <div className="absolute top-[15%] left-[10%] w-[35vw] h-[35vw] max-w-[350px] max-h-[350px] rounded-full bg-blue-500/15 blur-[120px] animate-float-slow pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[15%] w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] rounded-full bg-indigo-500/15 blur-[100px] animate-float-slow-reverse pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-[520px] mx-auto px-4 py-8 sm:py-12">
        {/* Glass Card */}
        <div className="relative bg-black/40 backdrop-blur-[30px] border border-white/10 rounded-[24px] p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Shine sweep */}
          <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 pointer-events-none z-0" />

          {/* Header — Greeting */}
          <div className="text-center mb-2 relative z-10">
            {session?.user?.image && (
              <img src={session.user.image} alt="" className="w-14 h-14 rounded-full mx-auto mb-3 border-2 border-white/10 shadow-lg" />
            )}
            <h1 className="font-fustat font-bold text-2xl sm:text-3xl text-white tracking-tight">
              {step === 0 ? `Welcome, ${session?.user?.name?.split(" ")[0] || "there"}! 👋` : STEP_META[step].title}
            </h1>
            <p className="font-inter text-sm text-gray-400 mt-1">
              {step === 0 ? "Let's set up your profile in under a minute" : STEP_META[step].subtitle}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative z-10 mt-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-inter text-white/40">Step {step + 1} of {TOTAL_STEPS}</span>
              <span className="text-xs font-inter text-white/40">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Step Icon */}
          <div className="flex justify-center mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/20 flex items-center justify-center">
              <StepIcon className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          {/* Step Content */}
          <div className="relative z-10 min-h-[180px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {step === 0 && (
                  <div>
                    <label className="block text-sm font-inter font-medium text-white/70 mb-2">Add up to 5 skills you can teach</label>
                    <TagInput tags={skillsOffered} onChange={setSkillsOffered} placeholder="e.g. React, Python, UI Design..." />
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <label className="block text-sm font-inter font-medium text-white/70 mb-2">What skills do you want to learn?</label>
                    <TagInput tags={skillsWanted} onChange={setSkillsWanted} placeholder="e.g. Machine Learning, Go..." />
                  </div>
                )}

                {step === 2 && (
                  <div className="flex flex-col gap-3">
                    {LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSkillLevel(level)}
                        className={`flex items-center gap-4 w-full p-4 rounded-xl border transition-all duration-300 text-left group ${
                          skillLevel === level
                            ? "bg-blue-500/15 border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                            : "bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-white/20"
                        }`}
                      >
                        <span className="text-2xl">{LEVEL_DETAILS[level].emoji}</span>
                        <div>
                          <p className={`font-inter font-semibold text-sm ${skillLevel === level ? "text-blue-300" : "text-white/80"}`}>{level}</p>
                          <p className="font-inter text-xs text-white/40">{LEVEL_DETAILS[level].desc}</p>
                        </div>
                        {skillLevel === level && (
                          <Check className="ml-auto w-5 h-5 text-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-inter text-white/50 mb-1">Select all that apply</p>
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleAvailability(opt)}
                        className={`flex items-center gap-4 w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                          availability.includes(opt)
                            ? "bg-blue-500/15 border-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                            : "bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-white/20"
                        }`}
                      >
                        <span className="text-2xl">{AVAIL_EMOJI[opt]}</span>
                        <span className={`font-inter font-semibold text-sm ${availability.includes(opt) ? "text-blue-300" : "text-white/80"}`}>{opt}</span>
                        {availability.includes(opt) && <Check className="ml-auto w-5 h-5 text-blue-400" />}
                      </button>
                    ))}
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <label className="block text-sm font-inter font-medium text-white/70 mb-2">Write a short bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => { if (e.target.value.length <= 120) setBio(e.target.value); }}
                      placeholder="CS student who loves building web apps"
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-inter text-sm placeholder-gray-500 hover:bg-white/[0.07] resize-none"
                    />
                    <p className={`text-xs font-inter mt-1.5 text-right ${bio.length >= 110 ? "text-amber-400" : "text-white/30"}`}>{bio.length}/120</p>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <label className="block text-sm font-inter font-medium text-white/70 mb-2">
                      Your phone number <span className="text-white/30">(optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^\d+\-\s()]/g, ''))}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-inter text-sm placeholder-gray-500 hover:bg-white/[0.07]"
                      />
                    </div>
                    <p className="text-xs font-inter text-white/30 mt-2">We'll never share your number publicly</p>
                  </div>
                )}

                {step === 6 && (
                  <div>
                    <label className="block text-sm font-inter font-medium text-white/70 mb-2">
                      Portfolio or LinkedIn URL <span className="text-white/30">(optional)</span>
                    </label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/yourname"
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-inter text-sm placeholder-gray-500 hover:bg-white/[0.07]"
                    />
                    <p className="text-xs font-inter text-white/30 mt-2">You can always add this later in Settings</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Error */}
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm font-inter text-center mt-3 relative z-10">
              {error}
            </motion.p>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3 mt-6 relative z-10">
            {step > 0 && (
              <button type="button" onClick={goBack} className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all font-inter text-sm font-medium">
                <ArrowLeft size={16} /> Back
              </button>
            )}

            <div className="flex-1" />

            {isSkippable && (
              <button type="button" onClick={handleSubmit} disabled={submitting} className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-white/40 hover:text-white/70 transition-colors font-inter text-sm">
                <SkipForward size={16} /> Skip
              </button>
            )}

            {step < TOTAL_STEPS - 1 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-inter font-bold text-sm shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.5)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)]"
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-inter font-bold text-sm shadow-[0_8px_25px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.6)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70"
              >
                {submitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <>Finish Setup ✨</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
