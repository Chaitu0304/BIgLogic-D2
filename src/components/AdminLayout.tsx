
import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Activity, Bot, Building2, LayoutDashboard, LogOut, Menu, Search, Settings, ShieldAlert, ShieldCheck, Users } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { path: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
        { path: "/admin/companies", icon: Building2, label: "Company Admin Management" },
        { path: "/admin/users", icon: Users, label: "User Management" },
        { path: "/admin/workflow-history", icon: Activity, label: "Workflow History" },
        { path: "/admin/bots", icon: Bot, label: "Bot Management" }, // Placeholder
        { path: "/admin/admins", icon: ShieldAlert, label: " Super Admin Management" },
        { path: "/admin/settings", icon: Settings, label: "System Settings" }, // Placeholder
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("user");
        navigate("/admin/login");
    };

    const SidebarContent = () => {
        const { theme } = useTheme();
        return (
            <>
                <div onClick={() => navigate("/admin/dashboard")} className="p-6 cursor-pointer flex flex-col items-center mb-6">
                    <div className="w-[160px] rounded-xl  flex items-center justify-center shadow-lg shadow-red-500/20">
                        <img src={theme === "dark" ? "/logo.png" : "/logo-light-theme.png"} width="160px" height="160px" alt="BigLogic Logo" />
                    </div>

                </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? "bg-red-600 text-white shadow-lg shadow-red-500/25"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                }`}
                        >
                            <Icon size={18} className={isActive ? "text-white" : "text-muted-foreground group-hover:text-red-400"} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-border mx-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-red-400 hover:bg-red-500/10 gap-3"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Sign Out</span>
                </Button>
            </div>
        </>
    );
};

    return (
        <div className="h-screen overflow-hidden flex w-full bg-background text-foreground font-sans selection:bg-red-500/30">
            {/* Background Ambience - Red/Dark for Admin */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-900/5 blur-[120px] rounded-full" />
            </div>

            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-card/40 backdrop-blur-xl border-r border-border z-20">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border flex flex-col"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
                {/* Top Navbar */}
                <header className="h-20 border-b border-border flex items-center justify-between px-6 lg:px-10 bg-background/20 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-muted-foreground"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </Button>
                        {/* <h2 className="text-xl font-semibold text-white hidden md:block">
                            {navItems.find(i => i.path === location.pathname)?.label || "Admin Portal"}
                        </h2> */}
                    </div>

                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <div className="flex items-center gap-4 group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-foreground group-hover:text-red-600 transition-colors">Super Admin</p>
                                <p className="text-xs text-muted-foreground">System Control</p>
                            </div>
                            <Avatar className="h-10 w-10 border-2 border-red-500/20 ring-2 ring-transparent group-hover:ring-red-500/50 transition-all cursor-pointer">
                                <AvatarFallback className="bg-red-600 text-white font-bold">
                                    SA
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto scrollbar-hide">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
