import { useState, useEffect } from "react";

import { Bell, CheckCircle, AlertTriangle, Info, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/services/api"; // Verify this path is correct based on usages
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

const NotificationDropdown = () => {
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

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
        // Optional: Set up an interval or socket listener here
        const interval = setInterval(fetchNotifications, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    const handleMarkRead = async (id: string, e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        try {
            await notificationService.markRead(id);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    const handleMarkAllRead = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
        }
        try {
            await notificationService.markAllRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            toast({ title: "Success", description: "All notifications marked as read" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to mark all as read", variant: "destructive" });
        }
    };

    const handleDeleteAll = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
        }
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
            case 'success': return <CheckCircle className="text-emerald-500" size={16} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={16} />;
            case 'error': return <AlertTriangle className="text-red-500" size={16} />;
            default: return <Info className="text-blue-500" size={16} />;
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <div className={`relative p-2 text-gray-800  transition-colors cursor-pointer outline-none ${useTheme().theme === "dark" ? "text-white/60 hover:text-white" : "text-gray-800 hover:text-black"}`}>
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border border-black" />
                    )}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 sm:w-96 bg-[#0A0A0A] border-white/10 text-white p-0 shadow-xl z-50">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    <div className="flex gap-1">
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleMarkAllRead}
                                className="h-6 text-[10px] px-2 text-gray-400"
                                title="Mark all as read"
                            >
                                Mark all read
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDeleteAll}
                                className="h-6 text-[10px] px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                title="Delete all"
                            >
                                Clear all
                            </Button>
                        )}
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {loading ? (
                        <div className="text-center py-8 text-xs text-gray-500">Loading...</div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                            <Bell className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={cn(
                                        "relative p-3 rounded-lg border flex items-start gap-3 transition-colors",
                                        notification.read
                                            ? 'bg-transparent border-transparent hover:bg-white/5 opacity-70'
                                            : 'bg-indigo-900/10 border-indigo-500/20 hover:bg-indigo-900/20'
                                    )}
                                >
                                    <div className={cn("mt-0.5 p-1.5 rounded-full", notification.read ? 'bg-black/20' : 'bg-white/10')}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={cn("text-sm font-medium leading-tight", notification.read ? 'text-gray-400' : 'text-white')}>
                                            {notification.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-3 leading-relaxed">{notification.message}</p>
                                        <span className="text-[10px] text-gray-500 mt-1 block">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    {!notification.read && (
                                        <button
                                            onClick={(e) => handleMarkRead(notification._id, e)}
                                            className="p-1 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded transition-colors shrink-0"
                                            title="Mark as read"
                                        >
                                            <Check size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationDropdown;
