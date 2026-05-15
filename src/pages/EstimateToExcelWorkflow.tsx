import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, ArrowLeft, Download, FileSpreadsheet, Layers, CheckCircle, RefreshCcw, Loader2 } from "lucide-react";
import { default as api } from "@/services/api";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type WorkflowStep = "upload" | "download";

const EstimateToExcelWorkflow = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState<WorkflowStep>("upload");
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [excelUrl, setExcelUrl] = useState<string | null>(null);
    const [documentType, setDocumentType] = useState<"xactimate" | "symbility">("xactimate");

    const [projectName, setProjectName] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf") || selectedFile.name.endsWith(".doc") || selectedFile.name.endsWith(".docx")) {
                setFile(selectedFile);
            } else {
                toast({
                    title: "Invalid file type",
                    description: "Please upload a valid document",
                    variant: "destructive",
                });
            }
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            toast({
                title: "Missing file",
                description: "Please upload a document",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        setProgress(0);

        let intervalId: NodeJS.Timeout;

        // Smooth UI progress reaching up to 5% while waiting for upload handshake
        intervalId = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 4.9) {
                    clearInterval(intervalId);
                    return 5;
                }
                return prev + 0.5;
            });
        }, 500);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileSize", file.size.toString());
            formData.append("fileName", file.name);
            formData.append("projectName", projectName);
            formData.append("documentType", documentType);

            const response = await api.post("/estimate-to-excel/extraction", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 60000 // Fast timeout since backend queues instantly
            });

            clearInterval(intervalId);
            setProgress(5);

            const responseData = response.data;
            if (Array.isArray(responseData) && responseData.length > 0) {
                if (responseData[0].status === "Processing") {
                    toast({
                        title: "Upload Successful!",
                        description: "Your estimate is now processing in the background. It will safely take up to 30 minutes to complete.",
                        duration: 10000
                    });

                    setProgress(100);

                    setTimeout(() => {
                        navigate("/history");
                    }, 4000);
                }
            }

        } catch (error) {
            console.error("Error queueing estimate:", error);
            toast({
                title: "Error",
                description: "Failed to queue Material Selection Extraction Bot",
                variant: "destructive",
            });
            clearInterval(intervalId!);
            setIsLoading(false);
            setProgress(0);
        }
    };


    const handleDownload = () => {
        if (excelUrl) {
            const a = document.createElement('a');
            a.href = excelUrl;
            const downloadName = projectName ? `${projectName.replace(/[^a-zA-Z0-9-]/g, '_')}_Estimate.xlsx` : "Estimate.xlsx";
            a.download = downloadName;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast({
                title: "Downloaded!",
                description: "Excel file download started.",
            });
        }
    };


    const handleReset = () => {
        setFile(null);
        setExcelUrl(null);
        setProjectName("");
        setStep("upload");
    };

    return (
        <DashboardLayout>
            <div className="w-[90%] mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/services")} className="text-muted-foreground hover:text-foreground hover:bg-accent font-medium">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Material Selection Extraction Bot</h1>
                        <p className="text-muted-foreground">Convert Insurance Estimate PDFs to detailed structured Excel tabular format</p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 py-4">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === "upload" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-emerald-500 text-white"}`}>
                            {step === "download" ? <CheckCircle size={16} /> : "1"}
                        </div>
                        <span className={`text-sm font-medium ${step === "upload" ? "text-foreground" : "text-muted-foreground"}`}>Upload Document</span>
                    </div>
                    <div className="w-12 h-0.5 bg-border" />
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === "download" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : theme === "light" ? "bg-slate-100 text-slate-400" : "bg-muted text-muted-foreground"}`}>
                            2
                        </div>
                        <span className={`text-sm font-medium ${step === "download" ? "text-foreground" : "text-muted-foreground"}`}>Download Excel</span>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                        "rounded-3xl border overflow-hidden p-8 min-h-[400px]",
                        theme === "light"
                            ? "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
                            : "bg-card/50 border-border backdrop-blur-sm"
                    )}
                >
                    {step === "upload" && (
                        <div className="space-y-8">
                            <div className="text-center max-w-lg mx-auto">
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <FileSpreadsheet className="text-primary" size={32} />
                                    </div>
                                </div>
                                <Label htmlFor="pdf-upload" className="text-xl font-bold text-foreground block mb-2">Upload Estimate Document</Label>
                                <p className="text-muted-foreground">Processing can take up to 30 minutes. You can navigate away from this page after processing reaches 5%; the result will be available in your Workflow History once complete.</p>
                            </div>

                            <div className="max-w-xl mx-auto space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Project Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        className="bg-background border-border text-foreground focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
                                        placeholder="e.g. Miller Estate"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center justify-center pt-2">
                                    <div className={cn(
                                        "flex items-center p-1 rounded-2xl border transition-all w-full max-w-[400px]",
                                        theme === 'light' ? "bg-slate-100 border-slate-200" : "bg-muted/30 border-border"
                                    )}>
                                        <button
                                            type="button"
                                            onClick={() => setDocumentType("xactimate")}
                                            className={cn(
                                                "flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center",
                                                documentType === "xactimate"
                                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Xactimate Document
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDocumentType("symbility")}
                                            className={cn(
                                                "flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center",
                                                documentType === "symbility"
                                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Symbility Document
                                        </button>
                                    </div>
                                </div>

                                <input
                                    id="pdf-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="pdf-upload"
                                    className="block border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                                >
                                    {/* <Upload className="mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors" size={40} /> */}
                                    {file ? (
                                        <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium">
                                            <CheckCircle size={16} /> {file.name}
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <Upload className="mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors" size={40} />
                                            <p className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">Click or Drag File Here</p>
                                            <p className="text-sm text-muted-foreground">Supported formats (PDF, DOC/DOCX)</p>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {isLoading && (
                                <div className="max-w-xl mx-auto space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground font-medium">
                                        <span>Analyzing Document...</span>
                                        <span>{Math.floor(progress)}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2 bg-secondary" indicatorClassName="bg-primary" />
                                </div>
                            )}

                            <Button
                                onClick={handleSubmit}
                                disabled={!file || isLoading || !projectName || projectName.trim() === ""}
                                className="w-full max-w-xl mx-auto block h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all text-lg font-medium"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin" /> Processing...
                                    </span>
                                ) : (
                                    "Convert to Excel"
                                )}
                            </Button>
                        </div>
                    )}

                    {step === "download" && (
                        <div className="text-center py-8 space-y-8 max-w-2xl mx-auto">
                            <div>
                                <div className={cn(
                                    "w-20 h-20 rounded-full flex items-center justify-center mx-auto ring-4 mb-6",
                                    theme === "light" ? "bg-emerald-50 ring-emerald-100" : "bg-emerald-500/20 ring-emerald-500/10"
                                )}>
                                    <FileSpreadsheet className="text-emerald-500" size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">Conversion Complete!</h3>
                                <p className="text-muted-foreground text-sm">Estimate details have been structured into a detailed Excel file.</p>
                            </div>

                            <div className="flex gap-4 justify-center mt-8">
                                <Button onClick={handleDownload} className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-8 shadow-lg shadow-indigo-500/20">
                                    <Download size={18} />
                                    Download Excel
                                </Button>
                                <Button onClick={handleReset} variant="outline" className={cn(
                                    "h-12 gap-2 px-8",
                                    theme === "light"
                                        ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                        : "border-border bg-accent hover:bg-accent/80 text-accent-foreground"
                                )}>
                                    <RefreshCcw size={18} />
                                    Process Another
                                </Button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </DashboardLayout>
    );
};

export default EstimateToExcelWorkflow;
