
import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { badgeVariants } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { adminService, Bot } from "@/services/adminService";
import { Loader2, FileText, Settings2, Box, Mic, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const BotManagement = () => {
    const { toast } = useToast();
    const [bots, setBots] = useState<Bot[]>([]);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState<string | null>(null);

    const fetchBots = async () => {
        try {
            const data = await adminService.fetchBots();
            setBots(data);
        } catch (error) {
            console.error("Failed to fetch bots", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBots();
    }, []);

    const handleToggle = async (bot: Bot) => {
        const newStatus = bot.status === 'active' ? 'inactive' : 'active';
        setToggling(bot.id);

        // Optimistic update
        setBots(prev => prev.map(b => b.id === bot.id ? { ...b, status: newStatus } : b));

        try {
            await adminService.toggleBotStatus(bot.id, newStatus);
            toast({
                title: `Bot ${newStatus === 'active' ? 'Enabled' : 'Disabled'}`,
                description: `${bot.name} is now ${newStatus}.`,
                style: newStatus === 'active'
                    ? { backgroundColor: '#064e3b', borderColor: '#10b981', color: 'white' }
                    : { backgroundColor: '#7f1d1d', borderColor: '#ef4444', color: 'white' }
            });
        } catch (error) {
            // Revert on error
            setBots(prev => prev.map(b => b.id === bot.id ? { ...b, status: bot.status } : b));
            toast({
                title: "Error",
                description: "Failed to update bot status.",
                variant: "destructive"
            });
        } finally {
            setToggling(null);
        }
    };

    const getIcon = (key: string) => {
        switch (key) {
            case 'xactimate':
                return <FileText className="w-8 h-8 text-indigo-400" />;
            case 'material':
                return <Box className="w-8 h-8 text-emerald-400" />;
            case 'voice':
                return <Mic className="w-8 h-8 text-rose-400" />;
            case 'excel':
                return <FileSpreadsheet className="w-8 h-8 text-emerald-400" />;
            default:
                return <Settings2 className="w-8 h-8 text-gray-400" />;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Bot Management</h1>
                    <p className="text-muted-foreground">Control availability and status of AI agents.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bots.map((bot) => (
                            <motion.div
                                key={bot.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className={`bg-card border-border transition-all duration-300 ${bot.status === 'active' ? 'shadow-lg shadow-indigo-500/5 border-indigo-500/20' : 'opacity-80'}`}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div className="p-3 rounded-xl bg-accent/50 border border-border">
                                            {getIcon(bot.iconKey)}
                                        </div>
                                        {toggling === bot.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                                        ) : (
                                            <Switch
                                                checked={bot.status === 'active'}
                                                onCheckedChange={() => handleToggle(bot)}
                                                className="data-[state=checked]:bg-green-600"
                                            />
                                        )}
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <CardTitle className="text-xl text-foreground font-semibold leading-tight">
                                                {bot.name}
                                            </CardTitle>
                                        </div>
                                        <CardDescription className="text-muted-foreground min-h-[3rem]">
                                            {bot.description}
                                        </CardDescription>
                                        <div className="mt-6 flex items-center justify-between">
                                            <Badge variant="outline" className={`
                                                ${bot.status === 'active'
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/20'}
                                            `}>
                                                {bot.status === 'active' ? 'Active' : 'Disabled'}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground font-mono">ID: {bot.id}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default BotManagement;
