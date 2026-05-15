import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldPlus, ArrowRight, Loader2, Key, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/api";
import { motion } from "framer-motion";

const AdminSignup = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminSecret, setAdminSecret] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showSecret, setShowSecret] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authService.registerAdmin({
                name,
                email,
                password,
                adminSecret
            });

            localStorage.setItem("user", JSON.stringify(response.data));
            localStorage.setItem("token", response.data.token);

            toast({
                title: "Admin Account Created",
                description: "Welcome. Please enable 2FA immediately in settings.",
                className: "bg-red-950 border-red-900 text-red-200"
            });

            setTimeout(() => {
                navigate("/admin/dashboard");
            }, 1500);

        } catch (error: any) {
            console.error("Signup error", error);
            toast({
                title: "Registration Failed",
                description: error.response?.data?.message || "Invalid secret key or data",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
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
                            <ShieldPlus className="w-8 h-8 text-red-600 dark:text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">New Admin Registration</h1>
                        <p className="text-muted-foreground font-medium">Secure Protocol Initiation</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-foreground font-semibold">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Admin Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-red-500 transition-all h-11 rounded-xl"
                            />
                        </div>

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

                        <div className="space-y-2 pt-2">
                            <Label htmlFor="secret" className="text-red-600 dark:text-red-400 flex items-center gap-2 font-bold">
                                <Key size={14} /> Admin Secret Key
                            </Label>
                            <div className="relative">
                                <Input
                                    id="secret"
                                    type={showSecret ? "text" : "password"}
                                    placeholder="Enter secret key to authorize..."
                                    value={adminSecret}
                                    onChange={(e) => setAdminSecret(e.target.value)}
                                    required
                                    className="bg-red-500/5 border-red-200 dark:border-red-500/30 text-foreground placeholder:text-red-900/30 focus:border-red-500 transition-all pr-10 rounded-xl"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSecret(!showSecret)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                >
                                    {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-red-600 hover:bg-red-500 text-white mt-4 transition-all hover:scale-[1.02] font-semibold rounded-xl shadow-lg shadow-red-500/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating Credentials...
                                </>
                            ) : (
                                <>
                                    Initialize Account <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border text-center">
                        <Link to="/admin/login" className="text-red-600 dark:text-red-400 hover:underline font-bold text-sm transition-colors">
                            Return to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminSignup;
