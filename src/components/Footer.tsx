import { Globe, Mail, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white/40 backdrop-blur-[25px] border-t border-white/60 mt-20 pt-16 pb-8 px-6 lg:px-12 z-20 relative shadow-[0_-8px_30px_rgb(0,0,0,0.02)]">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row justify-between gap-12">
        {/* Brand and Description */}
        <div className="flex flex-col items-start max-w-sm">
          <span className="font-fustat font-bold text-2xl tracking-tight text-gray-900 mb-4">SkillSwap</span>
          <p className="font-inter text-gray-600 mb-6 leading-relaxed">
            Experience a new way of exchanging skills. Connect, learn, and grow together with our intelligent and secure peer-to-peer platform.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white transition-all shadow-sm">
              <Globe className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white transition-all shadow-sm">
              <Mail className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white transition-all shadow-sm">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-gray-600 hover:text-blue-500 hover:bg-white transition-all shadow-sm">
              <Share2 className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-16 md:gap-24">
          <div className="flex flex-col gap-4">
            <h4 className="font-inter font-bold text-gray-900 mb-2">Product</h4>
            <Link href="#" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Features</Link>
            <Link href="#" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">How it Works</Link>
            <Link href="#" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Pricing</Link>
            <Link href="#" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Testimonials</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-inter font-bold text-gray-900 mb-2">Company</h4>
            <Link href="#" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">About Us</Link>
            <Link href="#" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Careers</Link>
            <Link href="#" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Blog</Link>
            <Link href="#" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Contact</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-inter font-bold text-gray-900 mb-2">Legal</h4>
            <Link href="#" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Privacy Policy</Link>
            <Link href="#" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Terms of Service</Link>
            <Link href="#" className="font-inter text-gray-600 hover:text-blue-500 transition-colors">Cookie Policy</Link>
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
    </footer>
  );
}
