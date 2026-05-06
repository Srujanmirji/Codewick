"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }

      // Automatically sign in the user after successful registration
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        setError(signInRes.error);
      } else {
        router.push("/dashboard"); // Or wherever you want to redirect after login
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black selection:bg-blue-500/30 flex items-center justify-center">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay to ensure text readability against the video */}
      <div className="absolute inset-0 bg-black/50 z-0 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between min-h-screen py-8 sm:py-12 gap-8 lg:gap-0">
        
        {/* LEFT SIDE: Branding Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-20"
        >
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20 group-hover:border-blue-400/50 transition-all">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-fustat font-bold text-3xl md:text-4xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
              SkillSwap
            </span>
          </Link>
          
          <h1 className="font-fustat font-bold text-[36px] sm:text-[48px] lg:text-[56px] leading-[1.1] tracking-[-1px] text-white mb-4 sm:mb-6 max-w-lg drop-shadow-md">
            Exchange skills.<br className="hidden lg:block"/> Earn time.
          </h1>
          
          <p className="font-inter text-base sm:text-[18px] leading-relaxed text-gray-300 mb-6 sm:mb-10 max-w-md drop-shadow">
            Join a trusted skill-sharing network. Connect with experts, learn new abilities, and share what you know.
          </p>

        </motion.div>

        {/* RIGHT SIDE: Signup Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full lg:w-[480px] z-20"
        >
          <div className="relative bg-black/40 backdrop-blur-[30px] border border-white/10 rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 md:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.6)] overflow-hidden group/card">
            {/* Subtle floating light reflection for dark card */}
            <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 group-hover/card:translate-x-[400%] transition-transform duration-1500 ease-out pointer-events-none z-10"></div>

            <div className="text-center mb-8 relative z-20">
              <h2 className="font-fustat font-bold text-3xl text-white mb-2 tracking-tight">Create an account</h2>
              <p className="font-inter text-gray-400">Sign up to get started</p>
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </div>

            <form onSubmit={handleSignup} className="flex flex-col gap-5 relative z-20">
              {/* Full Name Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                </div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name" 
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-inter placeholder-gray-500 hover:bg-white/10"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-inter placeholder-gray-500 hover:bg-white/10"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password" 
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-11 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-inter placeholder-gray-500 hover:bg-white/10"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white focus:outline-none transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex items-center mt-1 mb-2">
                <label className="flex items-center gap-2 cursor-pointer group/check">
                  <div className="relative flex items-center justify-center w-4 h-4 rounded border border-white/20 bg-white/5 group-hover/check:border-blue-400 transition-colors">
                    <input type="checkbox" className="peer opacity-0 absolute inset-0 cursor-pointer" required />
                    <div className="hidden peer-checked:block w-2 h-2 bg-blue-500 rounded-sm"></div>
                  </div>
                  <span className="font-inter text-sm text-gray-400 select-none">
                    I agree to the <Link href="#" className="text-blue-400 hover:underline">Terms of Service</Link>
                  </span>
                </label>
              </div>

              {/* Primary Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="group relative flex justify-center items-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-inter font-bold text-lg py-4 rounded-xl shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.5)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing up..." : "Sign Up"}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8 relative z-20">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="px-4 font-inter text-sm text-gray-500">or sign up with</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Social Buttons */}
            <div className="flex flex-col gap-3 relative z-20">
              <button 
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 shadow-sm text-white font-inter font-medium py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="mt-8 text-center font-inter text-sm text-gray-400 relative z-20">
              Already have an account? <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors">Log in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
