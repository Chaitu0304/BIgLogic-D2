import { Link } from "react-router-dom";
import {
  Twitter,
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

const FooterLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <li>
    <Link
      to={to}
      className={`text-muted-foreground ${useTheme().theme === "dark" ? "hover:text-indigo-400" : "hover:text-indigo-600"} transition-colors duration-200 flex items-center group`}
    >
      <span className="w-0 group-hover:w-2 h-[1px] bg-indigo-500 mr-0 group-hover:mr-2 transition-all duration-300" />
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ icon: Icon, href }: { icon: any, href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-accent/50 border border-border flex items-center justify-center text-muted-foreground hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all duration-300"
  >
    <Icon className="w-5 h-5" />
  </a>
);

export const Footer = () => {
  const { theme } = useTheme();
  return (
    <footer className="bg-background border-t mt-10 w-full border-border relative overflow-hidden pt-20 pb-10">
      {/* Background Glow */}
      <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] ${theme === "dark" ? "bg-indigo-900/10" : "bg-indigo-500/5"} blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4`} />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="space-y-2">
            <Link to="/" className="flex items-start gap-2">
              <img src={theme === "dark" ? "/logo.png" : "/logo-light-theme.png"} alt="BigLogic Logo" width={"200px"} height={"200px"} />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Enterprise-grade AI agents automating the restoration lifecycle. From claims data to audit-ready schedules in seconds.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialIcon icon={Twitter} href="#" />
              <SocialIcon icon={Linkedin} href="#" />
              <SocialIcon icon={Github} href="#" />
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-foreground font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm">
              <FooterLink to="/features">Draw Schedule Agent</FooterLink>
              <FooterLink to="/features">Material Extraction</FooterLink>
              <FooterLink to="/security">Trust & Security</FooterLink>
              <FooterLink to="/integrations">Integrations</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-foreground font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/contact">Contact Support</FooterLink>
              <FooterLink to="/partners">Partners</FooterLink>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h4 className="text-foreground font-bold mb-6">Stay Updated</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className={`w-4 h-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
                <span className={theme === "light" ? "text-gray-600 font-medium" : ""}>support@biglogic.ai</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className={`w-4 h-4 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} />
                <span className={theme === "light" ? "text-gray-600 font-medium" : ""}>San Francisco, CA</span>
              </div>
            </div>

            <div className={`mt-8 p-4 rounded-xl ${theme === "dark" ? "bg-accent/50" : "bg-indigo-50/50"} border border-border`}>
              <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-gray-500"} mb-3`}>Subscribe to our engineering changelog.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground w-full focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-muted-foreground"
                />
                <Button size="icon" className="bg-indigo-600 hover:bg-indigo-500 shrink-0">
                  <ArrowRight className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BigLogic Inc. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
