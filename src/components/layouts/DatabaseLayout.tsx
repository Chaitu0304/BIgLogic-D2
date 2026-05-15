import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, 
    Briefcase, 
    Users, 
    DollarSign, 
    BarChart3, 
    ArrowLeft,
    Search,
    Plus,
    Bell,
    Settings,
    PanelLeftClose,
    PanelLeftOpen,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Brain,
    HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle as ThemeSwitcher } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DatabaseLayoutProps {
    children: ReactNode;
}

const DatabaseLayout = ({ children }: DatabaseLayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { label: "Dashboard", path: "/jobs/dashboard", icon: LayoutDashboard },
        { label: "Job List", path: "/jobs/list", icon: Briefcase },
        { label: "Contacts", path: "/jobs/contacts", icon: Users },
        { label: "QuickBooks", path: "/jobs/quickbooks", icon: DollarSign },
        { label: "Reports", path: "/jobs/reports", icon: BarChart3 },
    ];

    const isActive = (path: string) => {
        if (location.pathname === path) return true;
        // Special case for Job List: keep active for sub-pages like /jobs/new or /jobs/:id
        if (path === "/jobs/list") {
            return location.pathname === "/jobs/new" || /^\/jobs\/list\//.test(location.pathname);
        }
        return false;
    };

    const getPageTitle = () => {
        const currentItem = navItems.find(item => isActive(item.path));
        if (currentItem) return currentItem.label;
        
        // Handle pages not directly in navItems
        if (location.pathname === "/jobs/new") return "Create New Job";
        if (/^\/jobs\/list\//.test(location.pathname)) return "Job Details";
        
        return "Dashboard";
    };

    return (
        <TooltipProvider>
            <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-[#0F1117]' : 'bg-slate-50'}`}>
                {/* Sidebar */}
                <AnimatePresence mode="wait">
                    <motion.aside
                        initial={false}
                        animate={{ 
                            width: isSidebarOpen ? 240 : 64,
                            transition: { duration: 0.3, ease: "easeInOut" }
                        }}
                        className={`relative flex flex-col h-full border-r z-50 ${
                            theme === 'dark' ? 'bg-[#0F1117] border-white/10' : 'bg-white border-slate-200'
                        } shadow-xl`}
                    >
                        {/* Sidebar Header / Logo */}
                        <div className={`h-16 flex items-center border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'} ${isSidebarOpen ? 'px-6' : 'justify-center'}`}>
                            <div className="cursor-pointer flex items-center" onClick={() => navigate("/")}>
                                {isSidebarOpen ? (
                                    <>
                                        <img src="/logo.png" className="h-10 w-auto dark:block hidden" alt="BigLogic Logo" />
                                        <img src="/logo-light-theme.png" className="h-10 w-auto dark:hidden block" alt="BigLogic Logo" />
                                    </>
                                ) : (
                                    <img src="/fav.png" className="h-9 w-9 rounded" alt="Logo" />
                                )}
                            </div>
                        </div>

                        {/* Navigation Items */}
                        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar">
                            {navItems.map((item) => (
                                <Tooltip key={item.path} delayDuration={0} disabled={isSidebarOpen}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                                                isActive(item.path)
                                                    ? (theme === 'dark' ? 'bg-indigo-600/10 text-indigo-400 shadow-[inset_0_0_20px_rgba(79,70,229,0.1)]' : 'bg-indigo-50 text-indigo-700')
                                                    : (theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100')
                                            }`}
                                        >
                                            <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive(item.path) ? 'text-indigo-500' : ''}`} />
                                            <AnimatePresence>
                                                {isSidebarOpen && (
                                                    <motion.span
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        className="font-semibold text-sm whitespace-nowrap"
                                                    >
                                                        {item.label}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                            {isActive(item.path) && (
                                                <motion.div
                                                    layoutId="active-indicator"
                                                    className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                                                />
                                            )}
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="font-bold">
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>

                        {/* Sidebar Footer */}
                        <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                            <button
                                onClick={() => navigate("/dashboard")}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                                    theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <ArrowLeft className="w-5 h-5 flex-shrink-0" />
                                {isSidebarOpen && <span className="font-semibold text-sm">Exit Module</span>}
                            </button>
                        </div>

                        {/* Collapse Toggle */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={`absolute -right-3 top-20 w-6 h-6 rounded-full border shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50 ${
                                theme === 'dark' ? 'bg-[#1A1C23] border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                            }`}
                        >
                            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    </motion.aside>
                </AnimatePresence>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <header className={`h-14 border-b flex items-center justify-between px-6 sticky top-0 z-40 flex-shrink-0 backdrop-blur-xl ${
                        theme === 'dark' ? 'bg-[#0F1117]/90 border-white/5' : 'bg-white/90 border-slate-200'
                    }`}>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Jobs Database</span>
                            <ChevronRight className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-gray-600' : 'text-slate-300'}`} />
                            <h1 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {getPageTitle()}
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className={`pl-9 h-9 w-48 text-sm rounded-lg border-0 ring-1 transition-all focus:w-64 ${
                                        theme === 'dark' 
                                            ? 'bg-white/5 ring-white/10 text-white placeholder:text-gray-600 focus:ring-indigo-500/40' 
                                            : 'bg-slate-50 ring-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-500/30'
                                    }`}
                                />
                            </div>

                            <ThemeSwitcher />
                            
                            <div className={`h-6 w-px ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`} />
                            
                            <Avatar className={`h-8 w-8 ring-2 ring-offset-1 transition-all cursor-pointer ${theme === 'dark' ? 'ring-transparent ring-offset-[#0F1117] hover:ring-indigo-500' : 'ring-transparent ring-offset-white hover:ring-indigo-500'}`}>
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="bg-indigo-600 text-white font-bold text-[10px]">
                                    {user?.name?.slice(0, 2).toUpperCase() || "JD"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </header>

                    {/* Content Scroll Area */}
                    <main className="flex-1 overflow-y-auto custom-scrollbar bg-transparent">
                        <div className="max-w-[1600px] mx-auto p-6 md:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default DatabaseLayout;
