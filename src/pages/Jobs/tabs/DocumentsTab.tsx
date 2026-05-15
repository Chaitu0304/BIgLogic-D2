import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import {
    FileText,
    Upload,
    Download,
    Trash2,
    File as FileIcon,
    Image as ImageIcon,
    MoreVertical,
    CheckCircle,
    AlertCircle,
    Search,
    ChevronLeft,
    ChevronRight,
    AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import api from "@/services/api";
import { useTheme } from "@/components/ThemeProvider";

const DocumentsTab = () => {
    const { theme } = useTheme();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Upload State
    const [uploadCategory, setUploadCategory] = useState("Contract");
    const [isRequiredDoc, setIsRequiredDoc] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Filter/Pagination State
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const itemsPerPage = 10;

    // Fetch Documents
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

    const documents = jobData?.documents || [];

    // Upload Mutation
    const uploadMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const token = localStorage.getItem("token");
            return await api.post(`/jobs/${id}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["job", id] });
            toast.success("Document uploaded successfully");
            setIsUploading(false);
            setIsUploadOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Upload failed");
            setIsUploading(false);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (documentId: string) => {
            const token = localStorage.getItem("token");
            return await api.delete(`/jobs/${id}/documents/${documentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["job", id] });
            toast.success("Document deleted");
            setDeleteConfirmId(null);
        },
        onError: () => {
            toast.error("Failed to delete document");
        }
    });

    const handleDeleteConfirm = () => {
        if (deleteConfirmId) {
            deleteMutation.mutate(deleteConfirmId);
        }
    };

    const handleFile = (file: File) => {
        if (file.type !== "application/pdf") {
            toast.error("Only PDF files are allowed.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "document");
        formData.append("category", uploadCategory);
        formData.append("isRequired", String(isRequiredDoc));

        setIsUploading(true);
        uploadMutation.mutate(formData);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.includes("pdf")) return <FileText className="h-8 w-8 text-red-400" />;
        if (mimeType.includes("image")) return <ImageIcon className="h-8 w-8 text-blue-400" />;
        return <FileIcon className="h-8 w-8 text-gray-400" />;
    };

    if (isLoading) return <Skeleton className="w-full h-[400px]" />;

    // Derived states
    const filteredDocuments = documents.filter((doc: any) =>
        doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
    const paginatedDocuments = filteredDocuments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    let totalDocs = documents.length;
    let requiredDocs = documents.filter((doc: any) => doc.isRequired).length;
    let contractDocs = documents.filter((doc: any) => doc.category === 'Contract').length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h2 className={`text-4xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Job <span className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Documents</span>
                    </h2>
                    <p className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Secure management for contracts, estimates, and compliance files.</p>
                </div>

                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 py-6 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Upload className="mr-2.5 h-5 w-5" /> Upload Document
                        </Button>
                    </DialogTrigger>
                    <DialogContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-gray-200 text-indigo-950 shadow-2xl'} min-w-[550px] rounded-3xl overflow-hidden`}>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Upload New Document</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-6">
                            <div className="space-y-2.5">
                                <Label className={`text-xs font-semibold uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Document Category</Label>
                                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                                    <SelectTrigger className={`border-0 ring-1 ${theme === 'dark' ? 'bg-white/[0.03] ring-white/10 text-white' : 'bg-slate-50 ring-slate-200 text-slate-900 shadow-sm'} rounded-xl h-12 font-medium px-4`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-slate-200 text-slate-900 shadow-2xl'} rounded-xl overflow-hidden`}>
                                        {['Contract', 'Estimate', 'Invoice', 'Change Order', 'Permit', 'Report', 'Other'].map(cat => (
                                            <SelectItem key={cat} value={cat} className="font-medium py-2.5 rounded-lg">{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className={`p-4 rounded-2xl flex items-center justify-between border-0 ring-1 ${theme === 'dark' ? 'bg-white/[0.02] ring-white/5' : 'bg-indigo-50/30 ring-indigo-100/50'}`}>
                                <div className="space-y-0.5">
                                    <Label htmlFor="required" className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Required Milestone</Label>
                                    <p className={`text-[10px] font-normal ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Mark this as an essential compliance document.</p>
                                </div>
                                <Switch
                                    id="required"
                                    checked={isRequiredDoc}
                                    onCheckedChange={setIsRequiredDoc}
                                    className="data-[state=checked]:bg-indigo-600"
                                />
                            </div>

                            <div className="pt-2">
                                <div
                                    className={`relative border-2 border-dashed rounded-3xl p-14 text-center transition-all cursor-pointer group shadow-inner ${isDragging 
                                        ? "border-indigo-600 bg-indigo-600/10 scale-[0.99]" 
                                        : theme === 'dark' ? "border-white/10 bg-white/[0.02] hover:border-indigo-500/50 hover:bg-indigo-500/5" : "border-gray-200 bg-gray-50/50 hover:border-indigo-400 hover:bg-indigo-50"
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="application/pdf"
                                        onChange={handleFileSelect}
                                        disabled={isUploading}
                                    />
                                    <div className="flex flex-col items-center justify-center space-y-4">
                                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-lg ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white text-indigo-600'}`}>
                                            <Upload className="h-7 w-7" />
                                        </div>
                                         <div className="space-y-1">
                                            <div className={`text-sm font-bold uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                                Click or drag PDF to upload
                                            </div>
                                            <div className={`text-[10px] font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-300'}`}>
                                                Maximum File Size: 25MB • PDF Only
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            {isUploading && <p className="text-sm font-bold text-indigo-500 text-center animate-pulse tracking-widest uppercase">Encryption & Upload in progress...</p>}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 ring-white/5 shadow-22xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-3xl overflow-hidden transition-all hover:scale-[1.02] group`}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className={`text-[10px] font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Repository Volume</span>
                            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50'}`}>
                                <FileIcon className={`h-4 w-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <div className={`text-5xl font-bold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {totalDocs}
                            </div>
                            <span className={`text-[10px] font-semibold pb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>FILES STORED</span>
                        </div>
                    </div>
                </Card>
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 ring-white/5 shadow-22xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-3xl overflow-hidden transition-all hover:scale-[1.02] group`}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>Executed Contracts</span>
                            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                                <FileText className={`h-4 w-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <div className={`text-5xl font-bold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {contractDocs}
                            </div>
                            <span className={`text-[10px] font-semibold pb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>ACTIVE AGREEMENTS</span>
                        </div>
                    </div>
                </Card>
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 ring-white/5 shadow-22xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-3xl overflow-hidden transition-all hover:scale-[1.02] group`}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`}>Compliance Risk</span>
                            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-rose-500/10' : 'bg-rose-50'}`}>
                                <AlertTriangle className={`h-4 w-4 ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`} />
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <div className={`text-5xl font-bold tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {requiredDocs}
                            </div>
                            <span className={`text-[10px] font-semibold pb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>HIGH PRIORITY</span>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 ring-white/5 shadow-22xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-3xl overflow-hidden`}>
                <div className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-gray-50/50'}`}>
                    <div className="space-y-1">
                        <CardTitle className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Document Archive</CardTitle>
                        <p className={`text-[11px] font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>SEARCHABLE LOG OF ALL CLOUD-STORED ASSETS</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className={`absolute left-4 top-3.5 h-4 w-4 ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-400'}`} />
                        <Input
                            placeholder="Search by title or category..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={`pl-11 h-11 transition-all rounded-xl font-medium border-0 ring-1 shadow-sm ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white focus:ring-indigo-500/50' : 'bg-white ring-slate-200 text-slate-900 focus:ring-indigo-500'}`}
                        />
                    </div>
                </div>
                <CardContent className="p-0">
                    {paginatedDocuments.length === 0 ? (
                        <div className="text-center py-20">
                            <div className={`h-16 w-16 mx-auto mb-4 rounded-3xl flex items-center justify-center ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <FileText className={`h-8 w-8 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
                            </div>
                             <p className={`font-bold text-sm uppercase tracking-widest ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>No matching documents found.</p>
                        </div>
                    ) : (
                        <div className={theme === 'dark' ? 'divide-y divide-white/5' : 'divide-y divide-gray-100'}>
                            {paginatedDocuments.map((doc: any) => (
                                <div key={doc._id} className={`flex items-center justify-between p-5 ${theme === 'dark' ? 'hover:bg-indigo-500/[0.03]' : 'hover:bg-indigo-50/30'} transition-all group relative`}>
                                    <div className="flex items-center gap-5">
                                        <div className={`p-3.5 rounded-2xl border-0 ring-1 transition-all ${theme === 'dark' ? 'bg-white/[0.03] ring-white/5 shadow-inner' : 'bg-gray-50 ring-indigo-50/50 group-hover:bg-white group-hover:shadow-md'}`}>
                                            {getFileIcon(doc.fileType || "")}
                                        </div>
                                        <div className="space-y-1.5">
                                             <div className="flex items-center gap-3">
                                                <p className={`font-bold tracking-tight transition-colors cursor-pointer text-base ${theme === 'dark' ? 'text-white group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'}`} onClick={() => window.open(doc.url, "_blank")}>
                                                    {doc.title}
                                                </p>
                                                 {doc.isRequired && (
                                                    <Badge className="bg-amber-500/10 text-amber-500 font-bold text-[9px] uppercase tracking-tighter border-0 ring-1 ring-amber-500/30 rounded-md py-0 px-2 h-4">
                                                        <AlertCircle className="h-2.5 w-2.5 mr-1" /> COMPLIANCE
                                                    </Badge>
                                                )}
                                            </div>                                             <div className={`flex items-center gap-3 text-[10px] font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>
                                                <Badge className={`px-2 py-0.5 rounded-md border-0 ring-1 font-bold text-[9px] ${
                                                    doc.category === 'Contract' ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' :
                                                    doc.category === 'Estimate' ? 'bg-indigo-500/10 text-indigo-500 ring-indigo-500/20' :
                                                    'bg-gray-500/10 text-gray-500 ring-gray-500/20'
                                                }`}>
                                                    {doc.category}
                                                </Badge>

                                                <div className={`h-1 w-1 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-indigo-100'}`} />
                                                <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                                <div className={`h-1 w-1 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-indigo-100'}`} />
                                                <span>{format(new Date(doc.createdAt), 'MMM d, yyyy')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className={`h-10 w-10 rounded-xl border-0 ring-1 shadow-sm ${theme === 'dark' ? 'bg-indigo-600 ring-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-600 text-white ring-indigo-600 hover:bg-indigo-700'}`}
                                            onClick={() => window.open(doc.url, "_blank")}
                                        >
                                            <Download className="h-4.5 w-4.5" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-xl ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-indigo-900/40 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                                                    <MoreVertical className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-gray-200 text-indigo-950'} rounded-2xl shadow-2xl p-2 min-w-[160px]`}>
                                                <DropdownMenuItem className="rounded-xl px-3 py-2.5 font-bold cursor-pointer group hover:bg-indigo-50/50" onClick={() => window.open(doc.url, "_blank")}>
                                                    <Download className="mr-3 h-4 w-4 text-indigo-500" /> View Document
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-rose-500 rounded-xl px-3 py-2.5 font-bold cursor-pointer focus:text-rose-600 focus:bg-rose-50" onClick={() => setDeleteConfirmId(doc._id)}>
                                                    <Trash2 className="mr-3 h-4 w-4" /> Delete Permanently
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className={`flex items-center justify-between p-6 border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-50'}`}>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-900/40'}`}>
                                Showing Page {currentPage} <span className="mx-1 text-gray-700">OF</span> {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={`h-10 w-10 rounded-xl border-0 ring-1 transition-all ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-white ring-gray-200 text-indigo-950'}`}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`h-10 w-10 rounded-xl border-0 ring-1 transition-all ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-white ring-gray-200 text-indigo-950'}`}
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
                <DialogContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-gray-200 text-indigo-950'} rounded-3xl overflow-hidden`}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-500 font-bold text-xl">
                            <AlertTriangle className="h-6 w-6" /> Confirm Deletion
                        </DialogTitle>
                    </DialogHeader>
                    <div className={`py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-indigo-900/80 font-medium'}`}>
                        Are you sure you want to delete this document? This action cannot be undone.
                    </div>
                    <DialogFooter className="mt-4 gap-3">
                        <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className={`rounded-xl px-6 ${theme === 'dark' ? 'border-white/10 text-white' : 'border-gray-200 text-indigo-950'}`}>
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-6 font-bold shadow-lg shadow-rose-500/20" disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending ? "Deleting..." : "Delete Document"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DocumentsTab;
