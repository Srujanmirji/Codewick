"use client";
import { useState, useRef, useEffect } from "react";
import { 
  ArrowRight, Star, Hexagon, Triangle, Circle, Square, Infinity, 
  RefreshCw, Zap, ShieldCheck, Clock, 
  PenTool, Users, Coins, 
  Activity, CheckCircle, TrendingUp, Layout, X,
  Sparkles, Globe, Award
} from "lucide-react";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValueEvent } from "framer-motion";

/* ── Animated Counter ── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = (ts: number) => {
      start = start || ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Text Reveal Animation ── */
function RevealText({ children, className = "", delay = 0 }: { children: string; className?: string; delay?: number }) {
  const words = children.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, delay: delay + i * 0.06, ease: "easeOut" }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Section Wrapper with Scroll Reveal ── */
function ScrollSection({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: mainRef, offset: ["start start", "end end"] });
  const heroParallaxY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const orbScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.3]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.25], [0.9, 0]);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => setScrolled(v > 0.02));

  return (
    <main ref={mainRef} id="home" className="relative min-h-screen bg-[#F8FAFC] overflow-hidden selection:bg-blue-100 font-inter scroll-mt-20">
      {/* ── Scroll Progress Bar ── */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 origin-left z-[999]"
      />

      {/* Background Gradient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-[10%] w-[50%] h-[800px] bg-[#60B1FF] rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob"></div>
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[600px] bg-[#319AFF] rounded-full mix-blend-multiply filter blur-[150px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[35%] -right-[10%] w-[45%] h-[700px] bg-[#60B1FF] rounded-full mix-blend-multiply filter blur-[150px] opacity-25 animate-blob"></div>
        <div className="absolute top-[60%] left-[5%] w-[40%] h-[800px] bg-[#319AFF] rounded-full mix-blend-multiply filter blur-[150px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[5%] right-[10%] w-[50%] h-[700px] bg-[#60B1FF] rounded-full mix-blend-multiply filter blur-[150px] opacity-30 animate-blob"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col min-h-screen">
        
        {/* Navbar — gains shadow on scroll */}
        <motion.header className="pt-8 sticky top-0 z-50">
          <nav className={`mx-auto w-full max-w-[1000px] flex items-center justify-between px-6 md:px-8 py-3 rounded-full bg-white/70 backdrop-blur-[20px] border border-black/5 transition-all duration-500 ${scrolled ? "shadow-[0_8px_40px_rgba(0,0,0,0.08)]" : "shadow-[0_8px_32px_rgba(0,0,0,0.04)]"}`}>
            <div className="flex items-center gap-10">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
                  <img src="/logo.png" alt="" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-xl md:text-2xl tracking-tight text-[#111827] group-hover:text-blue-600 transition-colors">SkillSwap</span>
              </Link>
              
              <div className="hidden md:flex items-center gap-8 text-[#4B5563] font-semibold text-sm">
                <Link href="#home" className="hover:text-black transition-colors">Home</Link>
                <Link href="#features" className="hover:text-black transition-colors">Features</Link>
                <Link href="#how-it-works" className="hover:text-black transition-colors">How It Works</Link>
                <Link href="#pricing" className="hover:text-black transition-colors">Pricing</Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:flex items-center gap-2 bg-white hover:bg-gray-50 border border-black/5 px-6 py-2.5 rounded-full text-sm font-bold text-[#111827] shadow-sm transition-all duration-300 active:scale-95 group">
                Login
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-black/5 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Layout className="w-6 h-6" />}
              </button>
            </div>
          </nav>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden absolute left-6 right-6 mt-4 p-6 rounded-3xl bg-white/90 backdrop-blur-[20px] border border-black/5 shadow-2xl z-50 flex flex-col gap-4"
              >
                <Link onClick={() => setIsMobileMenuOpen(false)} href="#home" className="text-lg font-bold text-[#111827] px-4 py-2 hover:bg-blue-50 rounded-xl transition-colors">Home</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="#features" className="text-lg font-bold text-[#111827] px-4 py-2 hover:bg-blue-50 rounded-xl transition-colors">Features</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="#how-it-works" className="text-lg font-bold text-[#111827] px-4 py-2 hover:bg-blue-50 rounded-xl transition-colors">How It Works</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="#pricing" className="text-lg font-bold text-[#111827] px-4 py-2 hover:bg-blue-50 rounded-xl transition-colors">Pricing</Link>
                <hr className="border-black/5 my-2" />
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="flex items-center justify-center gap-2 bg-[#3B82F6] text-white px-6 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-blue-500/20">
                  Login Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* ── Hero Section with Parallax ── */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-between mt-12 lg:mt-20 gap-12">
          
          {/* Left Column: Parallax Content */}
          <motion.div 
            style={{ y: heroParallaxY, opacity: heroOpacity }}
            className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left z-20"
          >
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-600">The #1 Skill Exchange Platform</span>
            </motion.div>

            {/* Headline — word-by-word reveal */}
            <h1 className="font-black text-[42px] sm:text-[64px] lg:text-[88px] leading-[1.1] lg:leading-[1] tracking-[-2px] lg:tracking-[-3px] text-[#111827] mb-8">
              <RevealText>Work smarter,</RevealText>
              <br className="hidden sm:block" />
              <RevealText delay={0.3}>achieve faster</RevealText>
            </h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-base sm:text-[18px] leading-relaxed text-[#6B7280] mb-12 max-w-xl font-medium"
            >
              Effortlessly manage your projects, collaborate with your team, and achieve your goals with our intuitive task management tool.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <Link href="/login" className="group flex items-center gap-4 bg-[#3B82F6] hover:bg-[#2563EB] px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-white font-bold text-lg shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95">
                Get Started Now
                <div className="bg-white rounded-full p-1.5 shadow-sm group-hover:translate-x-1 transition-transform duration-300">
                  <ArrowRight className="w-4 h-4 text-[#3B82F6]" />
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Parallax Orb */}
          <motion.div 
            style={{ scale: orbScale, opacity: orbOpacity }}
            className="w-full lg:w-[45%] relative h-[300px] sm:h-[450px] lg:h-[600px] flex items-center justify-center pointer-events-none mt-8 lg:mt-0"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] sm:blur-[150px] rounded-full scale-75 animate-pulse"></div>
            <video 
              autoPlay loop muted playsInline 
              className="absolute w-[160%] lg:w-[140%] h-[160%] lg:h-[140%] object-contain mix-blend-multiply opacity-90 scale-110 lg:scale-125"
              style={{ filter: "hue-rotate(-55deg) saturate(200%) brightness(1.1) contrast(1.1)" }}
            >
              <source src="https://future.co/images/homepage/glassy-orb/orb-purple.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent rounded-full filter blur-[50px]"></div>
          </motion.div>
        </div>

        {/* ── Social Proof Stats Bar ── */}
        <ScrollSection className="w-full mt-16 sm:mt-24 z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-4xl mx-auto text-center">
            {[
              { value: 12000, suffix: "+", label: "Active Users" },
              { value: 95, suffix: "%", label: "Match Rate" },
              { value: 48000, suffix: "+", label: "Skills Swapped" },
              { value: 4.9, suffix: "★", label: "User Rating" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex flex-col items-center"
              >
                <span className="text-3xl sm:text-4xl font-black text-[#111827] mb-1">
                  {stat.value < 100 ? <AnimatedCounter target={stat.value} suffix={stat.suffix} /> : <AnimatedCounter target={stat.value} suffix={stat.suffix} />}
                </span>
                <span className="text-sm text-[#6B7280] font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </ScrollSection>


        {/* ── Features Section ── */}
        <ScrollSection id="features" className="w-full mt-16 sm:mt-32 z-20 scroll-mt-24">
          <div className="text-center mb-10 sm:mb-16">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-bold uppercase tracking-[3px] text-blue-500 bg-blue-50 px-4 py-1.5 rounded-full mb-4"
            >
              Features
            </motion.span>
            <h2 className="font-bold text-3xl sm:text-4xl text-[#111827] mb-4">
              <RevealText>Why Choose SkillSwap</RevealText>
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto text-sm sm:text-base px-4">Experience a new way of exchanging skills with our intelligent and secure platform.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: RefreshCw, color: "text-blue-500", bg: "bg-blue-50", title: "Skill Exchange", desc: "Trade your expertise directly with others without spending a dime." },
              { icon: Zap, color: "text-cyan-500", bg: "bg-cyan-50", title: "Smart Matching", desc: "AI-powered algorithms connect you with the perfect skill partners." },
              { icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-50", title: "Trust System", desc: "Verified profiles and community reviews ensure safe interactions." },
              { icon: Clock, color: "text-blue-500", bg: "bg-blue-50", title: "Time Wallet", desc: "Earn time credits for teaching, spend them when you want to learn." }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 40, rotateX: 15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group bg-white/60 backdrop-blur-[20px] border border-white rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300"
                >
                  <motion.div 
                    className={`w-12 h-12 rounded-full ${feature.bg} flex items-center justify-center mb-6`}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </motion.div>
                  <h3 className="font-bold text-xl text-[#111827] mb-3">{feature.title}</h3>
                  <p className="text-[#6B7280] leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </ScrollSection>

        {/* ── How It Works — Timeline Style ── */}
        <ScrollSection id="how-it-works" className="w-full mt-16 sm:mt-32 z-20 scroll-mt-24">
          <div className="text-center mb-10 sm:mb-16">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-bold uppercase tracking-[3px] text-cyan-500 bg-cyan-50 px-4 py-1.5 rounded-full mb-4"
            >
              How It Works
            </motion.span>
            <h2 className="font-bold text-3xl sm:text-4xl text-[#111827] mb-4">
              <RevealText>Three steps to start learning</RevealText>
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto text-sm sm:text-base px-4">Start exchanging skills and growing your knowledge in minutes.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-4 relative max-w-4xl mx-auto">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-blue-200 via-cyan-300 to-indigo-200 z-0" />

            {[
              { icon: PenTool, step: "01", title: "Post your skill", desc: "Create a profile highlighting what you can teach and what you want to learn.", color: "from-blue-500 to-cyan-500" },
              { icon: Users, step: "02", title: "Get matched", desc: "Our AI finds the perfect partner whose needs align perfectly with yours.", color: "from-cyan-500 to-indigo-500" },
              { icon: Coins, step: "03", title: "Earn credits", desc: "Complete sessions to earn time credits and build your reputation score.", color: "from-indigo-500 to-purple-500" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: idx * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex flex-col items-center text-center w-full md:w-1/3 relative z-10"
                >
                  {/* Step number badge */}
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mb-6 relative`}>
                    <Icon className="w-8 h-8 text-white" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-black text-[#111827] shadow-md border border-gray-100">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-[#111827] mb-2">{item.title}</h3>
                  <p className="text-[#6B7280] px-4 text-sm">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </ScrollSection>


        {/* ── Pricing Section ── */}
        <ScrollSection id="pricing" className="w-full mt-16 sm:mt-32 z-20 scroll-mt-24">
          <div className="text-center mb-10 sm:mb-16">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-bold uppercase tracking-[3px] text-indigo-500 bg-indigo-50 px-4 py-1.5 rounded-full mb-4"
            >
              Pricing
            </motion.span>
            <h2 className="font-bold text-3xl sm:text-4xl text-[#111827] mb-4">
              <RevealText>Simple, Transparent Pricing</RevealText>
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto text-sm sm:text-base px-4">
              Get started for free or upgrade to Pro for AI matching and unlimited skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1200px] mx-auto">
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 50, rotateY: -5 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="bg-white/60 backdrop-blur-[20px] border border-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <span className="font-bold text-sm uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Basic</span>
                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-gray-900">₹0</span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">/month</span>
                </div>
                <p className="mt-4 text-gray-600 text-sm">Perfect for getting started and exploring the community.</p>
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <ul className="space-y-4">
                    {["5 active listings", "3 match requests / month", "Standard AI recommendations", "Community support"].map((item, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.08 }} className="flex items-center text-gray-600 gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link href="/login" className="mt-8 w-full py-4 text-center font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all">
                Get Started Free
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative bg-white/85 backdrop-blur-[20px] border-2 border-blue-500 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_20px_45px_rgba(59,130,246,0.15)] flex flex-col justify-between transition-all duration-300 z-10"
            >
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 text-white font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
                Most Popular
              </div>
              <div>
                <span className="font-bold text-sm uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Pro</span>
                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-gray-900">₹999</span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">/month</span>
                </div>
                <p className="mt-4 text-gray-600 text-sm">Unlock unlimited potential and high-priority matching.</p>
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <ul className="space-y-4">
                    {[
                      { text: "Unlimited active listings", bold: true },
                      { text: "Unlimited match requests", bold: true },
                      { text: "Priority AI Smart Matching", bold: true },
                      { text: "Verified member badge", bold: false },
                      { text: "24/7 dedicated email support", bold: false },
                    ].map((item, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.08 }} className="flex items-center text-gray-600 gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        <span className={item.bold ? "font-semibold text-gray-900" : ""}>{item.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link href="/login" className="mt-8 w-full py-4 text-center font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-2xl shadow-[0_12px_24px_rgba(59,130,246,0.3)] transition-all">
                Upgrade to Pro
              </Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 50, rotateY: 5 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="bg-white/60 backdrop-blur-[20px] border border-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <span className="font-bold text-sm uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Custom</span>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-gray-900">Let&apos;s Talk</span>
                </div>
                <p className="mt-5 text-gray-600 text-sm">Tailored solutions for teams, universities, and schools.</p>
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <ul className="space-y-4">
                    {["Multi-user organization accounts", "Advanced skills & growth analytics", "Custom API access & integration", "Dedicated Account Manager"].map((item, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.08 }} className="flex items-center text-gray-600 gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link href="mailto:support@skillswap.com" className="mt-8 w-full py-4 text-center font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-all">
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </ScrollSection>

        {/* ── Final CTA — Cinematic Entrance ── */}
        <ScrollSection className="w-full mt-16 sm:mt-32 mb-12 sm:mb-20 z-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="bg-[#3B82F6] rounded-[24px] sm:rounded-[40px] px-6 sm:px-8 py-12 sm:py-20 text-center shadow-2xl shadow-blue-500/20 relative overflow-hidden"
          >
            {/* Animated glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-transparent to-indigo-500/20 animate-pulse pointer-events-none" />
            
            <h2 className="font-black text-3xl sm:text-5xl md:text-6xl text-white mb-4 sm:mb-6 max-w-3xl mx-auto leading-tight relative z-10">
              <RevealText>Ready to unlock your potential?</RevealText>
            </h2>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base sm:text-xl text-white/80 mb-8 sm:mb-10 max-w-2xl mx-auto px-4 relative z-10"
            >
              Join thousands of learners and experts exchanging skills globally today.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="relative z-10"
            >
              <Link href="/login" className="group inline-flex items-center gap-4 bg-white px-8 sm:px-10 py-4 sm:py-5 rounded-full text-[#3B82F6] font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                Start Exchanging Now
                <ArrowRight className="w-5 h-5 text-[#3B82F6] group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </ScrollSection>

        <Footer />
      </div>
    </main>
  );
}
