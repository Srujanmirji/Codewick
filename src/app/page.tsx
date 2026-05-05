import { 
  ArrowRight, Star, Hexagon, Triangle, Circle, Square, Infinity, 
  RefreshCw, Zap, ShieldCheck, Clock, 
  PenTool, Users, Coins, 
  Activity, CheckCircle, TrendingUp, Layout 
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden selection:bg-blue-100">
      {/* Background Gradient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-[10%] w-[50%] h-[800px] bg-[#60B1FF] rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob"></div>
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[600px] bg-[#319AFF] rounded-full mix-blend-multiply filter blur-[150px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[35%] -right-[10%] w-[45%] h-[700px] bg-[#60B1FF] rounded-full mix-blend-multiply filter blur-[150px] opacity-25 animate-blob"></div>
        <div className="absolute top-[60%] left-[5%] w-[40%] h-[800px] bg-[#319AFF] rounded-full mix-blend-multiply filter blur-[150px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[5%] right-[10%] w-[50%] h-[700px] bg-[#60B1FF] rounded-full mix-blend-multiply filter blur-[150px] opacity-30 animate-blob"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col min-h-screen">
        
        {/* Navbar */}
        <nav className="sticky top-[30px] z-50 mx-auto w-fit flex items-center justify-between px-6 py-3 rounded-[16px] bg-white/30 backdrop-blur-[50px] border border-black/10 shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.25)] transition-all duration-300 hover:bg-white/40">
          <div className="flex items-center gap-12">
            <span className="font-fustat font-bold text-2xl tracking-tight text-gray-900">SkillSwap</span>
            
            <div className="hidden md:flex items-center gap-8 text-gray-700 font-inter font-medium text-sm">
              <a href="#" className="hover:text-black transition-colors">Home</a>
              <a href="#" className="hover:text-black transition-colors">Features</a>
              <a href="#" className="hover:text-black transition-colors">Company</a>
              <a href="#" className="hover:text-black transition-colors">Pricing</a>
            </div>
          </div>

          <button className="ml-12 flex items-center gap-2 bg-white/50 hover:bg-white/70 backdrop-blur-md px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-900 border border-white/50 shadow-sm transition-all duration-300">
            SignUp
            <div className="bg-white rounded-full p-1 shadow-sm">
              <ArrowRight className="w-3 h-3 text-black" />
            </div>
          </button>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-between mt-20 lg:mt-10 gap-12 lg:gap-0">
          
          {/* Left Column: Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start z-20">
            
            {/* Social Proof */}
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm border border-black/5 px-4 py-2 rounded-full mb-8 shadow-sm">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FF801E] text-[#FF801E]" />
                ))}
              </div>
              <span className="text-sm font-inter font-medium text-gray-700">
                Rated <strong className="text-gray-900">4.9/5</strong> by 2700+ customers
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-fustat font-bold text-[56px] sm:text-[64px] lg:text-[75px] leading-[1.05] tracking-[-2px] text-gray-900 mb-6 max-w-2xl">
              Work smarter, achieve faster
            </h1>

            {/* Subheadline */}
            <p className="font-inter text-[18px] leading-relaxed tracking-[-1px] text-gray-600 mb-10 max-w-xl">
              Effortlessly manage your projects, collaborate with your team, and achieve your goals with our intuitive task management tool.
            </p>

            {/* CTA */}
            <button className="group flex items-center gap-4 bg-[rgba(0,132,255,0.8)] hover:bg-[rgba(0,132,255,0.9)] backdrop-blur-[2px] px-8 py-4 rounded-[16px] text-white font-inter font-semibold text-lg shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.35),0_10px_30px_-10px_rgba(0,132,255,0.5)] transition-all duration-300 hover:scale-[1.02]">
              Get Started Now
              <div className="bg-white rounded-full p-1.5 shadow-sm group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRight className="w-4 h-4 text-[#0084FF]" />
              </div>
            </button>
          </div>

          {/* Right Column: Glassy Orb */}
          <div className="w-full lg:w-1/2 relative h-[500px] lg:h-[700px] flex items-center justify-center pointer-events-none">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute w-full h-full object-cover scale-125 translate-x-[5%] mix-blend-screen filter"
              style={{
                filter: "hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1)",
                WebkitFilter: "hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1)"
              }}
            >
              <source src="https://future.co/images/homepage/glassy-orb/orb-purple.webm" type="video/webm" />
            </video>
          </div>

        </div>

        {/* --- REDESIGN START --- */}
        
        {/* 1. Feature Section (Grid) */}
        <div className="w-full mt-32 z-20">
          <div className="text-center mb-16">
            <h2 className="font-fustat font-bold text-4xl text-gray-900 mb-4">Why Choose SkillSwap</h2>
            <p className="font-inter text-gray-600 max-w-2xl mx-auto">Experience a new way of exchanging skills with our intelligent and secure platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group bg-white/40 backdrop-blur-[20px] border border-white/50 rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(0,132,255,0.1)] hover:border-blue-200/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-blue-50/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,132,255,0.3)] transition-all duration-300">
                <RefreshCw className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-inter font-bold text-xl text-gray-900 mb-3">Skill Exchange</h3>
              <p className="font-inter text-gray-600 leading-relaxed opacity-80">Trade your expertise directly with others without spending a dime.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="group bg-white/40 backdrop-blur-[20px] border border-white/50 rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(0,132,255,0.1)] hover:border-blue-200/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-cyan-50/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300">
                <Zap className="w-6 h-6 text-cyan-500" />
              </div>
              <h3 className="font-inter font-bold text-xl text-gray-900 mb-3">Smart Matching</h3>
              <p className="font-inter text-gray-600 leading-relaxed opacity-80">AI-powered algorithms connect you with the perfect skill partners.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="group bg-white/40 backdrop-blur-[20px] border border-white/50 rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(0,132,255,0.1)] hover:border-blue-200/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-purple-50/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300">
                <ShieldCheck className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-inter font-bold text-xl text-gray-900 mb-3">Trust System</h3>
              <p className="font-inter text-gray-600 leading-relaxed opacity-80">Verified profiles and community reviews ensure safe interactions.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="group bg-white/40 backdrop-blur-[20px] border border-white/50 rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(0,132,255,0.1)] hover:border-blue-200/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-blue-50/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-inter font-bold text-xl text-gray-900 mb-3">Time Wallet</h3>
              <p className="font-inter text-gray-600 leading-relaxed opacity-80">Earn time credits for teaching, spend them when you want to learn.</p>
            </div>
          </div>
        </div>

        {/* 2. How It Works */}
        <div className="w-full mt-32 z-20">
          <div className="text-center mb-16">
            <h2 className="font-fustat font-bold text-4xl text-gray-900 mb-4">How It Works</h2>
            <p className="font-inter text-gray-600 max-w-2xl mx-auto">Three simple steps to start exchanging skills and growing your knowledge.</p>
          </div>
          
          <div className="relative flex flex-col md:flex-row items-start justify-between gap-8">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-50 z-0"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3 group">
              <div className="w-20 h-20 rounded-full bg-white/60 backdrop-blur-[20px] border border-white flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-6 group-hover:shadow-[0_0_20px_rgba(0,132,255,0.2)] transition-all duration-300">
                <PenTool className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-inter font-bold text-xl text-gray-900 mb-2">1. Post your skill</h3>
              <p className="font-inter text-gray-600 opacity-80 px-4">Create a profile highlighting what you can teach and what you want to learn.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3 group">
              <div className="w-20 h-20 rounded-full bg-white/60 backdrop-blur-[20px] border border-white flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-6 group-hover:shadow-[0_0_20px_rgba(0,132,255,0.2)] transition-all duration-300">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-inter font-bold text-xl text-gray-900 mb-2">2. Get matched</h3>
              <p className="font-inter text-gray-600 opacity-80 px-4">Our AI finds the perfect partner whose needs align perfectly with yours.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3 group">
              <div className="w-20 h-20 rounded-full bg-white/60 backdrop-blur-[20px] border border-white flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-6 group-hover:shadow-[0_0_20px_rgba(0,132,255,0.2)] transition-all duration-300">
                <Coins className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-inter font-bold text-xl text-gray-900 mb-2">3. Earn credits</h3>
              <p className="font-inter text-gray-600 opacity-80 px-4">Complete sessions to earn time credits and build your reputation score.</p>
            </div>
          </div>
        </div>

        {/* 3. Trust / Social Proof Section */}
        <div className="w-full mt-32 z-20">
          <div className="bg-white/40 backdrop-blur-[25px] border border-white/60 rounded-[32px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200/50">
              
              <div className="flex flex-col items-center justify-center text-center pt-8 md:pt-0 md:pr-8">
                <Activity className="w-8 h-8 text-blue-500 mb-4 opacity-80" />
                <span className="font-fustat font-bold text-5xl text-gray-900 mb-2 drop-shadow-[0_0_15px_rgba(0,132,255,0.15)]">150k+</span>
                <span className="font-inter text-gray-600 font-medium">Active Users</span>
              </div>
              
              <div className="flex flex-col items-center justify-center text-center pt-8 md:pt-0 md:px-8">
                <CheckCircle className="w-8 h-8 text-cyan-500 mb-4 opacity-80" />
                <span className="font-fustat font-bold text-5xl text-gray-900 mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]">2M+</span>
                <span className="font-inter text-gray-600 font-medium">Sessions Completed</span>
              </div>
              
              <div className="flex flex-col items-center justify-center text-center pt-8 md:pt-0 md:pl-8">
                <TrendingUp className="w-8 h-8 text-purple-500 mb-4 opacity-80" />
                <span className="font-fustat font-bold text-5xl text-gray-900 mb-2 drop-shadow-[0_0_15px_rgba(168,85,247,0.15)]">4.9/5</span>
                <span className="font-inter text-gray-600 font-medium">Average Rating</span>
              </div>
              
            </div>
          </div>
        </div>

        {/* 4. Product Preview Section */}
        <div className="w-full mt-32 z-20 flex flex-col items-center">
          <div className="text-center mb-12">
            <h2 className="font-fustat font-bold text-4xl text-gray-900 mb-4">A Workspace Designed for Growth</h2>
            <p className="font-inter text-gray-600 max-w-2xl mx-auto">Everything you need to manage your skill exchanges in one beautiful dashboard.</p>
          </div>
          
          <div className="relative w-full max-w-5xl group perspective-[2000px]">
            {/* Glow behind the dashboard */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-[100px] rounded-full group-hover:opacity-100 opacity-60 transition-opacity duration-500"></div>
            
            <div className="relative bg-white/50 backdrop-blur-[30px] border-[1px] border-white/80 rounded-[32px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transform transition-transform duration-700 ease-out group-hover:scale-[1.02] group-hover:rotate-x-2">
              <div className="w-full h-12 bg-white/40 border-b border-white/50 rounded-t-[20px] flex items-center px-6 gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="mx-auto bg-white/50 px-4 py-1 rounded-md text-xs font-medium text-gray-500 flex items-center gap-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]">
                  <Layout className="w-3 h-3" /> app.skillswap.co
                </div>
              </div>
              <div className="w-full aspect-[16/9] bg-gradient-to-br from-gray-50/50 to-blue-50/30 rounded-b-[20px] border border-white/20 p-8 flex flex-col gap-6 overflow-hidden">
                 {/* Mockup content */}
                 <div className="flex gap-6 h-full">
                   {/* Sidebar */}
                   <div className="w-48 bg-white/60 rounded-xl p-4 flex flex-col gap-3 shadow-sm border border-white/40">
                     <div className="h-8 bg-blue-100/50 rounded-lg w-full mb-4"></div>
                     <div className="h-6 bg-white/80 rounded-md w-3/4"></div>
                     <div className="h-6 bg-white/80 rounded-md w-5/6"></div>
                     <div className="h-6 bg-white/80 rounded-md w-full"></div>
                     <div className="h-6 bg-white/80 rounded-md w-2/3"></div>
                   </div>
                   {/* Main Content */}
                   <div className="flex-1 flex flex-col gap-6">
                     {/* Top header */}
                     <div className="h-16 bg-white/60 shadow-sm border border-white/40 rounded-xl w-full flex items-center px-6 justify-between">
                       <div className="h-6 bg-white/80 rounded-md w-1/4"></div>
                       <div className="w-10 h-10 rounded-full bg-blue-100/50"></div>
                     </div>
                     {/* Content grid */}
                     <div className="flex-1 grid grid-cols-3 gap-6">
                       <div className="col-span-2 flex flex-col gap-6">
                         <div className="flex-1 bg-white/60 shadow-sm border border-white/40 rounded-xl p-6">
                           <div className="h-6 bg-blue-100/50 rounded-md w-1/3 mb-4"></div>
                           <div className="space-y-3">
                             <div className="h-4 bg-white/80 rounded-md w-full"></div>
                             <div className="h-4 bg-white/80 rounded-md w-full"></div>
                             <div className="h-4 bg-white/80 rounded-md w-4/5"></div>
                           </div>
                         </div>
                       </div>
                       <div className="col-span-1 flex flex-col gap-6">
                         <div className="h-32 bg-white/60 shadow-sm border border-white/40 rounded-xl p-4"></div>
                         <div className="flex-1 bg-white/60 shadow-sm border border-white/40 rounded-xl p-4"></div>
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Final CTA Section */}
        <div className="w-full mt-32 mb-20 z-20">
          <div className="relative overflow-hidden bg-white/40 backdrop-blur-[25px] border border-white/60 rounded-[40px] px-8 py-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            {/* Inner glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-400/20 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="font-fustat font-bold text-5xl md:text-6xl text-gray-900 mb-6 max-w-3xl leading-tight">
                Ready to unlock your potential?
              </h2>
              <p className="font-inter text-xl text-gray-600 mb-10 opacity-80 max-w-2xl">
                Join thousands of learners and experts exchanging skills globally today.
              </p>
              
              <button className="group relative flex items-center gap-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 px-10 py-5 rounded-full text-white font-inter font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]">
                Start Exchanging Now
                <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm group-hover:translate-x-1 transition-transform duration-300">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* --- REDESIGN END --- */}

        {/* Footer Logos */}
        <div className="mt-auto py-12 flex flex-col items-center opacity-70">
          <p className="text-sm font-inter text-gray-500 mb-6 uppercase tracking-wider font-semibold">
            Trusted by Top-tier product companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-[50px] md:gap-[100px] grayscale opacity-60">
            <Hexagon className="w-10 h-10 text-gray-600" />
            <Triangle className="w-10 h-10 text-gray-600" />
            <Circle className="w-10 h-10 text-gray-600" />
            <Square className="w-10 h-10 text-gray-600" />
            <Infinity className="w-12 h-12 text-gray-600" />
          </div>
        </div>

      </div>
    </main>
  );
}
