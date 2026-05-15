import { useState, useEffect, useMemo } from "react";
import * as XLSX from 'xlsx';
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle, RefreshCcw, Loader2, Database, Plus, Search, Layers, Bot, Trash2, Eye, EyeOff, ChevronDown, ChevronUp, RefreshCw, Download } from "lucide-react";
import api from "@/services/api";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ThemeProvider";

interface TrainedItem {
  _id: string;
  itemName: string;
  categoryName: string;
}

const DEFAULT_CATEGORIES = [
  'Not Assigned',
  'Acoustical Treatments',
  'Antenna & Satellite Dishes',
  'Appliances',
  'Awnings & Patio Covers',
  'Asbestos',
  'Cabinetry',
  'Clean Appliances',
  'Cleaning - Structure',
  'Concrete & Asphalt',
  'Contents - Clean Electrical Items',
  'Contents - Clean Furniture',
  'Contents - Clean General Items',
  'Contents - Clean Lamps & Vases',
  'Contents - Clean Textiles',
  'Contents - Clean Upholstry',
  'Contents Packing, Handling & Storage',
  'Countertops',
  'Doors',
  'Drywall',
  'Electrical',
  'Equipment Rentals',
  'Excavation',
  'Exterior Furnishings',
  'Fencing',
  'Finish Carpentry & Trimwork',
  'Fireplace',
  'Floor Covering - Carpet',
  'Floor Covering - Tile',
  'Floor Covering - Stone',
  'Floor Covering - Vinyl',
  'Floor Covering - Wood',
  'Framing & Rough Carpentry',
  'General Demolition',
  'Heat, Vent & Air Conditioning',
  'Insulation',
  'Interior Furnishings',
  'Labor Only',
  'Landscaping',
  'Light Fixtures',
  'Masonry',
  'Metal Structures & Components',
  'Miscellaneous',
  'Mitigation',
  'Mobile Home, Skirting & Setup',
  'Moisture Protection',
  'Outbuildings',
  'Painting',
  'Paneling & Wood Wall Finishes',
  'Permits and Fees',
  'Plaster & Lath',
  'Plumbing',
  'Pools & Hot Tubs',
  'Roofing',
  'Siding',
  'Soffit, Fascia & Gutter',
  'Stairs',
  'Temporary Repairs',
  'Tile',
  'Toilet & Bath Accessories',
  'Vents',
  'Wall Paper & Wall Carpet',
  'Window Screens',
  'Windows'
];





const EstimateTraining = () => {
  const { theme } = useTheme();
  const { toast } = useToast();

  // Permission check
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isCompanyAdmin = user.role === "company_admin" || user.role === "superadmin";
  const hasPermission = user.permissions?.estimateTraining === true;

  if (!isCompanyAdmin && !hasPermission) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Database className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You do not have permission to access the Estimate Training module.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Data State
  const [items, setItems] = useState<TrainedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [leftSearchQuery, setLeftSearchQuery] = useState("");
  const [rightSearchQuery, setRightSearchQuery] = useState("");
  const [allSearchQuery, setAllSearchQuery] = useState("");
  const [fetchingData, setFetchingData] = useState(true);

  // Custom Category State
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<any>(null);
  const [documentType, setDocumentType] = useState<"xactimate" | "symbility" | "smart">("symbility");
  const [recentStats, setRecentStats] = useState({ total: 0, existing: 0, new: 0 });

  // Visibility States for "Train from PDF"
  const [showUploader, setShowUploader] = useState(true);
  const [showExistingItems, setShowExistingItems] = useState(true);
  const [showNewItems, setShowNewItems] = useState(true);
  const [showAllItems, setShowAllItems] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchItems(documentType);
    checkProcessingStatus();

    // Auto-refresh data when the window is refocused (good for background completion)
    const handleFocus = () => {
      fetchItems(documentType);
      checkProcessingStatus();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [documentType]);

  // Add polling for status when processing is active
  useEffect(() => {
    let pollInterval: any;
    if (isProcessing) {
      pollInterval = setInterval(() => {
        checkProcessingStatus();
      }, 10000); // Poll every 10 seconds
    }
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isProcessing]);

  const checkProcessingStatus = async () => {
    try {
      const res = await api.get(`/estimate-training/status?documentType=${documentType}`);
      setIsProcessing(res.data.isProcessing);
      setActiveWorkflow(res.data.workflow);
      if (res.data.recentStats) {
        setRecentStats(res.data.recentStats);
      }
    } catch (error) {
      console.error("Failed to check processing status:", error);
    }
  };

  const fetchItems = async (type: string = documentType) => {
    try {
      setFetchingData(true);
      const res = await api.get(`/estimate-training/items?documentType=${type}`);
      setItems(res.data);
      setFetchingData(false);
    } catch (error) {
      console.error("Failed to fetch trained items:", error);
      toast({ title: "Error", description: "Failed to load trained items.", variant: "destructive" });
      setFetchingData(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

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
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setProgress(0);

    let intervalId = setInterval(() => {
      setProgress((prev) => (prev >= 4.9 ? 5 : prev + 0.5));
    }, 500);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);

      const response = await api.post("/estimate-training/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      });

      clearInterval(intervalId);
      setProgress(100);
      setIsLoading(false);
      setFile(null);
      setIsProcessing(true);
      if (response.data.workflow) {
        setActiveWorkflow(response.data.workflow);
      }
      checkProcessingStatus();
      fetchItems();
    } catch (error: any) {
      clearInterval(intervalId);
      setIsLoading(false);
      setProgress(0);
      const errorMsg = error.response?.data?.message || error.message || "Could not start training extraction.";
      toast({ 
        title: "Upload Failed", 
        variant: "destructive", 
        description: errorMsg
      });
    }
  };

  const handleCategoryChange = async (itemId: string, newCategoryValue: string) => {
    // Optimistic UI update
    setItems(items.map(item => item._id === itemId ? { ...item, categoryName: newCategoryValue } : item));

    try {
      await api.put(`/estimate-training/items/${itemId}`, { categoryName: newCategoryValue });
      toast({ title: "Saved", description: "Category updated instantly." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update category.", variant: "destructive" });
      fetchItems(); // revert on failure
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await api.delete(`/estimate-training/items/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
      toast({ title: "Deleted", description: "Item removed from training data." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" });
    }
  };

  const handleClearUnassigned = async () => {
    if (!window.confirm(`Are you sure you want to clear all unassigned ${documentType} items?`)) return;
    try {
      await api.delete(`/estimate-training/items/clear-unassigned?documentType=${documentType}`);
      setItems(items.filter(item => item.categoryName !== 'Not Assigned'));
      toast({ title: "Cleared", description: `All unassigned ${documentType} items removed.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to clear items.", variant: "destructive" });
    }
  };

  const handleClearExisting = async () => {
    if (!window.confirm(`Are you sure you want to clear ALL existing ${documentType} items? This cannot be undone.`)) return;
    try {
      await api.delete(`/estimate-training/items/clear-existing?documentType=${documentType}`);
      setItems(items.filter(item => item.categoryName === 'Not Assigned'));
      toast({ title: "Cleared", description: `All existing ${documentType} items removed.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to clear ALREADY SCRAPED ITEMS.", variant: "destructive" });
    }
  };

  const handleExportAll = () => {
    if (items.length === 0) {
      toast({ title: "No items to export", variant: "destructive" });
      return;
    }

    const exportData = items.map(item => ({
      'Item Name': item.itemName,
      'Category': item.categoryName,
      'Document Type': documentType.toUpperCase()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trained Items");

    // Set column widths
    worksheet['!cols'] = [
      { wch: 50 }, // Item Name
      { wch: 30 }, // Category
      { wch: 15 }  // Document Type
    ];

    XLSX.writeFile(workbook, `${documentType}_trained_items.xlsx`);
    toast({ title: "Export Started", description: "Your trained items are being downloaded." });
  };

  /* Commented out as per user request
  const handleAddCustomCategory = () => {
    if (!newCategory.trim()) return;
    if (DEFAULT_CATEGORIES.includes(newCategory) || customCategories.includes(newCategory)) {
        toast({ title: "Duplicate", description: "Category already exists.", variant: "destructive" });
        return;
    }
    setCustomCategories([...customCategories, newCategory.trim()]);
    setNewCategory("");
    toast({ title: "Added", description: "New category available in dropdowns." });
  };
  */

  const allCategories = DEFAULT_CATEGORIES;

  const renderStatusBanner = () => {
    if (!isProcessing) return null;
    
    // If we have no workflow object yet, show a generic loading state
    if (!activeWorkflow) {
      return (
        <div className={cn(
          "p-4 rounded-2xl border flex items-center justify-between shadow-lg mb-6 animate-pulse",
          theme === 'dark' ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-200" : "bg-indigo-50 border-indigo-100 text-indigo-700"
        )}>
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-indigo-500" size={20} />
            <div>
              <p className="text-sm font-bold">Initializing extraction...</p>
              <p className="text-xs opacity-70">Starting background process</p>
            </div>
          </div>
        </div>
      );
    }
    
    // Only show banner if the active workflow matches the current document type
    const workflowDocType = activeWorkflow.details?.documentType;
    if (workflowDocType && workflowDocType !== documentType) {
        return null;
    }
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "p-4 rounded-2xl border flex items-center justify-between shadow-lg mb-6",
          theme === 'dark' ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-200" : "bg-indigo-50 border-indigo-100 text-indigo-700"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bot className={cn("w-6 h-6", activeWorkflow.status?.includes('scraping') ? "animate-pulse" : "")} />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
          </div>
          <div>
            <p className="text-sm font-bold">{activeWorkflow.status || "Bot is processing..."}</p>
            <p className="text-[10px] opacity-70 italic">Project: {activeWorkflow.projectName || "Training Session"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Loader2 className="animate-spin w-4 h-4" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Active Extraction</span>
        </div>
      </motion.div>
    );
  };

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  // Grouped items for the "Activity Categories" tab - uses searchQuery
  const groupedManagedItems = useMemo(() => {
    const groups: Record<string, TrainedItem[]> = {};
    items.filter(i => i.categoryName !== 'Not Assigned')
      .filter(i =>
        i.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .forEach(item => {
        if (!groups[item.categoryName]) {
          groups[item.categoryName] = [];
        }
        groups[item.categoryName].push(item);
      });

    return Object.keys(groups).sort().map(cat => ({
      category: cat,
      items: groups[cat]
    }));
  }, [items, searchQuery]);

  // Grouped items for the "Upload" tab's LEFT column - uses leftSearchQuery
  const groupedUploadLeftItems = useMemo(() => {
    const groups: Record<string, TrainedItem[]> = {};
    items.filter(i => i.categoryName !== 'Not Assigned')
      .filter(i =>
        i.itemName.toLowerCase().includes(leftSearchQuery.toLowerCase()) ||
        i.categoryName.toLowerCase().includes(leftSearchQuery.toLowerCase())
      )
      .forEach(item => {
        if (!groups[item.categoryName]) {
          groups[item.categoryName] = [];
        }
        groups[item.categoryName].push(item);
      });

    return Object.keys(groups).sort().map(cat => ({
      category: cat,
      items: groups[cat]
    }));
  }, [items, leftSearchQuery]);

  // Flat list of New/Unassigned Items
  const newItems = useMemo(() => {
    return items.filter(i => i.categoryName === 'Not Assigned')
      .filter(i => i.itemName.toLowerCase().includes(rightSearchQuery.toLowerCase()));
  }, [items, rightSearchQuery]);

  // Flat list of All Items in current extraction
  const allExtractedItems = useMemo(() => {
    return items.filter(i => i.itemName.toLowerCase().includes(allSearchQuery.toLowerCase()));
  }, [items, allSearchQuery]);

  const existingCountGlobal = useMemo(() => items.filter(i => i.categoryName !== 'Not Assigned').length, [items]);
  const newCountGlobal = useMemo(() => items.filter(i => i.categoryName === 'Not Assigned').length, [items]);
  const totalItemsGlobal = items.length;

  const renderItemOptions = (item: TrainedItem) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between bg-muted/50 border-border text-foreground h-8 text-xs px-2 hover:bg-accent hover:text-accent-foreground">
          <span className="truncate">{item.categoryName === 'Not Assigned' ? "Select..." : item.categoryName}</span>
          <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-popover border-border shadow-2xl z-[100]" align="end">
        <Command className="bg-transparent text-popover-foreground">
          <CommandInput placeholder="Search category..." className="h-8 text-foreground text-xs" />
          <CommandList className="scrollbar-none max-h-48 text-xs">
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {allCategories.map((cat) => (
                <CommandItem key={cat} value={cat} onSelect={() => handleCategoryChange(item._id, cat)} className="cursor-pointer text-foreground hover:bg-accent aria-selected:bg-accent">
                  <Check className={cn("mr-2 h-3 w-3 text-primary", item.categoryName === cat ? "opacity-100" : "opacity-0")} />
                  {cat}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20 relative">
        <div className="relative z-10">
          <h1 className={`${theme === 'dark' ? 'text-white' : 'text-indigo-950'} text-4xl font-bold flex items-center gap-4`}>
            <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'}`}>
              <Database size={32} />
            </div>
            Estimate Model Training
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload previous estimates to auto-extract items and define your company's custom categorization rules for the Material Selection Extraction Bot.
          </p>

          <div className="mt-8 flex items-center gap-6">
            <div className="space-y-3 min-w-[400px]">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Document Extraction Format</label>
              <div className={cn(
                "flex items-center p-1 rounded-2xl border transition-all w-full",
                theme === 'dark' ? "bg-black/40 border-white/5" : "bg-white border-indigo-100 shadow-sm"
              )}>

                <button
                  type="button"
                  onClick={() => setDocumentType("symbility")}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center",
                    documentType === "symbility"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Symbility
                </button>
              </div>
            </div>
          </div>
        </div>

        {renderStatusBanner()}

        <Tabs defaultValue="manage" className="w-full relative z-10">
          <TabsList className={`mb-8 p-1 rounded-2xl ${theme === 'dark' ? 'bg-black/40 border-white/5 shadow-2xl backdrop-blur-xl' : 'bg-white border-gray-200 shadow-xl'} border`}>
            <TabsTrigger value="manage" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
              Activity Categories
            </TabsTrigger>
            <TabsTrigger value="upload" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all">
              Train from PDF
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-6 mt-0">
            <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} backdrop-blur-xl flex flex-col min-h-[500px] rounded-3xl overflow-hidden`}>
              <CardHeader className={`flex flex-row items-center justify-between pb-6 border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50/50'}`}>
                <CardTitle className={`text-lg flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-primary/10' : 'bg-indigo-50'} text-primary`}>
                    <Layers size={20} />
                  </div>
                  Grouped Items
                  <span className={`text-xs px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-white/10 text-white/60' : 'bg-indigo-100 text-indigo-700 font-semibold'}`}>{items.length} items</span>
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={handleExportAll} variant="outline" size="sm" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-600 hover:text-white text-xs h-9 transition-all">
                    <Download size={14} className="mr-2" /> Export to Excel
                  </Button>
                  <Button onClick={handleClearExisting} variant="outline" size="sm" className="bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-600 hover:text-white text-xs h-9 transition-all">
                    <Trash2 size={14} className="mr-2" /> Clear All Items
                  </Button>
                  <Button onClick={fetchItems} variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" disabled={fetchingData}>
                    <RefreshCcw size={16} className={fetchingData ? "animate-spin" : ""} />
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <Input
                      placeholder="Search items..."
                      className="pl-9 bg-muted/50 border-border text-foreground h-9 w-48 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-auto flex flex-col">

                {/* Commented out as per user request
                <div className="p-4 border-b border-white/5 bg-black/20 flex gap-2">
                    <Input 
                      placeholder="Enter new custom category..." 
                      className="bg-black/50 border-white/10 text-white flex-1"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustomCategory() }}
                    />
                    <Button onClick={handleAddCustomCategory} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white">
                      <Plus size={16} className="mr-2" /> Add Category
                    </Button>
                </div>
                */}

                {fetchingData && items.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading data...
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
                    <Database size={48} className="mb-4 opacity-20" />
                    <p className="text-xl font-medium text-foreground/70">No trained items found</p>
                    <p className="text-sm mt-2 max-w-sm">Switch to the "Train from PDF" tab to upload an estimate and populate categories.</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-6">
                    <AnimatePresence>
                      {groupedManagedItems.length === 0 ? (
                        <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          <Search size={40} className="mx-auto mb-4 opacity-20" />
                          <p>No items match your search.</p>
                        </div>
                      ) : (
                        groupedManagedItems.map(group => (
                          <motion.div
                            key={group.category}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-2xl border ${theme === 'dark' ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-100 shadow-sm'} overflow-hidden transition-all hover:shadow-md`}
                          >
                            <div className={`${theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100'} px-5 py-3.5 border-b flex justify-between items-center`}>
                              <h3 className={`font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} flex items-center gap-3`}>
                                {group.category}
                                <span className={`${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-200' : 'bg-indigo-600 text-white'} text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold`}>{group.items.length}</span>
                              </h3>
                            </div>
                            <ul className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-50'}`}>
                              {group.items.map(item => (
                                <motion.li
                                  layout
                                  key={item._id}
                                  className={`flex items-center justify-between px-5 py-4 ${theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50/50'} transition-all group/item`}
                                >
                                  <span className={`font-medium text-sm truncate pr-4 flex-1 ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>{item.itemName}</span>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <div className="w-56">
                                      {renderItemOptions(item)}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteItem(item._id)}
                                      className="h-9 w-9 text-muted-foreground hover:text-white hover:bg-destructive transition-all rounded-xl opacity-0 group-hover/item:opacity-100"
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="mt-0 space-y-6">
            {/* Item Counters Summary Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-primary/5 ring-primary/20' : 'bg-indigo-50/50 ring-indigo-100'} p-4 rounded-2xl flex items-center gap-4 transition-all duration-300`}>
                <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-indigo-600 text-white shadow-md'}`}>
                  <Database size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Scraped (Recent)</p>
                  <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-indigo-950'}`}>{recentStats.totalLineItems || recentStats.total}</p>
                </div>
              </Card>

              <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-green-500/5 ring-green-500/20' : 'bg-green-50/50 ring-green-100'} p-4 rounded-2xl flex items-center gap-4 transition-all duration-300`}>
                <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-600 text-white shadow-md'}`}>
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ALREADY SCRAPED ITEMS</p>
                  <p className={`text-2xl font-black ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{recentStats.existing}</p>
                </div>
              </Card>

              <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-amber-500/5 ring-amber-500/20' : 'bg-amber-50/50 ring-amber-100'} p-4 rounded-2xl flex items-center gap-4 transition-all duration-300`}>
                <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-600 text-white shadow-md'}`}>
                  <Layers size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">New Items</p>
                  <p className={`text-2xl font-black ${theme === 'dark' ? 'text-amber-400' : 'text-amber-700'}`}>{recentStats.new}</p>
                </div>
              </Card>
            </div>
            {/* TOP: Uploader (Collapsible) */}
            <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} backdrop-blur-xl overflow-hidden rounded-3xl transition-all duration-300`}>
              <CardHeader className={`py-3 px-6 border-b flex flex-row items-center justify-between ${theme === 'dark' ? 'border-primary/20 bg-primary/5' : 'border-indigo-100 bg-indigo-50/50'} shrink-0`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-indigo-600 text-white'}`}>
                    <Upload size={18} />
                  </div>
                  <div>
                    <CardTitle className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-indigo-900'}`}>Train from PDF</CardTitle>
                    <p className="text-[10px] text-muted-foreground">Upload estimate PDFs to enrich your model.</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploader(!showUploader)}
                  className="h-8 w-8 p-0 rounded-full hover:bg-primary/10"
                >
                  {showUploader ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Button>
              </CardHeader>

              <AnimatePresence>
                {showUploader && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row items-center gap-6">
                        <div className="flex-1 w-full">
                          <input id="pdf-upload" type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
                          <label
                            htmlFor="pdf-upload"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`block border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group ${isDragging ? 'border-indigo-600 bg-indigo-500/10' : theme === 'dark' ? 'border-white/10 hover:border-primary/50 hover:bg-primary/5' : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'}`}
                          >
                            {file ? (
                              <div className="flex items-center justify-center gap-3">
                                <span className={`font-bold text-xs px-4 py-2 rounded-xl shadow-md ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-indigo-600 text-white'}`}>
                                  <CheckCircle size={14} className="inline mr-2" />
                                  {file.name}
                                </span>
                                <span className="text-xs text-muted-foreground underline">Change file</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <Upload size={24} className={cn("text-muted-foreground transition-colors", isDragging ? "text-indigo-600" : "group-hover:text-primary")} />
                                <div>
                                  <p className={`text-sm font-bold transition-colors ${isDragging ? 'text-indigo-600' : theme === 'dark' ? 'text-white/60 group-hover:text-primary' : 'text-gray-600 group-hover:text-indigo-700'}`}>
                                    {isDragging ? 'Drop file to upload' : 'Select Estimate PDF'}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">Drag and drop or click to browse</p>
                                </div>
                              </div>
                            )}
                          </label>
                        </div>

                        <div className="w-full lg:w-72 space-y-4">
                          {isLoading && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-primary">
                                <span>Processing...</span><span>{Math.floor(progress)}%</span>
                              </div>
                              <Progress value={progress} className="h-2 bg-muted rounded-full" indicatorClassName="bg-indigo-600" />
                            </div>
                          )}

                          <Button
                            onClick={handleUpload}
                            disabled={!file || isLoading}
                            className={`w-full h-12 rounded-xl font-bold text-xs transition-all shadow-lg ${!file || isLoading ? 'opacity-50' : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02] shadow-indigo-500/25'}`}
                          >
                            {isLoading ? <><Loader2 className="animate-spin mr-2" size={16} /> Processing...</> : "Start Training Session"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            <div className={`grid grid-cols-1 ${[showExistingItems, showNewItems, showAllItems].filter(Boolean).length > 1 ? 'lg:grid-cols-' + [showExistingItems, showNewItems, showAllItems].filter(Boolean).length : 'grid-cols-1'} gap-6 h-[650px]`}>
              {/* LEFT COLUMN: ALREADY SCRAPED ITEMS */}
              {showExistingItems && (
                <Card className={`bg-card border-border border-0 ring-1 ring-border flex flex-col h-full overflow-hidden transition-all duration-300`}>
                  <CardHeader className="py-3 px-4 border-b border-border shrink-0 bg-muted/50 space-y-3">
                    <CardTitle className="text-foreground text-sm flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Database size={16} className="text-primary" />
                        ALREADY SCRAPED ITEMS
                        <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">{groupedUploadLeftItems.reduce((acc, g) => acc + g.items.length, 0)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {groupedUploadLeftItems.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { }}
                            className="h-8 text-[10px] text-indigo-600 font-bold"
                          >
                            <RefreshCw size={12} className="mr-1" /> Sync
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setShowExistingItems(false)} className="h-8 w-8 p-0 rounded-full">
                          <EyeOff size={14} />
                        </Button>
                      </div>
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
                      <Input
                        placeholder="Search ALREADY SCRAPED ITEMS..."
                        className="pl-8 bg-muted/50 border-border text-foreground h-8 text-xs w-full"
                        value={leftSearchQuery}
                        onChange={(e) => setLeftSearchQuery(e.target.value)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 overflow-y-auto flex-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
                    <div className="p-3 space-y-4">
                      <AnimatePresence>
                        {groupedUploadLeftItems.length === 0 ? (
                          <div className="text-center py-12 text-xs text-muted-foreground flex flex-col items-center gap-3">
                            <Layers className="opacity-20 w-10 h-10" />
                            No ALREADY SCRAPED ITEMS match your search.
                          </div>
                        ) : (
                          groupedUploadLeftItems.map(group => (
                            <motion.div key={group.category} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-xl border ${theme === 'dark' ? 'bg-white/[0.03] border-white/5' : 'bg-gray-50 border-gray-100'} overflow-hidden shadow-sm`}>
                              <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-muted/50'} px-4 py-2 flex justify-between items-center border-b border-white/5`}>
                                <h3 className="text-xs font-bold text-foreground/80 uppercase tracking-wider">{group.category}</h3>
                                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">{group.items.length}</span>
                              </div>
                              <ul className="divide-y divide-border/40">
                                {group.items.map(item => (
                                  <motion.li layoutId={item._id} key={item._id} className="group flex flex-col gap-2 px-4 py-3 hover:bg-primary/5 transition-colors">
                                    <div className="flex justify-between items-start gap-3">
                                      <span className="text-foreground/90 text-sm font-semibold flex-1 break-words leading-snug">{item.itemName}</span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteItem(item._id)}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all rounded-lg shrink-0"
                                      >
                                        <Trash2 size={14} />
                                      </Button>
                                    </div>
                                    <div className="w-full">
                                      {renderItemOptions(item)}
                                    </div>
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* CENTER/RIGHT COLUMN: All Items */}
              {showAllItems && (
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-indigo-500/5 border-indigo-500/20 ring-indigo-500/20 shadow-2xl' : 'bg-white border-indigo-100 ring-indigo-50 shadow-xl'} flex flex-col h-full overflow-hidden rounded-3xl transition-all duration-300`}>
                  <CardHeader className={`py-3 px-5 border-b shrink-0 ${theme === 'dark' ? 'border-indigo-500/20 bg-indigo-500/10' : 'border-indigo-100 bg-indigo-50'} space-y-4`}>
                    <CardTitle className={`text-sm flex justify-between items-center ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-950 font-bold'}`}>
                      <span className="flex items-center gap-3">
                        All Items
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-600 text-white shadow-md'}`}>{allExtractedItems.length}</span>
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => setShowAllItems(false)} className="h-8 w-8 p-0 rounded-full hover:bg-white/20">
                        <EyeOff size={14} />
                      </Button>
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-indigo-500/60" size={12} />
                      <Input
                        placeholder="Search all items..."
                        className="pl-8 bg-white/5 border-indigo-500/20 text-foreground h-8 text-xs w-full placeholder:text-indigo-500/40 focus-visible:ring-indigo-500/50 rounded-lg"
                        value={allSearchQuery}
                        onChange={(e) => setAllSearchQuery(e.target.value)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 overflow-y-auto flex-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
                    {allExtractedItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
                        <div className={`w-16 h-16 rounded-3xl ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50'} flex items-center justify-center`}>
                          <Layers className="text-indigo-500/40 w-8 h-8" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">No items match your search.</p>
                      </div>
                    ) : (
                      <ul className="p-3 space-y-3">
                        <AnimatePresence>
                          {allExtractedItems.map(item => (
                            <motion.li
                              layoutId={`all-${item._id}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              key={`all-${item._id}`}
                              className={`group relative flex flex-col gap-3 px-4 py-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.05] shadow-lg shadow-black/20' : 'bg-white border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-md'}`}
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex flex-col gap-1 flex-1">
                                  <span className="text-foreground text-sm font-bold break-words leading-snug" title={item.itemName}>{item.itemName}</span>
                                  <span className={`text-[10px] font-bold uppercase tracking-wider ${item.categoryName === 'Not Assigned' ? 'text-amber-500' : 'text-green-500'}`}>
                                    {item.categoryName === 'Not Assigned' ? 'New' : 'Existed'}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteItem(item._id)}
                                  className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-destructive rounded-lg shrink-0 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                              <div className="w-full">
                                {renderItemOptions(item)}
                              </div>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* RIGHT COLUMN: New Items (Unassigned) */}
              {showNewItems && (
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-primary/5 border-primary/20 ring-primary/20 shadow-2xl' : 'bg-white border-indigo-100 ring-indigo-50 shadow-xl'} flex flex-col h-full overflow-hidden rounded-3xl transition-all duration-300`}>
                  <CardHeader className={`py-3 px-5 border-b shrink-0 ${theme === 'dark' ? 'border-primary/20 bg-primary/10' : 'border-indigo-100 bg-indigo-50'} space-y-4`}>
                    <CardTitle className={`text-sm flex justify-between items-center ${theme === 'dark' ? 'text-primary' : 'text-indigo-950 font-bold'}`}>
                      <span className="flex items-center gap-3">
                        New Items
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-indigo-600 text-white shadow-md'}`}>{newItems.length}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        {newItems.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearUnassigned}
                            className="h-8 text-[10px] text-indigo-600 font-bold px-3 rounded-lg"
                          >
                            Clear All
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setShowNewItems(false)} className="h-8 w-8 p-0 rounded-full hover:bg-white/20">
                          <EyeOff size={14} />
                        </Button>
                      </div>
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-primary/60" size={12} />
                      <Input
                        placeholder="Search new items..."
                        className="pl-8 bg-white/5 border-primary/20 text-foreground h-8 text-xs w-full placeholder:text-primary/40 focus-visible:ring-primary/50 rounded-lg"
                        value={rightSearchQuery}
                        onChange={(e) => setRightSearchQuery(e.target.value)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 overflow-y-auto flex-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
                    {newItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
                        <div className={`w-16 h-16 rounded-3xl ${theme === 'dark' ? 'bg-primary/10' : 'bg-indigo-50'} flex items-center justify-center`}>
                          <Layers className="text-primary/40 w-8 h-8" />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white/60' : 'text-indigo-900'}`}>Ready for extraction</p>
                          <p className="text-xs text-muted-foreground mt-1">Upload a PDF to extract new items.<br />They will appear here for categorization.</p>
                        </div>
                      </div>
                    ) : (
                      <ul className="p-3 space-y-3">
                        <AnimatePresence>
                          {newItems.map(item => (
                            <motion.li
                              layoutId={item._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              key={item._id}
                              className={`group relative flex flex-col gap-3 px-4 py-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-primary/5 border-primary/10 hover:bg-primary/10 shadow-lg shadow-black/20' : 'bg-white border-indigo-50 hover:border-indigo-200 shadow-sm hover:shadow-md'}`}
                            >
                              <div className="flex justify-between items-start gap-4">
                                <span className="text-foreground text-sm font-bold flex-1 break-words leading-snug" title={item.itemName}>{item.itemName}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteItem(item._id)}
                                  className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-destructive rounded-lg shrink-0 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                              <div className="w-full">
                                {renderItemOptions(item)}
                              </div>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Float Toggles when hidden */}
            {(!showExistingItems || !showNewItems || !showUploader) && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-background/80 backdrop-blur-md border border-border rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-4">
                {!showUploader && (
                  <Button variant="outline" size="sm" onClick={() => setShowUploader(true)} className="gap-2 rounded-xl text-xs h-9 bg-primary/5 border-primary/20">
                    <Upload size={14} /> Show Uploader
                  </Button>
                )}
                {!showExistingItems && (
                  <Button variant="outline" size="sm" onClick={() => setShowExistingItems(true)} className="gap-2 rounded-xl text-xs h-9 bg-primary/5 border-primary/20">
                    <Database size={14} /> Show Existing
                  </Button>
                )}
                {!showNewItems && (
                  <Button variant="outline" size="sm" onClick={() => setShowNewItems(true)} className="gap-2 rounded-xl text-xs h-9 bg-primary/5 border-primary/20">
                    <Layers size={14} /> Show New Items
                  </Button>
                )}
                {!showAllItems && (
                  <Button variant="outline" size="sm" onClick={() => setShowAllItems(true)} className="gap-2 rounded-xl text-xs h-9 bg-primary/5 border-primary/20">
                    <Database size={14} /> Show All Items
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EstimateTraining;
