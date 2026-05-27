import { Link } from "react-router-dom";
import {
  Twitter,
  Linkedin,
  Github,
  Mail,
  MapPin,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

const FooterLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <li>
    <Link
      to={to}
      className="text-[#6B6B6B] hover:text-[#0A0A0A] transition-all duration-200 flex items-center group font-medium"
    >
      <span className="w-0 group-hover:w-2 h-[2px] bg-[#0A0A0A] mr-0 group-hover:mr-2 transition-all duration-200" />
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ icon: Icon, href }: { icon: any, href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center text-[#0A0A0A] shadow-premium-tactile hover:bg-[#0A0A0A] hover:text-white transition-all duration-300"
  >
    <Icon className="w-4 h-4" />
  </a>
);

export const Footer = () => {
  return (
    <footer className="bg-[#F8F8F8] border-t border-black/8 w-full relative overflow-hidden pt-20 pb-10 font-sans-landeros text-[#0A0A0A]">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="space-y-4 text-left">
            <Link to="/" className="flex items-center gap-1.5 group">
              <span className="font-display-landeros text-2xl font-black tracking-tight text-[#0A0A0A] !font-bold">
                BigLogic<span className="text-[#6B6B6B]">AI</span>
              </span>
            </Link>
            <p className="font-medium text-xs leading-relaxed text-[#6B6B6B] max-w-xs">
              Enterprise-grade AI agents automating the restoration lifecycle. Rebuilding estimate data into approved cash flows in 60 seconds.
            </p>
            <div className="flex gap-3 pt-2">
              <SocialIcon icon={Twitter} href="#" />
              <SocialIcon icon={Linkedin} href="#" />
              <SocialIcon icon={Github} href="#" />
            </div>
          </div>

          {/* Product Links */}
          <div className="text-left">
            <h4 className="font-tech-landeros text-sm font-bold text-[#0A0A0A] mb-6 uppercase tracking-wider">Product</h4>
            <ul className="space-y-3 text-xs">
              <FooterLink to="/signup">Draw Schedule Agent</FooterLink>
              <FooterLink to="/signup">Material Extraction</FooterLink>
              <FooterLink to="/signup">Carrier Guideline Audit</FooterLink>
              <FooterLink to="/signup">Excel Spreadsheets</FooterLink>
              <FooterLink to="/signup">Company Brain</FooterLink>
            </ul>
          </div>

          {/* Company Links */}
          <div className="text-left">
            <h4 className="font-tech-landeros text-sm font-bold text-[#0A0A0A] mb-6 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-xs">
              <FooterLink to="/">About Us</FooterLink>
              <FooterLink to="/">Careers</FooterLink>
              <FooterLink to="/">Engineering Blog</FooterLink>
              <FooterLink to="/">Contact Support</FooterLink>
              <FooterLink to="/">Partner Ecosystem</FooterLink>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div className="text-left">
            <h4 className="font-tech-landeros text-sm font-bold text-[#0A0A0A] mb-6 uppercase tracking-wider">Stay Updated</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-[#6B6B6B]">
                <Mail className="w-4 h-4 text-[#0A0A0A] shrink-0" />
                <span>support@biglogic.ai</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-[#6B6B6B]">
                <MapPin className="w-4 h-4 text-[#0A0A0A] shrink-0" />
                <span>San Francisco, California</span>
              </div>
            </div>

            {/* Newsletter input */}
            <div className="mt-8 p-5 border border-black/8 bg-white rounded-3xl shadow-premium-tactile">
              <p className="text-[10px] font-bold uppercase text-black/60 mb-3 tracking-wider font-tech-landeros">ENGINEERING CHANGELOG</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Estimator email"
                  className="bg-[#F8F8F8] border border-black/10 px-4 py-2 text-xs font-medium w-full rounded-full focus:outline-none placeholder:text-black/30 text-[#0A0A0A] focus:border-black/20"
                />
                <button 
                  aria-label="Subscribe" 
                  className="w-9 h-9 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center shrink-0 shadow-md hover:bg-[#2A2A2A] transition-all duration-300 active:scale-95"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-black/8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-[#6B6B6B]">
          <p>
            © {new Date().getFullYear()} BigLogic Inc. All rights reserved. Made in U.S.A.
          </p>
          <div className="flex gap-6 font-semibold">
            <Link to="/signup" className="hover:text-[#0A0A0A] transition-colors">Privacy Policy</Link>
            <Link to="/signup" className="hover:text-[#0A0A0A] transition-colors">Terms of Service</Link>
            <Link to="/signup" className="hover:text-[#0A0A0A] transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

