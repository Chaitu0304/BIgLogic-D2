import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    DollarSign,
    FileText,
    CreditCard,
    RefreshCw,
    ExternalLink,
    Link2Off,
    CheckCircle2,
    Calendar,
    Plus,
    Trash2,
    TrendingDown,
    TrendingUp,
    Info,
    Search,
    Sparkles,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/services/api";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const QuickBooksJobTab = () => {
    const { theme } = useTheme();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [qbMetrics, setQbMetrics] = useState<any>(null);
    const [qbInvoices, setQbInvoices] = useState<any[]>([]);
    const [isLoadingQb, setIsLoadingQb] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSyncingEstimate, setIsSyncingEstimate] = useState(false);
    const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
    const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);

    // Expense Form State
    const [expenseForm, setExpenseForm] = useState({
        description: "",
        amount: "",
        category: "Materials",
        vendorName: ""
    });

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiInsights, setAiInsights] = useState<string | null>(null);

    // Fetch Job Data to get local sync state
    const { data: jobData } = useQuery({
        queryKey: ["job", id],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await api.get(`/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!id
    });

    const job = jobData?.job;
    const financials = job?.financials || {};

    // Check Global QuickBooks Connection Status
    const { data: qbStatus } = useQuery({
        queryKey: ['qbStatus'],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await api.get('/quickbooks/status', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    const fetchQuickBooksData = async () => {
        setIsLoadingQb(true);
        const token = localStorage.getItem("token");
        try {
            const [metricsRes, invoicesRes] = await Promise.all([
                api.get('/quickbooks/metrics', { headers: { Authorization: `Bearer ${token}` } }),
                api.get('/quickbooks/invoices?limit=10', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setQbMetrics(metricsRes.data.metrics);
            setQbInvoices(Array.isArray(invoicesRes.data.invoices) ? invoicesRes.data.invoices : []);
        } catch (error: any) {
            console.error("Error fetching QuickBooks data:", error);
        } finally {
            setIsLoadingQb(false);
        }
    };

    // Fetch Project Financial Summary (P&L) - NEW Phase 2
    const { data: financialSummary, isLoading: isLoadingSummary } = useQuery({
        queryKey: ["jobFinancials", id],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await api.get(`/quickbooks/jobs/${id}/financial-summary`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!id && !!qbStatus?.connected
    });

    const addExpenseMutation = useMutation({
        mutationFn: async (expenseData: any) => {
            const token = localStorage.getItem("token");
            return await api.post(`/quickbooks/jobs/${id}/expenses`, expenseData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobFinancials", id] });
            queryClient.invalidateQueries({ queryKey: ["job", id] });
            setShowAddExpenseDialog(false);
            setExpenseForm({ description: "", amount: "", category: "Materials", vendorName: "" });
            toast.success("Expense added and synced to QBO");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to add expense");
        }
    });

    const handleGetAIInsights = async () => {
        setIsAnalyzing(true);
        const token = localStorage.getItem("token");
        try {
            const res = await api.get(`/quickbooks/jobs/${id}/ai-insights`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAiInsights(res.data.insights);
            toast.success("AI Analysis Complete!");
        } catch (err: any) {
            const errMsg = err.response?.data?.message || "Failed to get AI insights";
            toast.error(errMsg);
        } finally {
            setIsAnalyzing(false);
        }
    };

    useEffect(() => {
        if (qbStatus?.connected) {
            fetchQuickBooksData();
        }
    }, [qbStatus?.connected]);

    const handleViewPdf = async (invoiceId: string) => {
        const token = localStorage.getItem("token");
        try {
            const res = await api.get(`/quickbooks/invoices/${invoiceId}/pdf`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            // ALWAYS open in a new tab as requested
            window.open(url, '_blank');
        } catch (error) {
            console.error("PDF Error", error);
            toast.error("Failed to view invoice PDF");
        }
    };

    const handleViewJson = async (invoiceId: string) => {
        const token = localStorage.getItem("token");
        try {
            const res = await api.get(`/quickbooks/invoices/${invoiceId}/json`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const jsonStr = JSON.stringify(res.data, null, 2);
            const x = window.open();
            if (x) {
                x.document.open();
                x.document.write(`<html><head><title>Raw QBO JSON - ${invoiceId}</title></head><body style="background:#111;color:#eee;"><pre>${jsonStr}</pre></body></html>`);
                x.document.close();
            }
        } catch (error) {
            toast.error("Failed to fetch raw JSON");
        }
    };

    const handleQuickBooksSync = async () => {
        setIsSyncing(true);
        const token = localStorage.getItem("token");

        if (!qbStatus?.connected) {
            setIsConnecting(true);
            try {
                const res = await api.get("/quickbooks/auth", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.url) {
                    const width = 600;
                    const height = 700;
                    const left = window.screenX + (window.outerWidth - width) / 2;
                    const top = window.screenY + (window.outerHeight - height) / 2;
                    const popup = window.open(res.data.url, 'QuickBooks Auth', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`);

                    const handlePopupMessage = (event: MessageEvent) => {
                        if (event.data?.type === 'qbo_success') {
                            window.removeEventListener('message', handlePopupMessage);
                            toast.success("QuickBooks Connected Successfully!");
                            queryClient.invalidateQueries({ queryKey: ['qbStatus'] });
                            fetchQuickBooksData();
                            setIsSyncing(false);
                            setIsConnecting(false);
                            if (popup && popup.closed !== false) popup.close();
                        } else if (event.data?.type === 'qbo_error') {
                            window.removeEventListener('message', handlePopupMessage);
                            toast.error("QuickBooks Connection Failed");
                            setIsSyncing(false);
                            setIsConnecting(false);
                        }
                    };
                    window.addEventListener('message', handlePopupMessage);
                }
            } catch (err: any) {
                toast.error("Failed to initiate connection");
                setIsSyncing(false);
                setIsConnecting(false);
            }
        } else {
            try {
                const res = await api.post(`/quickbooks/jobs/${id}/sync`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Invoice synced successfully!");
                queryClient.invalidateQueries({ queryKey: ["job", id] });
            } catch (err: any) {
                toast.error(err.response?.data?.message || "Failed to sync invoice");
            } finally {
                setIsSyncing(false);
            }
        }
    };

    const handleQuickBooksEstimateSync = async () => {
        if (!qbStatus?.connected) {
            handleQuickBooksSync();
            return;
        }
        setIsSyncingEstimate(true);
        const token = localStorage.getItem("token");
        try {
            const res = await api.post(`/quickbooks/jobs/${id}/sync-estimate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Estimate synced successfully!");
            queryClient.invalidateQueries({ queryKey: ["job", id] });
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to sync estimate");
        } finally {
            setIsSyncingEstimate(false);
        }
    };

    const disconnectMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("token");
            return await api.post('/quickbooks/disconnect', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['qbStatus'] });
            toast.success("Disconnected from QuickBooks");
            setShowDisconnectDialog(false);
        }
    });

    const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val || 0);

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

    if (isLoadingQb) return <div className="p-20 flex flex-col items-center gap-4"><RefreshCw className="animate-spin h-8 w-8 text-emerald-500" /><p>Fetching live data...</p></div>;

    if (!qbStatus?.connected) {
        return (
            <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#0A0A0A] ring-white/10' : 'bg-white ring-gray-200'} rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col items-center justify-center p-12 py-24 text-center`}>
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8">
                    <CreditCard className="w-12 h-12 text-emerald-500" />
                </div>
                <h3 className={`text-3xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Connect QuickBooks</h3>
                <p className={`max-w-md mb-10 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                    Authorize QuickBooks Online to sync invoices and estimates for this job directly to your accounting software.
                </p>
                <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20 px-10 py-7 text-xl font-black rounded-2xl"
                    onClick={handleQuickBooksSync}
                    disabled={isSyncing || isConnecting}
                >
                    <RefreshCw className={`mr-3 h-6 w-6 ${isSyncing || isConnecting ? "animate-spin" : ""}`} />
                    {isConnecting ? "Connecting..." : "Connect QuickBooks Online"}
                </Button>
            </Card>
        );
    }

    const totalIncome = getReportValue(qbMetrics?.profitAndLoss, "Total Income");
    const totalExpenses = getReportValue(qbMetrics?.profitAndLoss, "Total Expenses");
    const netIncome = getReportValue(qbMetrics?.profitAndLoss, "Net Income");

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Sync Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className={`text-2xl font-black flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                        QuickBooks Sync
                        {financials.quickbooks?.syncStatus && (
                            <Badge className={`ml-2 uppercase tracking-tighter text-[9px] px-2 py-0.5 font-black border-2 ${
                                financials.quickbooks.syncStatus === 'synced' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                financials.quickbooks.syncStatus === 'failed' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            }`}>
                                {financials.quickbooks.syncStatus}
                            </Badge>
                        )}
                    </h3>
                    <p className="text-muted-foreground font-bold text-sm tracking-wide ml-10">Job ID: {job?.jobId}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="rounded-xl font-bold text-xs uppercase tracking-widest h-12 px-6"
                        onClick={handleQuickBooksEstimateSync}
                        disabled={isSyncingEstimate}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isSyncingEstimate ? "animate-spin" : ""}`} />
                        {financials.quickbooks?.lastEstimateId ? "Update Estimate" : "Sync Estimate"}
                    </Button>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest h-12 px-6 shadow-lg shadow-indigo-500/20"
                        onClick={handleQuickBooksSync}
                        disabled={isSyncing}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                        {financials.quickbooks?.syncStatus === 'synced' ? "Update Invoice" : "Sync Invoice"}
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-rose-500 hover:bg-rose-500/10 rounded-xl font-bold text-xs uppercase tracking-widest h-12 px-6"
                        onClick={() => setShowDisconnectDialog(true)}
                    >
                        <Link2Off className="h-4 w-4 mr-2" /> Disconnect
                    </Button>
                </div>
            </div>

            {/* Financial Summary (Mini) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 ring-white/5' : 'bg-white ring-gray-200'} rounded-3xl overflow-hidden`}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pt-2">Company Income (YTD)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-emerald-500">{fmt(totalIncome)}</div>
                    </CardContent>
                </Card>
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 ring-white/5' : 'bg-white ring-gray-200'} rounded-3xl overflow-hidden`}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pt-2">Company Expenses (YTD)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-rose-500">{fmt(totalExpenses)}</div>
                    </CardContent>
                </Card>
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 ring-white/5' : 'bg-white ring-gray-200'} rounded-3xl overflow-hidden`}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pt-2">Company Net Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{fmt(netIncome)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Phase 2: Project Financial Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-indigo-500/5 ring-indigo-500/10' : 'bg-indigo-50/30 ring-indigo-500/10'} rounded-[2.5rem] overflow-hidden`}>
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-indigo-500" /> Project Profitability
                        </CardTitle>
                        <CardDescription className="font-bold">Real-time Margin Analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="flex items-end gap-6 mb-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">PROFIT</p>
                                <div className={`text-4xl font-black ${financialSummary?.profit >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                    {fmt(financialSummary?.profit)}
                                </div>
                            </div>
                            <Badge className={`mb-1 px-4 py-1.5 rounded-xl font-black text-xs ${financialSummary?.margin >= 30 ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                                {financialSummary?.margin.toFixed(1)}% MARGIN
                            </Badge>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className={theme === 'dark' ? "text-gray-400" : "text-slate-500"}>Project Revenue (Invoiced)</span>
                                <span className={theme === 'dark' ? "text-white" : "text-slate-900"}>{fmt(financialSummary?.revenue)}</span>
                            </div>
                            <Separator className="bg-indigo-500/10" />
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className={theme === 'dark' ? "text-gray-400" : "text-slate-500"}>Total Project Expenses</span>
                                <span className="text-rose-500">{fmt(financialSummary?.expenses)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Expense Breakdown */}
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 ring-white/5' : 'bg-white ring-gray-200'} rounded-[2.5rem] overflow-hidden`}>
                    <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black">Expense Items</CardTitle>
                            <CardDescription className="font-bold">Itemized Costs synced to QBO</CardDescription>
                        </div>
                        <Button 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest px-4"
                            onClick={() => setShowAddExpenseDialog(true)}
                        >
                            <Plus className="h-4 w-4 mr-1" /> Add Expense
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar ml-8 mr-8 mb-8">
                            <table className="w-full text-left">
                                <thead className={`text-[9px] font-black uppercase tracking-widest sticky top-0 ${theme === 'dark' ? 'bg-[#0A0A0A]' : 'bg-white'} text-muted-foreground z-10`}>
                                    <tr className="border-b border-border/50">
                                        <th className="py-3">Description</th>
                                        <th className="py-3">Cat</th>
                                        <th className="py-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    {financialSummary?.breakdown?.map((exp: any) => (
                                        <tr key={exp._id} className="text-[12px] font-bold">
                                            <td className="py-3 max-w-[150px] truncate">{exp.description}</td>
                                            <td className="py-3 px-1">
                                                <Badge variant="outline" className="text-[8px] px-1 py-0 border-indigo-500/30 text-indigo-500">{exp.category}</Badge>
                                            </td>
                                            <td className={`py-3 text-right ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{fmt(exp.amount)}</td>
                                        </tr>
                                    ))}
                                    {!financialSummary?.breakdown?.length && (
                                        <tr>
                                            <td colSpan={3} className="py-10 text-center text-muted-foreground font-bold italic">No itemized expenses yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Phase 4: Gemini AI Financial Advisor */}
            <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-emerald-500/5 ring-emerald-500/10' : 'bg-emerald-50/30 ring-emerald-500/10'} rounded-[2.5rem] overflow-hidden`}>
                <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-emerald-500 animate-pulse" /> Gemini AI Financial Advisor
                        </CardTitle>
                        <CardDescription className="font-bold">Automated project health & cost analysis</CardDescription>
                    </div>
                    {!aiInsights && (
                        <Button 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest px-6 h-12 shadow-lg shadow-emerald-500/20"
                            onClick={handleGetAIInsights}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Zap className="h-4 w-4 mr-2" />
                            )}
                            {isAnalyzing ? "Analyzing..." : "Scan Financials"}
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="p-8 pt-0">
                    {aiInsights ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className={`p-8 rounded-[2rem] ${theme === 'dark' ? 'bg-black/40 ring-1 ring-white/5' : 'bg-white shadow-inner'} overflow-hidden`}>
                                <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:font-medium prose-p:leading-relaxed prose-li:font-bold prose-strong:text-emerald-500">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {aiInsights}
                                    </ReactMarkdown>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-emerald-500" onClick={() => setAiInsights(null)}>
                                    Refresh Analysis
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                <Sparkles className="h-8 w-8 text-emerald-500 opacity-50" />
                            </div>
                            <p className="text-muted-foreground font-bold max-w-sm text-sm">
                                Let Gemini analyze your project categories, revenue, and expenses to find hidden risks or cost-saving opportunities.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Invoices Table */}
            <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-[2.5rem] overflow-hidden`}>
                <CardHeader className={`p-8 border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-gray-50/50'}`}>
                    <CardTitle className="text-xl font-black flex items-center gap-3">
                        <FileText className="h-6 w-6 text-indigo-500" /> Recent QBO Invoices
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/[0.01] text-gray-500 border-white/5' : 'bg-gray-50/50 text-slate-500 border-gray-100'} border-b`}>
                                <tr>
                                    <th className="px-8 py-6">Invoice #</th>
                                    <th className="px-8 py-6">Customer</th>
                                    <th className="px-8 py-6">Date</th>
                                    <th className="px-8 py-6 text-right">Amount</th>
                                    <th className="px-8 py-6 text-center">Status</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
                                {qbInvoices.map((inv) => (
                                    <tr key={inv.Id} className="hover:bg-indigo-500/[0.02] transition-colors">
                                        <td className={`px-8 py-6 font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{inv.DocNumber || inv.Id}</td>
                                        <td className="px-8 py-6 font-bold text-muted-foreground">{inv.CustomerRef?.name || 'Unknown'}</td>
                                        <td className="px-8 py-6 font-bold text-muted-foreground">{inv.TxnDate}</td>
                                        <td className={`px-8 py-6 text-right font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{fmt(inv.TotalAmt)}</td>
                                        <td className="px-8 py-6 text-center">
                                            <Badge className={`rounded-lg px-3 py-1 font-black tracking-widest text-[10px] ${inv.Balance === 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                                {inv.Balance === 0 ? "PAID" : "OPEN"}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 px-4 rounded-xl text-[10px] font-black tracking-widest uppercase border-border/50"
                                                    onClick={() => handleViewJson(inv.Id)}
                                                >
                                                    JSON
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    className="h-9 px-4 rounded-xl text-[10px] font-black tracking-widest uppercase bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                                                    onClick={() => handleViewPdf(inv.Id)}
                                                >
                                                    <ExternalLink className="h-3 w-3 mr-2 text-white" /> PDF
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
                <DialogContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-gray-200 text-slate-900 shadow-2xl'} rounded-3xl overflow-hidden max-w-md`}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-2xl font-black text-rose-500">
                            <Link2Off className="h-6 w-6" /> Disconnect QuickBooks?
                        </DialogTitle>
                        <DialogDescription className="pt-4 font-bold text-muted-foreground leading-relaxed">
                            Are you sure you want to disconnect? You will need to re-authenticate later to sync new data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-10">
                        <Button variant="ghost" onClick={() => setShowDisconnectDialog(false)} className="rounded-xl font-bold">Cancel</Button>
                        <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-8 font-black shadow-lg shadow-rose-500/20" onClick={() => disconnectMutation.mutate()}>
                            Yes, Disconnect
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Expense Dialog */}
            <Dialog open={showAddExpenseDialog} onOpenChange={setShowAddExpenseDialog}>
                <DialogContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#121212] ring-white/10 text-white' : 'bg-white ring-gray-200 text-slate-900 shadow-2xl'} rounded-[2.5rem] overflow-hidden max-w-lg`}>
                    <DialogHeader className="p-4">
                        <DialogTitle className="flex items-center gap-3 text-2xl font-black">
                            <Plus className="h-6 w-6 text-emerald-500" /> Sync New Expense
                        </DialogTitle>
                        <DialogDescription className="font-bold">Creates a Bill in QuickBooks associated with this Job.</DialogDescription>
                    </DialogHeader>
                    <div className="p-4 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Category</Label>
                                <Select value={expenseForm.category} onValueChange={(val) => setExpenseForm({...expenseForm, category: val})}>
                                    <SelectTrigger className="rounded-xl font-bold h-12 border-border/50">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border/50">
                                        <SelectItem value="Materials">Materials</SelectItem>
                                        <SelectItem value="Labor">Labor</SelectItem>
                                        <SelectItem value="Travel">Travel</SelectItem>
                                        <SelectItem value="Equipment">Equipment</SelectItem>
                                        <SelectItem value="Subcontractor">Subcontractor</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Amount ($)</Label>
                                <Input 
                                    type="number" 
                                    className="rounded-xl font-bold h-12 border-border/50" 
                                    placeholder="0.00"
                                    value={expenseForm.amount}
                                    onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Vendor / Payee Name</Label>
                            <Input 
                                className="rounded-xl font-bold h-12 border-border/50" 
                                placeholder="e.g. Home Depot, John Smith"
                                value={expenseForm.vendorName}
                                onChange={(e) => setExpenseForm({...expenseForm, vendorName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Description</Label>
                            <Input 
                                className="rounded-xl font-bold h-12 border-border/50" 
                                placeholder="Refractory bricks for site..."
                                value={expenseForm.description}
                                onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                            />
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setShowAddExpenseDialog(false)} className="rounded-xl font-bold px-6">Cancel</Button>
                            <Button 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-10 font-black shadow-xl shadow-indigo-500/20 h-12"
                                onClick={() => addExpenseMutation.mutate(expenseForm)}
                                disabled={addExpenseMutation.isPending || !expenseForm.amount || !expenseForm.description}
                            >
                                {addExpenseMutation.isPending ? "Syncing..." : "Sync to QuickBooks"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default QuickBooksJobTab;
