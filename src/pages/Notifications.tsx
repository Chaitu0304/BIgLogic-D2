import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/services/api";
import { Bell, CheckCircle, AlertTriangle, Info, Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const Notifications = () => {
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await notificationService.getNotifications();
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkRead = async (id: string) => {
        try {
            await notificationService.markRead(id);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            toast({ title: "Success", description: "All notifications marked as read" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to mark all as read", variant: "destructive" });
        }
    };

    const handleDeleteAll = async () => {
        try {
            await notificationService.deleteAll();
            setNotifications([]);
            toast({ title: "Success", description: "All notifications deleted" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete notifications", variant: "destructive" });
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-emerald-500" size={20} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={20} />;
            case 'error': return <AlertTriangle className="text-red-500" size={20} />; // Or XCircle
            default: return <Info className="text-blue-500" size={20} />;
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
                        <p className="text-muted-foreground">Updates and alerts for your account</p>
                    </div>
                    <div className="flex gap-2">
                        {notifications.some(n => !n.read) && (
                            <Button
                                onClick={handleMarkAllRead}
                                variant="outline"
                                className="border-border hover:bg-muted text-foreground"
                            >
                                <Check className="mr-2 h-4 w-4" /> Mark all as read
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                onClick={handleDeleteAll}
                                variant="outline"
                                className="border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive/80"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete All
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-20 text-muted-foreground">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground flex flex-col items-center">
                            <Bell className="w-12 h-12 mb-4 opacity-20" />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {notifications.map((notification) => (
                                <motion.div
                                    key={notification._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className={`relative p-4 rounded-xl border ${notification.read
                                        ? 'bg-muted/30 border-border opacity-70'
                                        : 'bg-primary/10 border-primary/20'
                                        } flex items-start gap-4 transition-all hover:bg-accent`}
                                >
                                    <div className={`mt-1 p-2 rounded-full ${notification.read ? 'bg-background' : 'bg-primary/10'}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                            {notification.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                        <span className="text-xs text-muted-foreground mt-2 block opacity-70">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    {!notification.read && (
                                        <button
                                            onClick={() => handleMarkRead(notification._id)}
                                            className="p-2 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-colors"
                                            title="Mark as read"
                                        >
                                            <Check size={16} />
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Notifications;
