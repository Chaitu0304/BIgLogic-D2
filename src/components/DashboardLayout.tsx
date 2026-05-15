import { ReactNode, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  matchPath
} from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  History,
  CreditCard,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Bell,
  Search,
  Settings,
  Users,
  PanelLeft,
  Mic,
  Brain,
  ShieldAlert,
  Database,
  TrendingUp,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { adminService } from "@/services/adminService";
import api from "@/services/api";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  fullWidth?: boolean; // ✅ added prop
}

const DashboardLayout = ({ children, fullWidth = false }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    const checkAnnouncement = async () => {
      try {
        const settings = await adminService.fetchPublicSettings();
        if (settings.announcementMessage) {
          setAnnouncement(settings.announcementMessage);
        }
      } catch (error) {
        console.error("Failed to fetch announcement");
      }
    };
    checkAnnouncement();
  }, []);

  const searchableRoutes = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Super Agents", path: "/services" },
    { label: "History", path: "/history" },
    { label: "Profile", path: "/profile" },
    { label: "Billing", path: "/billing" },
    { label: "Xactimate Workflow", path: "/workflow/xactimate" },
    { label: "Material Extraction", path: "/workflow/material-extraction" },
    { label: "Notifications", path: "/notifications" },
    { label: "Field Notes", path: "/fieldnotes" },
    { label: "Jobs Database", path: "/jobs/dashboard" },
    { label: "Reports Center", path: "/reports" },
    { label: "Estimate Training", path: "/estimate-training" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setSearchQuery("");
    setShowResults(false);
  };

  // Permissions Check
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Auth Sync Effect
  useEffect(() => {
    const syncUser = async () => {
      try {
        const response = await api.get('/auth/me');
        const latestUser = response.data;
        if (latestUser.isMaster !== user.isMaster || JSON.stringify(latestUser.permissions) !== JSON.stringify(user.permissions)) {
          const updatedUser = { ...user, isMaster: latestUser.isMaster, permissions: latestUser.permissions };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          // No need to reload, the state will update on next component cycle or we can trigger it
        }
      } catch (err) {
        console.error("Auth sync failed", err);
      }
    };
    if (localStorage.getItem("token")) syncUser();
  }, []);

  const permissions = user.permissions || {
    overview: true,
    activeServices: true,
    workflowHistory: true,
    billing: false,
    profile: false,
    companyBrain: true,
    fieldNotes: true,
    estimateTraining: true,
    activeJobs: true,
    teamManagement: true
  };
  const isCompanyAdmin = user.role === 'company_admin' || user.role === 'superadmin';

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Overview", show: permissions.overview },
    { path: "/history", icon: History, label: "Workflow History", show: permissions.workflowHistory },
    { path: "/services", icon: Briefcase, label: "Super Agents", show: permissions.activeServices },
    { path: "/fieldnotes", icon: Mic, label: "Field Notes", show: (isCompanyAdmin || permissions.fieldNotes) },
    { path: "/estimate-training", icon: Database, label: "Estimate Training", show: (isCompanyAdmin || permissions.estimateTraining) },
    {
      path: "/jobs",
      icon: Briefcase,
      label: "Jobs Database",
      show: (isCompanyAdmin || permissions.activeJobs),
      children: [
        { path: "/jobs/dashboard", label: "Dashboard" },
        { path: "/jobs/list", label: "Job List", pathslist: ["/jobs/list/*", "/jobs/new"], },
        { path: "/jobs/contacts", label: "Contacts" },
        { path: "/jobs/quickbooks", label: "QuickBooks" },
        { path: "/jobs/reports", label: "Reports" },
      ]
    },
    { path: "/company-brain", icon: Brain, label: "Company Brain", show: (isCompanyAdmin || permissions.companyBrain) },
    { path: "/billing", icon: CreditCard, label: "Billing & Plans", show: (isCompanyAdmin || permissions.billing) },
    { path: "/team", icon: Users, label: "Team Management", show: (isCompanyAdmin || permissions.teamManagement) },
  ].filter(item => item.show !== false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  // Auth check
  if (!localStorage.getItem("token")) {
    navigate("/login");
    return null;
  }

  const theme = useTheme().theme;
  const [jobsExpanded, setJobsExpanded] = useState(location.pathname.startsWith('/jobs'));

  const renderSidebarContent = (isMobile = false) => (
    <>
      <div onClick={() => navigate("/dashboard")} className="p-6 cursor-pointer flex items-center gap-3 mb-6">
        <img src={theme === "dark" ? "/logo.png" : "/logo-light-theme.png"} width="160px" height="160px" alt="BigLogic Logo" />
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isJobs = item.label === "Jobs Database";
          const isActive = location.pathname === item.path || (isJobs && location.pathname.startsWith('/jobs'));

          if (isJobs && item.children) {
            return (
              <div key={item.path} className="space-y-1">
                <button
                  onClick={() => setJobsExpanded(!jobsExpanded)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? theme === "dark"
                      ? "bg-indigo-600/10 text-indigo-400"
                      : "bg-indigo-50 text-indigo-700"
                    : theme === "dark"
                      ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? theme === "dark"
                            ? "text-indigo-400"
                            : "text-indigo-700"
                          : theme === "dark"
                            ? "text-muted-foreground group-hover:text-indigo-400"
                            : "text-gray-500 group-hover:text-indigo-600"
                      }
                    />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {jobsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                <AnimatePresence>
                  {jobsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-11 space-y-1"
                    >
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.path ? true :
                          child.pathslist?.some(pattern => matchPath({ path: pattern, end: true }, location.pathname));
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => {
                              if (isMobile) setSidebarOpen(false);
                            }}
                            className={`block px-4 py-2 text-xs font-semibold rounded-lg transition-all ${isChildActive
                              ? theme === "dark"
                                ? "text-indigo-400 bg-indigo-500/10"
                                : "text-indigo-700 bg-indigo-50"
                              : theme === "dark"
                                ? "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                              }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (isMobile) setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                : theme === "dark"
                  ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
            >
              <Icon
                size={18}
                className={
                  isActive
                    ? "text-white"
                    : theme === "dark"
                      ? "text-muted-foreground group-hover:text-indigo-400"
                      : "text-gray-500 group-hover:text-indigo-600"
                }
              />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    // ✅ Add overflow-hidden to prevent horizontal scroll
    <div className="h-screen flex w-full bg-background text-foreground font-sans selection:bg-indigo-500/30 overflow-hidden">

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] ${theme === "dark" ? "bg-indigo-900/10" : "bg-indigo-200/40"} blur-[120px] rounded-full`} />
        <div className={`absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] ${theme === "dark" ? "bg-purple-900/10" : "bg-purple-200/40"} blur-[120px] rounded-full`} />
      </div>

      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex lg:flex-col sticky top-0 h-screen flex-shrink-0 ${theme === "dark"
        ? "bg-card/40 border-border/5"
        : "bg-white/95 border-gray-200 shadow-sm"
        } backdrop-blur-xl border-r z-20 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-0 overflow-hidden opacity-0 min-w-0' : 'w-72 opacity-100 min-w-[288px]'
        }`}>
        {renderSidebarContent()}
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
              className={`absolute left-0 top-0 bottom-0 w-72 ${theme === "dark" ? "bg-card border-border" : "bg-white border-gray-200"} border-r flex flex-col`}
            >
              {renderSidebarContent(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0 overflow-hidden">
        {/* Global Announcement Banner */}
        <AnimatePresence>
          {announcement && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-indigo-600/90 backdrop-blur-sm border-b border-indigo-500/30 relative z-50"
            >
              <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 text-white text-sm font-medium">
                <AlertTriangle className="h-4 w-4 text-indigo-200" />
                <span>{announcement}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Navbar */}
        <header className={`h-20 border-b flex items-center justify-between px-6 lg:px-10 backdrop-blur-md sticky top-0 z-10 shrink-0 ${theme === "dark"
          ? "bg-background/80 border-border"
          : "bg-white/90 border-gray-200"
          }`}>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden ${theme === "dark" ? "text-muted-foreground" : "text-gray-600"}`}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={`hidden lg:flex transition-colors ${theme === "dark"
                ? "text-muted-foreground hover:bg-accent"
                : "text-gray-600 hover:bg-gray-100"
                }`}
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            >
              <PanelLeft size={20} />
            </Button>

            {/* Search Bar */}
            <div className="relative hidden md:block group z-50">
              <div className={`flex items-center gap-3 border rounded-full px-4 py-2 w-64 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all shadow-sm ${theme === "dark"
                ? "bg-accent/50 border-border"
                : "bg-white border-gray-200"
                }`}>
                <Search size={16} className={theme === "dark" ? "text-muted-foreground" : "text-gray-400"} />
                <input
                  type="text"
                  autoCorrect="off"
                  autoFocus={false}
                  autoCapitalize="off"
                  placeholder="Search services,tabs..."
                  className={`bg-transparent border-none outline-none text-sm w-full ${theme === "dark"
                    ? "text-foreground placeholder:text-muted-foreground"
                    : "text-gray-800 placeholder:text-gray-400"
                    }`}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.length > 0) {
                      setShowResults(true);
                      const results = searchableRoutes.filter(route =>
                        route.label.toLowerCase().includes(e.target.value.toLowerCase())
                      );
                      setSearchResults(results);
                    } else {
                      setShowResults(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchResults.length > 0) {
                      handleNavigate(searchResults[0].path);
                    }
                  }}
                  onFocus={() => {
                    if (searchQuery.length > 0) setShowResults(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowResults(false), 200);
                  }}
                />
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute top-full text-left left-0 right-0 mt-2 border rounded-xl shadow-2xl overflow-hidden py-1 z-50 ${theme === "dark"
                      ? "bg-popover border-border"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    {searchResults.map((result) => (
                      <button
                        key={result.path}
                        onClick={() => handleNavigate(result.path)}
                        className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between group/item transition-colors ${theme === "dark"
                          ? "text-muted-foreground hover:bg-accent hover:text-foreground"
                          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                          }`}
                      >
                        <span className="font-medium">{result.label}</span>
                        {result.path.includes("workflow") && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${theme === "dark"
                            ? "text-indigo-400 bg-indigo-500/10"
                            : "text-indigo-700 bg-indigo-100"
                            }`}>
                            Workflow
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <NotificationDropdown />

            <div className={`h-8 w-px hidden sm:block ${theme === "dark" ? "bg-border" : "bg-gray-200"}`} />

            {(isCompanyAdmin || permissions.profile) ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-4 group outline-none">
                    <div className="text-right hidden sm:block">
                      <p className={`text-sm font-medium group-hover:transition-colors ${theme === "dark"
                        ? "text-foreground group-hover:text-indigo-400"
                        : "text-gray-800 group-hover:text-indigo-600"
                        }`}>
                        {user.name || "User"}
                      </p>
                      <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-gray-500"}`}>
                        {user.role === 'company_admin' ? 'Company Admin' : 'Team member'}
                      </p>
                    </div>
                    <Avatar className={`h-10 w-10 border-2 transition-all cursor-pointer ${theme === "dark"
                      ? "border-indigo-500/20 ring-2 ring-transparent group-hover:ring-indigo-500/50"
                      : "border-indigo-200 shadow-sm ring-2 ring-transparent group-hover:ring-indigo-400/50"
                      }`}>
                      <AvatarFallback className={`font-bold text-sm ${theme === "dark"
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-100 text-indigo-700"
                        }`}>
                        {user.name?.slice(0, 2).toUpperCase() || "US"}
                      </AvatarFallback>
                      <AvatarImage src={user.avatar} className="object-cover" />
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={`w-56 ${theme === "dark" ? "bg-popover border-border text-foreground" : "bg-white border-gray-200 text-gray-800"}`}>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className={theme === "dark" ? "bg-border" : "bg-gray-200"} />
                  <DropdownMenuItem className={`cursor-pointer ${theme === "dark" ? "focus:bg-accent focus:text-accent-foreground" : "focus:bg-indigo-50 focus:text-indigo-700"}`} onClick={() => navigate("/profile")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className={theme === "dark" ? "bg-border" : "bg-gray-200"} />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-4 group cursor-pointer outline-none">
                    <div className="text-right hidden sm:block">
                      <p className={`text-sm font-medium ${theme === "dark" ? "text-foreground" : "text-gray-800"}`}>
                        {user.name || "User"}
                      </p>
                      <p className={`text-xs ${theme === "dark" ? "text-muted-foreground" : "text-gray-500"}`}>
                        {user.companyName || "Team Member"}
                      </p>
                    </div>
                    <Avatar className={`h-10 w-10 border-2 transition-all shadow-sm ${theme === "dark"
                      ? "border-border ring-2 ring-transparent"
                      : "border-gray-200 ring-2 ring-transparent group-hover:ring-indigo-400/50"
                      }`}>
                      <AvatarFallback className={`font-bold text-sm ${theme === "dark"
                        ? "bg-indigo-900/50 text-indigo-200"
                        : "bg-indigo-100 text-indigo-700"
                        }`}>
                        {user.name?.slice(0, 2).toUpperCase() || "US"}
                      </AvatarFallback>
                      <AvatarImage src={user.avatar} className="object-cover" />
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={`w-56 ${theme === "dark" ? "bg-popover border-border text-foreground" : "bg-white border-gray-200 text-gray-800"}`}>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className={theme === "dark" ? "bg-border" : "bg-gray-200"} />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Page Content - fluid width when fullWidth, otherwise centered max width */}
        <main className="p-6 lg:p-10 overflow-auto">
          <div className="space-y-8 h-full flex flex-col w-[96%]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;