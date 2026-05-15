import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api";
import { useTheme } from "@/components/ThemeProvider";

interface DateFieldProps {
    label: string;
    value: Date | string | null;
    onChange: (date: Date | undefined) => void;
}

const DateField = ({ label, value, onChange }: DateFieldProps) => {
    const { theme } = useTheme();
    return (
        <div className="flex flex-col space-y-2.5 flex-1">
            <label className={`text-[10px] font-semibold uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`}>{label}</label>
            <div className="flex gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                `w-full justify-start text-left font-semibold border-0 ring-1 ${theme === 'dark' ? 'bg-white/[0.03] ring-white/10 text-white hover:bg-white/10' : 'bg-slate-50 ring-slate-200 text-slate-900 hover:bg-slate-100/50 hover:ring-indigo-200'} transition-all px-4 h-12 rounded-xl shadow-sm`,
                                !value && "text-muted-foreground font-medium"
                            )}
                        >
                            <CalendarIcon className={`mr-2.5 h-4 w-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                            {value ? format(new Date(value), "PPP") : <span className="opacity-50 tracking-tight">Pick milestone date...</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={`w-auto p-0 border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-gray-200 shadow-2xl'} rounded-2xl overflow-hidden`}>
                        <Calendar
                            mode="single"
                            selected={value ? new Date(value) : undefined}
                            onSelect={onChange}
                            initialFocus
                            className={cn(
                                "rounded-2xl border-0 p-3",
                                theme === 'dark' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-indigo-950'
                            )}
                        />
                    </PopoverContent>
                </Popover>
                <Button
                    variant="outline"
                    size="icon"
                    className={`h-12 w-12 transition-all rounded-xl border-0 ring-1 shadow-sm ${theme === 'dark' ? 'bg-indigo-500/10 ring-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20' : 'bg-indigo-50 ring-indigo-100 text-indigo-600 hover:bg-indigo-100'}`}
                    onClick={() => onChange(new Date())}
                    title="Set to Today"
                >
                    <span className="text-xs font-bold uppercase tracking-tighter">Now</span>
                </Button>
            </div>
        </div>
    );
};

const DatesTab = () => {
    const { theme } = useTheme();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [isSaving, setIsSaving] = useState(false);

    // Fetch Job Data
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
    const dates = job?.dates || {};

    // Mutation to update dates
    const updateJobMutation = useMutation({
        mutationFn: async (updatedDates: any) => {
            const token = localStorage.getItem("token");
            return await api.put(`/jobs/${id}`, { dates: updatedDates }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["job", id] });
            toast.success("Dates updated successfully");
            setIsSaving(false);
        },
        onError: () => {
            toast.error("Failed to update dates");
            setIsSaving(false);
        }
    });

    const handleDateChange = (section: string, field: string, date: Date | undefined) => {
        if (!job) return;

        const newDates = {
            ...dates,
            [section]: {
                ...dates[section],
                [field]: date
            }
        };

        // Optimistic update locally or just trigger save
        // For better UX, we can auto-save or have a save button. 
        // Let's do auto-save with debounce or immediate for now on change?
        // User requested "One-click entry", implies immediate action usually.
        // But distinct save button prevents accidental API spam. 
        // Let's trigger save immediately for "app-like" feel.

        updateJobMutation.mutate(newDates);
    };

    if (isLoading) {
        return <Skeleton className="w-full h-[500px] rounded-xl" />;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h2 className={`text-4xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Milestone <span className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Dates</span>
                    </h2>
                    <p className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Precision tracking for project lifecycle and key events.</p>
                </div>
                <div className={`p-4 rounded-2xl border-0 ring-1 ${theme === 'dark' ? 'bg-indigo-500/5 ring-indigo-500/20' : 'bg-indigo-50 ring-indigo-100'} hidden md:block`}>
                    <div className="flex items-center gap-3">
                        <CalendarIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`}>{format(new Date(), 'EEEE, MMMM do yyyy').toUpperCase()}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
                {/* Intake */}
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 ring-white/5 shadow-22xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-3xl overflow-hidden flex flex-col`}>
                    <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-slate-50/50'} flex items-center justify-between`}>
                        <div className="space-y-1">
                            <h3 className={`text-sm font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Intake</h3>
                            <p className={`text-[10px] font-normal ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Initial receipt and contact milestones.</p>
                        </div>
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                            <CalendarIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        </div>
                    </div>
                    <CardContent className="space-y-8 p-8 flex-1">
                        <DateField
                            label="Date of Loss"
                            value={dates.intake?.loss}
                            onChange={(d) => handleDateChange('intake', 'loss', d)}
                        />
                        <DateField
                            label="Date Received"
                            value={dates.intake?.received}
                            onChange={(d) => handleDateChange('intake', 'received', d)}
                        />
                        <DateField
                            label="Date Contacted"
                            value={dates.intake?.contacted}
                            onChange={(d) => handleDateChange('intake', 'contacted', d)}
                        />
                    </CardContent>
                </Card>

                {/* Scoping */}
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 ring-white/5 shadow-22xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-3xl overflow-hidden flex flex-col`}>
                    <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-slate-50/50'} flex items-center justify-between`}>
                        <div className="space-y-1">
                            <h3 className={`text-sm font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Scoping</h3>
                            <p className={`text-[10px] font-normal ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Estimation and approval phase milestones.</p>
                        </div>
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                            <CalendarIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        </div>
                    </div>
                    <CardContent className="space-y-8 p-8 flex-1">
                        <DateField
                            label="Date Inspected"
                            value={dates.scoping?.inspected}
                            onChange={(d) => handleDateChange('scoping', 'inspected', d)}
                        />
                        <DateField
                            label="Estimate Sent"
                            value={dates.scoping?.estimateSent}
                            onChange={(d) => handleDateChange('scoping', 'estimateSent', d)}
                        />
                        <DateField
                            label="Estimate Approved"
                            value={dates.scoping?.estimateApproved}
                            onChange={(d) => handleDateChange('scoping', 'estimateApproved', d)}
                        />
                    </CardContent>
                </Card>

                {/* Production */}
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 ring-white/5 shadow-22xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-3xl overflow-hidden flex flex-col`}>
                    <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-slate-50/50'} flex items-center justify-between`}>
                        <div className="space-y-1">
                            <h3 className={`text-sm font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Production</h3>
                            <p className={`text-[10px] font-normal ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Active work and completion milestones.</p>
                        </div>
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                            <CalendarIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        </div>
                    </div>
                    <CardContent className="space-y-8 p-8 flex-1">
                        <DateField
                            label="Work Authorization"
                            value={dates.production?.workAuthorization}
                            onChange={(d) => handleDateChange('production', 'workAuthorization', d)}
                        />
                        <DateField
                            label="Date Started"
                            value={dates.production?.started}
                            onChange={(d) => handleDateChange('production', 'started', d)}
                        />
                        <DateField
                            label="Majority Completion"
                            value={dates.production?.majorityCompletion}
                            onChange={(d) => handleDateChange('production', 'majorityCompletion', d)}
                        />
                        <DateField
                            label="Target Completion"
                            value={dates.production?.targetCompletion}
                            onChange={(d) => handleDateChange('production', 'targetCompletion', d)}
                        />
                    </CardContent>
                </Card>

                {/* Administrative */}
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 ring-white/5 shadow-22xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-3xl overflow-hidden flex flex-col`}>
                    <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-slate-50/50'} flex items-center justify-between`}>
                        <div className="space-y-1">
                            <h3 className={`text-sm font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Administrative</h3>
                            <p className={`text-[10px] font-normal ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Billing and closure milestones.</p>
                        </div>
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                            <CalendarIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        </div>
                    </div>
                    <CardContent className="space-y-8 p-8 flex-1">
                        <DateField
                            label="Date COS / NOC"
                            value={dates.administrative?.cos}
                            onChange={(d) => handleDateChange('administrative', 'cos', d)}
                        />
                        <DateField
                            label="Date Invoiced"
                            value={dates.administrative?.invoiced}
                            onChange={(d) => handleDateChange('administrative', 'invoiced', d)}
                        />
                        <DateField
                            label="Date Paid"
                            value={dates.administrative?.paid}
                            onChange={(d) => handleDateChange('administrative', 'paid', d)}
                        />
                        <DateField
                            label="Date Closed"
                            value={dates.administrative?.closed}
                            onChange={(d) => handleDateChange('administrative', 'closed', d)}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DatesTab;
