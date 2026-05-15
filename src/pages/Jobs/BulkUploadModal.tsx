import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUp, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useContacts } from "@/hooks/useContacts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BulkUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const { bulkUpload } = useContacts();
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<{ count: number; skippedCount: number; message: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        
        setStatus('uploading');
        try {
            const res = await bulkUpload(file);
            setResult(res);
            setStatus('success');
            toast.success(`Upload complete: ${res.count} imported, ${res.skippedCount || 0} skipped`);
            // Don't close immediately so user can see summary
        } catch (error: any) {
            setStatus('error');
            toast.error(error.response?.data?.message || "Upload failed");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Bulk Upload Contacts</DialogTitle>
                    <DialogDescription>
                        Upload an Excel file (.xlsx) to import contacts. Data will be categorized automatically based on the "Bill To Contact Type" column.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed rounded-xl border-muted hover:border-indigo-500/50 transition-colors bg-muted/20 relative group">
                    <input 
                        type="file" 
                        accept=".xlsx, .xls" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleFileChange}
                        disabled={status === 'uploading'}
                    />
                    
                    {status === 'idle' && (
                        <>
                            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-110 transition-transform">
                                <FileUp size={24} />
                            </div>
                            <p className="text-sm font-bold">{file ? file.name : "Click or drag to upload Excel"}</p>
                            <p className="text-xs text-muted-foreground mt-1">Maximum file size: 10MB</p>
                        </>
                    )}

                    {status === 'uploading' && (
                        <div className="flex flex-col items-center">
                            <Loader2 size={32} className="animate-spin text-indigo-500 mb-4" />
                            <p className="text-sm font-bold">Processing file...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center text-emerald-500">
                            <CheckCircle2 size={32} className="mb-4" />
                            <p className="text-sm font-bold">Upload Complete!</p>
                            <p className="text-xs mt-1 font-semibold">{result?.count} contacts imported</p>
                            {result?.skippedCount && result.skippedCount > 0 && (
                                <p className="text-[10px] text-muted-foreground mt-1">{result.skippedCount} rows skipped (uncategorized)</p>
                            )}
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center text-rose-500">
                            <AlertCircle size={32} className="mb-4" />
                            <p className="text-sm font-bold">Upload Failed</p>
                            <p className="text-xs mt-1">Please check your file format</p>
                        </div>
                    )}
                </div>

                <div className="bg-muted/30 p-4 rounded-lg flex items-start gap-3">
                    <FileText size={18} className="text-indigo-500 mt-0.5" />
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-widest opacity-60">Excel Header Requirements</p>
                        <p className="text-xs leading-relaxed mt-1">
                            Use headers: <span className="font-bold">Individual Name</span>, <span className="font-bold">Company Name</span>, <span className="font-bold">Main Phone</span>, and <span className="font-bold">Bill To Contact Type</span> for proper mapping.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={status === 'uploading'}>Cancel</Button>
                    <Button 
                        onClick={handleUpload} 
                        disabled={!file || status === 'uploading' || status === 'success'}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                    >
                        {status === 'uploading' ? <Loader2 size={16} className="animate-spin" /> : "Start Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
