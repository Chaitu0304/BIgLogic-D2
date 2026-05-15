import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Upload, Calendar as CalendarIcon, ArrowLeft, ArrowRight, Loader2, FileText, CheckCircle, RotateCcw, Download, ChevronLeft, ChevronRight, Send, Loader2Icon, PlayCircle, Eye, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import axios from "axios";
import { workflowService, default as api } from "@/services/api";
import { Progress } from "@/components/ui/progress";
import SignaturePad from "@/components/SignaturePad";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import * as XLSX from 'xlsx';
import { CurrencyInput } from "@/components/CurrencyInput";
import { useTheme } from "@/components/ThemeProvider";

const STEPS: WorkflowStep[] = ["upload", "select", "schedule", "download"];

type WorkflowStep = "upload" | "select" | "schedule" | "download";

interface ScheduleItem {
  id: string;
  order: string;
  description: string;
  amount: number;
  percentage?: number;
}

interface SelectItem {
  id: string;
  name: string;
  value: number;
  selected: boolean;
  percentage?: number;
}

const XactimateWorkflow = () => {
  const isFixedItem = (description: string) => {
    const desc = description.toLowerCase();
    return desc.includes("down payment") ||
      desc.includes("deposit") ||
      desc.includes("deductible") ||
      desc.includes("retention") ||
      desc.includes("touch-up");
  };


  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<WorkflowStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<{ name: string, url?: string } | null>(null);

  const handleDownloadExisting = async () => {
    if (existingFile && existingFile.url) {
      try {
        // For S3 paths we ideally need a signed URL from backend
        // If url starts with http it might be public or pre-signed, if just path we need to fetch
        let url = existingFile.url;
        if (!url.startsWith('http')) {
          const res = await api.get(`/files/download?key=${encodeURIComponent(url)}`);
          url = res.data.url;
        }
        window.open(url, '_blank');
      } catch (e) {
        console.error("Failed to open file", e);
        toast({ title: "Error", description: "Could not open file", variant: "destructive" });
      }
    }
  };
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectProgress, setSelectProgress] = useState(0);
  const [scheduleProgress, setScheduleProgress] = useState(0);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);

  // Step 2: Select Items
  const [selectItems, setSelectItems] = useState<SelectItem[]>([]);
  const [deductAmount, setDeductAmount] = useState<number | string>("");
  const [downPayment, setDownPayment] = useState<number | string>("");
  const [projectName, setProjectName] = useState("");
  const [retentionAmount, setRetentionAmount] = useState<number | string>("");
  console.log(deductAmount, "deductAmount");
  console.log(downPayment, "downPayment");
  console.log(retentionAmount, "retentionAmount");
  const formatCurrency = (value: string | number) => {
    if (value === "") return "";
    const numberValue = Number(value);
    if (isNaN(numberValue)) return "";
    return numberValue.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const validateCurrencyInput = (value: string) => {
    // Allow digits and one dot, max 2 decimals
    const clean = value.replace(/[^0-9.]/g, "");
    if (/^\d*\.?\d{0,2}$/.test(clean)) return clean;
    return null;
  };

  const formatInputDisplay = (value: string | number) => {
    if (value === "" || value === undefined || value === null) return "";
    const str = value.toString();
    const isNegative = str.startsWith('-');
    const cleanStr = isNegative ? str.substring(1) : str;
    const parts = cleanStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (isNegative ? '-' : '') + parts.join('.');
  };


  const [usePercentageSplit, setUsePercentageSplit] = useState(false);

  // Step 3: Schedule Editor
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([

  ]);

  const [pdfData, setPdfData] = useState<string | null>(null);
  const [totalRCV, setTotalRCV] = useState<number>(0);
  const [client, setClient] = useState<object>({});
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [updatedContractAmount, setUpdatedContractAmount] = useState<number>(0);


  // New State for Credits & Workflow Type
  const [workflowType, setWorkflowType] = useState<"xactimate" | "symbility">("xactimate");
  const [showCredits, setShowCredits] = useState(false);
  const [credits, setCredits] = useState<{ id: string; description: string; amount: number | string }[]>([]);
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  // Email State
  const [emails, setEmails] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  // Resume Workflow State
  const [pendingWorkflows, setPendingWorkflows] = useState<any[]>([]);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [isScheduleEditing, setIsScheduleEditing] = useState(false);

  useEffect(() => {
    if (location.state && location.state.workflowId) {
      handleResume({ _id: location.state.workflowId }, location.state.editMode || false);
      // Clear state so refresh doesn't trigger again? 
      // history.replaceState({}, ''); // Optional but good practice
    }
  }, [location.state]);

  /* Removed Pending Workflow Popup */
  // useEffect(() => {
  //   const checkPending = async () => { ... }
  //   checkPending();
  // }, []);

  /* Removed Pending Workflow Popup */
  // useEffect(() => {
  //   const checkPending = async () => { ... }
  //   checkPending();
  // }, []);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const handleResume = async (wf: any, editMode: boolean = false) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/xactimate/resume/${wf._id}`);
      const fullWf = res.data;
      const details = fullWf.details || {};
      console.log(details);

      setWorkflowId(fullWf._id);
      setProjectName(fullWf.projectName || "");
      if (details.startDate) setStartDate(new Date(details.startDate));
      if (details.endDate) setEndDate(new Date(details.endDate));

      if (details.client) setClient(details.client);
      if (details.totalAmount) setTotalAmount(details.totalAmount);

      // Restore Credits & Amounts
      if (details.credits) {
        setCredits(details.credits);
        if (details.credits.length > 0) setShowCredits(true);
      }
      if (details.deductAmount !== undefined && details.deductAmount !== null) setDeductAmount(details.deductAmount);
      if (details.downPayment !== undefined && details.downPayment !== null) setDownPayment(details.downPayment);
      if (details.retentionAmount !== undefined && details.retentionAmount !== null) setRetentionAmount(details.retentionAmount);
      setUsePercentageSplit(!!details.isSplitted);

      // Set existing file info if available
      if (fullWf.inputFiles && fullWf.inputFiles.length > 0) {
        setExistingFile({
          name: fullWf.inputFiles[0].originalName,
          url: fullWf.inputFiles[0].path // This is S3 key or URL depending on backend, ideally use a download/view link logic
        });
      }

      // Restore Step Data
      if (fullWf.currentStep === 'select') {
        const items = details.selectItems || [];
        setSelectItems(items);
        setStep('select');
        setMaxStepReached(1);

        // Ensure totalAmount is set correctly if it wasn't in details separately
        if (!details.totalAmount && items.length > 0) {
          // Recalculate or rely on saved total? N8N passes it, we saved it.
        }
      } else if (fullWf.currentStep === 'schedule') {
        setSelectItems(details.selectItems || []); // Keep select items for reference/back
        setScheduleItems(details.scheduleItems || []);
        setStep('schedule');
        setMaxStepReached(2);
      } else if (fullWf.currentStep === 'upload') {
        // Just restore form data
        setStep('upload');
      }

      if (editMode) {
        setIsEditMode(true);
        // Start editing from Selection Step
        setStep('select');
        setMaxStepReached(2);
        // Ensure select items are populated
        const items = details.selectItems || [];
        setSelectItems(items);
      }

      setShowResumeDialog(false);
      setIsLoading(false);
      toast({ title: "Workflow Resumed", description: `Resumed ${fullWf.projectName}` });
    } catch (e) {
      console.error("Resume failed", e);
      setIsLoading(false);
      toast({ title: "Resume Failed", description: "Could not load saved state", variant: "destructive" });
    }
  };

  const addCredit = () => {
    setCredits([...credits, { id: Math.random().toString(36).substr(2, 9), description: "", amount: 0 }]);
  };

  const removeCredit = (id: string) => {
    setCredits(credits.filter(c => c.id !== id));
  };

  const updateCredit = (id: string, field: "description" | "amount", value: any) => {
    setCredits(credits.map(c => {
      if (c.id === id) {
        if (field === "amount") {
          // Allow editing as string for decimals
          // Auto-negate logic: If user types positive number, make it negative? 
          // But strict editing is better: Just ensure valid format.
          // Let's rely on user entering "-" or we handle it.
          // Actually original logic forced negative.
          // Let's allowing typing.
          let val = value.toString();

          // Remove commas first
          val = val.replace(/,/g, '');

          // Remove invalid chars but keep - and .
          val = val.replace(/[^0-9.-]/g, '');

          // Ensure max 2 decimals
          if (!/^-?\d*\.?\d{0,2}$/.test(val)) return c;

          // Auto-add negative if missing and not empty/just minus
          if (val !== "" && val !== "-" && !val.startsWith("-")) {
            val = "-" + val;
          }

          // Remove leading zeros (e.g. -01 -> -1) but allow -0.
          if (/^-0\d/.test(val)) {
            val = val.replace(/^-0/, '-');
          }

          return { ...c, amount: val };
        }
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if ((!file && !existingFile) || !startDate || !endDate) {
      toast({
        title: "Missing information",
        description: "Please upload a PDF (or use existing) and select both dates",
        variant: "destructive",
      });
      return;
    }
    if (showCredits && credits.length == 0) {
      toast({
        title: "Missing Credits",
        description: "Please add at least one credit line or uncheck the 'Show Credits' option.",
        variant: "destructive",
      });
      return;
    }
    // ... validation ...

    const formData = new FormData();

    // Add text fields BEFORE file to ensure proper parsing on all backend configurations (Multer/Busboy)
    formData.append("startDate", format(startDate, "yyyy-MM-dd"));
    formData.append("endDate", format(endDate, "yyyy-MM-dd"));
    formData.append("projectName", projectName);
    if (workflowId) {
      formData.append("workflowId", workflowId);
    }
    formData.append("workflowType", workflowType);

    // Pass Financial Fields
    // Ensure we send "0" if empty to avoid undefined
    formData.append("deductAmount", deductAmount !== "" ? deductAmount.toString() : "0");
    formData.append("downPayment", downPayment !== "" ? downPayment.toString() : "0");
    formData.append("retentionAmount", retentionAmount !== "" ? retentionAmount.toString() : "0");
    formData.append("credits", JSON.stringify(credits));

    // File last
    if (file) {
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("fileSize", file.size.toString());
      formData.append("fileType", file.type);
    }

    setIsLoading(true);
    setUploadProgress(0);
    setProgress(0);

    // Simulation: Progress from 0 to 100 in exactly 2 minutes (120 seconds)
    // IMPORTANT: n8n takes time to process. We simulate this wait time.
    let intervalId: NodeJS.Timeout;

    // Updates every 100ms
    // Total steps = 120s * 10 = 1200 steps
    // Increment per step = 100 / 1200 = 0.08333...
    const duration = 40 * 1000; // 40 seconds
    const intervalTime = 100;
    const increment = 100 / (duration / intervalTime);

    intervalId = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          return 99;
        }
        return prev + increment;
      });
    }, intervalTime);

    const config = {
      onUploadProgress: (progressEvent: any) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
        // If upload is done, start the processing timer effect visually if needed, 
        // effectively handled by state 'uploadProgress'
      },
    };

    try {
      // 1. Log start of workflow to backend
      const backendFormData = new FormData();
      if (file) {
        backendFormData.append("files", file);
      }
      backendFormData.append("workflowType", "Xactimate Processing");
      backendFormData.append("details", JSON.stringify({
        fileName: file ? file.name : existingFile?.name,
        fileSize: file ? file.size : 0,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd")
      }));

      try {
        await workflowService.createWorkflow(backendFormData);
      } catch (err) {
        console.error("Failed to log workflow to backend:", err);
      }

      // Use backend API instead of direct N8N
      const response = await api.post("/xactimate/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-Type' },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || (file ? file.size : 100);
          const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(percentCompleted);
        }
      });
      console.log("response", response);

      if (response.data.workflowId) {
        setWorkflowId(response.data.workflowId);
      }

      clearInterval(intervalId);
      setProgress(100);

      // Add a small delay to show 100% completion before moving to next step
      setTimeout(() => {
        // Backend returns { workflowId, n8nData: [...] }
        // We need to access n8nData[0]
        const n8nData = response.data.n8nData;
        const total = n8nData[0].Total;
        setSelectItems([...n8nData[0].rows])
        setClient(n8nData[0].client)
        setTotalAmount(total)
        setTotalRCV(total)
        setUpdatedContractAmount((totalAmount + credits.reduce((acc, c) => acc + Number(c.amount), 0)));

        // Remove auto-calculation. We now use the user input from Step 1.
        // Retention and Down Payment remain as set in state.

        setIsLoading(false);
        setStep("select");
        if (maxStepReached < 1) setMaxStepReached(1);
        toast({
          title: "Upload successful",
          description: "PDF processed. Please select items to include.",
        });
      }, 1000);

    } catch (error: any) {
      setIsLoading(false);
      clearInterval(intervalId!);
      setProgress(0);
      toast({
        title: "Upload failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };
  console.log(file, startDate, endDate);

  const handleSelectSubmit = async () => {
    const selectedCount = selectItems.filter((item) => item.selected).length;
    if (selectedCount === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item",
        variant: "destructive",
      });
      return;
    }

    // REMOVED early return - we now save state to backend even in percentage mode
    // if (usePercentageSplit) { ... return; }

    setIsLoading(true);
    setSelectProgress(0);

    // Simulation: Progress from 0 to 100 in exactly 2 minutes (120 seconds)
    let intervalId: NodeJS.Timeout;

    // Updates every 100ms
    // Total steps = 120s * 10 = 1200 steps
    // Increment per step = 100 / 1200 = 0.08333...
    const duration = 120 * 1000; // 2 minutes
    const intervalTime = 100;
    const increment = 100 / (duration / intervalTime);

    intervalId = setInterval(() => {
      setSelectProgress((prev) => {
        if (prev >= 99) {
          return 99;
        }
        return prev + increment;
      });
    }, intervalTime);

    let selectedItems = selectItems;
    if (usePercentageSplit) {
      selectedItems = selectedItems.map((item) => {
        return {
          ...item,
          percentage: item.percentage || 0,
          value: item.percentage ? calculateValueFromPercentage(item.percentage) : item.value
        }
      });
    }
    console.log(selectItems);
    console.log(selectItems);

    const endpoint = usePercentageSplit ? "/xactimate/select-percentage" : "/xactimate/select";

    await api.post(endpoint, {
      selectItems: selectedItems,
      client,
      totalAmount,
      updatedContractAmount: (totalAmount + credits.reduce((acc, c) => acc + Number(c.amount), 0)),
      deductAmount: Number(deductAmount),
      downPayment: Number(downPayment),
      retentionAmount: Number(retentionAmount),
      isSplitted: usePercentageSplit,
      credits,
      workflowType,
      workflowId
    }, {
      timeout: 900000 // 15 minutes
    })
      .then((response) => {
        console.log("response2 ...->", response);
        clearInterval(intervalId);
        setSelectProgress(100);

        setTimeout(() => {
          setScheduleItems([...response.data[0].drawSchedule])
          setIsLoading(false);
          setStep("schedule");
          if (maxStepReached < 2) setMaxStepReached(2);
          toast({
            title: "Items confirmed",
            description: "Now review and edit the draw schedule",
          });
        }, 500);
      })
      .catch((error) => {
        clearInterval(intervalId);
        setSelectProgress(0);
        setIsLoading(false);
        toast({
          title: "Items failed",
          description: error.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      });
  };

  const handleScheduleSubmit = async () => {
    try {
      setIsLoading(true);
      setScheduleProgress(0);

      // Simulation: Progress to 99%
      let intervalId: NodeJS.Timeout;
      const duration = 120 * 1000; // 2 minutes simulation
      const intervalTime = 100;
      const increment = 100 / (duration / intervalTime);

      intervalId = setInterval(() => {
        setScheduleProgress((prev) => {
          if (prev >= 99) return 99;
          return prev + increment;
        });
      }, intervalTime);

      // Call backend which returns { success: true, url: "signed-s3-url" }
      const res = await api.post("/xactimate/schedule", {
        scheduleItems,
        client,
        startDate,
        endDate,
        credits,
        workflowType,
        totalAmount,
        updatedContractAmount,
        deductAmount: Number(deductAmount),
        downPayment: Number(downPayment),
        retentionAmount: Number(retentionAmount),
        isSplitted: usePercentageSplit,
        selectItems: selectItems,
        workflowId // Update the workflow with the output file
      }, {
        timeout: 900000 // 15 minutes
      });

      if (res.status === 200 && res.data.url && res.data.pdfBase64) {
        console.log("Res", res);

        // Convert Base64 string to Blob directly to avoid CORS issues with S3 fetch
        const byteCharacters = atob(res.data.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        clearInterval(intervalId);
        setScheduleProgress(100);

        const pdfUrl = URL.createObjectURL(blob);
        setPdfData(pdfUrl);
        setPdfBlob(blob);

        setTimeout(() => {
          setStep("download");
          setIsLoading(false);
          if (maxStepReached < 3) setMaxStepReached(3);
          toast({
            title: "Schedule submitted",
            description: "Your draw schedule has been finalized",
          });
        }, 500);
      } else {
        throw new Error("Failed to generate PDF URL");
      }

    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      setScheduleProgress(0);
      toast({
        title: "Schedule failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const updateSelectItem = (id: string, field: keyof SelectItem, value: any) => {
    const updatedItems = selectItems.map((item) => {
      if (item.id === id) {
        // If unselecting an item, clear its percentage
        if (field === 'selected' && value === false) {
          return { ...item, selected: false, percentage: 0 };
        }
        return { ...item, [field]: value };
      }
      return item;
    });

    if (usePercentageSplit && field === 'selected') {
      setSelectItems(calculateProportionalPercentages(updatedItems));
    } else {
      setSelectItems(updatedItems);
    }
  };

  const handlePercentageChange = (id: string, value: string) => {
    // Allow empty string to clear the field
    if (value === "") {
      updateSelectItem(id, 'percentage', 0);
      return;
    }

    // Strict Integer Validation
    const numValue = Number(value);

    // Check if it's a valid integer (no decimals)
    if (!Number.isInteger(numValue)) {
      return;
    }

    // Check range 0-100
    if (numValue < 0 || numValue > 100) {
      return;
    }

    updateSelectItem(id, 'percentage', numValue);
  };

  const calculateTotalPercentage = () => {
    return selectItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.percentage || 0), 0);
  };

  const validateAndSubmit = () => {
    if (usePercentageSplit) {
      const totalPercentage = calculateTotalPercentage();
      if (Math.abs(totalPercentage - 100) > 0.01) { // Allow for floating point imprecision
        toast({
          title: "Invalid Percentages",
          description: `Total percentage must be 100%. Current total: ${totalPercentage.toFixed(2)}%`,
          variant: "destructive",
        });
        return;
      }

      // Check for 0% items
      for (const item of selectItems) {
        if (item.selected) {
          if (!item.percentage || item.percentage <= 0) {
            toast({
              title: "Invalid Percentage",
              description: `Item "${item.name}" must have a percentage greater than 0%`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    }
    handleSelectSubmit();
  };

  const updateScheduleItem = (id: string, field: keyof ScheduleItem, value: any) => {
    setScheduleItems(
      scheduleItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateBalanceRemaining = () => {
    const totalCredits = credits.reduce((acc, c) => acc + Number(c.amount), 0);
    return (totalAmount + totalCredits) - Number(downPayment) - Math.max(0, Number(deductAmount) - Number(downPayment)) - Number(retentionAmount);
  }

  const calculateValueFromPercentage = (percentage: number) => {
    const balance = calculateBalanceRemaining();
    return (balance * percentage) / 100;
  };

  const calculateProportionalPercentages = (items: SelectItem[]) => {
    const balance = calculateBalanceRemaining();

    // If balance is 0 or negative, we cannot use the formula; return items with 0%
    if (balance <= 0) {
      return items.map(item => ({ ...item, percentage: 0 }));
    }

    return items.map(item => {
      if (!item.selected) return { ...item, percentage: 0 };
      
      // FORMULA: (Original RCV / Total Balance Remaining) * 100
      const rawPercentage = (Number(item.value) / balance) * 100;
      let p;
      
      if (rawPercentage > 0 && rawPercentage < 1) {
        // Minimum 1% for any selected item to avoid 0% issues (e.g., 0.137% rounds to 1%)
        p = 1;
      } else {
        p = Math.round(rawPercentage);
      }
      
      return { ...item, percentage: p };
    });
  };

  const handleDownloadXLS = () => {
    try {
      const excelData = scheduleItems.map(item => {
        const row: any = {
          Description: item.description,
          Amount: Number(item.amount)
        };
        if (!usePercentageSplit) {
          row.Order = item.order;
        }
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Draw Schedule");
      const filename = `${projectName || 'Project'}_Draw_Schedule.xlsx`;
      XLSX.writeFile(wb, filename);

      toast({
        title: "Download Started",
        description: "Your Excel file is being downloaded.",
      });
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast({
        title: "Download Failed",
        description: "Could not generate Excel file.",
        variant: "destructive",
      });
    }
  };

  const currentStepIndex = STEPS.indexOf(step);

  const handleRestart = () => {
    setFile(null);
    setExistingFile(null);
    setProjectName("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectItems([]);
    setScheduleItems([]);
    setPdfData(null);
    setStep("upload");
    setProgress(0);
    setSelectProgress(0);
    setIsLoading(false);
    setMaxStepReached(0);
    // Reset new state variables
    setDeductAmount("");
    setDownPayment("");
    setRetentionAmount("");
    setUsePercentageSplit(false);
    setCredits([]);
    setWorkflowId(null);
    setShowCredits(false);
    setEmails("");
    setIsSendingEmail(false);
    setPdfBlob(null);
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
      if (!pdfBlob) {
        toast({
          title: "Error",
          description: "PDF not generated yet",
          variant: "destructive",
        });
        setIsSendingEmail(false);
        return;
      }

      const formData = new FormData();
      formData.append("client", JSON.stringify(client));
      formData.append("file", pdfBlob, "Contract.pdf");
      formData.append("emails", emails);
      formData.append("projectName", projectName);


      // TODO: Replace with actual webhook URL
      const response = await api.post("/xactimate/email", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

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
    <DashboardLayout fullWidth={true}>
      <div className="w-[80%] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/services")} className="text-muted-foreground hover:text-foreground hover:bg-accent">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Contract Processing</h1>
              <p className="text-muted-foreground">Generate Contract and Draw Schedule</p>
            </div>
          </div>

          {/* Top Restart button only shown in first and last step or if preferred globally. 
               User asked for bottom buttons, so we can hide this or keep it. 
               Keeping it as a secondary option for now. */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestart}
            className={cn(
              "text-muted-foreground hover:text-foreground border shadow-sm",
              theme === "light"
                ? "bg-white hover:bg-slate-50 border-slate-200"
                : "bg-accent hover:bg-accent/80 border-border backdrop-blur-md"
            )}
          >
            <RotateCcw size={16} className="mr-2" /> Reset
          </Button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto w-full">
          {["upload", "select", "schedule", "download"].map((s, idx) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-colors ${step === s
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : idx < currentStepIndex
                    ? "bg-emerald-500 text-white"
                    : theme === "light" ? "bg-slate-200 text-slate-500" : "bg-muted text-muted-foreground"
                  }`}
              >
                {idx < currentStepIndex ? <CheckCircle size={18} /> : idx + 1}
              </div>
              {idx < 3 && <div className={`flex-1 h-0.5 mx-2 ${idx < currentStepIndex ? "bg-emerald-500/50" : theme === "light" ? "bg-slate-200" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "rounded-3xl border overflow-hidden p-8",
            theme === "light"
              ? "bg-white border-slate-300/40 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
              : "bg-card/50 border-border backdrop-blur-sm"
          )}
        >
          {/* Step 1: Upload Form */}
          {step === "upload" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Step 1 — File Upload</h2>
                <p className="text-muted-foreground text-sm">Upload your estimate PDF.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center py-4">
                  <div className={cn(
                    "flex items-center p-1 rounded-2xl border transition-all w-full",
                    theme === 'light' ? "bg-slate-200/50 border-slate-300/40" : "bg-muted/30 border-border"
                  )}>
                    <button
                      type="button"
                      onClick={() => setWorkflowType("xactimate")}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center",
                        workflowType === "xactimate"
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Xactimate Estimate
                    </button>
                    <button
                      type="button"
                      onClick={() => setWorkflowType("symbility")}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center",
                        workflowType === "symbility"
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Symbility Estimate
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Project Name <span className="text-red-500">*</span></Label>
                    <Input
                      className={cn(
                        "w-full border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0",
                        theme === 'light' ? "bg-slate-50/80" : "bg-background"
                      )}
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g. Smith Residence"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="pdf" className="text-muted-foreground">Upload PDF</Label>
                      <span className="text-xs text-muted-foreground/60">(PDF only)</span>
                    </div>

                    <label
                      htmlFor="pdf"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        "block border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer group",
                        isDragging
                          ? "border-primary bg-primary/10"
                          : theme === "light"
                            ? "border-slate-300/60 hover:border-primary/50 hover:bg-slate-50"
                            : "border-border hover:border-primary/50 hover:bg-primary/5"
                      )}
                    >
                      <Upload className={cn(
                        "mx-auto mb-4 transition-colors",
                        theme === "light" ? "text-slate-400 group-hover:text-primary" : "text-muted-foreground group-hover:text-primary"
                      )} size={40} />
                      <Input
                        id="pdf"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {file ? (
                        <div className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg">
                          <FileText size={16} />
                          <span className="font-medium text-sm">{file.name}</span>
                        </div>
                      ) : existingFile ? (
                        <div className="space-y-4">
                          <div className="flex flex-col items-center gap-3">
                            <div className={cn(
                              "flex items-center justify-center gap-2 py-2 px-4 rounded-lg",
                              theme === "light" ? "bg-emerald-50 text-emerald-700" : "bg-emerald-500/20 text-emerald-300"
                            )}>
                              <FileText size={16} />
                              <span className="font-medium text-sm">Resume: {existingFile.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => { e.preventDefault(); handleDownloadExisting(); }}
                              className={cn(
                                "h-8 text-xs",
                                theme === "light"
                                  ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                  : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                              )}
                            >
                              <Eye size={14} className="mr-2" /> View PDF
                            </Button>
                          </div>
                          <p className="text-xs text-slate-500">Click to upload a new version (replaces existing)</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-foreground font-medium group-hover:text-primary transition-colors">Click to upload PDF</p>
                          <p className="text-sm text-muted-foreground">or drag and drop</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className={theme === "light" ? "text-slate-600" : "text-gray-300"}>Approximate start date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background border-border text-foreground hover:bg-accent hover:text-foreground",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-border bg-popover text-popover-foreground" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className={theme === "light" ? "text-slate-600" : "text-gray-300"}>Estimated completion date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background border-border text-foreground hover:bg-accent hover:text-foreground",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-border bg-popover text-popover-foreground" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={!startDate}
                        initialFocus
                        fromDate={startDate}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className={theme === "light" ? "text-slate-600" : "text-gray-300"}>Deductible Amount</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className={cn(
                            "h-4 w-4 cursor-pointer transition-colors",
                            theme === "light" ? "text-slate-400 hover:text-slate-600" : "text-gray-500 hover:text-gray-300"
                          )} />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm bg-popover border-border text-popover-foreground p-3" align="start">
                          <p className="font-bold mb-1">Deductible</p>
                          <p className="mb-2">Enter the deductible amount if it is known. If the deductible is unknown, you may proceed. BigLogic will generate the contract using the total contract price, which includes the deductible.</p>
                          {/* <p>Best practice is to collect the deductible at the start of the project after the deposit is received. If the deductible exceeds the deposit, the remaining deductible should be collected after the deposit.</p> */}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-2 relative">
                    <span className="absolute left-3 text-muted-foreground">$</span>
                    <Input
                      className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 pl-7"
                      value={formatInputDisplay(deductAmount)}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, '');
                        const val = validateCurrencyInput(rawValue);
                        if (val !== null) setDeductAmount(val);
                      }}
                      type="text"
                      placeholder="0.00"
                    />
                  </div>
                  <span className={cn(
                    "text-xs",
                    theme === "light" ? "text-slate-400" : "text-gray-500"
                  )}>*Leave at $0 if unknown</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Label className={theme === "light" ? "text-slate-600" : "text-gray-300"}>Down Payment</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className={cn(
                            "h-4 w-4 cursor-pointer transition-colors",
                            theme === "light" ? "text-slate-400 hover:text-slate-600" : "text-gray-500 hover:text-gray-300"
                          )} />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm bg-popover border-border text-popover-foreground p-3" align="start">
                          <p className="font-bold mb-1">Down Payment</p>
                          <p className="mb-2">Enter the down payment amount you intend to collect. Be sure this amount complies with your state’s applicable laws and limits.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-2 relative">
                    <span className="absolute left-3 text-muted-foreground">$</span>
                    <Input
                      className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 pl-7"
                      value={formatInputDisplay(downPayment)}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, '');
                        const val = validateCurrencyInput(rawValue);
                        if (val !== null) setDownPayment(val);
                      }}
                      type="text"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className={theme === "light" ? "text-slate-600" : "text-gray-300"}>Final Touch-Ups / Retention</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className={cn(
                            "h-4 w-4 cursor-pointer transition-colors",
                            theme === "light" ? "text-slate-400 hover:text-slate-600" : "text-gray-500 hover:text-gray-300"
                          )} />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm bg-popover border-border text-popover-foreground p-3" align="start">
                          <p className="font-bold mb-1">Final Touch-Ups / Retention</p>
                          <p className="mb-2">Enter the amount the customer will retain after substantial completion and before final touch-ups are completed. BigLogic recommends using the maximum amount permitted under state or local law, as this preserves the option to pursue recovery in small-claims court if necessary.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center gap-2 relative">
                    <span className="absolute left-3 text-muted-foreground">$</span>
                    <Input
                      className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 pl-7"
                      value={formatInputDisplay(retentionAmount)}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, '');
                        const val = validateCurrencyInput(rawValue);
                        if (val !== null) setRetentionAmount(val);
                      }}
                      type="text"
                      placeholder="0.00"
                    />
                  </div>
                </div>



                <div className={cn(
                  "md:col-span-2 space-y-4 pt-4 border-t",
                  theme === "light" ? "border-slate-100" : "border-white/10"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="credits"
                        checked={showCredits}
                        onCheckedChange={(c) => {
                          setShowCredits(!!c);
                          if (!c) setCredits([]);
                        }}
                        className={cn(
                          "data-[state=checked]:bg-indigo-600",
                          theme === "light" ? "border-slate-300" : "border-white/20"
                        )}
                      />
                      <Label htmlFor="credits" className={theme === "light" ? "text-slate-700" : "text-white"}>Apply Credits</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className={cn(
                              "h-4 w-4 cursor-pointer transition-colors",
                              theme === "light" ? "text-slate-400 hover:text-slate-600" : "text-gray-500 hover:text-gray-300"
                            )} />
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-sm bg-popover border-border text-popover-foreground p-3">
                            <p className="font-bold mb-1">Credits</p>
                            <p className="mb-2">Use this section only if there is an agreed credit to the homeowner off the insurance-approved contract price.</p>
                            <p className="mb-1">Common examples include:</p>
                            <ul className="list-disc pl-4 mb-2 space-y-1">
                              <li>Crediting part of the deductible</li>
                              <li>Scope items in the insurer’s estimate that will not be performed</li>
                            </ul>
                            <p>Credits reduce the contract price. Additional charges must be handled through change orders, not here.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {showCredits && (
                    <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border">
                      {credits.map((credit, idx) => (
                        <div key={credit.id} className="flex gap-4 items-start">
                          <div className="flex-1 space-y-1">
                            <Label className="text-xs text-muted-foreground">Description</Label>
                            <Input
                              placeholder="e.g. Deductible Credit"
                              value={credit.description}
                              onChange={(e) => updateCredit(credit.id, "description", e.target.value)}
                              className="bg-background border-border text-foreground focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
                            />
                          </div>
                          <div className="w-32 space-y-1">
                            <Label className="text-xs text-muted-foreground">Amount (Credits)</Label>
                            <div className="flex items-center gap-2 relative">
                              <span className="absolute left-3 text-muted-foreground">$</span>
                              <Input
                                type="text"
                                placeholder="-0.00"
                                value={formatInputDisplay(credit.amount)}
                                onChange={(e) => updateCredit(credit.id, "amount", e.target.value)}
                                className="bg-background border-border text-foreground pl-7 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
                              />
                            </div>
                            <span className={cn(
                              "text-[10px]",
                              theme === "light" ? "text-slate-400" : "text-gray-500"
                            )}>Negative only</span>
                          </div>
                          <div className="pt-6">
                            <Button variant="ghost" size="icon" onClick={() => removeCredit(credit.id)} className={cn(
                              "text-red-400 hover:text-red-300",
                              theme === "light" ? "hover:bg-red-50" : "hover:bg-red-900/20"
                            )}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button onClick={addCredit} variant="outline" size="sm" className="border-dashed border-border text-foreground hover:bg-accent transition-colors">
                        <Plus size={14} className="mr-2" /> Add Credit Line
                      </Button>
                    </div>
                  )}
                </div>
                {theme === "light" ? (
                  <div className="space-y-2">
                    {/* <Label className="text-slate-600">Signature</Label> */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      {/* <SignaturePad /> */}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* <Label className="text-gray-300">Signature</Label> */}
                    <div className="border border-white/10 rounded-lg overflow-hidden">
                      {/* <SignaturePad /> */}
                    </div>
                  </div>
                )}
              </div>

              {isLoading && (
                <div className="max-w-xl mx-auto space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground font-medium">
                    <span>Analyzing Document...</span>
                    <span>{Math.floor(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-muted" indicatorClassName="bg-gradient-to-r from-primary to-purple-500" />
                </div>
              )}

              <Button
                onClick={handleUploadSubmit}
                disabled={(!file && !existingFile) || !startDate || !endDate || isLoading || downPayment === "" || retentionAmount === "" || !projectName || projectName.trim() === ""}
                className="w-full max-w-xl mx-auto block h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all text-lg font-medium mt-4"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" /> Processing...
                  </span>
                ) : (
                  <>
                    <span className="flex items-center justify-center gap-2">
                      Generate Draw Schedule
                      <ArrowRight size={16} />
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 2: Select Items */}
          {step === "select" && (
            <div className="space-y-6">


              <div className="space-y-4">
                <h3 className="text-foreground font-bold mb-3 text-xl">Overall Accounting</h3>
                {/* Summary Table at Top */}
                <div className={cn(
                  "rounded-xl border p-4 space-y-2",
                  theme === "light" ? "bg-slate-50 border-slate-100" : "bg-muted/30 border-border"
                )}>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Total Contract Amount</span>
                    <span className="text-foreground">$ {totalAmount.toLocaleString()}</span>
                  </div>
                  {credits.map(c => (
                    <div key={c.id} className="flex justify-between text-muted-foreground text-sm">
                      <span>{c.description || "Credit"}</span>
                      <span className="text-red-500">– $ {Math.abs(Number(c.amount)).toLocaleString()}</span>
                    </div>
                  ))}

                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between text-foreground font-medium">
                    <span>Updated Contract Amount</span>
                    <span>$ {(totalAmount + credits.reduce((acc, c) => acc + Number(c.amount), 0)).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground text-sm mt-2">
                    <span>Down Payment</span>
                    <span className="text-foreground">$ {Number(downPayment).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  {(Number(deductAmount) - Number(downPayment)) > 0 && (
                    <div className="flex justify-between text-muted-foreground text-sm">
                      <span>Remaining Deductible</span>
                      <span className="text-foreground">$ {(Number(deductAmount) - Number(downPayment)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Touch-ups / Retention</span>
                    <span className="text-foreground">$ {Number(retentionAmount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between text-emerald-500 font-bold text-lg">
                    <span>Balance remaining for milestones</span>
                    <span>
                      $ {(
                        (totalAmount + credits.reduce((acc, c) => acc + Number(c.amount), 0)) -
                        Number(downPayment) -
                        (Math.max(0, Number(deductAmount) - Number(downPayment))) -
                        Number(retentionAmount)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                {usePercentageSplit && (
                  <div className="space-y-3">
                    <div className="bg-accent/50 border border-border p-3 rounded-lg text-sm text-foreground/80">
                      <p className="mb-1">You are responsible for determining how payments are structured, including deposits and final balances. BigLogic does not automatically apply state-specific down-payment rules and does not provide legal advice. Payment selections are made at your discretion and reflected exactly as entered.</p>
                    </div>
                    <div className="flex items-center justify-between bg-primary/10 border border-primary/20 text-primary p-2 rounded-lg text-sm">
                      <span className="flex flex-col items-start">
                        <span className="text-[10px] uppercase tracking-wider opacity-70 mb-0.5">Total Allocated</span>
                        <span className="text-2xl font-bold leading-none flex items-baseline gap-1">
                          {calculateTotalPercentage().toFixed(0)}
                          <span className="text-lg">%</span>
                        </span>
                        <span className="text-[11px] font-medium opacity-80 mt-1">
                          ( $ {calculateValueFromPercentage(calculateTotalPercentage()).toLocaleString("en-US", { maximumFractionDigits: 0 })} )
                        </span>
                      </span>

                      <span className="flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-wider opacity-70 mb-0.5">Remaining Balance</span>
                        <span className="text-[#cc0000] text-3xl font-black leading-none flex items-baseline gap-1">
                          {(100 - calculateTotalPercentage()).toFixed(0)}
                          <span className="text-xl">%</span>
                        </span>
                        <span className="text-[#cc0000] text-[11px] font-bold opacity-80 mt-1">
                          ( $ {calculateValueFromPercentage(100 - calculateTotalPercentage()).toLocaleString("en-US", { maximumFractionDigits: 0 })} )
                        </span>
                      </span>

                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Select milestones to include</h2>
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm">Choose items to include in the draw schedule.</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm bg-popover border-border text-popover-foreground p-3" align="start" side="bottom">
                          <p className="font-bold mb-1">Milestones</p>
                          <p className="mb-2">You are paid for all trades. Milestones do not represent who is being paid—they represent when you want to collect funds.</p>
                          <p>Select a milestone if you want to collect payment when that phase of work is completed (for example, select “Cleaning” if you want to collect funds upon completion of cleaning).</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-lg border border-border">
                  <Checkbox
                    id="percentage-split"
                    checked={usePercentageSplit}
                    onCheckedChange={(checked) => {
                      setUsePercentageSplit(!!checked);
                      if (checked) {
                        setSelectItems(calculateProportionalPercentages(selectItems));
                      }
                    }}
                    className={cn(
                      "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
                      theme === "light" ? "border-slate-300" : "border-border"
                    )}
                  />
                  <Label htmlFor="percentage-split" className="text-muted-foreground flex items-center gap-2">
                    Split by percentage
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm bg-popover border-border text-popover-foreground p-3" align="end" side="bottom">
                          <p className="font-bold mb-1">Split by Percentage</p>
                          <p className="mb-2">This option allows you to bypass BigLogic’s automated milestone calculations and manually assign a percentage of the total contract value to each milestone.</p>
                          <p>When selected, you can edit percentages directly and view the corresponding dollar amounts in real time.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                </div>
              </div>

              <div className={cn(
                "rounded-xl border overflow-hidden",
                theme === "light" ? "bg-white border-slate-300/40 shadow-sm" : "bg-muted/20 border-border"
              )}>
                <table className="w-full">
                  <thead className={cn(
                    theme === "light" ? "bg-slate-100/80" : "bg-muted"
                  )}>
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground w-12 text-sm uppercase tracking-wider">
                        Select
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm uppercase tracking-wider">
                        Trade / Item
                      </th>
                      {!usePercentageSplit ? (
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm uppercase tracking-wider w-[150px]">
                          RCV (O&P)
                        </th>
                      ) : (
                        <>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm uppercase tracking-wider w-[20%]">
                            Original RCV
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm uppercase tracking-wider w-[20%]">
                            Percentage (%)
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm uppercase tracking-wider w-[20%]">
                            Amount
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className={cn(
                    "divide-y",
                    theme === "light" ? "divide-slate-100" : "divide-white/5"
                  )}>
                    {/* Deductible Row */}
                    <tr className={theme === "light" ? "bg-slate-50/50" : "bg-muted/10"}>
                      <td className="py-3 px-4">
                        <Checkbox checked={true} disabled className={cn(
                          "opacity-50",
                          theme === "light" ? "border-slate-300" : "border-border"
                        )} />
                      </td>
                      <td className="py-3 px-4 text-foreground font-medium text-sm">
                        Deductible
                      </td>
                      {!usePercentageSplit ? (
                        <td className="py-3 px-4 text-foreground text-sm text-right whitespace-nowrap">
                          $ {Number(deductAmount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      ) : (
                        <>
                          <td className="py-3 px-4 text-foreground text-sm text-left whitespace-nowrap">
                            $ {Number(deductAmount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground italic text-sm">N/A</td>
                          <td className="py-3 px-4 text-foreground text-sm text-right whitespace-nowrap">
                            $ {Number(deductAmount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </>
                      )}
                    </tr>

                    {selectItems.map((item) => (
                      <tr key={item.id} className={`${item.selected ? 'bg-primary/5' : ''} hover:bg-muted/50 transition-colors`}>
                        <td className="py-3 px-4">
                          <Checkbox
                            checked={item.selected}
                            onCheckedChange={(checked) =>
                              updateSelectItem(item.id, "selected", checked)
                            }
                            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </td>
                        <td className="py-3 px-4 text-foreground/80 text-sm">
                          {item.name}
                        </td>
                        {!usePercentageSplit ? (
                          <td className="py-3 px-4 text-foreground/80 text-sm text-right whitespace-nowrap">
                            $ {(item.value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        ) : (
                          <>
                            <td className="py-3 px-4 text-foreground/80 text-sm text-left whitespace-nowrap">
                              $ {(item.value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-4">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className={`flex items-center gap-2 ${!item.selected ? 'cursor-not-allowed opacity-50' : ''}`}>
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={item.percentage || ''}
                                        onChange={(e) => handlePercentageChange(item.id, e.target.value)}
                                        className={cn(
                                          "border-border text-foreground w-20 h-8 p-2 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0",
                                          theme === 'light' ? "bg-slate-50/80" : "bg-background"
                                        )}
                                        disabled={!item.selected}
                                      />
                                      <span className="text-muted-foreground font-medium">%</span>
                                    </div>
                                  </TooltipTrigger>
                                  {!item.selected && (
                                    <TooltipContent className="bg-popover border-border text-popover-foreground p-3">
                                      <p>Please select the trade item in order to input the % value</p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TooltipProvider>
                            </td>
                            <td className="py-3 px-4 text-foreground/80 text-sm text-right whitespace-nowrap">
                              $ {item.percentage ? calculateValueFromPercentage(item.percentage).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0'}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Navigation Buttons: Previous | Restart | Next */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                {/* Previous Button - Gray */}
                <Button
                  variant="secondary"
                  className={cn(
                    "min-w-[120px]",
                    theme === "light"
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                      : "bg-zinc-600 hover:bg-zinc-500 text-white"
                  )}
                  onClick={() => setStep("upload")}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                {/* Restart Button - White Outline */}
                <Button
                  onClick={handleRestart}
                  className={cn(
                    "min-w-[120px] border-none shadow-none",
                    theme === "light"
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                  )}
                >
                  Restart <RotateCcw className="ml-2 h-4 w-4" />
                </Button>

                {/* Next Button - Indigo */}
                <Button
                  onClick={validateAndSubmit}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px] relative overflow-hidden"
                  disabled={isLoading || (usePercentageSplit && Math.abs(calculateTotalPercentage() - 100) > 0.01)}
                >
                  {isLoading ? (
                    <>
                      <div className="absolute inset-0 bg-white/20" style={{ width: `${selectProgress}%`, transition: 'width 0.1s linear' }} />
                      <span className="relative z-10 flex items-center justify-center">
                        <Loader2Icon className="animate-spin mr-2" size={16} /> Processing...
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center justify-center">
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Draw Schedule Editor */}
          {step === "schedule" && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">Edit Draw Schedule</h2>
                  <p className="text-muted-foreground text-sm">Review and customize the payment schedule description and amounts.</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`gap-2 ${isScheduleEditing ? "bg-primary/20 text-primary border-primary/50" : "border-border text-foreground hover:bg-accent"}`}
                    onClick={() => setIsScheduleEditing(!isScheduleEditing)}
                  >
                    <Edit size={16} /> {isScheduleEditing ? "Done Editing" : "Edit Schedule"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary gap-2"
                    onClick={handleDownloadXLS}
                  >
                    <FileText size={16} /> Download XLS
                  </Button>
                </div>
              </div>

              {/* Step 3: Overall Accounting Table */}
              <div className={cn(
                "rounded-xl border p-4 space-y-2",
                theme === "light" ? "bg-slate-50 border-slate-100" : "bg-muted/30 border-border"
              )}>
                <h3 className="text-foreground font-bold mb-3">Overall Accounting</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Original Contract Amount</span>
                    <span className="text-foreground">$ {totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  {credits.map(c => (
                    <div key={c.id} className="flex justify-between text-muted-foreground text-sm">
                      <span>{c.description || "Credit"}</span>
                      <span className="text-red-500">– $ {Math.abs(c.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between text-foreground font-medium">
                    <span>Total Amount of this Contract</span>
                    <span>$ {(totalAmount + credits.reduce((acc, c) => acc + Number(c.amount), 0)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  <div className="h-px bg-border my-2" />

                  {/* {(() => {
                    const finalContractAmount = totalAmount + credits.reduce((acc, c) => acc + Number(c.amount), 0);
                    const currentScheduleTotal = scheduleItems.reduce((sum, item) => sum + Number(item.amount), 0) + ((Number(deductAmount) - Number(downPayment)) > 0 ? (Number(deductAmount) - Number(downPayment)) : 0);
                    const remaining = finalContractAmount - currentScheduleTotal;

                    if (Math.abs(remaining) < 0.005) return null;

                    return (
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                        <span className="text-sm text-gray-400">Remaining to Allocate dd</span>
                        <span className={`font-bold ${remaining < -0.005 ? "text-red-500" : remaining > 0.005 ? "text-emerald-400" : "text-gray-400"}`}>
                          $ {remaining.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    );
                  })()} */}

                </div>
              </div>

              {usePercentageSplit && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-primary/10 border border-primary/20 text-primary p-2 rounded-lg text-sm">
                    <span className="flex flex-col items-start">
                      <span className="text-[10px] uppercase tracking-wider opacity-70 mb-0.5">Total Allocated</span>
                      <span className="text-2xl font-bold leading-none flex items-baseline gap-1">
                        {((scheduleItems.filter(i => !isFixedItem(i.description)).reduce((sum, item) => sum + Number(item.amount), 0) / calculateBalanceRemaining()) * 100).toFixed(0)}
                        <span className="text-lg">%</span>
                      </span>
                      <span className="text-[11px] font-medium opacity-80 mt-1">
                        ( $ {scheduleItems.filter(i => !isFixedItem(i.description)).reduce((sum, item) => sum + Number(item.amount), 0).toLocaleString("en-US", { maximumFractionDigits: 0 })} )
                      </span>
                    </span>

                    <span className="flex flex-col items-end">
                      <span className="text-[10px] uppercase tracking-wider opacity-70 mb-0.5">Remaining Balance</span>
                      <span className="text-[#cc0000] text-3xl font-black leading-none flex items-baseline gap-1">
                        {(100 - (scheduleItems.filter(i => !isFixedItem(i.description)).reduce((sum, item) => sum + Number(item.amount), 0) / calculateBalanceRemaining()) * 100).toFixed(0)}
                        <span className="text-xl">%</span>
                      </span>
                      <span className="text-[#cc0000] text-[11px] font-bold opacity-80 mt-1">
                        ( $ {(calculateBalanceRemaining() - scheduleItems.filter(i => !isFixedItem(i.description)).reduce((sum, item) => sum + Number(item.amount), 0)).toLocaleString("en-US", { maximumFractionDigits: 0 })} )
                      </span>
                    </span>

                  </div>
                </div>
              )}

              <div className="rounded-xl border border-border overflow-hidden bg-muted/20">
                <table className="w-full">
                  <thead className={cn(
                    theme === "light" ? "bg-slate-100/80" : "bg-muted"
                  )}>
                    <tr>
                      {!usePercentageSplit && <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm uppercase tracking-wider">Order</th>}
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm uppercase tracking-wider">Description</th>
                      {usePercentageSplit && (
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm uppercase tracking-wider w-[120px]">Percentage (%)</th>
                      )}
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm uppercase tracking-wider w-[180px]">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {/* Remaining Deductible Row - Only show if > 0 */}

                    {scheduleItems.map((item) => (
                      item.order !== "Remaining Deductible" ?
                        <tr key={item.id}>
                          {!usePercentageSplit && <td className="py-3 px-4 text-muted-foreground font-mono text-sm">{item.order}</td>}
                          <td className="py-3 px-4">
                            {isScheduleEditing ? (
                              <Input
                                value={item.description}
                                onChange={(e) =>
                                  updateScheduleItem(item.id, "description", e.target.value)
                                }
                                className={cn(
                                  "border-border text-foreground text-sm focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 py-1 px-2 h-8",
                                  theme === 'light' ? "bg-slate-50/80" : "bg-background"
                                )}
                              />
                            ) : (
                              <span className="text-foreground/80 text-sm min-h-[1.5rem] flex items-center">{item.description}</span>
                            )}
                          </td>
                          {usePercentageSplit && (
                            <td className="py-3 px-4 text-foreground/80 text-sm">
                              {isFixedItem(item.description) ? <span className="text-muted-foreground italic">N/A</span> : `${((Number(item.amount || 0) / calculateBalanceRemaining()) * 100).toFixed(0)} %`}
                            </td>
                          )}
                          <td className="py-3 px-4 text-foreground text-sm text-right whitespace-nowrap">
                            $ {Number(item.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                        : (Number(deductAmount) - Number(downPayment)) > 0 && (
                          <tr className={theme === "light" ? "bg-slate-50/50" : "bg-muted/10"}>
                            {!usePercentageSplit && <td className="py-3 px-4 text-muted-foreground font-mono text-sm">Remaining Deductible</td>}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="text-foreground text-sm">Remaining Deductible</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-sm bg-popover border-border text-popover-foreground p-3">
                                      <p className="font-bold mb-1">Remaining Deductible</p>
                                      <p>This represents any portion of the deductible that has not yet been collected.</p>
                                      {/* <p>If no deductible applies or the deductible amount is unknown, this line will not appear.</p> */}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </td>
                            {usePercentageSplit && (
                              <td className="py-3 px-4 text-muted-foreground italic text-sm">N/A</td>
                            )}
                            <td className="py-3 px-4 text-foreground text-sm text-right whitespace-nowrap">
                              <span className="text-muted-foreground mr-2">$</span>
                              <span className="text-foreground">{(Number(deductAmount) - Number(downPayment)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </td>
                          </tr>
                        )))}
                  </tbody>
                </table>
              </div>

              <div className={cn(
                "space-y-4 pt-4 border-t",
                theme === "light" ? "border-slate-100" : "border-border"
              )}>
                <div className={cn(
                  "p-6 rounded-xl border space-y-3",
                  theme === "light" ? "bg-slate-100/50 border-slate-200" : "bg-muted/30 border-border"
                )}>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    Totals
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm bg-popover border-border text-popover-foreground p-3">
                          <p className="mb-2">Total RCV reflects the full insurance-approved contract amount.</p>
                          <p>Credits are deducted from the Total RCV to calculate the Final Contract Amount shown in the contract.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Total RCV:</span>
                      <span className="text-foreground font-medium">$ {totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    {credits.length > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Credits:</span>
                        <span className="text-red-500 font-medium">– $ {credits.reduce((acc, c) => acc + Math.abs(Number(c.amount)), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold text-foreground pt-3 border-t border-border">
                      <span>Final Contract Amount:</span>
                      <span className="text-emerald-500">$ {(totalAmount - credits.reduce((acc, c) => acc + Math.abs(Number(c.amount)), 0)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    variant="secondary"
                    className={cn(
                      "min-w-[120px]",
                      theme === "light"
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                        : "bg-zinc-600 hover:bg-zinc-500 text-white"
                    )}
                    onClick={() => setStep("select")}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>

                  <Button
                    onClick={handleRestart}
                    className={cn(
                      "min-w-[120px] border-none shadow-none",
                      theme === "light"
                        ? "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        : "bg-accent text-accent-foreground hover:bg-accent/80"
                    )}
                  >
                    Restart <RotateCcw className="ml-2 h-4 w-4" />
                  </Button>



                  <div className="group relative">
                    <Button
                      onClick={handleScheduleSubmit}
                      disabled={isLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px] relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="absolute inset-0 bg-white/20" style={{ width: `${scheduleProgress}%`, transition: 'width 0.1s linear' }} />
                          <span className="relative z-10 flex items-center justify-center">
                            <Loader2Icon className="animate-spin mr-2" size={16} /> Finalizing...
                          </span>
                        </>
                      ) : (
                        <>Finalize contract <ChevronRight className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-2 bg-popover border border-border text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      <p className="font-bold mb-1">Finalize Contract</p>
                      <p>This will generate the construction contract and milestone draw schedule using the values and selections shown. Please review all amounts carefully before finalizing.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Download */}
          {step === "download" && (
            <div className="text-center py-12 space-y-6">
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mx-auto ring-4",
                theme === "light" ? "bg-emerald-50 ring-emerald-100" : "bg-emerald-500/20 ring-emerald-500/10"
              )}>
                <CheckCircle className="text-emerald-500" size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Schedule Ready!</h2>
                <p className="text-muted-foreground">Your draw schedule has been successfully generated and is ready for download.</p>
              </div>

              {pdfData && (
                <div className="flex justify-center gap-4">
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-12 px-8"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = pdfData;
                      link.download = `${projectName}_Draw_Schedule.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download size={18} /> Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="border-indigo-600/30 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 gap-2 h-12 px-8"
                    onClick={handleDownloadXLS}
                  >
                    <FileText size={18} /> Download XLS
                  </Button>
                </div>
              )}

              <div className="flex justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("schedule")}
                  className={cn(
                    "text-muted-foreground hover:text-foreground border shadow-sm",
                    theme === "light"
                      ? "bg-white hover:bg-slate-50 border-slate-200"
                      : "bg-accent hover:bg-accent/80 border-border backdrop-blur-md"
                  )}
                >
                  <ChevronLeft className="mr-2" size={16} /> Back to Schedule
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleRestart}
                  className={cn(
                    "text-muted-foreground hover:text-foreground border shadow-sm",
                    theme === "light"
                      ? "bg-white hover:bg-slate-50 border-slate-200"
                      : "bg-accent hover:bg-accent/80 border-border backdrop-blur-md"
                  )}
                >
                  <RotateCcw className="mr-2" size={16} /> Restart Workflow
                </Button>
              </div>

              <div className={cn(
                "border-t pt-8 mt-8 max-w-xl mx-auto",
                theme === "light" ? "border-slate-100" : "border-border"
              )}>
                <h4 className="text-lg font-medium text-foreground mb-4 text-center">Share Report via Email</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email addresses with comma separated..."
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    className="bg-background border-border text-foreground focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
                  />
                  <Button onClick={handleSendEmail} disabled={isSendingEmail} className="bg-indigo-600 text-white hover:bg-indigo-700">
                    {isSendingEmail ? <Loader2Icon className="animate-spin" /> : <Send size={18} />}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <Dialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <DialogContent className="bg-popover border-border text-popover-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resume Workflow?</DialogTitle>
            <DialogDescription>
              We found unfinished workflows. Would you like to resume one of them?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
            {pendingWorkflows.map((wf) => (
              <div key={wf._id} className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-colors group",
                theme === "light"
                  ? "bg-slate-50 border-slate-100 hover:bg-slate-100"
                  : "bg-card/50 border-border hover:bg-accent"
              )}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <PlayCircle size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{wf.projectName || "Unnamed Project"}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(wf.startedAt).toLocaleDateString()}</span>
                      <span className={cn(
                        "w-1 h-1 rounded-full",
                        theme === "light" ? "bg-slate-300" : "bg-muted-foreground/30"
                      )} />
                      <span className="capitalize">{wf.currentStep === 'select' ? 'Item Selection' : wf.currentStep === 'schedule' ? 'Draw Schedule' : 'Upload'}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" onClick={() => handleResume(wf)} className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs font-medium shadow-sm">
                  Resume
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter className={cn(
            "sm:justify-center border-t pt-4 mt-2",
            theme === "light" ? "border-slate-100" : "border-border"
          )}>
            <Button variant="ghost" onClick={() => setShowResumeDialog(false)} className="text-muted-foreground hover:text-foreground hover:bg-accent">
              Start New Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default XactimateWorkflow;
