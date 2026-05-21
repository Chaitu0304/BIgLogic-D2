import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navLinks = [
    { name: "Automations", id: "services" },
    { name: "How it Works", id: "how-it-works" },
    { name: "ROI Math", id: "roi-calculator" },
    { name: "Evidence", id: "testimonials" },
    { name: "Who It's For", id: "who-its-for" },
    { name: "FAQ", id: "faq" },
  ];

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[96%] lg:w-[95%] xl:w-[86%] lg:max-w-[1080px] xl:max-w-[1200px] transition-all duration-300">
      {/* Floating Glass Container Capsule */}
      <div 
        className={`rounded-full border border-[#311081]/10 transition-all duration-300 px-5 py-2 flex items-center justify-between bg-glass-landeros ${
          isScrolled 
            ? "shadow-landeros-lg bg-white/95" 
            : "shadow-landeros bg-white/80"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-display-landeros text-base md:text-lg font-bold tracking-tight flex items-center gap-0.5 text-[#311081] whitespace-nowrap">
              BigLogic<span className="text-[#6D28D9]">AI</span>
            </span>
          </Link>
 
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-[9.5px] xl:text-[10px] font-bold uppercase tracking-widest text-[#645D75] whitespace-nowrap shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className="hover:text-[#311081] transition-colors relative py-1 px-0.5 whitespace-nowrap shrink-0"
              >
                {link.name}
              </a>
            ))}
          </div>
 
          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0 whitespace-nowrap">
            {localStorage.getItem("token") ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-3.5 xl:px-4 py-2 text-[9.5px] xl:text-[10px] font-bold btn-landeros-primary flex items-center gap-1.5 group shrink-0"
              >
                DASHBOARD <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-2 xl:px-3 py-2 text-[9.5px] xl:text-[10px] font-bold text-[#311081] hover:text-[#240b61] transition-colors uppercase tracking-widest font-sans-landeros shrink-0"
                >
                  SIGN IN
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 xl:px-5 py-2.5 text-[9.5px] xl:text-[10px] font-bold btn-landeros-primary flex items-center gap-1.5 group shrink-0"
                >
                  GET STARTED <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </>
            )}
          </div>
 
          {/* Mobile Menu Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              className="p-2 rounded-full bg-white text-[#311081] border border-[#311081]/10 hover:bg-[#F6F1FC] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
 
      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute top-16 left-2 right-2 z-40 lg:hidden p-5 bg-glass-landeros border border-[#311081]/15 rounded-3xl shadow-landeros-lg bg-white/95"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={`#${link.id}`}
                  onClick={(e) => scrollToSection(e, link.id)}
                  className="text-xs font-bold uppercase tracking-wider text-[#645D75] hover:text-[#311081] py-2 transition-colors border-b border-[#311081]/5 last:border-0"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-[#311081]/10 my-1" />
              <div className="flex flex-col gap-2 pt-1">
                {localStorage.getItem("token") ? (
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold btn-landeros-primary"
                  >
                    DASHBOARD
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 text-center text-xs font-bold text-[#311081] border border-[#311081]/10 rounded-full hover:bg-[#F6F1FC] transition-colors"
                    >
                      SIGN IN
                    </button>
                    <button
                      onClick={() => {
                        navigate("/signup");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 text-center text-xs font-bold btn-landeros-primary flex items-center justify-center gap-1"
                    >
                      START FREE NOW <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
