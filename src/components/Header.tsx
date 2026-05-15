import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { FileText } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="text-primary-foreground" size={24} />
            </div>
            <span className="text-xl font-bold text-foreground">Draw Scheduler</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#support" className="text-muted-foreground hover:text-foreground transition-colors">
              Support
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {localStorage.getItem("token")
              ? (
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
              )
              : (
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
              )}
            {!localStorage.getItem("token") &&
              <Button onClick={() => navigate("/signup")}>
                Get Started
              </Button>
            }
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
