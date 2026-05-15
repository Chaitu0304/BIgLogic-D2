import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "../ThemeToggle";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

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
      // Short timeout to allow navigation to complete before scrolling
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
    { name: "Services", id: "services" },
    { name: "How it Works", id: "how-it-works" },
    { name: "Testimonials", id: "testimonials" },
    { name: "Who It's For", id: "who-its-for" },
    { name: "Why Us", id: "why-us" },
    { name: "Security", id: "security" },
    { name: "FAQ", id: "faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || mobileMenuOpen
        ? "bg-background/80 backdrop-blur-md border-b border-border"
        : "bg-transparent border-transparent"
        }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src={theme === "dark" ? "/logo.png" : "/logo-light-theme.png"} width="160px" height="160px" alt="BigLogic Logo" />
        </Link>
        {/* Desktop Menu */}
        <div className={`hidden lg:flex items-center gap-6 text-sm font-medium ${theme === "dark" ? "text-muted-foreground" : "text-foreground"}`}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={`#${link.id}`}
              onClick={(e) => scrollToSection(e, link.id)}
              className="hover:text-foreground hover:text-indigo-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          {
            localStorage.getItem("token") ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className={`${theme === "dark" ? "text-muted-foreground" : "text-foreground"
                  } hover:text-foreground hover:bg-accent`}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className={`${theme === "dark" ? "text-muted-foreground" : "text-foreground"
                    } hover:text-foreground hover:bg-accent`}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate("/signup")}
                  className={`${theme === "dark" ? "bg-primary" : "bg-primary"
                    } text-primary-foreground hover:bg-primary/90 transition-colors`}
                >
                  Get Started
                </Button>
              </>)}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`lg:hidden p-2 ${theme === "dark" ? "text-muted-foreground" : "text-foreground"
            } hover:bg-accent rounded-lg transition-colors`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={`#${link.id}`}
                  onClick={(e) => scrollToSection(e, link.id)}
                  className={`text-lg font-medium ${theme === "dark" ? "text-muted-foreground" : "text-foreground"
                    } hover:text-indigo-400 transition-colors`}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${theme === "dark" ? "text-muted-foreground" : "text-foreground"}`}>Appearance</span>
                <ThemeToggle />
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex flex-col gap-4">
                {
                  localStorage.getItem("token") ? (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate("/dashboard");
                        setMobileMenuOpen(false);
                      }}
                      className={`justify-start ${theme === "dark" ? "text-muted-foreground" : "text-foreground"
                        } hover:text-foreground hover:bg-accent`}
                    >
                      Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate("/login");
                          setMobileMenuOpen(false);
                        }}
                        className={`justify-start ${theme === "dark" ? "text-muted-foreground" : "text-foreground"
                          } hover:text-foreground hover:bg-accent`}
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={() => {
                          navigate("/signup");
                          setMobileMenuOpen(false);
                        }}
                        className={`bg-indigo-600 text-white hover:bg-indigo-500 w-full`}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav >
  );
};
