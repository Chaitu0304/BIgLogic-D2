import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, ArrowRight, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/api";
import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";
import { useTheme } from "@/components/ThemeProvider";

const getPostLoginRoute = (userData: any): string => {
  if (userData.role === 'superadmin') return '/admin/dashboard';
  if (userData.role === 'company_admin') return '/dashboard';
  const perms = userData.permissions || {};
  if (perms.overview) return '/dashboard';
  if (perms.companyBrain) return '/company-brain';
  if (perms.activeJobs) return '/jobs';
  if (perms.fieldNotes) return '/fieldnotes';
  if (perms.activeServices) return '/services';
  if (perms.estimateTraining) return '/estimate-training';
  return '/dashboard';
};

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload: any = { email, password };
      if (showOtp) payload.otp = otp;

      const response = await authService.login(payload);

      if (response.data.twoFactorRequired) {
        setShowOtp(true);
        toast({
          title: "2FA Required",
          description: "Please enter the code from your authenticator app.",
          className: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
        });
        setIsLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", response.data.token);

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      setTimeout(() => {
        navigate(getPostLoginRoute(response.data));
      }, 2000);

    } catch (error: any) {
      console.error("Login error", error);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full" />

      <Link to="/" className="flex  mb-10 items-center gap-2 group">
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
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to access your intelligent workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!showOtp ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="username"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary transition-all h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline transition-colors font-medium">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
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
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-primary/30">
                    <Lock className="text-primary" size={20} />
                  </div>
                  <h3 className="text-foreground font-bold">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Enter the 6-digit code from your app</p>
                </div>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="bg-background border-border text-foreground text-center text-xl font-bold tracking-[0.5em] placeholder:text-muted-foreground/30 focus:border-primary transition-all h-12 rounded-xl"
                  autoFocus
                />
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-[1.02] font-semibold rounded-xl shadow-lg border border-primary/20 shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {showOtp ? "Verifying..." : "Signing in..."}
                </>
              ) : (
                <>
                  {showOtp ? "Verify & Login" : "Sign In"} <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            {!showOtp && (
              <>
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
                            title: "Login successful",
                            description: "Welcome back!",
                          });
                          navigate(getPostLoginRoute(response.data));
                        } catch (error) {
                          console.error("Google Login Failed", error);
                          toast({
                            title: "Login failed",
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
                        title: "Login failed",
                        description: "Google authentication failed",
                        variant: "destructive",
                      });
                    }}
                    theme={theme === 'dark' ? "filled_black" : "outline"}
                    shape="pill"
                    text="continue_with"
                    width="100%"
                  />
                </div>
              </>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <span className="text-muted-foreground text-sm">Don't have an account? </span>
            <Link to="/signup" className="text-primary hover:underline font-bold text-sm transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Login;
