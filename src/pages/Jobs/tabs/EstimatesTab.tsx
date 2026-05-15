import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, DollarSign, Trash2, Search, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import { useTheme } from "@/components/ThemeProvider";

const EstimatesTab = () => {
    const { theme } = useTheme();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const itemsPerPage = 10;

    // Form State
    const [formData, setFormData] = useState({
        estimateNumber: "",
        type: "Original",
        amount: "",
        dateCreated: new Date().toISOString().split('T')[0],
        notes: ""
    });

    // Fetch Estimates
    const { data: estimates, isLoading } = useQuery({
        queryKey: ["estimates", id],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await api.get(`/jobs/${id}/estimates`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!id
    });

    // Create Estimate Mutation
    const createMutation = useMutation({
        mutationFn: async (newEstimate: any) => {
            const token = localStorage.getItem("token");
            return await api.post(`/jobs/${id}/estimates`, newEstimate, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["estimates", id] });
            queryClient.invalidateQueries({ queryKey: ["job", id] });
            toast.success("Estimate added successfully");
            setIsAddOpen(false);
            setFormData({
                estimateNumber: "",
                type: "Original",
                amount: "",
                dateCreated: new Date().toISOString().split('T')[0],
                notes: ""
            });
        },
        onError: () => {
            toast.error("Failed to add estimate");
        }
    });

    // Delete Estimate Mutation
    const deleteMutation = useMutation({
        mutationFn: async (estimateId: string) => {
            const token = localStorage.getItem("token");
            return await api.delete(`/jobs/${id}/estimates/${estimateId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["estimates", id] });
            toast.success("Estimate deleted");
            setDeleteConfirmId(null);
        },
        onError: () => {
            toast.error("Failed to delete estimate");
        }
    });

    const handleDeleteConfirm = () => {
        if (deleteConfirmId) {
            deleteMutation.mutate(deleteConfirmId);
        }
    };

    const handleSubmit = () => {
        if (!formData.estimateNumber || !formData.amount) {
            toast.error("Please fill required fields");
            return;
        }
        createMutation.mutate(formData);
    };

    const sortedEstimates = estimates ? [...estimates].sort((a: any, b: any) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()) : [];

    let runningTotal = 0;
    let totalOriginal = 0;
    let totalSupplements = 0;

    const estimatesWithTotal = sortedEstimates.map((est: any) => {
        runningTotal += est.amount;
        if (est.type === "Original") {
            totalOriginal += est.amount;
        } else {
            totalSupplements += est.amount;
        }
        return { ...est, runningTotal };
    });

    const filteredEstimates = estimatesWithTotal.filter((est: any) =>
        est.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (est.notes && est.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredEstimates.length / itemsPerPage);
    const paginatedEstimates = filteredEstimates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (isLoading) return <Skeleton className="w-full h-[400px] rounded-3xl" />;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className={`text-4xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Job <span className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Estimates</span>
                    </h2>
                    <p className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        Track estimate versions, supplements, and change orders.
                    </p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 py-6 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Plus className="mr-2 h-5 w-5" /> Add Estimate Record
                        </Button>
                    </DialogTrigger>
                    <DialogContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-gray-200 text-indigo-950 shadow-2xl'} min-w-[500px] rounded-3xl overflow-hidden`}>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Add Estimate Record</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2.5">
                                    <Label className={`text-xs font-semibold uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Estimate Number</Label>
                                    <Input
                                        value={formData.estimateNumber}
                                        onChange={(e) => setFormData({ ...formData, estimateNumber: e.target.value })}
                                        className={`h-12 border-0 ring-1 rounded-xl font-medium px-4 ${theme === 'dark' ? 'bg-white/[0.03] ring-white/10 text-white' : 'bg-slate-50 ring-slate-200 shadow-sm text-slate-900'}`}
                                        placeholder="e.g. EST-001"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <Label className={`text-xs font-semibold uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Revenue Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(val) => setFormData({ ...formData, type: val })}
                                    >
                                        <SelectTrigger className={`h-12 border-0 ring-1 rounded-xl font-medium px-4 ${theme === 'dark' ? 'bg-white/[0.03] ring-white/10 text-white' : 'bg-slate-50 ring-slate-200 shadow-sm text-slate-900'}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10' : 'bg-white ring-slate-200 shadow-2xl'} rounded-xl overflow-hidden p-1`}>
                                            <SelectItem value="Original" className="font-medium py-2.5 rounded-lg">Original</SelectItem>
                                            <SelectItem value="Revision" className="font-medium py-2.5 rounded-lg">Revision</SelectItem>
                                            <SelectItem value="Supplement" className="font-medium py-2.5 rounded-lg">Supplement</SelectItem>
                                            <SelectItem value="Change Order" className="font-medium py-2.5 rounded-lg">Change Order</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Label className={`text-xs font-semibold uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Amount ($)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500" />
                                    <Input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className={`h-12 border-0 ring-1 rounded-xl font-medium pl-12 pr-4 ${theme === 'dark' ? 'bg-white/[0.03] ring-white/10 text-white' : 'bg-slate-50 ring-slate-200 shadow-sm text-slate-900'}`}
                                        placeholder="0.00 (Use negative for credit)"
                                    />
                                </div>
                                <p className={`text-[10px] font-normal uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-gray-600' : 'text-slate-400'}`}>Use negative values for credit changes.</p>
                            </div>

                            <div className="space-y-2.5">
                                <Label className={`text-xs font-semibold uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Effective Date</Label>
                                <Input
                                    type="date"
                                    value={formData.dateCreated}
                                    onChange={(e) => setFormData({ ...formData, dateCreated: e.target.value })}
                                    className={`h-12 border-0 ring-1 rounded-xl font-medium px-4 ${theme === 'dark' ? 'bg-white/[0.03] ring-white/10 text-white [color-scheme:dark]' : 'bg-slate-50 ring-slate-200 shadow-sm text-slate-900'}`}
                                />
                            </div>

                            <div className="space-y-2.5">
                                <Label className={`text-xs font-semibold uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Documentation Notes</Label>
                                <Input
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className={`h-12 border-0 ring-1 rounded-xl font-medium px-4 ${theme === 'dark' ? 'bg-white/[0.03] ring-white/10 text-white' : 'bg-slate-50 ring-slate-200 shadow-sm text-slate-900'}`}
                                    placeholder="Optional descriptive context..."
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-3">
                            <Button variant="outline" onClick={() => setIsAddOpen(false)} className={`h-12 rounded-xl px-6 font-bold ${theme === 'dark' ? 'border-white/10 text-white' : 'border-gray-200 text-slate-900'}`}>Cancel</Button>
                            <Button onClick={handleSubmit} className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">Save Record</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Asset Value", value: runningTotal, color: "indigo" },
                    { label: "Original Base", value: totalOriginal, color: "blue" },
                    { label: "Total Supplements", value: totalSupplements, color: "purple" }
                ].map((stat, i) => (
                    <Card key={i} className={`border-0 ring-1 overflow-hidden rounded-3xl transition-all hover:scale-[1.02] shadow-xl ${
                        theme === 'dark' 
                        ? 'bg-card/40 border-white/5 ring-white/5' 
                        : 'bg-white ring-gray-100'
                    }`}>
                        <CardHeader className="pb-2">
                            <CardTitle className={`text-[10px] font-semibold uppercase tracking-widest ${theme === 'dark' ? `text-${stat.color}-400` : `text-${stat.color}-600`}`}>{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                ${stat.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className={`border-0 ring-1 rounded-3xl overflow-hidden shadow-2xl ${
                theme === 'dark' ? 'bg-[#0A0A0A] ring-white/5' : 'bg-white ring-gray-100'
            }`}>
                <CardHeader className={`flex flex-col md:flex-row md:items-center justify-between gap-6 border-b p-8 ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-slate-50/50'}`}>
                    <CardTitle className={`text-xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Revision History Ledger</CardTitle>
                    <div className="relative w-full md:w-80">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-400'}`} />
                        <Input
                            placeholder="Search ledger entries..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={`h-11 pl-11 border-0 ring-1 rounded-xl font-medium ${theme === 'dark' ? 'bg-white/[0.03] ring-white/10 text-white' : 'bg-white ring-slate-200 text-slate-900 shadow-sm'}`}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {paginatedEstimates.length === 0 ? (
                        <div className="text-center py-20">
                            <FileText className={`h-12 w-12 mx-auto mb-4 opacity-10 ${theme === 'dark' ? 'text-white' : 'text-indigo-950'}`} />
                            <p className={`font-bold ${theme === 'dark' ? 'text-gray-600' : 'text-indigo-900/30'}`}>No estimate records found.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className={`border-b transition-colors ${theme === 'dark' ? 'border-white/5 hover:bg-white/[0.02]' : 'border-gray-50 hover:bg-gray-50/30'}`}>
                                    <TableHead className={`h-14 font-semibold text-[10px] uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Asset Identity</TableHead>
                                    <TableHead className={`h-14 font-semibold text-[10px] uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Classification</TableHead>
                                    <TableHead className={`h-14 font-semibold text-[10px] uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Record Date</TableHead>
                                    <TableHead className={`h-14 font-semibold text-[10px] uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Custodian</TableHead>
                                    <TableHead className={`h-14 font-semibold text-[10px] uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'} text-right`}>Incremental</TableHead>
                                    <TableHead className={`h-14 font-semibold text-[10px] uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'} text-right`}>Aggregated</TableHead>
                                    <TableHead className={`h-14 font-semibold text-[10px] uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'} text-right px-8`}>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedEstimates.map((est: any) => (
                                    <TableRow key={est._id} className={`border-b group transition-colors ${theme === 'dark' ? 'border-white/5 hover:bg-white/[0.04]' : 'border-gray-50 hover:bg-indigo-50/30'}`}>
                                        <TableCell className="py-6 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20' : 'bg-indigo-50 text-indigo-600 group-hover:bg-white shadow-sm'}`}>
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className={`font-bold text-sm tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{est.estimateNumber}</div>
                                                    {est.notes && <div className={`text-[10px] font-normal mt-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>{est.notes}</div>}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest border-0 ring-1 ${
                                                est.type === 'Original' ? (theme === 'dark' ? 'bg-blue-500/10 text-blue-400 ring-blue-500/20' : 'bg-blue-50 text-blue-700 ring-blue-100') :
                                                est.type === 'Supplement' ? (theme === 'dark' ? 'bg-purple-500/10 text-purple-400 ring-purple-500/20' : 'bg-purple-50 text-purple-700 ring-purple-100') :
                                                est.type === 'Change Order' ? (theme === 'dark' ? 'bg-orange-500/10 text-orange-400 ring-orange-500/20' : 'bg-orange-50 text-orange-700 ring-orange-100') :
                                                (theme === 'dark' ? 'bg-gray-500/10 text-gray-400 ring-gray-500/20' : 'bg-gray-50 text-gray-700 ring-gray-100')
                                            }`}>
                                                {est.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-slate-400'}`}>
                                            {new Date(est.dateCreated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-slate-900'}`}>{est.addedBy?.name || "System Record"}</span>
                                                <span className={`text-[9px] font-normal uppercase tracking-widest ${theme === 'dark' ? 'text-gray-600' : 'text-slate-400'}`}>Logged {new Date(est.dateUploaded).toLocaleDateString()}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className={`text-right font-bold text-base ${est.amount < 0 ? "text-rose-500" : "text-emerald-500"}`}>
                                            {est.amount < 0 ? "-" : "+"}${Math.abs(est.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className={`text-right font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                            ${est.runningTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-right px-8">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={`h-10 w-10 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-rose-500/10 hover:text-rose-400 text-gray-600' : 'hover:bg-rose-50 hover:text-rose-600 text-indigo-900/20'}`}
                                                onClick={() => setDeleteConfirmId(est._id)}
                                            >
                                                <Trash2 className="h-4.5 w-4.5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className={`flex items-center justify-between gap-2 p-6 border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-50'}`}>
                            <span className={`text-[10px] font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>
                                Showing Page {currentPage} of {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={`h-10 w-10 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-gray-200 text-indigo-950 hover:bg-gray-50 shadow-sm'}`}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`h-10 w-10 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-gray-200 text-indigo-950 hover:bg-gray-50 shadow-sm'}`}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
                <DialogContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-gray-200 text-indigo-950 shadow-2xl'} rounded-3xl overflow-hidden`}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                            <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            Confirm Deletion
                        </DialogTitle>
                    </DialogHeader>
                    <div className={`py-6 text-base font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        Are you sure you want to permanently remove this estimate record? This audit trail action cannot be reversed.
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className={`h-12 rounded-xl px-6 font-bold ${theme === 'dark' ? 'border-white/10 text-white' : 'border-gray-200 text-indigo-950'}`}>
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} className="h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-8 font-black shadow-lg shadow-rose-500/20 active:scale-95 transition-all" disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending ? "Removing..." : "Confirm Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EstimatesTab;
