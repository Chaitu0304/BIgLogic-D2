import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight, Zap, Layers, Mic, Settings2, Loader2, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { adminService, Bot } from "@/services/adminService";

const Services = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState<Bot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await adminService.fetchBots();
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const isCompanyAdmin = user.role === 'company_admin' || user.role === 'superadmin';
                const allowedBots = user.permissions?.allowedBots || [];

                // Filter: Must be active globally AND (User is Admin OR User has specific permission)
                const filteredServices = data.filter(bot => {
                    if (bot.status !== 'active') return false;
                    if (isCompanyAdmin) return true;
                    // Check if bot routeKey matches allowedBots (which stores routeKeys like 'xactimate')
                    return allowedBots.includes(bot.routeKey);
                });

                setServices(filteredServices);
            } catch (error) {
                console.error("Failed to fetch services", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const getServiceConfig = (bot: Bot) => {
        switch (bot.routeKey) {
            case 'xactimate':
                return {
                    icon: FileText,
                    path: "/workflow/xactimate",
                    color: "text-blue-600 dark:text-blue-400",
                    bg: "bg-blue-500/10",
                    border: "border-blue-500/30 dark:border-blue-500/50",
                    action: "Start Processing"
                };
            case 'material-extraction':
                return {
                    icon: Layers,
                    path: "/workflow/material-extraction",
                    color: "text-purple-600 dark:text-purple-400",
                    bg: "bg-purple-500/10",
                    border: "border-purple-500/30 dark:border-purple-500/50",
                    action: "Start Extraction"
                };
            case 'voice-transcription':
                return {
                    icon: Mic,
                    path: "/workflow/voice-transcription",
                    color: "text-rose-600 dark:text-rose-400",
                    bg: "bg-rose-500/10",
                    border: "border-rose-500/30 dark:border-rose-500/50",
                    action: "Start Field Notes",
                    displayName: "Field Notes"
                };
            case 'estimate-to-excel':
                return {
                    icon: FileSpreadsheet,
                    path: "/workflow/estimate-to-excel",
                    color: "text-emerald-600 dark:text-emerald-400",
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-500/30 dark:border-emerald-500/50",
                    action: "Start Extraction"
                };
            default:
                return {
                    icon: Settings2,
                    path: "#",
                    color: "text-gray-400",
                    bg: "bg-gray-500/10",
                    border: "border-gray-500/30",
                    action: "Coming Soon"
                };
        }
    };

    return (
        <DashboardLayout fullWidth={true}>
            <div className="space-y-8 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-3xl font-bold text-foreground mb-2">Super Agents</h1>
                    <p className="text-muted-foreground">Choose a agent to start your workflow automation.</p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.length === 0 ? (
                            <div className="col-span-2 text-center text-muted-foreground py-10">
                                No active services available at the moment.
                            </div>
                        ) : services.map((service, idx) => {
                            const config = getServiceConfig(service);
                            const Icon = config.icon;
                            return (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    className={`p-8 rounded-3xl border-2 ${config.border} bg-card/50 backdrop-blur-md hover:bg-accent shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
                                >
                                    {/* Decorative background glow */}
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${config.bg} blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    <div className={`w-14 h-14 ${config.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={config.color} size={28} />
                                    </div>

                                    <h3 className="text-xl font-bold text-foreground mb-3">{config.displayName || service.name}</h3>
                                    <p className="text-muted-foreground mb-8 leading-relaxed">
                                        {service.description}
                                    </p>

                                    <Button
                                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all duration-300"
                                        onClick={() => navigate(config.path)}
                                        disabled={config.path === '#'}
                                    >
                                        {config.action}
                                        {config.path !== '#' && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />}
                                    </Button>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Services;
