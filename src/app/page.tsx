"use client";

import { 
  ArrowRight, Star, Hexagon, Triangle, Circle, Square, Infinity, 
  RefreshCw, Zap, ShieldCheck, Clock, 
  PenTool, Users, Coins, 
  Activity, CheckCircle, TrendingUp, Layout 
} from "lucide-react";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main id="home" className="relative min-h-screen bg-[#F8FAFC] overflow-hidden selection:bg-blue-100 font-inter scroll-mt-20">
      {/* Background Gradient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-[10%] w-[50%] h-[800px] bg-[#60B1FF] rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob"></div>
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[600px] bg-[#319AFF] rounded-full mix-blend-multiply filter blur-[150px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[35%] -right-[10%] w-[45%] h-[700px] bg-[#60B1FF] rounded-full mix-blend-multiply filter blur-[150px] opacity-25 animate-blob"></div>
        <div className="absolute top-[60%] left-[5%] w-[40%] h-[800px] bg-[#319AFF] rounded-full mix-blend-multiply filter blur-[150px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[5%] right-[10%] w-[50%] h-[700px] bg-[#60B1FF] rounded-full mix-blend-multiply filter blur-[150px] opacity-30 animate-blob"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col min-h-screen">
        
        {/* Navbar */}
        <header className="pt-8">
          <nav className="mx-auto w-full max-w-[1000px] flex items-center justify-between px-8 py-3 rounded-full bg-white/70 backdrop-blur-[20px] border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-300">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl">
                  <img src="/logo.png" alt="" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-[#111827]">SkillSwap</span>
              </div>
              
              <div className="hidden md:flex items-center gap-8 text-[#4B5563] font-semibold text-sm">
                <Link href="#home" className="hover:text-black transition-colors">Home</Link>
                <Link href="#features" className="hover:text-black transition-colors">Features</Link>
                <Link href="#how-it-works" className="hover:text-black transition-colors">How It Works</Link>
                <Link href="#pricing" className="hover:text-black transition-colors">Pricing</Link>
              </div>
            </div>

            <Link href="/signup" className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-black/5 px-6 py-2.5 rounded-full text-sm font-bold text-[#111827] shadow-sm transition-all duration-300 active:scale-95 group">
              SignUp
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-between mt-12 gap-12">
          
          {/* Left Column: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-[55%] flex flex-col items-start z-20"
          >
            
            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-black text-[64px] sm:text-[72px] lg:text-[88px] leading-[1] tracking-[-3px] text-[#111827] mb-8"
            >
              Work smarter,<br />achieve faster
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-[18px] leading-relaxed text-[#6B7280] mb-12 max-w-xl font-medium"
            >
              Effortlessly manage your projects, collaborate with your team, and achieve your goals with our intuitive task management tool.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/signup" className="group flex items-center gap-4 bg-[#3B82F6] hover:bg-[#2563EB] px-10 py-5 rounded-2xl text-white font-bold text-lg shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95">
                Get Started Now
                <div className="bg-white rounded-full p-1.5 shadow-sm group-hover:translate-x-1 transition-transform duration-300">
                  <ArrowRight className="w-4 h-4 text-[#3B82F6]" />
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Vibrant Blue Orb */}
          <div className="w-full lg:w-[45%] relative h-[600px] flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-blue-500/20 blur-[150px] rounded-full scale-75 animate-pulse"></div>
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute w-[140%] h-[140%] object-contain mix-blend-multiply opacity-90 scale-125"
              style={{
                filter: "hue-rotate(-55deg) saturate(200%) brightness(1.1) contrast(1.1)",
              }}
            >
              <source src="https://future.co/images/homepage/glassy-orb/orb-purple.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent rounded-full filter blur-[50px]"></div>
          </div>
        </div>

        {/* 1. Feature Section (Grid) */}
        <div id="features" className="w-full mt-32 z-20 scroll-mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-bold text-4xl text-[#111827] mb-4">Why Choose SkillSwap</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">Experience a new way of exchanging skills with our intelligent and secure platform.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: RefreshCw,
                color: "text-blue-500",
                bg: "bg-blue-50",
                title: "Skill Exchange",
                desc: "Trade your expertise directly with others without spending a dime."
              },
              {
                icon: Zap,
                color: "text-cyan-500",
                bg: "bg-cyan-50",
                title: "Smart Matching",
                desc: "AI-powered algorithms connect you with the perfect skill partners."
              },
              {
                icon: ShieldCheck,
                color: "text-purple-500",
                bg: "bg-purple-50",
                title: "Trust System",
                desc: "Verified profiles and community reviews ensure safe interactions."
              },
              {
                icon: Clock,
                color: "text-blue-500",
                bg: "bg-blue-50",
                title: "Time Wallet",
                desc: "Earn time credits for teaching, spend them when you want to learn."
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="group bg-white/60 backdrop-blur-[20px] border border-white rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:-translate-y-2 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-full ${feature.bg} flex items-center justify-center mb-6`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-bold text-xl text-[#111827] mb-3">{feature.title}</h3>
                  <p className="text-[#6B7280] leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="w-full mt-32 z-20 scroll-mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-bold text-4xl text-[#111827] mb-4">How It Works</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">Three simple steps to start exchanging skills and growing your knowledge.</p>
          </motion.div>
          
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            {[
              {
                icon: PenTool,
                step: "1. Post your skill",
                desc: "Create a profile highlighting what you can teach and what you want to learn."
              },
              {
                icon: Users,
                step: "2. Get matched",
                desc: "Our AI finds the perfect partner whose needs align perfectly with yours."
              },
              {
                icon: Coins,
                step: "3. Earn credits",
                desc: "Complete sessions to earn time credits and build your reputation score."
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className="flex flex-col items-center text-center w-full md:w-1/3"
                >
                  <div className="w-20 h-20 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm mb-6">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-xl text-[#111827] mb-2">{item.step}</h3>
                  <p className="text-[#6B7280] px-4">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>


        {/* Pricing Section */}
        <div id="pricing" className="w-full mt-32 z-20 scroll-mt-24">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-[#111827] mb-4">Simple, Transparent Pricing</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Get started for free or upgrade to Pro for AI matching and unlimited skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/60 backdrop-blur-[20px] border border-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:scale-[1.02] transition-all duration-300"
            >
              <div>
                <span className="font-bold text-sm uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Basic</span>
                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-gray-900">$0</span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">/month</span>
                </div>
                <p className="mt-4 text-gray-600 text-sm">Perfect for getting started and exploring the community.</p>
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-600 gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span>5 active listings</span>
                    </li>
                    <li className="flex items-center text-gray-600 gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span>3 match requests / month</span>
                    </li>
                    <li className="flex items-center text-gray-600 gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span>Standard AI recommendations</span>
                    </li>
                    <li className="flex items-center text-gray-600 gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span>Community support</span>
                    </li>
                  </ul>
                </div>
              </div>
              <Link href="/signup" className="mt-8 w-full py-4 text-center font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all">
                Get Started Free
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative bg-white/85 backdrop-blur-[20px] border-2 border-blue-500 rounded-[32px] p-8 shadow-[0_20px_45px_rgba(59,130,246,0.15)] flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 z-10"
            >
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 text-white font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full shadow-md">
                Most Popular
              </div>
              <div>
                <span className="font-bold text-sm uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Pro</span>
                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-extrabold tracking-tight text-gray-900">$12</span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">/month</span>
                </div>
                <p className="mt-4 text-gray-600 text-sm">Unlock unlimited potential and high-priority matching.</p>
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-600 gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="font-semibold text-gray-900">Unlimited active listings</span>
                    </li>
                    <li className="flex items-center text-gray-600 gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="font-semibold text-gray-900">Unlimited match requests</span>
                    </li>
                    <li className="flex items-center text-gray-600 gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="font-semibold text-gray-900">Priority AI Smart Matching</span>
                    </li>
                    <li className="flex items-center text-gray-600 gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span>Verified member badge</span>
                    </li>
                    <li className="flex items-center text-gray-600 gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span>24/7 dedicated email support</span>
                    </li>
                  </ul>
                </div>
              </div>
              <Link href="/signup" className="mt-8 w-full py-4 text-center font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-2xl shadow-[0_12px_24px_rgba(59,130,246,0.3)] transition-all">
                Upgrade to Pro
              </Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/60 backdrop-blur-[20px] border border-white rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:scale-[1.02] transition-all duration-300"
            >
              <div>
                <span className="font-bold text-sm uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Custom</span>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-gray-900">Let's Talk</span>
                </div>
                <p className="mt-5 text-gray-600 text-sm">Tailored solutions for teams, universities, and schools.</p>
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-600 gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span>Multi-user organization accounts</span>
                    </li>
                    <li className="flex items-center text-gray-600 gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span>Advanced skills & growth analytics</span>
                    </li>
                    <li className="flex items-center text-gray-600 gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span>Custom API access & integration</span>
                    </li>
                    <li className="flex items-center text-gray-600 gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span>Dedicated Account Manager</span>
                    </li>
                  </ul>
                </div>
              </div>
              <Link href="mailto:support@skillswap.com" className="mt-8 w-full py-4 text-center font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-all">
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="w-full mt-32 mb-20 z-20"
        >
          <div className="bg-[#3B82F6] rounded-[40px] px-8 py-20 text-center shadow-2xl shadow-blue-500/20">
            <h2 className="font-black text-5xl md:text-6xl text-white mb-6 max-w-3xl mx-auto leading-tight">
              Ready to unlock your potential?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of learners and experts exchanging skills globally today.
            </p>
            <Link href="/signup" className="group flex items-center gap-4 bg-white px-10 py-5 rounded-full text-[#3B82F6] font-bold text-lg transition-all duration-300 hover:scale-105 mx-auto w-fit">
              Start Exchanging Now
              <ArrowRight className="w-5 h-5 text-[#3B82F6]" />
            </Link>
          </div>
        </motion.div>

        <Footer />
      </div>
    </main>
  );
}
