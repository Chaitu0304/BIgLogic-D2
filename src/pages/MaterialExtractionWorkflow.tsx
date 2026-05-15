import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, ArrowLeft, Download, FileSpreadsheet, Send, Layers, CheckCircle, RefreshCcw, Loader2 } from "lucide-react";
import axios from "axios";
import { workflowService, default as api } from "@/services/api";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

type WorkflowStep = "upload" | "download";

const MaterialExtractionWorkflow = () => {

  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<WorkflowStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [excelUrl, setExcelUrl] = useState<string | null>(null);
  const [emails, setEmails] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  // New Manual Inputs
  const [pmName, setPmName] = useState("");
  const [jobName, setJobName] = useState("");
  // Workflow ID for later actions
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  const [projectName, setProjectName] = useState("");


  const [selections, setSelections] = useState<any[]>([]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);

      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "Missing file",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setUploadProgress(0);

    // Simulation: Progress from 0 to 100 in exactly 4 minutes (240 seconds)
    let intervalId: NodeJS.Timeout;

    // Updates every 100ms
    // Total steps = 240s * 10 = 2400 steps
    // Increment per step = 100 / 2400 = 0.041666...
    const duration = 240 * 1000; // 4 minutes
    const intervalTime = 100;
    const increment = 100 / (duration / intervalTime);

    intervalId = setInterval(() => {
      const updateFn = (prev: number) => {
        if (prev >= 99) {
          return 99;
        }
        return prev + increment;
      };

      setProgress(updateFn);
      setUploadProgress(updateFn);
    }, intervalTime);

    try {
      const formData = new FormData();
      formData.append("file", file); // Middleware expects 'file'
      formData.append("fileSize", file.size.toString());
      formData.append("fileName", file.name);
      formData.append("projectName", projectName);
      // Restore manual inputs
      formData.append("pmName", pmName);
      formData.append("jobName", jobName);


      // Call backend API instead of N8N directly
      const response = await api.post("/material-extraction/extraction", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 900000 // 15 minutes
      });

      console.log("Response", response);
      // Clear simulation interval and set to 100
      clearInterval(intervalId);
      setProgress(100);
      setUploadProgress(100);

      const responseData = response.data;
      console.log("Response Data", responseData);

      // Extract Workflow ID if present
      if (Array.isArray(responseData) && responseData.length > 0) {
        if (responseData[0].workflowId) {
          setWorkflowId(responseData[0].workflowId);
        }
      }

      // New Response Parsing Logic (Array of objects, for n8n standard)
      if (Array.isArray(responseData) && responseData.length > 0) {
        // Check if the response is nested (backend sends [[{...}]]) or flat [{...}]
        // Based on user report: [ { "selections": [...] } ]

        let firstItem = responseData[0];
        // Handle potential nested array from backend if it wraps N8N output
        if (Array.isArray(firstItem)) {
          firstItem = firstItem[0];
        }

        // Extract Metadata attached by backend
        if (firstItem.workflowId) setWorkflowId(firstItem.workflowId);

        // Usage of Backend Generated Download URL
        if (firstItem.downloadUrl) {
          setExcelUrl(firstItem.downloadUrl);

          const extractSelections = firstItem.selections || (firstItem.json && firstItem.json.selections);
          if (extractSelections && Array.isArray(extractSelections)) {
            setSelections(extractSelections);
          }

          setStep("download");
          toast({
            title: "Extraction Complete!",
            description: "Material selections have been extracted and Excel file is ready.",
          });
        } else {
          // If downloadUrl is missing BUT we have selections, we can assume backend failed to upload or assign URL
          // However, checking the user provided payload: it contains 'selections'.
          // The backend SHOULD have attached 'downloadUrl' and 'workflowId' to the response.
          // If they are missing, it means backend logic might have branched to "res.json(responseData)" 
          // WITHOUT attaching metadata if it considered responseData "empty" or structure assumed wrong.

          // Let's permit transition if selections exist, even if downloadUrl is missing, 
          // but warn user or disable download. Ideally fix backend, but here we handle frontend resilience.
          const extractSelections = firstItem.selections || (firstItem.json && firstItem.json.selections);

          if (extractSelections && Array.isArray(extractSelections)) {
            // We have data but no Excel URL. 
            // Backend generates Excel. If URL missing, maybe try to use the raw data?
            // For now, let's look for ANY downloadUrl in the object keys just in case.
            console.warn("Missing downloadUrl in response", firstItem);

            // If we have selections, we can technically execute. 
            // But the 'Download' button relies on 'excelUrl'.
            // We will throw error for now to enforce backend correctness, 
            // OR check if we can fallback.
            throw new Error("Backend did not return a valid Excel download URL.");
          } else {
            throw new Error("Extraction completed but no valid data or file URL returned.");
          }
        }
      } else {
        throw new Error("Invalid response format: Unexpected JSON structure");
      }

    } catch (error) {
      console.error("Error extracting materials:", error);
      toast({
        title: "Error",
        description: "Failed to extract material selections",
        variant: "destructive",
      });
    } finally {
      clearInterval(intervalId!);
      setIsLoading(false);
      setProgress(0);
    }

  };


  const handleDownload = () => {
    if (excelUrl) {
      const a = document.createElement('a');
      a.href = excelUrl;
      // If it's a signed URL from S3, it might already include content-disposition, but setting download attr is good practice.
      // We don't know the exact name, but "Materials_Selection.xlsx" is safe default.
      a.download = `${projectName}_MaterialsSelection.xlsx`;
      a.target = "_blank"; // Open in new tab if download/content-disposition issues occur
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
    setResultBlob(null);
    setExcelUrl(null);
    setResultBlob(null);
    setEmails("");
    setPmName("");
    setJobName("");
    setProjectName("");
    setWorkflowId(null);
    setStep("upload");

  };

  const handleSendEmail = async () => {
    if (!emails) {
      toast({
        title: "Missing emails",
        description: "Please enter at least one email address",
        variant: "destructive",
      });
      return;
    }


    setIsSendingEmail(true);

    try {
      // Logic Update: send workflowId and emails, backend retrieves rest.
      const payload = {
        emails: emails,
        workflowId: workflowId,
        projectName: projectName,
      };

      const response = await api.post("/material-extraction/email", payload);
      if (response.status === 200) {
        toast({
          title: "Email Sent",
          description: "The report has been emailed successfully.",
        });
        setEmails("");
      }

    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };


  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/services")} className="text-muted-foreground hover:text-foreground hover:bg-accent">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Material Extraction</h1>
            <p className="text-muted-foreground">Extract homeowner material selections from Xactimate PDFs</p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === "upload" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-emerald-500 text-white"}`}>
              {step === "download" ? <CheckCircle size={16} /> : "1"}
            </div>
            <span className={`text-sm font-medium ${step === "upload" ? "text-foreground" : "text-muted-foreground"}`}>Upload PDF</span>
          </div>
          <div className="w-12 h-0.5 bg-border" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step === "download" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground"}`}>
              2
            </div>
            <span className={`text-sm font-medium ${step === "download" ? "text-foreground" : "text-muted-foreground"}`}>Download Excel</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden p-8 min-h-[400px]"
        >
          {/* Step 1: Upload */}
          {step === "upload" && (
            <div className="space-y-8">
              <div className="text-center max-w-lg mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Layers className="text-primary" size={32} />
                  </div>
                </div>
                <Label htmlFor="pdf-upload" className="text-xl font-bold text-foreground block mb-2">Upload Xactimate Estimate PDF</Label>
                <p className="text-muted-foreground">Processing typically takes about 3-4 minutes depending on file size.</p>
              </div>

              <div className="max-w-xl mx-auto space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Project Name <span className="text-red-500">*</span></Label>
                  <Input
                    className="bg-background border-border text-foreground"
                    placeholder="e.g. Miller Estate"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                <input
                  id="pdf-upload"

                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="pdf-upload"
                  className="block border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <Upload className="mx-auto mb-4 text-muted-foreground group-hover:text-primary transition-colors" size={40} />
                  {file ? (
                    <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-lg font-medium">
                      <CheckCircle size={16} /> {file.name}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">Click or Drag File Here</p>
                      <p className="text-sm text-muted-foreground">PDFs only (Max 10MB)</p>
                    </div>
                  )}
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pmName" className="text-muted-foreground">PM Name</Label>
                  <Input
                    id="pmName"
                    placeholder="Enter PM Name"
                    value={pmName}
                    onChange={(e) => setPmName(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobName" className="text-muted-foreground">Job Name / Homeowner</Label>
                  <Input
                    id="jobName"
                    placeholder="Enter Job or Homeowner Name"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
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
                disabled={!file || isLoading || !projectName || projectName.trim() === "" || !pmName || pmName.trim() === "" || !jobName || jobName.trim() === ""}
                className="w-full max-w-xl mx-auto block h-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all text-lg font-medium"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" /> Processing...
                  </span>
                ) : (
                  "Start Extraction"
                )}
              </Button>
            </div>
          )}

          {/* Step 2: Download */}
          {step === "download" && (
            <div className="text-center py-8 space-y-8 max-w-2xl mx-auto">
              <div>
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/10 mb-6 animate-pulse">
                  <FileSpreadsheet className="text-emerald-500" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Extraction Complete!</h3>
                <p className="text-muted-foreground">Material selections have been organized into a structured Excel file.</p>
              </div>

              <div className="bg-muted/30 border border-border p-6 rounded-2xl text-left space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-wide text-muted-foreground border-b border-border pb-2">Project Details & Email</h4>

                {/* PM Name / Job Name removed as requested, using extracted data now */}

                <div className="space-y-2 pt-2">
                  <Label htmlFor="emails" className="text-muted-foreground">Recipient Emails (comma separated)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="emails"
                      placeholder="client@example.com, pm@example.com"
                      value={emails}
                      onChange={(e) => setEmails(e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                    <Button
                      onClick={handleSendEmail}
                      disabled={isSendingEmail || !emails || !workflowId}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isSendingEmail ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={handleDownload} className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white gap-2 px-8 shadow-lg shadow-emerald-500/20">
                  <Download size={18} />
                  Download Excel
                </Button>
                <Button onClick={handleReset} variant="secondary" className="h-12 border border-border bg-accent hover:bg-accent/80 text-accent-foreground gap-2 px-8">
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

export default MaterialExtractionWorkflow;
