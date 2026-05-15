import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    DollarSign,
    TrendingUp,
    FileText,
    CreditCard,
    Save,
    AlertTriangle,
    RefreshCw,
    Calculator,
    LineChart,
    Briefcase,
    Building2,
    ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Reusable Currency Input Component
const CurrencyInput = ({ value, onChange, label, className = "" }: { value: number, onChange: (val: number) => void, label: string, className?: string }) => {
    const { theme } = useTheme();
    const [displayValue, setDisplayValue] = useState("");

    useEffect(() => {
        const numericCurrent = parseFloat(displayValue.replace(/[^0-9.-]+/g, ""));
        if (value !== numericCurrent && !(isNaN(numericCurrent) && !value)) {
            if (value) {
                setDisplayValue(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value));
            } else {
                setDisplayValue("");
            }
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const numberPart = raw.replace(/[^0-9.]/g, '');

        if (numberPart === '') {
            setDisplayValue("");
            onChange(0);
            return;
        }

        const parts = numberPart.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const formatted = "$" + parts.join('.');

        setDisplayValue(formatted);
        onChange(parseFloat(numberPart));
    };

    return (
        <div className="space-y-2">
            <Label className={theme === 'dark' ? 'text-indigo-400 font-semibold uppercase tracking-wider text-[10px]' : 'text-slate-500 font-semibold uppercase tracking-wider text-[10px]'}>{label}</Label>
            <Input
                type="text"
                value={displayValue}
                onChange={handleChange}
                placeholder="$0"
                className={`transition-all h-11 rounded-xl font-semibold ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-indigo-500' : 'bg-white border-gray-200 text-slate-900 focus:border-indigo-600 shadow-sm'} ${className}`}
            />
        </div>
    );
};

const FinancialsTab = () => {
    const { theme } = useTheme();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [financials, setFinancials] = useState<any>({});
    const [initialized, setInitialized] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch Job Data
    const { data: jobData, isLoading: isJobLoading } = useQuery({
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

    // Initialize local state
    useEffect(() => {
        if (job && job.financials && !initialized) {
            setFinancials(JSON.parse(JSON.stringify(job.financials)));
            setInitialized(true);
        } else if (job && !job.financials && !initialized) {
            // Default Structure
            setFinancials({
                revenue: {},
                costs: {},
                profitMetrics: {},
                receivables: { lienRights: { status: "Not Started", deadline: "" } },
                quickbooks: { connected: false }
            });
            setInitialized(true);
        }
    }, [job, initialized]);

    // Mutation to update financials
    const updateMutation = useMutation({
        mutationFn: async (updatedFinancials: any) => {
            setIsSaving(true);
            const token = localStorage.getItem("token");
            return await api.put(`/jobs/${id}`, { financials: updatedFinancials }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["job", id] });
            setTimeout(() => {
                setIsSaving(false);
                toast.success("Financials updated successfully");
            }, 600); // Artificial delay to make savings smooth
        },
        onError: () => {
            setIsSaving(false);
            toast.error("Failed to update financials");
        }
    });

    const handleChange = (section: string, field: string, value: any) => {
        const newFinancials = { ...financials };
        if (!newFinancials[section]) newFinancials[section] = {};

        newFinancials[section][field] = value;
        recalculateTotals(newFinancials);
        setFinancials(newFinancials);
    };

    const handleNestedChange = (section: string, subSection: string, field: string, value: any) => {
        const newFinancials = { ...financials };
        if (!newFinancials[section]) newFinancials[section] = {};
        if (!newFinancials[section][subSection]) newFinancials[section][subSection] = {};

        newFinancials[section][subSection][field] = value;
        setFinancials(newFinancials);
    }

    const recalculateTotals = (data: any) => {
        // Revenue Totals
        const rev = data.revenue || {};
        const totalEstimates = rev.totalEstimates || 0;
        const approvedEstimate = rev.approvedEstimate || 0;
        const supplements = rev.supplements || 0;
        const changeOrders = rev.changeOrders || 0;

        // Total Revenue sum
        const totalRevenue = approvedEstimate + supplements + changeOrders;
        if (data.revenue) data.revenue.totalRevenue = totalRevenue;

        // Invoicing Totals
        const invSub = rev.invoicedSubtotal || 0;
        const tax = rev.tax || 0;
        const totalInv = invSub + tax;
        if (data.revenue) data.revenue.totalInvoiced = totalInv;

        // Cost Totals
        const costs = data.costs || {};
        const totalJobCost = (costs.labor || 0) + (costs.materials || 0) + (costs.subtrade || 0) + (costs.equipment || 0);
        if (data.costs) data.costs.totalCost = totalJobCost;

        // Profit Metrics calculations
        const estimatedGP = totalEstimates > 0 ? totalEstimates - totalJobCost : 0;
        const actualGP = totalRevenue - totalJobCost;
        const workingGP = totalInv - totalJobCost;

        if (!data.profitMetrics) data.profitMetrics = {};
        data.profitMetrics.estimatedGP = estimatedGP;
        data.profitMetrics.estimatedGPPercent = totalEstimates > 0 ? (estimatedGP / totalEstimates) * 100 : 0;

        data.profitMetrics.actualGP = actualGP;
        data.profitMetrics.actualGPPercent = totalRevenue > 0 ? (actualGP / totalRevenue) * 100 : 0;

        data.profitMetrics.workingGP = workingGP;
        data.profitMetrics.workingGPPercent = totalInv > 0 ? (workingGP / totalInv) * 100 : 0;

        // AR
        const receivables = data.receivables || {};
        const totalCollected = receivables.totalCollected || 0;
        const balanceOwing = totalInv - totalCollected;

        if (data.receivables) data.receivables.balanceOwing = balanceOwing;
    };

    if (isJobLoading || !initialized) return <Skeleton className="w-full h-[600px]" />;

    // Helper to format currency
    const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val || 0);
    const pct = (val: number) => `${(val || 0).toFixed(1)}%`;

    return (
        <div className="space-y-8 pb-20">

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h2 className={`text-4xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Financials & Accounting</h2>
                    <p className="text-muted-foreground mt-1">Manage monetary metrics, costing, and QuickBooks links.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => updateMutation.mutate(financials)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 transition-all h-11 px-8 rounded-xl font-semibold hover:scale-[1.02] active:scale-95"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>


                    <div className="space-y-6 mt-0">
                    {/* Top KPI Summary Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden transition-all hover:scale-[1.02]`}>
                            <CardHeader className="pb-1">
                                <CardTitle className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`}>Total Approved Revenue</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    {fmt(financials.revenue?.totalRevenue)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden transition-all hover:scale-[1.02]`}>
                            <CardHeader className="pb-1">
                                <CardTitle className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`}>Total Job Cost</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    {fmt(financials.costs?.totalCost)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-indigo-950/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-indigo-600 ring-indigo-500 shadow-indigo-500/20 shadow-xl'} rounded-2xl overflow-hidden transition-all hover:scale-[1.02]`}>
                            <CardHeader className="pb-1">
                                <CardTitle className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-indigo-400' : 'text-white/80'}`}>Actual GP</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="flex items-baseline gap-2">
                                    <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-white'}`}>
                                        {fmt(financials.profitMetrics?.actualGP)}
                                    </div>
                                    <div className={`text-xs py-1 px-2 font-bold rounded-lg ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/20 text-white'}`}>
                                        {pct(financials.profitMetrics?.actualGPPercent)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-emerald-950/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-emerald-600 ring-emerald-500 shadow-emerald-500/20 shadow-xl'} rounded-2xl overflow-hidden transition-all hover:scale-[1.02]`}>
                            <CardHeader className="pb-1">
                                <CardTitle className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-emerald-400' : 'text-white/80'}`}>Total Collected</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="flex items-baseline justify-between w-full">
                                    <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-white'}`}>
                                        {fmt(financials.receivables?.totalCollected)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Left Column: Revenue & Invoicing */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Revenue Tracker */}
                            <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden`}>
                                <CardHeader className={`border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-gray-50/50'}`}>
                                    <CardTitle className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                                        <DollarSign className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} /> Revenue & Estimates
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                        <CurrencyInput
                                            label="Total Estimates"
                                            value={financials.revenue?.totalEstimates}
                                            onChange={(v) => handleChange("revenue", "totalEstimates", v)}
                                        />
                                        <CurrencyInput
                                            label="Approved Estimate Value"
                                            value={financials.revenue?.approvedEstimate}
                                            onChange={(v) => handleChange("revenue", "approvedEstimate", v)}
                                            className={`${theme === 'dark' ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-indigo-200 bg-indigo-50/50'} text-indigo-600 font-bold`}
                                        />
                                        <CurrencyInput
                                            label="Supplements"
                                            value={financials.revenue?.supplements}
                                            onChange={(v) => handleChange("revenue", "supplements", v)}
                                        />
                                        <CurrencyInput
                                            label="Change Orders"
                                            value={financials.revenue?.changeOrders}
                                            onChange={(v) => handleChange("revenue", "changeOrders", v)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Invoicing Section */}
                            <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden`}>
                                <CardHeader className={`border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-gray-50/50'}`}>
                                    <CardTitle className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                                        <FileText className={`h-5 w-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} /> Invoicing & AR
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                        <CurrencyInput
                                            label="Invoiced Subtotal"
                                            value={financials.revenue?.invoicedSubtotal}
                                            onChange={(v) => handleChange("revenue", "invoicedSubtotal", v)}
                                        />
                                        <CurrencyInput
                                            label="Tax"
                                            value={financials.revenue?.tax}
                                            onChange={(v) => handleChange("revenue", "tax", v)}
                                        />
                                        <div className="space-y-2">
                                            <Label className={`text-[10px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`}>Total Invoiced</Label>
                                            <div className={`h-11 px-4 py-2 border rounded-xl font-bold flex items-center text-xl shadow-inner ${theme === 'dark' ? 'bg-black/50 border-white/5 text-white' : 'bg-gray-50 border-gray-100 text-slate-900'}`}>
                                                {fmt(financials.revenue?.totalInvoiced)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`h-px w-full mb-8 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`} />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <CurrencyInput
                                            label="Total Collected"
                                            value={financials.receivables?.totalCollected}
                                            onChange={(v) => handleChange("receivables", "totalCollected", v)}
                                            className={`${theme === 'dark' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' : 'text-emerald-600 border-emerald-100 bg-emerald-50/50'} font-bold`}
                                        />
                                        <CurrencyInput
                                            label="Deductible"
                                            value={financials.receivables?.deductible}
                                            onChange={(v) => handleChange("receivables", "deductible", v)}
                                        />
                                        <div className="space-y-2">
                                            <Label className={`text-[10px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`}>Balance Owing</Label>
                                            <div className={`h-11 px-4 py-2 border rounded-xl font-bold flex items-center text-xl shadow-inner transition-all ${(financials.receivables?.balanceOwing || 0) > 0
                                                ? theme === 'dark' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-100 text-amber-600'
                                                : theme === 'dark' ? 'bg-black/50 border-white/5 text-gray-500' : 'bg-gray-50 border-gray-100 text-gray-400'
                                                }`}>
                                                {fmt(financials.receivables?.balanceOwing)}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Costing & Profit Metrics & Lien */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Costing Section */}
                            <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden`}>
                                <CardHeader className={`border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-gray-50/50'}`}>
                                    <CardTitle className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                                        <CreditCard className={`h-5 w-5 ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`} /> Costing
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="grid grid-cols-2 gap-8 mb-8">
                                        <CurrencyInput
                                            label="Labor Cost"
                                            value={financials.costs?.labor}
                                            onChange={(v) => handleChange("costs", "labor", v)}
                                        />
                                        <CurrencyInput
                                            label="Materials Cost"
                                            value={financials.costs?.materials}
                                            onChange={(v) => handleChange("costs", "materials", v)}
                                        />
                                        <CurrencyInput
                                            label="Subtrade Cost"
                                            value={financials.costs?.subtrade}
                                            onChange={(v) => handleChange("costs", "subtrade", v)}
                                        />
                                        <CurrencyInput
                                            label="Equipment Cost"
                                            value={financials.costs?.equipment}
                                            onChange={(v) => handleChange("costs", "equipment", v)}
                                        />
                                    </div>
                                    <div className={`mt-4 pt-6 border-t ${theme === 'dark' ? 'border-white/5 bg-black/30' : 'border-gray-100 bg-gray-50/50'} p-6 rounded-2xl flex justify-between items-center shadow-inner`}>
                                        <span className={`font-semibold tracking-[0.2em] text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>TOTAL JOB COST</span>
                                        <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`}>{fmt(financials.costs?.totalCost)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Progress / Profit Dashboard */}
                            <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden`}>
                                <CardHeader className={`border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-gray-50/50'}`}>
                                    <CardTitle className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                                        <LineChart className={`h-5 w-5 ${theme === 'dark' ? 'text-fuchsia-400' : 'text-fuchsia-600'}`} /> Profitability Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-indigo-600'}`}>Estimated GP</span>
                                                <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-indigo-950'}`}>{fmt(financials.profitMetrics?.estimatedGP)}</span>
                                            </div>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-lg ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-indigo-100 text-indigo-700'}`}>{pct(financials.profitMetrics?.estimatedGPPercent)}</span>
                                        </div>
                                        <Progress value={financials.profitMetrics?.estimatedGPPercent || 0} className={`h-2 shadow-inner ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`} indicatorClassName="bg-indigo-500" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-indigo-600'}`}>Working GP</span>
                                                <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-indigo-950'}`}>{fmt(financials.profitMetrics?.workingGP)}</span>
                                            </div>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-lg ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-amber-100 text-amber-700'}`}>{pct(financials.profitMetrics?.workingGPPercent)}</span>
                                        </div>
                                        <Progress value={financials.profitMetrics?.workingGPPercent || 0} className={`h-2 shadow-inner ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`} indicatorClassName="bg-amber-500" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Actual GP</span>
                                                <span className={`text-xl font-bold ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'}`}>{fmt(financials.profitMetrics?.actualGP)}</span>
                                            </div>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-lg ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>{pct(financials.profitMetrics?.actualGPPercent)}</span>
                                        </div>
                                        <Progress value={financials.profitMetrics?.actualGPPercent || 0} className={`h-2 shadow-inner ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`} indicatorClassName="bg-emerald-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Lien Rights Tracking */}
                            <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-amber-950/20 border-amber-500/20 ring-amber-500/10 shadow-2xl' : 'bg-white ring-amber-200 shadow-xl'} rounded-2xl overflow-hidden`}>
                                <CardHeader className={`border-b ${theme === 'dark' ? 'border-amber-500/10 bg-amber-500/[0.03]' : 'border-amber-100 bg-amber-50/50'}`}>
                                    <CardTitle className={`text-lg font-semibold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'} flex items-center gap-2`}>
                                        <AlertTriangle className="h-5 w-5" /> Lien Rights Tracking
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label className={`text-[10px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-amber-400/70' : 'text-amber-600'}`}>Status</Label>
                                            <Select
                                                value={financials.receivables?.lienRights?.status || "Not Started"}
                                                onValueChange={(val) => handleNestedChange("receivables", "lienRights", "status", val)}
                                            >
                                                <SelectTrigger className={`rounded-xl h-11 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-indigo-950 shadow-sm'} focus:ring-1 focus:ring-amber-500`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-gray-200 text-slate-900'} rounded-xl shadow-2xl`}>
                                                    <SelectItem value="Not Started" className="font-medium">Not Started</SelectItem>
                                                    <SelectItem value="Pre-Lien Sent" className="text-amber-600 font-bold">Pre-Lien Sent</SelectItem>
                                                    <SelectItem value="Lien Filed" className="text-rose-600 font-bold">Lien Filed</SelectItem>
                                                    <SelectItem value="Released" className="text-emerald-600 font-bold">Released</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={`text-[10px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-amber-400/70' : 'text-amber-600'}`}>Deadline</Label>
                                            <Input
                                                type="date"
                                                value={financials.receivables?.lienRights?.deadline ? new Date(financials.receivables.lienRights.deadline).toISOString().split('T')[0] : ""}
                                                onChange={(e) => handleNestedChange("receivables", "lienRights", "deadline", e.target.value)}
                                                className={`rounded-xl h-11 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white [color-scheme:dark]' : 'bg-white border-gray-200 text-indigo-950 shadow-sm'} focus:ring-1 focus:ring-orange-500`}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    </div>
        </div>
    );
};


export default FinancialsTab;
