"use client";

import { Globe, Mail, MessageCircle, Share2, Scale, ShieldCheck, Cookie } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Modal } from "./ui/Modal";

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState<{ title: string; content: React.ReactNode } | null>(null);

  const policies = {
    privacy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-4 text-white/70 font-inter text-sm leading-relaxed">
          <p>Last updated: May 2026</p>
          <p>At SkillSwap, we take your privacy seriously. This policy describes how we collect, use, and handle your information when you use our platform.</p>
          <h4 className="text-white font-bold mt-4">1. Data Collection</h4>
          <p>We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with other users.</p>
          <h4 className="text-white font-bold mt-4">2. Use of Information</h4>
          <p>We use the information we collect to provide, maintain, and improve our services, including matching you with potential skill partners.</p>
          <h4 className="text-white font-bold mt-4">3. Data Sharing</h4>
          <p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>
        </div>
      )
    },
    terms: {
      title: "Terms of Service",
      content: (
        <div className="space-y-4 text-white/70 font-inter text-sm leading-relaxed">
          <p>Last updated: May 2026</p>
          <p>By using SkillSwap, you agree to these terms. Please read them carefully.</p>
          <h4 className="text-white font-bold mt-4">1. Account Responsibility</h4>
          <p>You are responsible for maintaining the confidentiality of your account and password.</p>
          <h4 className="text-white font-bold mt-4">2. Community Guidelines</h4>
          <p>Users must treat others with respect. Harassment, hate speech, and fraudulent behavior are strictly prohibited.</p>
          <h4 className="text-white font-bold mt-4">3. Skill Exchange</h4>
          <p>SkillSwap is a platform for peer-to-peer learning. We do not guarantee the quality of instruction provided by users.</p>
        </div>
      )
    },
    cookie: {
      title: "Cookie Policy",
      content: (
        <div className="space-y-4 text-white/70 font-inter text-sm leading-relaxed">
          <p>Last updated: May 2026</p>
          <p>We use cookies to enhance your experience on SkillSwap.</p>
          <h4 className="text-white font-bold mt-4">What are cookies?</h4>
          <p>Cookies are small text files that are stored on your device when you visit a website.</p>
          <h4 className="text-white font-bold mt-4">How we use them</h4>
          <p>We use cookies to remember your preferences, keep you logged in, and analyze how our platform is used.</p>
          <h4 className="text-white font-bold mt-4">Managing cookies</h4>
          <p>You can control and/or delete cookies as you wish through your browser settings.</p>
        </div>
      )
    }
  };

  return (
    <footer className="w-full bg-white/40 backdrop-blur-[25px] border-t border-white/60 mt-12 sm:mt-20 pt-10 sm:pt-16 pb-8 px-6 lg:px-12 z-20 relative shadow-[0_-8px_30px_rgb(0,0,0,0.02)]">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
        {/* Brand and Description */}
        <div className="flex flex-col items-start max-w-sm">
          <Link href="/" className="font-fustat font-bold text-2xl tracking-tight text-gray-900 mb-4 hover:text-blue-500 transition-colors">SkillSwap</Link>
          <p className="font-inter text-gray-600 mb-6 leading-relaxed">
            Experience a new way of exchanging skills. Connect, learn, and grow together with our intelligent and secure peer-to-peer platform.
          </p>
          <div className="flex items-center gap-4">
            <a href="#home" className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white transition-all shadow-sm">
              <Globe className="w-5 h-5" />
            </a>
            <a href="#home" className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white transition-all shadow-sm">
              <Mail className="w-5 h-5" />
            </a>
            <a href="#home" className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white transition-all shadow-sm">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="#home" className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white transition-all shadow-sm">
              <Share2 className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-10 sm:gap-16 md:gap-24">
          <div className="flex flex-col gap-4">
            <h4 className="font-inter font-bold text-gray-900 mb-2">Product</h4>
            <Link href="#features" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Features</Link>
            <Link href="#how-it-works" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">How it Works</Link>
            <Link href="#pricing" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Pricing</Link>
            <Link href="#home" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Testimonials</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-inter font-bold text-gray-900 mb-2">Company</h4>
            <Link href="#home" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">About Us</Link>
            <Link href="#home" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Careers</Link>
            <Link href="#home" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Blog</Link>
            <Link href="#home" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Contact</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-inter font-bold text-gray-900 mb-2">Legal</h4>
            <button 
              onClick={() => setActivePolicy(policies.privacy)}
              className="font-inter text-gray-600 hover:text-blue-500 transition-colors text-left"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setActivePolicy(policies.terms)}
              className="font-inter text-gray-600 hover:text-blue-500 transition-colors text-left"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => setActivePolicy(policies.cookie)}
              className="font-inter text-gray-600 hover:text-blue-500 transition-colors text-left"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto mt-16 pt-8 border-t border-gray-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-inter text-gray-500 text-sm">
          © {new Date().getFullYear()} SkillSwap. All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-sm font-inter text-gray-500">
          <span>Crafted with</span>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span>for a better learning experience.</span>
        </div>
      </div>

      {/* Policy Modal */}
      <Modal
        isOpen={!!activePolicy}
        onClose={() => setActivePolicy(null)}
        title={activePolicy?.title || ""}
      >
        {activePolicy?.content}
      </Modal>
    </footer>
  );
}
