import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, ArrowRight, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/api";
import { motion } from "framer-motion";

const AdminLogin = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
                    className: "bg-red-500/10 border-red-500/20 text-red-400"
                });
                setIsLoading(false);
                return;
            }

            // Check if user is SuperAdmin
            if (response.data.role !== 'superadmin') {
                toast({
                    title: "Access Denied",
                    description: "You do not have administrative privileges.",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            localStorage.setItem("user", JSON.stringify(response.data));
            localStorage.setItem("token", response.data.token);

            toast({
                title: "Admin Access Granted",
                description: "Welcome to the command center.",
                className: "bg-red-950 border-red-900 text-red-200"
            });

            setTimeout(() => {
                navigate("/admin/dashboard");
            }, 1000);

        } catch (error: any) {
            console.error("Login error", error);
            toast({
                title: "Authentication Failed",
                description: error.response?.data?.message || "Invalid credentials",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements - Red Theme for Admin */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-500/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 blur-[100px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="relative rounded-2xl border border-red-500/20 bg-card backdrop-blur-md shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20 shadow-lg shadow-red-500/10">
                            <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Admin Portal</h1>
                        <p className="text-muted-foreground font-medium">Restricted Access Authorization</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!showOtp ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-foreground font-semibold">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@biglogic.ai"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-red-500 transition-all h-11 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-foreground font-semibold">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-red-500 transition-all h-11 pr-10 rounded-xl"
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
                                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-500/30">
                                        <Lock className="text-red-500" size={20} />
                                    </div>
                                    <h3 className="text-foreground font-bold">Security Clearance</h3>
                                    <p className="text-sm text-muted-foreground">Enter 2FA Code</p>
                                </div>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                    className="bg-background border-border text-foreground text-center text-xl font-bold tracking-[0.5em] placeholder:text-muted-foreground/30 focus:border-red-500 transition-all h-12 rounded-xl"
                                    autoFocus
                                />
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 bg-red-600 hover:bg-red-500 text-white transition-all hover:scale-[1.02] font-semibold rounded-xl shadow-lg shadow-red-500/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    {showOtp ? "Verify Clearance" : "Authenticate"} <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border text-center">
                        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Unauthorized access is prohibited and monitored.</span>
                        <div className="mt-4">
                            <Link to="/admin/signup" className="text-red-600 dark:text-red-400 hover:underline text-sm font-bold">
                                Register New Admin
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
