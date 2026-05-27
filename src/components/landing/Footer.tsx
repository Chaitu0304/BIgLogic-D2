import { Link } from "react-router-dom";
import {
  Twitter,
  Linkedin,
  Github,
  Mail,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Globe,
  Heart
} from "lucide-react";

const FooterLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <li>
    <Link
      to={to}
      className="text-[#645D75] hover:text-[#6D28D9] transition-all duration-300 flex items-center group font-semibold text-sm"
    >
      <span className="w-0 group-hover:w-2.5 h-[2px] bg-[#6D28D9] mr-0 group-hover:mr-2 transition-all duration-300 rounded-full" />
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ icon: Icon, href }: { icon: any, href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-11 h-11 rounded-full border border-[#311081]/8 bg-white flex items-center justify-center text-[#311081] shadow-landeros hover:bg-[#311081] hover:text-white hover:border-transparent hover:scale-110 hover:shadow-[0_0_20px_rgba(109,40,217,0.35)] transition-all duration-300"
  >
    <Icon className="w-4.5 h-4.5" />
  </a>
);

export const Footer = () => {
  return (
    <footer className="bg-[#FCFBFE] bg-grid-landeros border-t border-[#311081]/5 w-full relative overflow-hidden pt-24 pb-12 font-sans-landeros text-[#1C1629]">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-[350px] h-[350px] bg-gradient-to-tr from-[#6D28D9]/4 to-transparent rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-gradient-to-bl from-[#4F46E5]/4 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">

          {/* Brand Info Column (Span 4) */}
          <div className="space-y-6 text-left lg:col-span-4">
            <Link to="/" className="flex items-center gap-1.5 group">
              <span className="font-display-landeros text-2xl font-black tracking-tight text-[#311081]">
                BigLogic<span className="text-[#6D28D9]">AI</span>
              </span>
            </Link>
            <p className="font-medium text-sm leading-relaxed text-[#645D75] max-w-sm">
              Enterprise-grade AI agents automating the reconstruction and restoration lifecycle. Rebuilding estimate data into approved draw cash flows in seconds.
            </p>
            <div className="flex gap-3.5 pt-2">
              <SocialIcon icon={Twitter} href="#" />
              <SocialIcon icon={Linkedin} href="#" />
              <SocialIcon icon={Github} href="#" />
            </div>
          </div>

          {/* Product Links (Span 2) */}
          <div className="text-left lg:col-span-2 md:pl-4">
            <h4 className="font-tech-landeros text-xs font-black text-[#311081]/40 mb-6 uppercase tracking-widest">Product</h4>
            <ul className="space-y-3.5">
              <FooterLink to="/signup">Draw Agent</FooterLink>
              <FooterLink to="/signup">Estimate Parser</FooterLink>
              <FooterLink to="/signup">Insurer Auditor</FooterLink>
              <FooterLink to="/signup">Excel Export</FooterLink>
              <FooterLink to="/signup">Company Brain</FooterLink>
            </ul>
          </div>

          {/* Company Links (Span 2) */}
          <div className="text-left lg:col-span-2">
            <h4 className="font-tech-landeros text-xs font-black text-[#311081]/40 mb-6 uppercase tracking-widest">Company</h4>
            <ul className="space-y-3.5">
              <FooterLink to="/">About Us</FooterLink>
              <FooterLink to="/">Careers</FooterLink>
              <FooterLink to="/">Engineering</FooterLink>
              <FooterLink to="/">Partner Suite</FooterLink>
              <FooterLink to="/">Support Desk</FooterLink>
            </ul>
          </div>

          {/* Newsletter / Contact (Span 4) */}
          <div className="text-left lg:col-span-4">
            <h4 className="font-tech-landeros text-xs font-black text-[#311081]/40 mb-6 uppercase tracking-widest">Stay Connected</h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#645D75]">
                <Mail className="w-4 h-4 text-[#6D28D9] shrink-0" />
                <span>support@biglogic.ai</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-[#645D75]">
                <MapPin className="w-4 h-4 text-[#6D28D9] shrink-0" />
                <span>San Francisco, California</span>
              </div>
            </div>

            {/* Newsletter Glassmorphic Card */}
            <div className="p-6 border border-[#311081]/10 bg-white/70 backdrop-blur-md rounded-3xl shadow-landeros hover:border-[#6D28D9]/25 hover:shadow-[0_15px_35px_rgba(109,40,217,0.06)] transition-all duration-300">
              <p className="text-[10px] font-black uppercase text-[#311081]/60 mb-2 tracking-wider font-tech-landeros">
                WEEKLY COGNITIVE CHANGELOG
              </p>
              <p className="text-xs font-semibold text-[#645D75] mb-4 leading-normal">
                Receive dry-run engineering notes on carrier guideline audits.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Estimator email"
                  className="bg-[#FCFBFE] border border-[#311081]/10 px-4 py-2.5 text-xs font-semibold w-full rounded-full focus:outline-none placeholder:text-[#645D75]/40 text-[#311081] focus:border-[#6D28D9]/40 focus:ring-4 focus:ring-[#6D28D9]/5 transition-all"
                />
                <button 
                  aria-label="Subscribe" 
                  className="w-10 h-10 rounded-full bg-[#311081] text-white flex items-center justify-center shrink-0 shadow-md hover:bg-[#6D28D9] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-[#311081]/6 w-full mb-8" />

        {/* Bottom Metadata & Legal Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-xs font-semibold text-[#645D75]">
          
          {/* Copyright Info */}
          <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
            <p>
              © {new Date().getFullYear()} BigLogic Inc. All rights reserved.
            </p>
            <span className="hidden md:inline text-[#311081]/20">|</span>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 fill-[#6D28D9] text-[#6D28D9] animate-pulse" />
              <span>for Calm Operators.</span>
            </div>
          </div>

          {/* Live Operational Status Capsule */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/50 text-[10px] font-black font-tech-landeros text-emerald-700 tracking-wider uppercase shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 block animate-pulse" />
            <span>ALL SYSTEMS OPERATIONAL // ONLINE</span>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/signup" className="hover:text-[#6D28D9] transition-colors">Privacy Policy</Link>
            <Link to="/signup" className="hover:text-[#6D28D9] transition-colors">Terms of Service</Link>
            <Link to="/signup" className="hover:text-[#6D28D9] transition-colors">Cookie Vault</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
