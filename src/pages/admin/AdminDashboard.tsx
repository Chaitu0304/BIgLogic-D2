
import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, CreditCard, Activity, TrendingUp, ArrowUpRight, ArrowDownRight, Server, PieChart as PieIcon, BarChart3, Wallet, DollarSign, Percent, Building2, Bot } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Line, ComposedChart } from "recharts";
import { adminService, DashboardStats } from "@/services/adminService";
import { motion } from "framer-motion";

const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await adminService.fetchDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const kpiCards = [
        {
            title: "Total Revenue",
            value: `$${stats?.mrr.toLocaleString() || "0"}`,
            icon: Wallet,
            trend: "+12.5% vs last month",
            trendUp: true,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20"
        },
        {
            title: "Total Users",
            value: stats?.totalUsers.toLocaleString() || "0",
            icon: Users,
            trend: "+8.2% new users",
            trendUp: true,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            title: "Total Companies",
            value: stats?.totalCompanies?.toLocaleString() || "0",
            icon: Building2,
            trend: "New this week: 3",
            trendUp: true,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20"
        },
        {
            title: "Active Workflows",
            value: stats?.activeSubscriptions.toLocaleString() || "0",
            icon: Activity,
            trend: "98.5% uptime",
            trendUp: true,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
            border: "border-indigo-500/20"
        },
        {
            title: "Total Runs",
            value: stats?.totalWorkflowRuns.toLocaleString() || "0",
            icon: Server,
            trend: "+24% usage spike",
            trendUp: true,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        },
        {
            title: "Total Bots",
            value: stats?.totalBots?.toLocaleString() || "0",
            icon: Bot,
            trend: `Active: ${stats?.activeBots || 0}`,
            trendUp: true,
            color: "text-pink-400",
            bg: "bg-pink-500/10",
            border: "border-pink-500/20"
        }
    ];

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[80vh]">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Executive Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Real-time platform performance and financial insights.</p>
                    </div>
                    {/* <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Last updated: just now
                    </div> */}
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kpiCards.map((kpi, idx) => {
                        const Icon = kpi.icon;
                        return (
                            <motion.div
                                key={kpi.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                            >
                                <Card className={`bg-card/50 backdrop-blur-sm border-border hover:border-border/80 transition-all duration-300 group`}>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            {kpi.title}
                                        </CardTitle>
                                        <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                                            <Icon size={18} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-foreground mb-1 tracking-tight">{kpi.value}</div>
                                        <div className={`flex items-center gap-1 text-xs ${kpi.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {kpi.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                            <span className="font-medium bg-emerald-400/10 px-1.5 py-0.5 rounded text-emerald-400">{kpi.trend}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Financial Deep Dive Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-500" /> Financial Health
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Net Profit Trend (Revenue vs Expenses) */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="h-full"
                            >
                                <Card className="bg-card/50 backdrop-blur-sm border-border h-[400px] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                                                    Net Profit Trend
                                                </CardTitle>
                                                <CardDescription className="text-muted-foreground">Revenue vs Operational Expenses (6 Months)</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={stats?.revenueTrend}>
                                                <defs>
                                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                                <XAxis
                                                    dataKey="month"
                                                    stroke="hsl(var(--muted-foreground))"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    stroke="hsl(var(--muted-foreground))"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickFormatter={(value) => `$${value / 1000}k`}
                                                />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))', borderRadius: '8px' }}
                                                    formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                                                />
                                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                                <Area
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    name="Revenue"
                                                    stroke="#10b981"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorRevenue)"
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="expenses"
                                                    name="Expenses"
                                                    stroke="#ef4444"
                                                    strokeWidth={2}
                                                    strokeDasharray="5 5"
                                                    fill="transparent"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Revenue Distribution (Donut) */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                className="h-full"
                            >
                                <Card className="bg-card/50 backdrop-blur-sm border-border h-[400px] relative">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                                            Revenue Breakdown
                                        </CardTitle>
                                        <CardDescription className="text-muted-foreground">By Subscription Plan</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-[300px] flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={stats?.revenueByPlan}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={80}
                                                    outerRadius={110}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {stats?.revenueByPlan.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))', borderRadius: '8px' }}
                                                    formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                                                />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    height={36}
                                                    iconType="circle"
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Secondary Metrics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* User Acquisition (Bar Chart) */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <Card className="bg-card/50 backdrop-blur-sm border-border h-[350px]">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-blue-400" /> User Acquisition
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground">Daily Signups (Last 7 Days)</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats?.userGrowth}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                stroke="hsl(var(--muted-foreground))"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }}
                                                contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))', borderRadius: '8px' }}
                                            />
                                            <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Churn Rate (Line Chart) */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.45 }}
                        >
                            <Card className="bg-[#0A0A0A]/50 backdrop-blur-sm border-white/10 h-[350px]">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                                <Percent className="w-5 h-5 text-red-400" /> Churn Rate
                                            </CardTitle>
                                            <CardDescription className="text-gray-400">Monthly User Drop-off</CardDescription>
                                        </div>
                                        <div className="text-2xl font-bold text-white">0.8%</div>
                                    </div>
                                </CardHeader>
                                <CardContent className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats?.churnRate}>
                                            <defs>
                                                <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))', borderRadius: '8px' }} />
                                            <Area type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} fill="url(#colorChurn)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Bot Usage Distribution (Pie Chart) */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            className="h-full"
                        >
                            <Card className="bg-card/50 backdrop-blur-sm border-border h-[350px] relative">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                                        <PieIcon className="w-5 h-5 text-purple-400" /> Bot Utilization
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground">By Workflow Type</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[250px] flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats?.botUsage}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {stats?.botUsage.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))', borderRadius: '8px' }}
                                            />
                                            <Legend verticalAlign="bottom" iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
