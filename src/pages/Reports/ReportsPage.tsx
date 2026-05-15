import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import * as XLSX from "xlsx";
import {
    FileText,
    Download,
    Calendar,
    Filter,
    ChevronRight,
    Search,
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
            { id: "production-summary", name: "Production Summary By Employee" }
        ]
    }
];

const ReportsPage = () => {
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

        // Flatten data for export (if nested objects exist)
        const exportData = reportData.data.map((row: any) => {
            // Create a flat object based on columns if possible, or just dump row
            // But row keys match column keys usually
            return row;
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, `${selectedReport.name.replace(/ /g, "_")}_${dateRange.end}.xlsx`);
    };

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-white/10 flex flex-col bg-[#0A0A0A]">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-500" /> Reports Center
                    </h2>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                        {reportCategories.map((category, idx) => (
                            <div key={idx}>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                                    {category.title}
                                </h3>
                                <div className="space-y-1">
                                    {category.reports.map((report) => (
                                        <button
                                            key={report.id}
                                            onClick={() => {
                                                setSelectedReport(report);
                                                setPage(1);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group ${selectedReport.id === report.id
                                                ? "bg-indigo-600/20 text-indigo-400 font-medium"
                                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                }`}
                                        >
                                            <span className="truncate">{report.name}</span>
                                            {selectedReport.id === report.id && <ChevronRight className="h-4 w-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full bg-black">
                {/* Header & Filters */}
                <div className="p-6 border-b border-white/10 bg-[#0A0A0A]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white">{selectedReport.name}</h1>
                            <p className="text-gray-400 text-sm mt-1">
                                Generated for {new Date().toLocaleDateString()} • BIGlogic.ai HQ
                            </p>
                        </div>
                        <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white">
                            <Download className="mr-2 h-4 w-4" /> Download Excel
                        </Button>
                    </div>

                    <div className="flex items-end gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="space-y-2">
                            <Label className="text-gray-400 text-xs uppercase">Start Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="pl-9 bg-[#1A1A1A] border-white/10 w-40 [color-scheme:dark]"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-400 text-xs uppercase">End Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="pl-9 bg-[#1A1A1A] border-white/10 w-40 [color-scheme:dark]"
                                />
                            </div>
                        </div>
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                            Apply Filters
                        </Button>
                    </div>
                </div>

                {/* Report Content */}
                <div className="flex-1 p-6 overflow-hidden flex flex-col">
                    <Card className="flex-1 bg-[#0A0A0A] border-white/10 flex flex-col overflow-hidden">
                        <CardContent className="p-0 flex-1 overflow-auto">
                            {isLoading ? (
                                <div className="p-6 space-y-4">
                                    <Skeleton className="h-10 w-full bg-white/5" />
                                    <Skeleton className="h-10 w-full bg-white/5" />
                                    <Skeleton className="h-10 w-full bg-white/5" />
                                    <Skeleton className="h-10 w-full bg-white/5" />
                                </div>
                            ) : isError ? (
                                <div className="p-10 text-center text-red-400">
                                    Failed to load report data. Please try again.
                                </div>
                            ) : !reportData?.data || reportData.data.length === 0 ? (
                                <div className="p-20 text-center text-gray-500 flex flex-col items-center">
                                    <FileText className="h-12 w-12 mb-4 opacity-20" />
                                    <p>No records found for this period.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-white/5 sticky top-0 z-10">
                                        <TableRow className="border-white/10 hover:bg-transparent">
                                            {reportData.columns?.map((col: any) => (
                                                <TableHead key={col.key} className="text-gray-300 font-medium whitespace-nowrap">
                                                    {col.label}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportData.data.map((row: any, i: number) => (
                                            <TableRow key={i} className="border-white/10 hover:bg-white/5">
                                                {reportData.columns?.map((col: any) => (
                                                    <TableCell key={col.key} className="text-gray-300 whitespace-nowrap">
                                                        {/* Handle formatting if needed (dates, currency) based on col key or value */}
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
                            )}
                        </CardContent>

                        {/* Pagination Footer */}
                        {reportData?.pagination && reportData.pagination.total > 0 && (
                            <div className="border-t border-white/10 p-4 bg-[#111] flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, reportData.pagination.total)} of {reportData.pagination.total} entries
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="border-white/10 text-gray-400 hover:text-white disabled:opacity-50"
                                    >
                                        <ChevronLeft className="h-4 w-4" /> Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={page >= (reportData.pagination.pages || 1)}
                                        className="border-white/10 text-gray-400 hover:text-white disabled:opacity-50"
                                    >
                                        Next <ChevronRightIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
