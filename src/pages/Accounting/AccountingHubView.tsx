import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    DollarSign,
    TrendingUp,
    FileText,
    CreditCard,
    Building2,
    ArrowUpRight,
    Search,
    RefreshCw,
    ExternalLink,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import api from "@/services/api";
import { useTheme } from "@/components/ThemeProvider";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const AccountingHubView = ({ hideHeader = false }: { hideHeader?: boolean }) => {
    const { theme } = useTheme();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("overview");
    const [searchTerm, setSearchTerm] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Fetch QuickBooks Connection Status
    const { data: qbStatus, isLoading: isStatusLoading } = useQuery({
        queryKey: ['qbStatus'],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await api.get('/quickbooks/status', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    // Fetch Metrics
    const { data: metricsData, isLoading: isMetricsLoading } = useQuery({
        queryKey: ['qbMetrics'],
        queryFn: async () => {
            const res = await api.get('/quickbooks/metrics', {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            return res.data.metrics;
        },
        enabled: !!qbStatus?.connected
    });

    // Fetch Lists
    const { data: invoices, isLoading: isInvoicesLoading } = useQuery({
        queryKey: ['qbInvoices'],
        queryFn: async () => {
            const res = await api.get('/quickbooks/invoices?limit=50', {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            return res.data.invoices;
        },
        enabled: !!qbStatus?.connected && (activeTab === "invoices" || activeTab === "overview")
    });

    const { data: estimates, isLoading: isEstimatesLoading } = useQuery({
        queryKey: ['qbEstimates'],
        queryFn: async () => {
            const res = await api.get('/quickbooks/estimates?limit=50', {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            return res.data.estimates;
        },
        enabled: !!qbStatus?.connected && activeTab === "estimates"
    });

    const { data: expenses, isLoading: isExpensesLoading } = useQuery({
        queryKey: ['qbExpenses'],
        queryFn: async () => {
            const res = await api.get('/quickbooks/expenses?limit=50', {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            return res.data.expenses;
        },
        enabled: !!qbStatus?.connected && (activeTab === "expenses" || activeTab === "overview")
    });

    const { data: payments, isLoading: isPaymentsLoading } = useQuery({
        queryKey: ['qbPayments'],
        queryFn: async () => {
            const res = await api.get('/quickbooks/payments?limit=50', {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            return res.data.payments;
        },
        enabled: !!qbStatus?.connected && activeTab === "payments"
    });

    const { data: customers, isLoading: isCustomersLoading } = useQuery({
        queryKey: ['qbCustomers'],
        queryFn: async () => {
            const res = await api.get('/quickbooks/customers?limit=100', {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            return res.data.customers;
        },
        enabled: !!qbStatus?.connected && activeTab === "customers"
    });

    const getFilteredData = (data: any[]) => {
        if (!data) return [];
        if (!searchTerm) return data;
        const lowSearch = searchTerm.toLowerCase();
        return data.filter(item =>
            (item.DisplayName?.toLowerCase().includes(lowSearch)) ||
            (item.DocNumber?.toLowerCase().includes(lowSearch)) ||
            (item.CustomerRef?.name?.toLowerCase().includes(lowSearch)) ||
            (item.Id?.toLowerCase().includes(lowSearch))
        );
    };

    const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

    const getReportValue = (report: any, label: string) => {
        if (!report || !report.Rows || !report.Rows.Row) return 0;
        const findRow = (rows: any[]): any => {
            for (const row of rows) {
                if (row.Summary?.ColData?.[0]?.value === label) return parseFloat(row.Summary.ColData[1].value);
                if (row.Rows?.Row) {
                    const found = findRow(row.Rows.Row);
                    if (found) return found;
                }
            }
            return null;
        };
        return findRow(report.Rows.Row) || 0;
    };

    const handleViewPdf = async (type: string, id: string) => {
        const token = localStorage.getItem("token");
        const endpoint = type.toLowerCase() === 'invoice' ? `/quickbooks/invoices/${id}/pdf` : `/quickbooks/estimates/${id}/pdf`;
        try {
            const res = await api.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            window.open(url, '_blank');
        } catch (error) {
            toast.error(`Failed to view ${type} PDF`);
        }
    };

    const handleViewJson = async (type: string, id: string) => {
        const token = localStorage.getItem("token");
        const endpoint = type.toLowerCase() === 'invoice' ? `/quickbooks/invoices/${id}/json` : `/quickbooks/estimates/${id}/json`;
        try {
            const res = await api.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const jsonStr = JSON.stringify(res.data, null, 2);
            const x = window.open();
            if (x) {
                x.document.open();
                x.document.write(`<html><head><title>Raw QBO JSON - ${id}</title></head><body style="background:#111;color:#eee;"><pre>${jsonStr}</pre></body></html>`);
                x.document.close();
            }
        } catch (error) {
            toast.error("Failed to fetch raw JSON");
        }
    };

    if (!qbStatus?.connected && !isStatusLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center">
                    <CreditCard size={48} className="text-indigo-500" />
                </div>
                <div className="max-w-md space-y-2">
                    <h1 className="text-3xl font-bold">Connect QuickBooks</h1>
                    <p className="text-muted-foreground">Authorize QuickBooks Online to unlock the QuickBooks Hub and see real-time financial data across your company.</p>
                </div>
                <Button
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-full shadow-lg shadow-indigo-500/25"
                    onClick={() => {
                        // In Jobs tab context, we might not want to navigate away.
                        // But for now, we'll keep the logic to navigate back to Jobs (which will show the same tab).
                        window.location.href = `/jobs`;
                    }}
                >
                    Connect via Jobs
                </Button>
            </div>
        );
    }

    const totalIncome = getReportValue(metricsData?.profitAndLoss, "Total Income");
    const totalExpenses = getReportValue(metricsData?.profitAndLoss, "Total Expenses");
    const netIncome = getReportValue(metricsData?.profitAndLoss, "Net Income");

    // Real Chart Data from QuickBooks
    const chartData = metricsData?.monthlyTrend?.Columns?.Column?.slice(1).map((col: any, idx: number) => {
        const monthLabel = col.MetaData?.[0]?.value || `M${idx + 1}`;
        const getColValue = (report: any, label: string, columnIdx: number) => {
            if (!report || !report.Rows || !report.Rows.Row) return 0;
            const findRow = (rows: any[]): any => {
                for (const row of rows) {
                    if (row.Summary?.ColData?.[0]?.value === label) return parseFloat(row.Summary.ColData[columnIdx + 1]?.value || "0");
                    if (row.Rows?.Row) {
                        const found = findRow(row.Rows.Row);
                        if (found) return found;
                    }
                }
                return null;
            };
            return findRow(report.Rows.Row) || 0;
        };

        const revenue = getColValue(metricsData.monthlyTrend, "Total Income", idx);
        const exp = getColValue(metricsData.monthlyTrend, "Total Expenses", idx);
        const profit = getColValue(metricsData.monthlyTrend, "Net Income", idx);

        return {
            name: monthLabel.split(' ')[0],
            revenue: revenue,
            expenses: exp,
            profit: profit
        };
    }) || [];

    return (
        <div className={`space-y-8 ${hideHeader ? '' : 'pb-20'}`}>
            {/* Header Section */}
            {!hideHeader && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                            QuickBooks Hub
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 font-bold">
                                LIVE SYNC
                            </Badge>
                        </h1>
                        <p className="text-muted-foreground mt-2 font-medium">Real-time financial performance and QuickBooks synchronization.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="rounded-xl border-border bg-card/50 backdrop-blur-sm"
                            disabled={isRefreshing}
                            onClick={async () => {
                                setIsRefreshing(true);
                                try {
                                    await queryClient.refetchQueries();
                                    toast.success("Data synchronized successfully");
                                } catch (error) {
                                    toast.error("Failed to refresh data");
                                } finally {
                                    setIsRefreshing(false);
                                }
                            }}
                        >
                            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                        </Button>
                    </div>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 ring-1 ring-border/50 bg-card/40 backdrop-blur-xl rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <DollarSign size={18} className="text-indigo-500" />
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-0 flex gap-1 items-center">
                                <ArrowUpRight size={12} /> 12%
                            </Badge>
                        </div>
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest pt-2">Total Revenue (YTD)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{fmt(totalIncome)}</div>
                    </CardContent>
                </Card>

                <Card className="border-0 ring-1 ring-border/50 bg-card/40 backdrop-blur-xl rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <TrendingUp size={18} className="text-rose-500" />
                            <Badge variant="secondary" className="bg-rose-500/10 text-rose-500 border-0 flex gap-1 items-center">
                                <ArrowUpRight size={12} /> 5%
                            </Badge>
                        </div>
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest pt-2">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{fmt(totalExpenses)}</div>
                    </CardContent>
                </Card>

                <Card className="border-0 ring-1 ring-border/50 bg-indigo-600 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all shadow-2xl shadow-indigo-500/20">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CheckCircle2 size={18} className="text-white/80" />
                            <Badge variant="secondary" className="bg-white/20 text-white border-0 flex gap-1 items-center">
                                <ArrowUpRight size={12} /> 24%
                            </Badge>
                        </div>
                        <CardTitle className="text-sm font-semibold text-white/70 uppercase tracking-widest pt-2">Net Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{fmt(netIncome)}</div>
                    </CardContent>
                </Card>

                <Card className="border-0 ring-1 ring-border/50 bg-emerald-600 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-all shadow-2xl shadow-emerald-500/20">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CreditCard size={18} className="text-white/80" />
                            <span className="text-[10px] text-white/50 font-bold">REALTIME</span>
                        </div>
                        <CardTitle className="text-sm font-semibold text-white/70 uppercase tracking-widest pt-2">Cash on Hand</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">$142,400</div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    <TabsList className="bg-card/40 backdrop-blur-xl border border-border/50 p-1 rounded-2xl h-12">
                        <TabsTrigger value="overview" className="rounded-xl px-6 data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-bold transition-all">Overview</TabsTrigger>
                        <TabsTrigger value="invoices" className="rounded-xl px-6 data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-bold transition-all">Invoices</TabsTrigger>
                        <TabsTrigger value="estimates" className="rounded-xl px-6 data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-bold transition-all">Estimates</TabsTrigger>
                        <TabsTrigger value="payments" className="rounded-xl px-6 data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-bold transition-all">Payments</TabsTrigger>
                        <TabsTrigger value="expenses" className="rounded-xl px-6 data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-bold transition-all">Expenses</TabsTrigger>
                        <TabsTrigger value="customers" className="rounded-xl px-6 data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-bold transition-all">Customers</TabsTrigger>
                    </TabsList>

                    {activeTab !== 'overview' && (
                        <div className="flex items-center gap-2">
                            <div className="relative group hidden sm:block">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                                <Input
                                    className="pl-10 h-10 w-64 rounded-xl bg-card/40 border-border/50 backdrop-blur-xl focus-visible:ring-indigo-600"
                                    placeholder="Search records..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <TabsContent value="overview" className="mt-0">
                    <div className="flex flex-col space-y-8">
                        {/* Full Width Monthly Performance Chart */}
                        <Card className="border-0 ring-1 ring-border/50 bg-card/20 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xl font-black">Monthly Performance</CardTitle>
                                <CardDescription className="font-medium">Direct comparison of Revenue vs Expenses retrieved from QuickBooks Online.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                                            </linearGradient>
                                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#888', fontSize: 12, fontWeight: 'bold' }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#888', fontSize: 12, fontWeight: 'bold' }}
                                            tickFormatter={(v) => `$${v / 1000}k`}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            contentStyle={{
                                                backgroundColor: theme === 'dark' ? '#111' : '#fff',
                                                border: 'none',
                                                borderRadius: '1.5rem',
                                                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                                                padding: '20px'
                                            }}
                                            itemStyle={{ fontWeight: 'black', fontSize: '12px' }}
                                            labelStyle={{ fontWeight: 'black', color: theme === 'dark' ? '#fff' : '#000', marginBottom: '8px' }}
                                        />
                                        <Bar dataKey="revenue" fill="url(#colorIncome)" radius={[10, 10, 0, 0]} name="Monthly Income" barSize={40} />
                                        <Bar dataKey="expenses" fill="url(#colorExpense)" radius={[10, 10, 0, 0]} name="Monthly Expenses" barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Full Width Trend Chart */}
                        <Card className="border-0 ring-1 ring-border/50 bg-card/20 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="p-8 border-b border-border/50 bg-white/[0.02]">
                                <CardTitle className="text-xl font-black">Net Margin Trend</CardTitle>
                                <CardDescription className="font-medium">Profitability analysis across fiscal periods.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorProfitLine" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12, fontWeight: 'bold' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12, fontWeight: 'bold' }} tickFormatter={(v) => `$${v / 1000}k`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: theme === 'dark' ? '#111' : '#fff', border: 'none', borderRadius: '1.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}
                                        />
                                        <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorProfitLine)" name="Net Profit" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* 3-Column Summary Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card className="border-0 ring-1 ring-border/50 bg-card/20 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-lg font-black flex items-center gap-2">
                                        <Clock className="text-indigo-500" size={20} /> Receivables
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-4">
                                    {invoices?.slice(0, 3).map((inv: any) => (
                                        <div key={inv.Id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer group">
                                            <div className="flex flex-col">
                                                <div className="font-black text-sm max-w-[120px] truncate">{inv.CustomerRef?.name}</div>
                                                <div className="text-[10px] text-muted-foreground font-bold uppercase">{inv.Id}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-black text-sm">{fmt(inv.TotalAmt)}</div>
                                                <Badge className="bg-emerald-500/10 text-emerald-500 text-[9px] border-0 px-2 py-0">{inv.Balance === 0 ? "PAID" : "OPEN"}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                    {(!invoices || invoices.length === 0) && <div className="py-6 text-center text-muted-foreground italic font-bold">No recent invoices</div>}
                                </CardContent>
                            </Card>

                            <Card className="border-0 ring-1 ring-border/50 bg-card/20 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-lg font-black flex items-center gap-2">
                                        <AlertCircle className="text-rose-500" size={20} /> Outstanding
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-4">
                                    {expenses?.slice(0, 3).map((exp: any) => (
                                        <div key={exp.Id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer group">
                                            <div className="flex flex-col">
                                                <div className="font-black text-sm max-w-[120px] truncate">{exp.VendorRef?.name}</div>
                                                <div className="text-[10px] text-muted-foreground font-bold uppercase">BILL</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-black text-sm">{fmt(exp.TotalAmt)}</div>
                                                <Badge className="bg-amber-500/10 text-amber-500 text-[9px] border-0 px-2 py-0">UNPAID</Badge>
                                            </div>
                                        </div>
                                    ))}
                                    {(!expenses || expenses.length === 0) && <div className="py-6 text-center text-muted-foreground italic font-bold">No recent bills</div>}
                                </CardContent>
                            </Card>

                            <Card className="border-0 ring-1 ring-border/50 bg-card/20 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="text-lg font-black flex items-center gap-2">
                                        <Building2 className="text-indigo-500" size={20} /> QB Context
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-4">
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-black uppercase text-muted-foreground">REALM ID</div>
                                        <div className="text-xs font-mono font-bold text-indigo-400 bg-white/[0.03] p-3 rounded-xl border border-white/5">{qbStatus?.realmId || "N/A"}</div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-[9px] font-black uppercase text-muted-foreground">STATUS</span>
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-0 px-2 py-0">LIVE SYNC</Badge>
                                    </div>
                                    <div className="pt-4 flex flex-col gap-2">
                                        <Button
                                            variant="default"
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 h-10 rounded-xl font-bold text-xs text-white"
                                            onClick={() => window.open('https://app.qbo.intuit.com/app/homepage', '_blank')}
                                        >
                                            Goto QBO
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" className="w-full text-rose-500 hover:bg-rose-500/10 h-10 rounded-xl font-bold text-xs">
                                                    Disconnect
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="rounded-[2rem] border-0 ring-1 ring-border/50 bg-card/95 backdrop-blur-xl">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-xl font-black">Disconnect QuickBooks?</AlertDialogTitle>
                                                    <AlertDialogDescription className="font-medium">
                                                        This will stop the real-time sync and remove access to your financial metrics from the Accounting Hub. You can reconnect at any time.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="gap-2 sm:gap-0">
                                                    <AlertDialogCancel className="rounded-xl border-border font-bold">Stay Connected</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold border-0"
                                                        onClick={() => {
                                                            api.post('/quickbooks/disconnect', {}, {
                                                                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                                                            }).then(() => {
                                                                toast.success("Disconnected successfully");
                                                                queryClient.invalidateQueries();
                                                            }).catch(() => {
                                                                toast.error("Failed to disconnect");
                                                            });
                                                        }}
                                                    >
                                                        Disconnect Now
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="invoices" className="mt-0">
                    <DataTable
                        data={getFilteredData(invoices)}
                        loading={isInvoicesLoading}
                        type="Invoice"
                        fmt={fmt}
                        theme={theme}
                        onViewPdf={(id) => handleViewPdf('Invoice', id)}
                        onViewJson={(id) => handleViewJson('Invoice', id)}
                    />
                </TabsContent>

                <TabsContent value="estimates" className="mt-0">
                    <DataTable
                        data={getFilteredData(estimates)}
                        loading={isEstimatesLoading}
                        type="Estimate"
                        fmt={fmt}
                        theme={theme}
                        onViewPdf={(id) => handleViewPdf('Estimate', id)}
                        onViewJson={(id) => handleViewJson('Estimate', id)}
                    />
                </TabsContent>

                <TabsContent value="payments" className="mt-0">
                    <DataTable
                        data={getFilteredData(payments)}
                        loading={isPaymentsLoading}
                        type="Payment"
                        fmt={fmt}
                        theme={theme}
                    />
                </TabsContent>

                <TabsContent value="expenses" className="mt-0">
                    <DataTable
                        data={getFilteredData(expenses)}
                        loading={isExpensesLoading}
                        type="Expense"
                        fmt={fmt}
                        theme={theme}
                    />
                </TabsContent>

                <TabsContent value="customers" className="mt-0">
                    <DataTable
                        data={getFilteredData(customers)}
                        loading={isCustomersLoading}
                        type="Customer"
                        fmt={fmt}
                        theme={theme}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

const DataTable = ({ data, loading, type, fmt, theme, onViewPdf, onViewJson }: { data: any[], loading: boolean, type: string, fmt: (v: number) => string, theme: string, onViewPdf?: (id: string) => void, onViewJson?: (id: string) => void }) => {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                ))}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-64 rounded-[2.5rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground gap-3">
                <FileText size={32} />
                <p className="font-black">No {type}s found in QuickBooks</p>
            </div>
        );
    }

    return (
        <Card className="border-0 ring-1 ring-border/50 bg-card/20 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border/50 bg-white/[0.02]">
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">ENTITY</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">DATE</th>
                            {type !== 'Customer' && <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">AMOUNT</th>}
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">STATUS</th>
                            {(type === 'Invoice' || type === 'Estimate') && <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">ACTIONS</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {data.map((item: any) => (
                            <tr key={item.Id} className="group hover:bg-white/[0.03] transition-all">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${type === 'Invoice' ? 'bg-indigo-500/10 text-indigo-500' :
                                                type === 'Estimate' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    type === 'Expense' ? 'bg-rose-500/10 text-rose-500' :
                                                        'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {type.slice(0, 1)}
                                        </div>
                                        <div>
                                            <div className="font-black text-sm">{item.DisplayName || item.DocNumber || item.CustomerRef?.name || item.Id}</div>
                                            {item.CustomerRef?.name && <div className="text-xs text-muted-foreground font-bold">{item.CustomerRef.name}</div>}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 font-bold text-sm text-muted-foreground">
                                    {item.TxnDate || (item.MetaData?.CreateTime ? new Date(item.MetaData.CreateTime).toLocaleDateString() : 'N/A')}
                                </td>
                                {type !== 'Customer' && (
                                    <td className="p-6 text-right font-black text-sm">
                                        {fmt(item.TotalAmt || item.Amount || 0)}
                                    </td>
                                )}
                                <td className="p-6 text-center">
                                    <Badge variant="outline" className={`rounded-lg uppercase text-[10px] font-black tracking-widest px-3 py-1 ${(item.Balance === 0 || item.TotalAmt > 0) ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                        }`}>
                                        {type === 'Invoice' ? (item.Balance === 0 ? 'PAID' : 'OPEN') : 'PROCESSED'}
                                    </Badge>
                                </td>
                                <td className="p-6 text-right">
                                    {(type === 'Invoice' || type === 'Estimate') && (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-9 px-3 rounded-xl text-[10px] font-black tracking-widest uppercase border-border/50"
                                                onClick={() => onViewJson?.(item.Id)}
                                            >
                                                JSON
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="h-9 px-3 rounded-xl text-[10px] font-black tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                                                onClick={() => onViewPdf?.(item.Id)}
                                            >
                                                <ExternalLink size={12} className="mr-2 text-white" /> PDF
                                            </Button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default AccountingHubView;
