import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, Briefcase, Clock, AlertTriangle, ArrowUpRight, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/components/ThemeProvider";
import api from "@/services/api";
import DashboardLayout from "@/components/DashboardLayout";

const JobListView = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [jobToDelete, setJobToDelete] = useState<any>(null);

    const token = localStorage.getItem("token");
    let userRole = "";
    try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            userRole = user.role || "";
        }
    } catch (e) {
        console.error(e);
    }

    const deleteMutation = useMutation({
        mutationFn: async (jobId: string) => {
            return await api.delete(`/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            toast.success("Job deleted successfully");
            setJobToDelete(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete job");
        }
    });

    const canDelete = userRole === 'company_admin' || userRole === 'superadmin';

    const { data: jobs, isLoading: isJobsLoading } = useQuery({
        queryKey: ["jobs", search],
        queryFn: async () => {
            const res = await api.get("/jobs", {
                params: { search }
            });
            return res.data;
        },
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'Lead': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Estimating': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Production': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'text-red-500';
            case 'High': return 'text-orange-500';
            case 'Normal': return 'text-blue-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                    <div className="relative group flex-1 max-w-md">
                        <Input
                            placeholder="Search jobs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`rounded-xl h-11 pl-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white'}`}
                        />
                    </div>
                    <Button
                        onClick={() => navigate("/jobs/new")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 shadow-lg shadow-indigo-500/20"
                    >
                        <Plus className="mr-2 h-5 w-5" /> New Job
                    </Button>
                </div>

                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden`}>
                    <CardContent className="p-0">
                        {isJobsLoading ? (
                            <div className="p-8 space-y-4">
                                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
                            </div>
                        ) : jobs && jobs.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className={`${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'bg-slate-50'} hover:bg-transparent`}>
                                        <TableHead className="font-bold py-4">Job Details</TableHead>
                                        <TableHead className="font-bold">Status</TableHead>
                                        <TableHead className="font-bold">Priority</TableHead>
                                        <TableHead className="font-bold">Revenue</TableHead>
                                        <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {jobs.map((job: any) => (
                                        <TableRow
                                            key={job._id}
                                            className={`${theme === 'dark' ? 'border-white/5 hover:bg-white/[0.03]' : 'hover:bg-slate-50/50'} cursor-pointer transition-all`}
                                            onClick={() => navigate(`/jobs/list/${job._id}`)}
                                        >
                                            <TableCell className="py-5">
                                                <div className="flex flex-col">
                                                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{job.jobName}</span>
                                                    <span className="text-xs text-muted-foreground mt-0.5">{job.jobId} • {job.claimNumber || 'No Claim #'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`${getStatusColor(job.status)} text-[10px] uppercase tracking-wider font-bold h-6 border-0 ring-1`}>
                                                    {job.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`flex items-center gap-1.5 ${getPriorityColor(job.priority)} font-bold text-xs uppercase tracking-tight`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                                                    {job.priority}
                                                </span>
                                            </TableCell>
                                            <TableCell className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                                ${(job.financials?.contractAmount || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="rounded-xl">
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </Button>
                                                    {canDelete && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setJobToDelete(job);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-20 text-muted-foreground">
                                <p className="font-medium italic">No jobs found matching your criteria.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Dialog */}
                <Dialog open={!!jobToDelete} onOpenChange={(open) => !open && setJobToDelete(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p>Are you sure you want to delete <strong>{jobToDelete?.jobName}</strong>?</p>
                            <p className="text-sm text-rose-500 mt-2 font-semibold">This action cannot be undone.</p>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setJobToDelete(null)}>Cancel</Button>
                            <Button
                                variant="destructive"
                                onClick={() => deleteMutation.mutate(jobToDelete?._id)}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? "Deleting..." : "Delete Forever"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
};

export default JobListView;
