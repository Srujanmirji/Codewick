import { ArrowRight, Star, Hexagon, Triangle, Circle, Square, Infinity } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden selection:bg-blue-100">
      {/* Background Gradient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#60B1FF] rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob"></div>
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-[#319AFF] rounded-full mix-blend-multiply filter blur-[150px] opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col min-h-screen">
        
        {/* Navbar */}
        <nav className="sticky top-[30px] z-50 mx-auto w-fit flex items-center justify-between px-6 py-3 rounded-[16px] bg-white/30 backdrop-blur-[50px] border border-black/10 shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.25)] transition-all duration-300 hover:bg-white/40">
          <div className="flex items-center gap-12">
            <span className="font-fustat font-bold text-2xl tracking-tight text-gray-900">Taskly</span>
            
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
