import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Brain, Loader2 } from "lucide-react";
import api from "@/services/api";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/auth/forgotpassword', { email });
      setEmailSent(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error: any) {
      console.error("Forgot password error", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/resetpassword', { otp, password: newPassword });
      toast({
        title: "Password reset successful",
        description: "You can now login with your new password",
      });
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
      console.error("Reset password error", error);
      toast({
        title: "Reset failed",
        description: error.response?.data?.message || "Invalid OTP or failed to reset",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full" />

      {/* Brand */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 group z-50">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">BigLogic.ai</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="relative rounded-2xl border border-border bg-card backdrop-blur-md shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Reset your password</h1>
            <p className="text-muted-foreground">
              {emailSent
                ? "Enter the OTP sent to your email and your new password"
                : "Enter your email address and we'll send you a reset link"}
            </p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-[1.02] font-semibold rounded-xl shadow-lg border border-primary/20 shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div className="p-4 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl text-sm text-center mb-4">
                OTP sent to <span className="font-semibold text-foreground">{email}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-foreground font-medium">Enter OTP</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    autoFocus
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="w-10 h-10 border-border text-foreground bg-muted/20 [&_div>div]:bg-primary" />
                      <InputOTPSlot index={1} className="w-10 h-10 border-border text-foreground bg-muted/20 [&_div>div]:bg-primary" />
                      <InputOTPSlot index={2} className="w-10 h-10 border-border text-foreground bg-muted/20 [&_div>div]:bg-primary" />
                      <InputOTPSlot index={3} className="w-10 h-10 border-border text-foreground bg-muted/20 [&_div>div]:bg-primary" />
                      <InputOTPSlot index={4} className="w-10 h-10 border-border text-foreground bg-muted/20 [&_div>div]:bg-primary" />
                      <InputOTPSlot index={5} className="w-10 h-10 border-border text-foreground bg-muted/20 [&_div>div]:bg-primary" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-foreground font-medium">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="New strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary transition-all h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword" className="text-foreground font-medium">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary transition-all h-11 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-[1.02] mt-2 font-semibold rounded-xl shadow-lg border border-primary/20 shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 bg-muted/20 border-border text-foreground hover:bg-muted transition-colors mt-2 rounded-xl"
                onClick={() => setEmailSent(false)}
              >
                Back to Email
              </Button>
            </form>
          )}

          <div className="mt-8 text-center pt-6 border-t border-border">
            <Link
              to="/login"
              className="text-primary hover:underline font-bold text-sm transition-colors inline-flex items-center gap-2 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
