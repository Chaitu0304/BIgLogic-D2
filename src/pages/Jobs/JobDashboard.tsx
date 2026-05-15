import { useQuery } from "@tanstack/react-query";
import { DollarSign, Briefcase, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/components/ThemeProvider";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import api from "@/services/api";

import DashboardLayout from "@/components/DashboardLayout";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const JobDashboard = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { data: allJobs, isLoading: isStatsLoading } = useQuery({
        queryKey: ["jobs-stats"],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await api.get("/jobs", {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
    });

    // --- KPI Calculations ---
    const totalJobs = allJobs?.length || 0;
    const openJobs = allJobs?.filter((j: any) => !['Closed', 'Paid', 'Cancelled'].includes(j.status)).length || 0;
    const totalRevenue = allJobs?.reduce((sum: any, j: any) => sum + (j.financials?.contractAmount || 0), 0) || 0;
    const totalAR = allJobs?.filter((j: any) => j.status === 'Billing').reduce((sum: any, j: any) => sum + (j.financials?.balanceDue || 0), 0) || 0;

    const getStatusDistribution = () => {
        const dist: any = {};
        allJobs?.forEach((j: any) => {
            dist[j.status] = (dist[j.status] || 0) + 1;
        });
        return Object.entries(dist).map(([name, value]) => ({ name, value }));
    };

    const getRevenueGraphData = () => {
        // Mocking grouping by month for current year
        const data = [
            { month: 'Jan', revenue: 45000 },
            { month: 'Feb', revenue: 52000 },
            { month: 'Mar', revenue: 48000 },
            { month: 'Apr', revenue: 61000 },
            { month: 'May', revenue: 55000 },
            { month: 'Jun', revenue: 67000 },
        ];
        return data;
    };

    const statusData = getStatusDistribution();
    const revenueGraphData = getRevenueGraphData();

    if (isStatsLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Skeleton className="h-[400px] rounded-2xl" />
                        <Skeleton className="h-[400px] rounded-2xl" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Jobs Overview</h1>
                        <p className="text-muted-foreground font-medium">Real-time performance metrics and financial auditing for all active jobs.</p>
                    </div>
                </div>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`}>Total Revenue</CardTitle>
                        <DollarSign className={`h-4 w-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>${totalRevenue.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`}>Active Jobs</CardTitle>
                        <Briefcase className={`h-4 w-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{openJobs}</div>
                    </CardContent>
                </Card>

                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`}>Accounts Receivable</CardTitle>
                        <Clock className={`h-4 w-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>${totalAR.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={`text-sm font-semibold uppercase tracking-wider text-rose-500`}>Compliance Risk</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-rose-900'}`}>1</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl p-6`}>
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg font-bold">Revenue Growth</CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueGraphData}>
                                <XAxis dataKey="month" stroke={theme === 'dark' ? '#4b5563' : '#9ca3af'} fontSize={12} />
                                <YAxis stroke={theme === 'dark' ? '#4b5563' : '#9ca3af'} fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl p-6`}>
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg font-bold">Job Status Distribution</CardTitle>
                    </CardHeader>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                        borderRadius: '12px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-4 mt-2">
                            {statusData.map((s, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-xs font-medium opacity-70">{s.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
        </DashboardLayout>
    );
};

export default JobDashboard;
