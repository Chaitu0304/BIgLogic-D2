import { ReactNode } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DatabaseLayout from "@/components/layouts/DatabaseLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Calendar,
    FileText,
    Calculator,
    StickyNote,
    Image as ImageIcon,
    DollarSign,
    ArrowLeft,
    Clock,
    MapPin,
    AlertCircle,
    Users,
    ShieldCheck,
    CreditCard,
    X
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2 } from "lucide-react";
import api from "@/services/api";
import { useTheme } from "@/components/ThemeProvider";
import JobChatWidget from "@/components/JobChatWidget";

interface JobLayoutProps {
    children: ReactNode;
}

const JobLayout = ({ children }: JobLayoutProps) => {
    const { theme } = useTheme();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { data: jobData, isLoading } = useQuery({
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
    const documents = jobData?.documents || [];

    // Derive metrics for the AI - aligning with JobList and checkJobCompliance logic
    const getBottleneckLabel = (job: any) => {
        if (!job?.phaseDurations || ['Closed', 'Cancelled'].includes(job.status)) return "None reported";

        if (job.phaseDurations.scoping > 7) return `Scoping (${job.phaseDurations.scoping}d > 7d limit)`;
        if (job.phaseDurations.intake > 5) return `Intake (${job.phaseDurations.intake}d > 5d limit)`;
        if (job.phaseDurations.production > 14) return `Production (${job.phaseDurations.production}d > 14d limit)`;

        // Status based fallbacks
        if (job.status === 'inspecting') return 'Awaiting Inspection Report';
        if (job.status === 'Estimating') return 'Finalizing line items';
        if (job.status === 'Production') return 'Scheduling Subcontractors';

        return "None reported";
    };

    const getComplianceNeeded = (docs: any[]) => {
        const requiredCategories = ['Contract', 'Estimate', 'Invoice', 'Change Order', 'Permit', 'Report'];
        const uploadedCategories = docs.map(d => d.category);
        const missing = requiredCategories.filter(cat => !uploadedCategories.includes(cat));
        return missing.length > 0 ? missing.join(', ') : 'All required documents uploaded';
    };

    const metrics = {
        bottleneck: getBottleneckLabel(job),
        cycle_time: `${job?.cycleTime || 0} days`,
        documents_needed: getComplianceNeeded(documents)
    };

    const tabs = [
        { id: "dates", label: "Dates", icon: Calendar, path: `/jobs/list/${id}/dates` },
        { id: "participants", label: "Participants", icon: Users, path: `/jobs/list/${id}/participants` },
        { id: "documents", label: "Documents", icon: FileText, path: `/jobs/list/${id}/documents` },
        { id: "photos", label: "Photos", icon: ImageIcon, path: `/jobs/list/${id}/photos` },
        { id: "estimates", label: "Estimates", icon: Calculator, path: `/jobs/list/${id}/estimates` },
        { id: "notes", label: "Notes", icon: StickyNote, path: `/jobs/list/${id}/notes` },
        { id: "accounting", label: "Financials", icon: DollarSign, path: `/jobs/list/${id}/accounting` },
        { id: "quickbooks", label: "QuickBooks", icon: CreditCard, path: `/jobs/list/${id}/quickbooks` },
    ];

    const currentTab = tabs.find(t => location.pathname.includes(t.id))?.id || "overview";

    if (isLoading) {
        return (

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>

        );
    }

    if (!job) {
        return (

            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <h2 className="text-xl font-bold text-white">Job Not Found</h2>
                <Button onClick={() => navigate("/jobs")} variant="outline">Return to Jobs</Button>
            </div>

        )
    }

    return (
        // <DatabaseLayout>
        <div>
            <div className="flex flex-col gap-6">
                {/* Back Navigation */}
                <div>
                    <Button variant="ghost" className={`pl-0 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500 hover:text-indigo-600'} px-2 font-medium`} onClick={() => navigate("/jobs/list")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs List
                    </Button>
                </div>

                {/* Persistent Job Header */}
                <div className={`relative overflow-hidden group border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl p-6 transition-all`}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/jobs")}
                        className="absolute top-4 right-4 z-20 h-8 w-8 rounded-full hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground transition-all"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    {/* Ambient Glow */}
                    <div className={`absolute top-0 right-0 w-64 h-64 ${theme === 'dark' ? 'bg-indigo-600/10' : 'bg-indigo-500/5'} blur-[80px] rounded-full pointer-events-none group-hover:scale-110 transition-all duration-700`} />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-slate-50'} ring-1 ${theme === 'dark' ? 'ring-indigo-500/20' : 'ring-slate-100'}`}>
                                    <ShieldCheck className={`h-6 w-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h1 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{job.jobId}</h1>
                                        <Badge className={`rounded-lg py-1 px-3 font-semibold border-0 ring-1 ${job.priority === 'Critical' ? 'bg-rose-500/10 ring-rose-500/30 text-rose-500' :
                                            job.priority === 'High' ? 'bg-orange-500/10 ring-orange-500/30 text-orange-500' :
                                                'bg-indigo-500/10 ring-indigo-500/30 text-indigo-400'
                                            }`}>
                                            {job.priority} Priority
                                        </Badge>
                                        <EditJobDialog job={job} theme={theme} />
                                    </div>
                                    <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'}`}>{job.jobName}</h2>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-5 text-sm font-normal">
                                <span className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                    <MapPin className="h-4 w-4 text-indigo-500" />
                                    {job.lossAddress?.street}, {job.lossAddress?.city}
                                </span>
                                <div className={`h-1 w-1 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`} />
                                <span className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                    <FileText className="h-4 w-4 text-indigo-500" />
                                    Claim: <span className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-900'}`}>{job.claimNumber || 'N/A'}</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5 text-right items-end justify-between">
                            <div className="flex flex-wrap gap-4">
                                <div className={`px-5 py-3 rounded-2xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/5 shadow-inner' : 'bg-slate-50 ring-slate-100 shadow-sm'} min-w-[140px] text-left`}>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Status</p>
                                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-0 ring-1 ring-emerald-500/30 rounded-lg py-1 px-3 font-bold text-xs">
                                        {job.status.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className={`px-5 py-3 rounded-2xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/5 shadow-inner' : 'bg-slate-50 ring-slate-100 shadow-sm'} min-w-[140px] text-left`}>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Cycle Time</p>
                                    <div className={`flex items-center gap-2 font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-lg`}>
                                        <Clock className="h-5 w-5 text-indigo-500" />
                                        {job.cycleTime} <span className="text-xs font-semibold opacity-60">DAYS</span>
                                    </div>
                                </div>
                            </div>
                            <ComplianceCheckButton job={job} theme={theme} />
                        </div>
                    </div>
                </div>

                {/* Module Tabs */}
                <Tabs value={currentTab} onValueChange={(val) => {
                    const path = tabs.find(t => t.id === val)?.path;
                    if (path) navigate(path);
                }} className="w-full">
                    <TabsList className={`w-full justify-start h-14 ${theme === 'dark' ? 'bg-muted/40' : 'bg-gray-100/50'} border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-200'} rounded-2xl p-1 overflow-x-auto scrollbar-hide`}>
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className={`data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20
                                       rounded-xl px-6 h-full gap-2 font-medium text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-indigo-600'} transition-all duration-300`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>

                    <div className="pt-6 pb-20">
                        {children}
                    </div>
                </Tabs>
            </div>

            {/* AI Chat Bot */}
            <JobChatWidget
                jobId={job._id}
                adminJobId={job.jobId}
                jobName={job.jobName}
                metrics={metrics}
            />
        </div>
        // </DatabaseLayout>
    );
};

export default JobLayout;

const EditJobDialog = ({ job, theme }: { job: any, theme: string }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        jobName: job.jobName,
        claimNumber: job.claimNumber,
        status: job.status,
        priority: job.priority,
        lossAddress: { ...job.lossAddress }
    });

    const updateJobMutation = useMutation({
        mutationFn: async (updatedData: any) => {
            const token = localStorage.getItem("token");
            api.put(`/jobs/${job._id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["job", job._id] });
            toast.success("Job updated successfully");
            setOpen(false);
        },
        onError: () => {
            toast.error("Failed to update job");
        }
    });

    const handleSave = () => {
        updateJobMutation.mutate(formData);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-indigo-900/40 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                    <Edit2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-gray-200 text-indigo-950 shadow-2xl'} rounded-3xl overflow-hidden max-w-2xl`}>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Edit Job Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-900/40'}`}>Job Name</Label>
                            <Input
                                value={formData.jobName}
                                onChange={(e) => setFormData({ ...formData, jobName: e.target.value })}
                                className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-900/40'}`}>Claim Number</Label>
                            <Input
                                value={formData.claimNumber}
                                onChange={(e) => setFormData({ ...formData, claimNumber: e.target.value })}
                                className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Status</Label>
                            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                                <SelectTrigger className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-slate-50 ring-slate-200 text-slate-900 shadow-sm'}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={`${theme === 'dark' ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-white border-gray-100 text-slate-900 shadow-2xl'} rounded-xl`}>
                                    {['Lead', 'inspecting', 'Estimating', 'Approved', 'Production', 'Billing', 'Paid', 'Closed', 'On Hold', 'Cancelled'].map(s => (
                                        <SelectItem key={s} value={s} className="rounded-lg font-medium">{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-900/40'}`}>Priority</Label>
                            <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val })}>
                                <SelectTrigger className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={`${theme === 'dark' ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-white border-gray-100 text-indigo-950 shadow-2xl'} rounded-xl`}>
                                    {['Low', 'Normal', 'High', 'Critical'].map(p => (
                                        <SelectItem key={p} value={p} className="rounded-lg font-bold">{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-900/40'}`}>Loss Address</Label>
                        <Input
                            value={formData.lossAddress.street}
                            onChange={(e) => setFormData({ ...formData, lossAddress: { ...formData.lossAddress, street: e.target.value } })}
                            placeholder="Street"
                            className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}
                        />
                        <div className="grid grid-cols-3 gap-3">
                            <Input
                                value={formData.lossAddress.city}
                                onChange={(e) => setFormData({ ...formData, lossAddress: { ...formData.lossAddress, city: e.target.value } })}
                                placeholder="City"
                                className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}
                            />
                            <Input
                                value={formData.lossAddress.state}
                                onChange={(e) => setFormData({ ...formData, lossAddress: { ...formData.lossAddress, state: e.target.value } })}
                                placeholder="State"
                                className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}
                            />
                            <Input
                                value={formData.lossAddress.zip}
                                onChange={(e) => setFormData({ ...formData, lossAddress: { ...formData.lossAddress, zip: e.target.value } })}
                                placeholder="Zip"
                                className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-slate-900 shadow-sm'}`}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter className="gap-3">
                    <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-medium">Cancel</Button>
                    <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-8 shadow-lg shadow-indigo-500/20">Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ComplianceCheckButton = ({ job, theme }: { job: any, theme: string }) => {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const checkCompliance = async () => {
        setLoading(true);
        setResult(null);
        try {
            console.log("Sending compliance request...");
            // Call the Backend Proxy instead of n8n directly to avoid CORS
            const token = localStorage.getItem("token");
            const res = await api.post(`/jobs/${job._id}/compliance`,
                {
                    ...job,
                    requestType: "compliance-audit"
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            console.log("Compliance Result:", res.data);
            setResult(res.data);
            setOpen(true);
        } catch (error: any) {
            console.error("Compliance check failed", error);
            // Show toast but don't open dialog if it's a hard error
            toast.error(error.response?.data?.message || "Failed to run compliance check. See console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="outline"
                className={`gap-2 rounded-xl font-semibold px-6 border-0 ring-1 ${theme === 'dark' ? 'bg-indigo-600/10 ring-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20 hover:text-indigo-300' : 'bg-indigo-600 text-white ring-indigo-600 shadow-lg shadow-indigo-500/20 hover:bg-indigo-700'}`}
                onClick={checkCompliance}
                disabled={loading}
            >
                <ShieldCheck className="h-4 w-4" />
                {loading ? "Checking..." : "Verify Compliance"}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-gray-200 text-slate-900 shadow-2xl'} rounded-3xl overflow-hidden max-w-lg`}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <ShieldCheck className={`h-6 w-6 ${result?.isCompliant ? "text-emerald-500" : "text-rose-500"}`} />
                            Compliance Audit
                        </DialogTitle>
                    </DialogHeader>

                    {result && (
                        <div className="space-y-6 py-6">
                            {/* Empty Response Handling */}
                            {result.isCompliant === undefined && (
                                <div className={`p-5 rounded-2xl border-0 ring-1 ${theme === 'dark' ? 'bg-amber-500/10 ring-amber-500/30 text-amber-500' : 'bg-amber-50 ring-amber-100 text-amber-700 shadow-sm'}`}>
                                    <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Empty Response Received</h3>
                                    <p className="text-sm font-medium opacity-80">The automation ran but returned no data. Check your n8n workflow "Respond to Webhook" node.</p>
                                    <pre className={`text-[10px] mt-4 p-3 rounded-xl font-mono overflow-auto ${theme === 'dark' ? 'bg-black/50 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>{JSON.stringify(result, null, 2)}</pre>
                                </div>
                            )}

                            {result.isCompliant !== undefined && (
                                <div className={`p-6 rounded-2xl border-0 ring-1 ${result.isCompliant
                                    ? (theme === 'dark' ? 'bg-emerald-500/10 ring-emerald-500/30' : 'bg-emerald-50 ring-emerald-100 shadow-sm')
                                    : (theme === 'dark' ? 'bg-rose-500/10 ring-rose-500/30' : 'bg-rose-50 ring-rose-100 shadow-sm')
                                    }`}>
                                    <h3 className={`font-bold tracking-widest text-xs uppercase mb-3 ${result.isCompliant ? "text-emerald-500" : "text-rose-500"}`}>
                                        {result.isCompliant ? "Status: Compliant" : "Status: Non-Compliant"}
                                    </h3>
                                    <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-gray-200' : 'text-slate-900'}`}>{result.complianceNote}</p>
                                </div>
                            )}

                            {result.isCompliant === false && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Risk Level</p>
                                        <Badge className={`rounded-lg py-1 px-3 font-bold text-[10px] uppercase border-0 ring-1 ${result.riskLevel === 'Critical' ? 'bg-rose-500 text-white ring-rose-600' :
                                            result.riskLevel === 'High' ? 'bg-orange-500 text-white ring-orange-600' :
                                                'bg-amber-500 text-white ring-amber-600'
                                            }`}>
                                            {result.riskLevel}
                                        </Badge>
                                    </div>

                                    {result.missingItems?.length > 0 && (
                                        <div className={`p-5 rounded-2xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/5' : 'bg-slate-50 ring-slate-100'}`}>
                                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Missing Requirements</p>
                                            <ul className="space-y-3">
                                                {result.missingItems.map((item: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <div className={`mt-1.5 h-1.5 w-1.5 rounded-full ${theme === 'dark' ? 'bg-rose-500' : 'bg-rose-600'}`} />
                                                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-900'}`}>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button onClick={() => setOpen(false)} className={`rounded-xl font-semibold px-8 ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900 shadow-sm'}`}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
