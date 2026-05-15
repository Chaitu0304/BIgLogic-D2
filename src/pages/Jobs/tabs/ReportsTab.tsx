import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import * as XLSX from "xlsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import {
    FileText,
    Download,
    Calendar,
    ChevronRight,
    ChevronLeft,
    ChevronRight as ChevronRightIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import api from "@/services/api";

const reportCategories = [
    {
        title: "Job Reports",
        reports: [
            { id: "jobs-received-but-not-started", name: "Jobs Received But Not Started" },
            { id: "show-total-estimates", name: "Show Total Estimates for all Jobs" },
            { id: "open-jobs", name: "Open Jobs Report" },
            { id: "jobs-received", name: "Jobs Received Report" },
            { id: "sales-marketing", name: "Sales and Marketing Report" },
            { id: "open-leads", name: "Open Lead Report" },
            { id: "jobs-zip-postal", name: "Jobs with Zip/Postal" },
            { id: "job-gp-report", name: "Job GP Report (New)" },
            { id: "jobs-inspection", name: "Jobs Inspection Report" },
            { id: "jobs-estimate", name: "Jobs Estimate Report" },
            { id: "job-financials", name: "Job Financials (New)" },
            { id: "job-aging", name: "Job Aging Report" },
            { id: "job-status", name: "Job Status Report" },
            { id: "milestone-report", name: "Milestone Report" },
            { id: "48-hour-report", name: "48-Hour Report" }
        ]
    },
    {
        title: "Sales & Financials",
        reports: [
            { id: "monthly-sales", name: "Monthly Sales Report" },
            { id: "tls-monthly", name: "TLS Monthly Report" },
            { id: "sales-by-insurance", name: "Sales By Insurance Company" },
            { id: "wip-job", name: "Work In Progress Report By Job" },
            { id: "wip-details", name: "Work In Progress Report Details Listing" },
            { id: "dash-comparison", name: "Dash Account Comparison Report" },
            { id: "completed-contract", name: "Completed Contract Report" },
            { id: "aged-receivables", name: "Aged Receivables Report" },
            { id: "register-report", name: "Register Report" },
            { id: "compensation-report", name: "Compensation Report" }
        ]
    },
    {
        title: "Performance",
        reports: [
            { id: "job-progress-associate", name: "Job Progress by Associate" },
            { id: "production-summary", name: "Production Summary By Employee" },
            { id: "cycle-time-bottlenecks", name: "Cycle-Time Bottlenecks" }
        ]
    }
];

const ReportsTab = () => {
    const [selectedReport, setSelectedReport] = useState(reportCategories[0].reports[0]);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [page, setPage] = useState(1);
    const limit = 50;

    // Fetch Report Data
    const { data: reportData, isLoading, isError } = useQuery({
        queryKey: ["report", selectedReport.id, dateRange.start, dateRange.end, page],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await api.get(`/reports/${selectedReport.id}`, {
                params: {
                    startDate: dateRange.start,
                    endDate: dateRange.end,
                    page,
                    limit
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    const handleExport = () => {
        if (!reportData || !reportData.data || reportData.data.length === 0) {
            toast.error("No data to export");
            return;
        }

        const exportData = reportData.data.map((row: any) => {
            return row;
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, `${selectedReport.name.replace(/ /g, "_")}_${dateRange.end}.xlsx`);
    };

    const getAverageCycleTimes = () => {
        if (!reportData?.data || reportData.data.length === 0) return [];
        let totalIntake = 0;
        let totalScoping = 0;
        let totalProduction = 0;
        let totalClosed = 0;

        reportData.data.forEach((job: any) => {
            totalIntake += job.intake || 0;
            totalScoping += job.scoping || 0;
            totalProduction += job.production || 0;
            totalClosed += job.total || 0;
        });

        const count = reportData.data.length;
        return [
            { name: "Intake", avgDays: Math.round(totalIntake / count) },
            { name: "Scoping", avgDays: Math.round(totalScoping / count) },
            { name: "Production", avgDays: Math.round(totalProduction / count) }
        ];
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] bg-black/50 border border-white/10 rounded-xl overflow-hidden">
            {/* Sidebar */}
            <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col bg-[#0A0A0A]">
                <div className="p-4 border-b border-white/10 bg-[#0A0A0A]">
                    <h2 className="text-sm font-semibold flex items-center gap-2 text-gray-300">
                        <FileText className="h-4 w-4 text-indigo-500" /> AVAILABLE REPORTS
                    </h2>
                </div>
                <ScrollArea className="flex-1 h-[200px] lg:h-auto">
                    <div className="p-2 space-y-4">
                        {reportCategories.map((category, idx) => (
                            <div key={idx}>
                                <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 pt-2">
                                    {category.title}
                                </h3>
                                <div className="space-y-0.5">
                                    {category.reports.map((report) => (
                                        <button
                                            key={report.id}
                                            onClick={() => {
                                                setSelectedReport(report);
                                                setPage(1);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center justify-between group ${selectedReport.id === report.id
                                                ? "bg-indigo-600/10 text-indigo-400 font-medium border border-indigo-500/20"
                                                : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                                                }`}
                                        >
                                            <span className="truncate">{report.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full bg-[#050505] overflow-hidden">
                {/* Header & Filters */}
                <div className="p-4 border-b border-white/10 bg-[#0A0A0A]/50 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-lg font-semibold text-white flex items-center gap-2">
                                {selectedReport.name}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={handleExport} size="sm" variant="outline" className="h-8 bg-green-900/10 border-green-500/20 text-green-500 hover:bg-green-500/20 hover:text-white">
                                <Download className="mr-2 h-3.5 w-3.5" /> Export Excel
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-end gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                        <div className="space-y-1.5">
                            <Label className="text-gray-500 text-[10px] uppercase font-semibold tracking-wider">Date Range</Label>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                        className="h-8 pl-3 bg-[#1A1A1A] border-white/10 w-36 text-xs text-white [color-scheme:dark]"
                                    />
                                </div>
                                <span className="text-gray-500 text-xs">to</span>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                        className="h-8 pl-3 bg-[#1A1A1A] border-white/10 w-36 text-xs text-white [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report Content */}
                <div className="flex-1 p-0 overflow-hidden flex flex-col relative">
                    <CardContent className="p-0 flex-1 overflow-auto bg-[#050505]">
                        {isLoading ? (
                            <div className="p-6 space-y-4">
                                <Skeleton className="h-8 w-full bg-white/5" />
                                <Skeleton className="h-8 w-full bg-white/5" />
                                <Skeleton className="h-8 w-full bg-white/5" />
                                <Skeleton className="h-8 w-full bg-white/5" />
                            </div>
                        ) : isError ? (
                            <div className="p-10 text-center text-red-400 text-sm">
                                Failed to load report data. Please try again.
                            </div>
                        ) : !reportData?.data || reportData.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <FileText className="h-10 w-10 mb-3 opacity-20" />
                                <p className="text-sm">No records found for this period.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="relative w-full overflow-auto">
                                    <Table>
                                        <TableHeader className="bg-[#0A0A0A] sticky top-0 z-10 shadow-sm shadow-black">
                                            <TableRow className="border-white/10 hover:bg-transparent">
                                                {reportData.columns?.map((col: any) => (
                                                    <TableHead key={col.key} className="text-gray-400 font-medium text-xs whitespace-nowrap h-9 py-2">
                                                        {col.label}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reportData.data.map((row: any, i: number) => (
                                                <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors group">
                                                    {reportData.columns?.map((col: any) => (
                                                        <TableCell key={col.key} className="text-gray-300 text-xs whitespace-nowrap py-2 group-hover:text-white">
                                                            {typeof row[col.key] === 'number' && (col.key.toLowerCase().includes('cost') || col.key.toLowerCase().includes('revenue') || col.key.toLowerCase().includes('gp') || col.key.toLowerCase().includes('sales'))
                                                                ? `$${row[col.key].toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                                                                : row[col.key]
                                                            }
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                {selectedReport.id === "cycle-time-bottlenecks" && (
                                    <div className="mt-8 p-6 bg-[#0A0A0A] border border-white/5 rounded-xl">
                                        <h3 className="text-white font-semibold mb-6 text-lg">Company Averages (Days Per Phase)</h3>
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={getAverageCycleTimes()}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                                    <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888' }} />
                                                    <YAxis stroke="#888" tick={{ fill: '#888' }} />
                                                    <Tooltip
                                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                        contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px' }}
                                                        itemStyle={{ color: 'white' }}
                                                        labelStyle={{ color: 'white' }}
                                                    />
                                                    <Bar dataKey="avgDays" name="Average Days" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>

                    {/* Pagination Footer */}
                    {reportData?.pagination && reportData.pagination.total > 0 && (
                        <div className="border-t border-white/10 p-2 bg-[#0A0A0A] flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                {((page - 1) * limit) + 1}-{Math.min(page * limit, reportData.pagination.total)} of {reportData.pagination.total}
                            </span>
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="h-7 w-7 text-gray-400 hover:text-white disabled:opacity-30"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page >= (reportData.pagination.pages || 1)}
                                    className="h-7 w-7 text-gray-400 hover:text-white disabled:opacity-30"
                                >
                                    <ChevronRightIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsTab;
