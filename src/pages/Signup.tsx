import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/api";
import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";
import { useTheme } from "@/components/ThemeProvider";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.register({ name, email, password });

      console.log("response from signup", response);
      if (response.status === 201) {

        // Auto login after signup? Or require explicit login?
        // Let's store token and login immediately for better UX
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("token", response.data.token);

        toast({
          title: "Account created successfully",
          description: "Welcome to BigLogic.ai!",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Signup error", error);
      toast({
        title: "Account creation failed",
        description: error.response?.data?.message || "Please try again or user may exist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full" />

      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 group mb-10">
        <img src={theme === "dark" ? "/logo.png" : "/logo-light-theme.png"} width="160px" height="160px" alt="BigLogic Logo" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="relative rounded-2xl border border-border bg-card backdrop-blur-md shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join the thousands automating their workflows</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary transition-all h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary transition-all h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary transition-all h-11 pr-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary transition-all h-11 pr-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-[1.02] mt-2 font-semibold rounded-xl shadow-lg border border-primary/20 shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    setIsLoading(true);
                    try {
                      const response = await authService.googleLogin(credentialResponse.credential);
                      localStorage.setItem("user", JSON.stringify(response.data));
                      localStorage.setItem("token", response.data.token);
                      toast({
                        title: "Account created successfully",
                        description: "Welcome to BigLogic.ai!",
                      });
                      navigate("/dashboard");
                    } catch (error) {
                      console.error("Google Signup Failed", error);
                      toast({
                        title: "Signup failed",
                        description: "Google authentication failed",
                        variant: "destructive",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }
                }}
                onError={() => {
                  toast({
                    title: "Signup failed",
                    description: "Google authentication failed",
                    variant: "destructive",
                  });
                }}
                theme={theme === 'dark' ? "filled_black" : "outline"}
                shape="pill"
                text="signup_with"
                width="100%"
              />
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <span className="text-muted-foreground text-sm">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline font-bold text-sm transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div >
      <Footer />
    </div >
  );
};

export default Signup;
