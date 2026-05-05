import Link from "next/link";
import { 
  ArrowRight, Star, Hexagon, Triangle, Circle, Square, Infinity, 
  RefreshCw, Zap, ShieldCheck, Clock, 
  PenTool, Users, Coins, 
  Activity, CheckCircle, TrendingUp, Layout 
} from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#F8FAFC] overflow-hidden selection:bg-blue-100 font-inter">
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
                <Link href="/" className="hover:text-black transition-colors">Home</Link>
                <Link href="#features" className="hover:text-black transition-colors">Features</Link>
                <Link href="/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
                <Link href="/dashboard/marketplace" className="hover:text-black transition-colors">Marketplace</Link>
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
          <div className="w-full lg:w-[55%] flex flex-col items-start z-20">
            
            {/* Headline */}
            <h1 className="font-black text-[64px] sm:text-[72px] lg:text-[88px] leading-[1] tracking-[-3px] text-[#111827] mb-8">
              Work smarter,<br />achieve faster
            </h1>

            {/* Subheadline */}
            <p className="text-[18px] leading-relaxed text-[#6B7280] mb-12 max-w-xl font-medium">
              Effortlessly manage your projects, collaborate with your team, and achieve your goals with our intuitive task management tool.
            </p>

            {/* CTA */}
            <Link href="/signup" className="group flex items-center gap-4 bg-[#3B82F6] hover:bg-[#2563EB] px-10 py-5 rounded-2xl text-white font-bold text-lg shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95">
              Get Started Now
              <div className="bg-white rounded-full p-1.5 shadow-sm group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRight className="w-4 h-4 text-[#3B82F6]" />
              </div>
            </Link>
          </div>

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
        <div className="w-full mt-32 z-20">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-[#111827] mb-4">Why Choose SkillSwap</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">Experience a new way of exchanging skills with our intelligent and secure platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-white/60 backdrop-blur-[20px] border border-white rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <RefreshCw className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold text-xl text-[#111827] mb-3">Skill Exchange</h3>
              <p className="text-[#6B7280] leading-relaxed">Trade your expertise directly with others without spending a dime.</p>
            </div>
            
            <div className="group bg-white/60 backdrop-blur-[20px] border border-white rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-cyan-500" />
              </div>
              <h3 className="font-bold text-xl text-[#111827] mb-3">Smart Matching</h3>
              <p className="text-[#6B7280] leading-relaxed">AI-powered algorithms connect you with the perfect skill partners.</p>
            </div>
            
            <div className="group bg-white/60 backdrop-blur-[20px] border border-white rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-bold text-xl text-[#111827] mb-3">Trust System</h3>
              <p className="text-[#6B7280] leading-relaxed">Verified profiles and community reviews ensure safe interactions.</p>
            </div>
            
            <div className="group bg-white/60 backdrop-blur-[20px] border border-white rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold text-xl text-[#111827] mb-3">Time Wallet</h3>
              <p className="text-[#6B7280] leading-relaxed">Earn time credits for teaching, spend them when you want to learn.</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="w-full mt-32 z-20">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-[#111827] mb-4">How It Works</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">Three simple steps to start exchanging skills and growing your knowledge.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="flex flex-col items-center text-center w-full md:w-1/3">
              <div className="w-20 h-20 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm mb-6">
                <PenTool className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl text-[#111827] mb-2">1. Post your skill</h3>
              <p className="text-[#6B7280] px-4">Create a profile highlighting what you can teach and what you want to learn.</p>
            </div>

            <div className="flex flex-col items-center text-center w-full md:w-1/3">
              <div className="w-20 h-20 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl text-[#111827] mb-2">2. Get matched</h3>
              <p className="text-[#6B7280] px-4">Our AI finds the perfect partner whose needs align perfectly with yours.</p>
            </div>

            <div className="flex flex-col items-center text-center w-full md:w-1/3">
              <div className="w-20 h-20 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm mb-6">
                <Coins className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl text-[#111827] mb-2">3. Earn credits</h3>
              <p className="text-[#6B7280] px-4">Complete sessions to earn time credits and build your reputation score.</p>
            </div>
          </div>
        </div>


        {/* Final CTA */}
        <div className="w-full mt-32 mb-20 z-20">
          <div className="bg-[#3B82F6] rounded-[40px] px-8 py-20 text-center shadow-2xl shadow-blue-500/20">
            <h2 className="font-black text-5xl md:text-6xl text-white mb-6 max-w-3xl mx-auto leading-tight">
              Ready to unlock your potential?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of learners and experts exchanging skills globally today.
            </p>
            <Link href="/login" className="group flex items-center gap-4 bg-white px-10 py-5 rounded-full text-[#3B82F6] font-bold text-lg transition-all duration-300 hover:scale-105 mx-auto w-fit">
              Start Exchanging Now
              <ArrowRight className="w-5 h-5 text-[#3B82F6]" />
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
