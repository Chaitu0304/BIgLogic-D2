import { useState, useMemo } from "react";
import {
    Users,
    Search,
    Filter,
    Building2,
    Plus,
    ChevronRight,
    ChevronLeft,
    Phone,
    Mail,
    X,
    Trophy,
    ExternalLink,
    FileUp,
    UserCheck,
    Calendar,
    BadgeCheck,
    Star,
    Pencil,
    Trash2,
    Loader2,
    Copy
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

import { Switch } from "@/components/ui/switch";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DESIGNATIONS, CONTACT_FIELD_CONFIG, FieldConfig } from "@/lib/contact-config";
import { useContacts, Contact } from "@/hooks/useContacts";
import { AddContactForm } from "./AddContactForm";
import { BulkUploadModal } from "./BulkUploadModal";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    TableSortLabel
} from '@mui/material';
import axios from "axios";

const PAGE_SIZE = 25;

const ContactsPage = () => {
    const { theme } = useTheme();
    const [search, setSearch] = useState("");
    const [selectedDesignation, setSelectedDesignation] = useState("Adjusters");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [sortBy, setSortBy] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("asc");

    const [newContactData, setNewContactData] = useState<any>({});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<any>({});
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const {
        contacts,
        isLoading,
        isFetching,
        createContact,
        isCreating,
        updateContact,
        isUpdating,
        bulkDelete,
        isBulkDeleting
    } = useContacts(selectedDesignation, search, sortBy, sortOrder);

    const isDark = theme === "dark";

    const copyToClipboard = (text: string, label: string) => {
        if (!text || text === "N/A") return;
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    const activeColumns = useMemo(() => {
        const config = CONTACT_FIELD_CONFIG[selectedDesignation] || [];
        return config.filter(f => f.visibleOverall);
    }, [selectedDesignation]);
    const validateForm = (data: any, label: string) => {
        const config = CONTACT_FIELD_CONFIG[label] || CONTACT_FIELD_CONFIG["All Contacts"];
        const missingFields = config
            .filter(f => f.mandatory && !data[f.key] && data[f.key] !== 0)
            .map(f => f.label);

        if (missingFields.length > 0) {
            toast.error(`Mandatory fields missing: ${missingFields.join(", ")}`);
            return false;
        }
        return true;
    };

    const handleAddContact = async () => {
        try {
            const label = newContactData.designation || selectedDesignation;
            if (!validateForm(newContactData, label)) return;

            const apiValue = DESIGNATIONS.find(d => d.label === label)?.apiValue || "Customer";

            await createContact({
                ...newContactData,
                designation: apiValue
            });

            toast.success("Contact added successfully");
            setIsAddModalOpen(false);
            setNewContactData({});
        } catch (error) {
            console.error("Add contact failed:", error);
            toast.error("Failed to add contact");
        }
    };

    const handleUpdateContact = async () => {
        if (!selectedContact) return;
        try {
            const label = editFormData.designation || "All Contacts";
            if (!validateForm(editFormData, label)) return;

            const apiValue = DESIGNATIONS.find(d => d.label === label)?.apiValue || selectedContact.designation;

            await updateContact({
                id: selectedContact._id,
                data: {
                    ...editFormData,
                    designation: apiValue
                }
            });

            toast.success("Contact updated successfully");
            setIsEditModalOpen(false);
            setSelectedContact(prev => prev ? { ...prev, ...editFormData, designation: apiValue } : null);
        } catch (error) {
            console.error("Update contact failed:", error);
            toast.error("Failed to update contact");
        }
    };

    const openEditModal = () => {
        if (!selectedContact) return;
        const label = DESIGNATIONS.find(d => d.apiValue === selectedContact.designation)?.label || "All Contacts";
        setEditFormData({ ...selectedContact, designation: label });
        setIsEditModalOpen(true);
    };

    const paginatedContacts = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return contacts.slice(start, start + PAGE_SIZE);
    }, [contacts, currentPage]);

    const toggleSelectAll = () => {
        if (selectedIds.size === paginatedContacts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(paginatedContacts.map(c => c._id)));
        }
    };

    const toggleSelectOne = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedIds(newSelected);
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;

        try {
            await bulkDelete(Array.from(selectedIds));
            toast.success(`Deleted ${selectedIds.size} contacts`);
            setSelectedIds(new Set());
            setIsDeleteDialogOpen(false);
        } catch (error) {
            toast.error("Failed to delete contacts");
        }
    };

    const totalPages = Math.ceil(contacts.length / PAGE_SIZE);

    const getInitials = (name: string) =>
        name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "?";

    const avatarColors = [
        "bg-indigo-500", "bg-emerald-500", "bg-amber-500",
        "bg-rose-500", "bg-violet-500", "bg-cyan-500", "bg-orange-500"
    ];
    const getAvatarColor = (id: string) => avatarColors[(id?.charCodeAt(0) || 0) % avatarColors.length];

    const getFieldValue = (contact: Contact, col: FieldConfig) => {
        if (col.calculated && col.key === "convRate") {
            const received = Number(contact.received || 0);
            const signed = Number(contact.signed || 0);
            return received > 0 ? Math.round((signed / received) * 100) : 0;
        }
        const val = contact[col.key];
        if (val === undefined || val === null || val === "") return "N/A";
        return val;
    };

    const renderCell = (contact: Contact, col: FieldConfig) => {
        const val = getFieldValue(contact, col);
        const isNumeric = ["number", "currency", "percent", "rating"].includes(col.type);
        const alignCls = (col.align === "center" || isNumeric) ? "text-center w-full block" : col.align === "right" ? "text-right w-full block" : "";

        switch (col.type) {
            case "name":
                return (
                    <div className="flex items-center gap-4 min-w-0 pr-2">
                        <div className={cn("w-[48px] h-[48px] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden border-2 border-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]", !contact.avatar && getAvatarColor(contact._id))}>
                            {contact.avatar ? (
                                <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                            ) : (
                                getInitials(contact.name)
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className={cn("font-bold text-[14px] leading-tight truncate", isDark ? "text-white" : "text-[#111827]")}>{contact.name}</p>
                            <p className="text-[13px] text-[#6B7280] truncate font-medium mt-0.5">{contact.phone || contact.email || "No contact info"}</p>
                        </div>
                    </div>
                );
            case "currency":
                return (
                    <span className={cn("text-[14px] font-bold tabular-nums", isDark ? "text-white" : "text-[#111827]", alignCls)}>
                        {val !== undefined && val !== null ? `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` : "—"}
                    </span>
                );
            case "number":
                return <span className={cn("text-[14px] font-semibold tabular-nums", alignCls, col.key.includes("active") ? "text-[#1D4ED8]" : isDark ? "text-white" : "text-[#111827]")}>{val ?? 0}</span>;
            case "percent":
                return (
                    <div className="px-1 min-w-[100px]">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className={cn("text-[13px] font-bold", isDark ? "text-white" : "text-[#111827]")}>{val != null ? `${val}%` : "0%"}</span>
                        </div>
                        <div className="h-[6px] w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                            <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${Math.min(val || 0, 100)}%` }} />
                        </div>
                    </div>
                );
            case "badge":
            case "select":
                const badgeLabel = String(val || "—").toUpperCase();
                const isStatus = col.key.toLowerCase().includes("status") || col.key === "tier" || col.key.toLowerCase().includes("comp");

                if (col.type === "select" && !isStatus) {
                    return <span className={cn("text-[14px] font-medium", isDark ? "text-gray-300" : "text-[#374151]", alignCls)}>{val || "—"}</span>;
                }

                const getTierStyles = (tier: string | number) => {
                    const t = String(tier);
                    if (t === "1") return isDark ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-indigo-50 text-indigo-700 border border-indigo-200";
                    if (t === "2") return isDark ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border border-emerald-200";
                    if (t === "3") return isDark ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-amber-50 text-amber-700 border border-amber-200";
                    if (t === "4") return isDark ? "bg-violet-500/20 text-violet-400 border border-violet-500/30" : "bg-violet-50 text-violet-700 border border-violet-200";
                    if (t === "5") return isDark ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-rose-50 text-rose-700 border border-rose-200";
                    return isDark ? "bg-zinc-800 text-zinc-400 border border-zinc-700" : "bg-zinc-50 text-zinc-600 border border-zinc-200";
                };

                return (
                    <div className={cn("flex", col.align === "center" ? "justify-center" : col.align === "right" ? "justify-end" : "justify-start")}>
                        <Badge variant="outline" className={cn(
                            "text-[11px] font-bold uppercase tracking-[0.4px] px-2.5 py-0.5 h-[22px] border-none rounded-[6px] flex items-center justify-center",
                            col.key === "tier" ? getTierStyles(val) :
                                isStatus && (badgeLabel.includes("ACTIVE") || badgeLabel.includes("COMPLIANT") || badgeLabel.includes("COMPLETED")) ? "bg-[#DCFCE7] text-[#16A34A]" :
                                    isStatus && (badgeLabel.includes("INACTIVE") || badgeLabel.includes("NON") || badgeLabel.includes("PENDING")) ? "bg-[#FEE2E2] text-[#DC2626]" :
                                        isDark ? "bg-white/10 text-gray-300 border-white/10" : "bg-[#F3F4F6] text-[#374151]"
                        )}>
                            {col.key === "tier" ? `${val}` : badgeLabel}
                        </Badge>
                    </div>
                );
            case "rating":
                return (
                    <div className={cn("flex items-center gap-1.5", (col.align === "center" || isNumeric) ? "justify-center" : col.align === "right" ? "justify-end" : "justify-start")}>
                        <Star size={12} className="text-[#F59E0B] fill-[#F59E0B]" />
                        <span className={cn("text-[14px] font-bold tabular-nums", isDark ? "text-white" : "text-[#111827]")}>{val || "0.0"}</span>
                    </div>
                );
            case "activity":
            case "date":
                return <span className={cn("text-[14px] font-medium", isDark ? "text-gray-400" : "text-[#6B7280]")}>{val ? new Date(val).toLocaleDateString() : "—"}</span>;
            default:
                return <span className={cn("text-[14px] font-medium truncate", isDark ? "text-gray-300" : "text-[#374151]", alignCls)}>{val || "—"}</span>;
        }
    };

    return (
        <DashboardLayout fullWidth={true}>
            <div className="w-[100%] min-w-0 space-y-8 animate-in fade-in duration-500 flex flex-col">
                {/* Page Header */}
                <div className="flex items-center justify-between shrink-0 w-full">
                    <div>
                        <h1 className={cn("text-[36px] font-bold leading-[1.2] mb-1 tracking-tight", isDark ? "text-white" : "text-[#111827]")}>Contacts Directory</h1>
                        <p className="text-[#6B7280] font-medium text-[15px]">Manage and monitor all company contact categories in a centralized hub.</p>
                    </div>
                </div>
                {/*search ,fil,designation bar*/}
                <div className="flex gap-6 flex-1 min-w-0">
                    {/* Main Content Area */}
                    <div className={cn(
                        "flex flex-col space-y-4 transition-all duration-500",
                        selectedContact ? "w-[calc(75%-10px)]" : "w-[100%]"
                    )}>
                        {/* Filter Tabs -designations */}
                        <div className={cn(
                            "flex items-center gap-1 overflow-x-auto scrollbar-hide border-b pb-0 shrink-0",
                            isDark ? "border-white/10" : "border-[#E5E7EB]"
                        )}>
                            {DESIGNATIONS.map(({ label, icon: Icon }) => (
                                <button
                                    key={label}
                                    onClick={() => { setSelectedDesignation(label); setCurrentPage(1); setSelectedContact(null); }}
                                    className={cn(
                                        "relative flex items-center gap-2 px-4 py-4 text-[15px] font-semibold whitespace-nowrap transition-all border-b-4 -mb-px",
                                        selectedDesignation === label
                                            ? "border-[#1D4ED8] text-[#1D4ED8]"
                                            : isDark
                                                ? "border-transparent text-gray-400 hover:text-gray-200"
                                                : "border-transparent text-[#374151] hover:text-[#111827]"
                                    )}
                                >
                                    <Icon size={16} />
                                    {label}
                                    {selectedDesignation === label && !isLoading && (
                                        <span className="ml-1 bg-[#1D4ED8] text-white text-[11px] font-bold rounded-full px-2 py-0.5">
                                            {contacts.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center justify-between gap-4 flex-nowrap shrink-0 w-full">
                            <div className="flex items-center gap-3 shrink-0">
                                <h2 className={cn("text-[20px] font-bold tracking-tight", isDark ? "text-white" : "text-[#111827]")}>
                                    {selectedDesignation} <span className={cn("text-sm font-medium ml-1", isDark ? "text-gray-400" : "text-[#6B7280]")}>{contacts.length}</span>
                                </h2>
                            </div>

                            <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                                <div className="relative flex-1 max-w-[320px] min-w-[120px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                                    <Input
                                        placeholder="Search contacts..."
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                        className={cn(
                                            "pl-10 h-[44px] w-full rounded-[10px] text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:!border-transparent outline-none",
                                            isDark ? "bg-white/5 border-white/10" : "bg-white border-[#E5E7EB] placeholder-[#9CA3AF]"
                                        )}
                                    />
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsBulkModalOpen(true)}
                                    disabled={isBulkDeleting}
                                    className={cn("h-[44px] gap-2 rounded-[10px] font-semibold text-[14px] px-5 shrink-0 transition-all duration-300 border-[#E5E7EB] shadow-sm", isDark ? "border-white/10 bg-white/5 text-white hover:!bg-white/10 hover:!text-white" : "bg-white text-[#111827] hover:bg-gray-50")}
                                >
                                    {isBulkDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp size={16} />}
                                    <span className="hidden sm:inline">Bulk Upload</span>
                                </Button>

                                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="h-[44px] bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-6 rounded-[10px] font-semibold text-[14px] shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shrink-0">
                                            <Plus size={18} className="mr-1" /> <span className="hidden sm:inline">Add Contact</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className={cn("sm:max-w-[700px] max-h-[90vh] overflow-y-auto scrollbar-hide rounded-[16px]", isDark ? "bg-[#1A1C23] border-white/10 shadow-2xl" : "bg-white border-[#E5E7EB]")}>
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold text-[#111827]">Add New {selectedDesignation.slice(0, -1)}</DialogTitle>
                                            <p className="text-sm text-[#6B7280] font-medium">Enter details for the selected category</p>
                                        </DialogHeader>

                                        <AddContactForm
                                            designation={selectedDesignation}
                                            formData={newContactData}
                                            setFormData={setNewContactData}
                                        />

                                        <DialogFooter className="pt-4 border-t border-[#E5E7EB]">
                                            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)} disabled={isCreating} className="font-semibold text-sm hover:bg-gray-100">Cancel</Button>
                                            <Button onClick={handleAddContact} disabled={isCreating} className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-8 font-semibold text-sm rounded-[10px] shadow-sm min-w-[160px]">
                                                {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                                {isCreating ? "Creating..." : "Create Contact"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className={cn(
                            "border rounded-[14px] flex flex-col w-full",
                            isDark ? "border-white/5 bg-card/50 shadow-inner" : "border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                        )}>
                            <TableContainer className="overflow-x-auto px-2 scrollbar-hide" component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
                                <Table stickyHeader aria-label="contacts table" sx={{ minWidth: 600, maxWidth: 700 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                padding="checkbox"
                                                sx={{
                                                    bgcolor: isDark ? '#0F1117' : '#FFFFFF',
                                                    borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #F1F5F9',
                                                    width: 50
                                                }}
                                            >
                                                <Checkbox
                                                    checked={selectedIds.size > 0 && selectedIds.size === paginatedContacts.length}
                                                    onCheckedChange={toggleSelectAll}
                                                    className={cn(isDark ? "border-white/20" : "border-[#E5E7EB]")}
                                                />
                                            </TableCell>
                                            {activeColumns.map(col => (
                                                <TableCell
                                                    key={col.key + col.label}
                                                    align={(col.align === "center" || ["number", "currency", "percent", "rating"].includes(col.type)) ? 'center' : (col.align || 'left')}
                                                    sx={{
                                                        bgcolor: isDark ? '#0F1117' : '#FFFFFF',
                                                        borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #F1F5F9',
                                                        color: isDark ? '#D1D5DB' : '#374151',
                                                        fontSize: '13px',
                                                        fontWeight: 600,
                                                        letterSpacing: '0.2px',
                                                        minWidth: 200,
                                                        py: 2
                                                    }}
                                                >
                                                    <TableSortLabel
                                                        active={sortBy === col.key}
                                                        direction={sortBy === col.key ? sortOrder : 'asc'}
                                                        onClick={() => {
                                                            if (sortBy === col.key) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                                            else { setSortBy(col.key); setSortOrder('asc'); }
                                                        }}
                                                        sx={{
                                                            color: 'inherit !important',
                                                            '& .MuiTableSortLabel-icon': {
                                                                color: '#1D4ED8 !important',
                                                            },
                                                        }}
                                                    >
                                                        {col.label}
                                                    </TableSortLabel>
                                                </TableCell>
                                            ))}
                                            <TableCell sx={{ bgcolor: isDark ? '#0F1117' : '#FFFFFF', borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #F1F5F9', width: 40 }} />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(isLoading || isFetching) ? (
                                            <TableRow>
                                                <TableCell colSpan={activeColumns.length + 2} align="center" sx={{ py: 32 }}>
                                                    <div className="flex flex-col items-start ml-[400px] justify-center gap-4 w-full mx-auto border-none">
                                                        <div className="relative flex items-center justify-center gap-2 flex-col ">
                                                            <Loader2 className="w-12 h-12 animate-spin text-[#1D4ED8]" />
                                                            <p className="text-[13px] font-bold text-[#6B7280] animate-pulse uppercase tracking-tight ml-1">Loading contacts</p>
                                                        </div>

                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : Array.isArray(paginatedContacts) && paginatedContacts.length > 0 ? (
                                            paginatedContacts.map((contact: Contact) => (
                                                <TableRow
                                                    key={contact._id}
                                                    hover
                                                    onClick={() => setSelectedContact(contact)}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        height: '84px',
                                                        bgcolor: selectedContact?._id === contact._id
                                                            ? (isDark ? 'rgba(29,78,216,0.25)' : 'rgba(29,78,216,0.12)')
                                                            : 'transparent',
                                                        '&:hover': {
                                                            bgcolor: isDark ? 'rgba(255,255,255,0.03) !important' : '#F9FAFB !important'
                                                        },
                                                        '& td': {
                                                            borderBottom: isDark ? '1px solid rgba(255,255,255,0.02)' : '1px solid #F1F5F9',
                                                            color: isDark ? '#E5E7EB' : '#111827',
                                                            fontSize: '14px',
                                                            fontWeight: 600
                                                        }
                                                    }}
                                                >
                                                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                                        <Checkbox
                                                            checked={selectedIds.has(contact._id)}
                                                            onCheckedChange={() => toggleSelectOne(contact._id)}
                                                            className={cn(isDark ? "border-white/20" : "border-slate-300")}
                                                        />
                                                    </TableCell>
                                                    {activeColumns.map(col => (
                                                        <TableCell
                                                            key={col.key + col.label}
                                                            align={(col.align === "center" || ["number", "currency", "percent", "rating"].includes(col.type)) ? 'center' : (col.align || 'left')}
                                                        >
                                                            {renderCell(contact, col)}
                                                        </TableCell>
                                                    ))}
                                                    <TableCell align="right">
                                                        <ChevronRight
                                                            size={14}
                                                            className={cn(
                                                                "transition-transform",
                                                                selectedContact?._id === contact._id ? "text-indigo-500 translate-x-1" : "text-muted-foreground/20"
                                                            )}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={activeColumns.length + 2} align="center" sx={{ py: 10, opacity: 0.2 }}>
                                                    <Users size={64} className="mx-auto mb-4" />
                                                    <p className="text-sm font-bold uppercase tracking-tight opacity-50">No contacts found in this category</p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Pagination */}
                            <div className={cn("px-6 py-4 flex items-center justify-between border-t text-[13px] font-medium text-[#6B7280] shrink-0", isDark ? "border-white/5 bg-white/[0.01]" : "border-[#E5E7EB] bg-[#FFFFFF]")}>
                                <span className={isDark ? "text-gray-400" : ""}>Showing <span className={cn("font-bold", isDark ? "text-white" : "text-[#111827]")}>{Math.min(contacts.length, (currentPage - 1) * PAGE_SIZE + 1)}</span> to <span className={cn("font-bold", isDark ? "text-white" : "text-[#111827]")}>{Math.min(currentPage * PAGE_SIZE, contacts.length)}</span> of <span className={cn("font-bold", isDark ? "text-white" : "text-[#111827]")}>{contacts.length}</span> entries</span>
                                <div className="flex gap-2 items-center">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className={cn("h-9 w-9 rounded-[10px] border-none bg-[#1D4ED8] text-white hover:!bg-[#1D4ED8]/90 transition-all", currentPage === 1 && "opacity-50")}
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                    >
                                        <ChevronLeft size={18} />
                                    </Button>

                                    {/* Smart Pagination */}
                                    {(() => {
                                        const pages = [];
                                        const showMax = 7;
                                        if (totalPages <= showMax) {
                                            for (let i = 1; i <= totalPages; i++) pages.push(i);
                                        } else {
                                            pages.push(1);
                                            if (currentPage > 4) pages.push("...");

                                            const start = Math.max(2, currentPage - 2);
                                            const end = Math.min(totalPages - 1, currentPage + 2);

                                            for (let i = start; i <= end; i++) {
                                                if (!pages.includes(i)) pages.push(i);
                                            }

                                            if (currentPage < totalPages - 3) pages.push("...");
                                            if (!pages.includes(totalPages)) pages.push(totalPages);
                                        }

                                        return pages.map((page, i) => (
                                            page === "..." ? (
                                                <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
                                            ) : (
                                                <Button
                                                    key={`page-${page}`}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="icon"
                                                    className={cn(
                                                        "h-9 w-9 rounded-[10px] text-[13px] font-bold transition-all border-none shadow-sm",
                                                        currentPage === page
                                                            ? "bg-[#1D4ED8] text-white ring-2 ring-white/20"
                                                            : isDark ? "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    )}
                                                    onClick={() => setCurrentPage(Number(page))}
                                                >
                                                    {page}
                                                </Button>
                                            )
                                        ));
                                    })()}

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className={cn("h-9 w-9 rounded-[10px] border-none bg-[#1D4ED8] text-white hover:!bg-[#1D4ED8]/90 transition-all", (currentPage === totalPages || totalPages === 0) && "opacity-50")}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                    >
                                        <ChevronRight size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Dynamic Category Specific Details */}
                    <AnimatePresence>
                        {selectedContact && (
                            <motion.div
                                initial={{ x: 350, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 350, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className={cn(
                                    "w-[20%] min-w-[340px] border rounded-xl h-fit sticky top-8 flex flex-col shrink-0 scrollbar-hide",
                                    isDark ? "bg-[#13151b]/80 backdrop-blur-2xl border-white/5 shadow-2xl" : "bg-white border-slate-200 shadow-xl"
                                )}
                            >
                                {/* Sidebar Header */}
                                <div className="p-8 pb-4 flex flex-col items-center text-center">
                                    <div className="absolute top-4 right-4 flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-[#1D4ED8]/10 hover:text-[#1D4ED8] transition-colors" onClick={openEditModal}><Pencil size={16} /></Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-rose-500/10 hover:text-rose-500 transition-colors" onClick={() => setSelectedContact(null)}><X size={16} /></Button>
                                    </div>

                                    <div className="relative group mb-6">
                                        <div className={cn("w-[96px] h-[96px] rounded-full flex items-center justify-center text-white text-3xl font-bold ring-8 transition-transform group-hover:scale-105 overflow-hidden",
                                            isDark ? "ring-white/[0.02]" : "ring-[#F8FAFC]",
                                            !selectedContact.avatar && getAvatarColor(selectedContact._id))}>
                                            {selectedContact.avatar ? (
                                                <img src={selectedContact.avatar} alt={selectedContact.name} className="w-full h-full object-cover" />
                                            ) : (
                                                getInitials(selectedContact.name)
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-[#1D4ED8] text-white p-2 rounded-full border-4 border-[#FFFFFF] shadow-xl"><BadgeCheck size={16} /></div>
                                    </div>

                                    <h3 className={cn("text-[30px] font-bold tracking-tight", isDark ? "text-white" : "text-[#111827]")}>{selectedContact.name}</h3>
                                    <p className="text-[15px] font-semibold text-[#1D4ED8] mt-1">{selectedContact.company || "Independent"}</p>
                                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                                        <Badge className="bg-[#DBEAFE] text-[#1D4ED8]  hover:bg-inherit border-none text-[11px] font-bold uppercase tracking-[0.4px] px-3 py-1 rounded-[6px]">{selectedContact.designation}</Badge>
                                        {selectedDesignation === "Adjusters" && selectedContact.tier && selectedContact.tier !== "N/A" && (
                                            <Badge className={cn("border-none hover:bg-inherit text-[11px] font-bold uppercase tracking-[0.4px] px-3 py-1 rounded-[6px]",
                                                String(selectedContact.tier) === "1" ? (isDark ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-indigo-50 text-indigo-700 border border-indigo-200") :
                                                    String(selectedContact.tier) === "2" ? (isDark ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border border-emerald-200") :
                                                        String(selectedContact.tier) === "3" ? (isDark ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-amber-50 text-amber-700 border border-amber-200") :
                                                            String(selectedContact.tier) === "4" ? (isDark ? "bg-violet-500/20 text-violet-400 border border-violet-500/30" : "bg-violet-50 text-violet-700 border border-violet-200") :
                                                                String(selectedContact.tier) === "5" ? (isDark ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-rose-50 text-rose-700 border border-rose-200") :
                                                                    (isDark ? "bg-zinc-800 text-zinc-400 border border-zinc-700" : "bg-zinc-50 text-zinc-600 border border-zinc-200")
                                            )}>{selectedContact.tier}</Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="px-6 grid grid-cols-2 gap-3 mb-8">
                                    <Button
                                        asChild={!!selectedContact.phone && selectedContact.phone !== "N/A"}
                                        disabled={!selectedContact.phone || selectedContact.phone === "N/A"}
                                        className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-[14px] font-semibold h-[44px] rounded-[10px] gap-2 shadow-sm uppercase tracking-[0.2px] disabled:opacity-50"
                                    >
                                        {!!selectedContact.phone && selectedContact.phone !== "N/A" ? (
                                            <a href={`tel:${selectedContact.phone}`}><Phone size={16} /> CALL</a>
                                        ) : (
                                            <><Phone size={16} /> CALL</>
                                        )}
                                    </Button>
                                    <Button
                                        asChild={!!(selectedContact.email || selectedContact.email1) && (selectedContact.email || selectedContact.email1) !== "N/A"}
                                        variant="outline"
                                        disabled={!(selectedContact.email || selectedContact.email1) || (selectedContact.email || selectedContact.email1) === "N/A"}
                                        className={cn("text-[14px] font-semibold h-[44px] rounded-[10px] gap-2 uppercase tracking-[0.2px] disabled:opacity-50 border-[#E5E7EB] text-[#111827]", isDark ? "border-white/10 hover:bg-white/5 text-white" : "hover:bg-gray-50")}
                                    >
                                        {!!(selectedContact.email || selectedContact.email1) && (selectedContact.email || selectedContact.email1) !== "N/A" ? (
                                            <a href={`mailto:${selectedContact.email || selectedContact.email1}`}><Mail size={16} /> EMAIL</a>
                                        ) : (
                                            <><Mail size={16} /> EMAIL</>
                                        )}
                                    </Button>
                                </div>

                                {/* Dynamic Field Content */}
                                <div className="flex-1 px-6 pb-8 space-y-10">
                                    {(() => {
                                        const allFields = CONTACT_FIELD_CONFIG[selectedDesignation] || [];
                                        const detailFields = allFields.filter(f => f.detailView);

                                        const sections = selectedDesignation === "Adjusters" ? [
                                            {
                                                title: "Performance Dashboard",
                                                fields: detailFields.filter(f => ["received", "signed", "completed", "revenue", "convRate", "tier", "activeJobs", "lastActivity"].includes(f.key))
                                            },
                                            {
                                                title: "Adjuster Identity",
                                                fields: detailFields.filter(f => ["adjusterType"].includes(f.key))
                                            },
                                            {
                                                title: "Contact Matrix",
                                                fields: detailFields.filter(f => ["phone", "phone2", "phone3", "email1", "email2", "fax"].includes(f.key))
                                            },
                                            {
                                                title: "Location Intel",
                                                fields: detailFields.filter(f => ["address", "city", "state", "zip"].includes(f.key))
                                            }
                                        ] : selectedDesignation === "Vendors" ? [
                                            {
                                                title: "Performance & Compliance",
                                                fields: detailFields.filter(f => ["vendorRating", "activeJobs", "totalJobs", "avgJobValue", "complianceStatus", "insuranceExp", "lastActivity"].includes(f.key))
                                            },
                                            {
                                                title: "Professional Credentials",
                                                fields: detailFields.filter(f => ["trades", "subTrades", "licenseNumber"].includes(f.key))
                                            },
                                            {
                                                title: "Contact Hub",
                                                fields: detailFields.filter(f => ["phone", "phone2", "phone3", "email", "email2", "fax", "preferredContact"].includes(f.key))
                                            },
                                            {
                                                title: "Location Intel",
                                                fields: detailFields.filter(f => ["address", "city", "state", "zip"].includes(f.key))
                                            },
                                            {
                                                title: "Workers' Compensation",
                                                fields: detailFields.filter(f => ["workersComp", "wcCompany", "wcPolicy", "wcExpDate"].includes(f.key))
                                            },
                                            {
                                                title: "Liability Insurance",
                                                fields: detailFields.filter(f => ["liabilityIns", "liabCompany", "liabPolicy", "liabExpDate"].includes(f.key))
                                            }
                                        ] : selectedDesignation === "Employees" ? [
                                            {
                                                title: "Performance & Metrics",
                                                fields: detailFields.filter(f => ["utilization", "activeJobs", "yearsOfService", "lastActivity"].includes(f.key))
                                            },
                                            {
                                                title: "Organizational Context",
                                                fields: detailFields.filter(f => ["role", "department", "hireDate", "status", "manager"].includes(f.key))
                                            },
                                            {
                                                title: "Contact Hub",
                                                fields: detailFields.filter(f => ["phone", "phone2", "phone3", "email", "email2", "fax"].includes(f.key))
                                            },
                                        ] : selectedDesignation === "TPAs / Clients" ? [
                                            {
                                                title: "Portfolio Performance",
                                                fields: detailFields.filter(f => ["totalClaims", "revenue", "activeJobs", "clientRating"].includes(f.key))
                                            },
                                            {
                                                title: "SLA & Protocol",
                                                fields: detailFields.filter(f => ["responseTarget", "guidelines", "lastActivity", "notes"].includes(f.key))
                                            },
                                            {
                                                title: "Communication Hub",
                                                fields: detailFields.filter(f => ["primaryContact", "phone", "phone2", "phone3", "email", "email2", "fax"].includes(f.key))
                                            },
                                            {
                                                title: "Location Details",
                                                fields: detailFields.filter(f => ["address", "city", "state", "zip"].includes(f.key))
                                            }
                                        ] : selectedDesignation === "HOAs" ? [
                                            {
                                                title: "Management Portfolio",
                                                fields: detailFields.filter(f => ["managedUnits", "avgJobSize", "activeJobs", "totalJobs"].includes(f.key))
                                            },
                                            {
                                                title: "Account Identity",
                                                fields: detailFields.filter(f => ["accountStatus", "lastActivity"].includes(f.key))
                                            },
                                            {
                                                title: "Communication Hub",
                                                fields: detailFields.filter(f => ["primaryContact", "phone", "phone2", "phone3", "email", "email2", "fax"].includes(f.key))
                                            },
                                            {
                                                title: "Property Logistics",
                                                fields: detailFields.filter(f => ["address", "city", "state", "zip", "accessNotes"].includes(f.key))
                                            }
                                        ] : selectedDesignation === "Property Mgmt" ? [
                                            {
                                                title: "Portfolio Metrics",
                                                fields: detailFields.filter(f => ["managedUnits", "avgJobSize", "activeJobs", "totalJobs"].includes(f.key))
                                            },
                                            {
                                                title: "Account Identity",
                                                fields: detailFields.filter(f => ["accountStatus", "lastActivity"].includes(f.key))
                                            },
                                            {
                                                title: "Communication Hub",
                                                fields: detailFields.filter(f => ["name", "phone", "phone2", "phone3", "email", "email2", "fax"].includes(f.key))
                                            },
                                            {
                                                title: "Management Scope",
                                                fields: detailFields.filter(f => ["address", "city", "state", "zip", "propertiesManaged"].includes(f.key))
                                            }
                                        ] : [
                                            {
                                                title: "Contact Details",
                                                fields: detailFields.filter(f => f.key !== "name")
                                            }
                                        ];

                                        return sections.filter(s => s.fields.length > 0).map(section => {
                                            const isPerformance = section.title === "Performance Dashboard" || section.title === "Portfolio Metrics" || section.title === "Portfolio Performance";
                                            const isIdentity = section.title === "Adjuster Identity" || section.title === "Account Identity" || section.title === "Carrier Association";

                                            return (
                                                <div key={section.title} className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className={cn("text-[13px] font-bold uppercase tracking-[1px]", isDark ? "text-gray-400" : "text-[#6B7280]")}>
                                                            {section.title}
                                                            {isPerformance && <span className="ml-1.5 lowercase font-medium opacity-50">(This Year)</span>}
                                                        </h4>
                                                        {section.title === "Recent Claims Sent to Us" && (
                                                            <button className="text-[11px] font-bold text-[#1D4ED8] hover:underline">View All</button>
                                                        )}
                                                    </div>

                                                    {isPerformance ? (
                                                        <div className="space-y-4">
                                                            {/* 2x2 Grid for Main Metrics */}
                                                            <div className={cn("grid grid-cols-2 rounded-[16px] overflow-hidden border", isDark ? "border-white/5 bg-white/[0.02]" : "border-gray-100 bg-gray-50/30")}>
                                                                {section.fields.filter(f => ["revenue", "received", "signed", "completed", "totalClaims", "managedUnits", "activeJobs", "totalJobs", "managedPortfolio"].includes(f.key)).slice(0, 4).map((field, i) => {
                                                                    const val = getFieldValue(selectedContact, field);
                                                                    const isRevenue = field.type === "currency";
                                                                    return (
                                                                        <div key={field.key} className={cn(
                                                                            "p-5 flex flex-col items-center justify-center text-center gap-1",
                                                                            i % 2 === 0 && (isDark ? "border-r border-white/5" : "border-r border-gray-100"),
                                                                            i < 2 && (isDark ? "border-b border-white/5" : "border-b border-gray-100")
                                                                        )}>
                                                                            <span className={cn("text-[20px] font-black tracking-tight", isRevenue ? "text-[#1D4ED8]" : (isDark ? "text-white" : "text-[#111827]"))}>
                                                                                {field.type === 'currency' ? `$${Number(val || 0).toLocaleString()}` : val}
                                                                            </span>
                                                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">{field.label}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Conversion Progress Bars */}
                                                            {section.fields.filter(f => f.key === "convRate").map(f => {
                                                                const val = Number(getFieldValue(selectedContact, f)) || 0;
                                                                return (
                                                                    <div key={f.key} className={cn("p-4 rounded-[16px] border space-y-3", isDark ? "border-white/5 bg-white/[0.01]" : "border-gray-100 bg-white shadow-sm")}>
                                                                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Conversion Performance</p>
                                                                        <div className="space-y-4">
                                                                            <div className="space-y-1.5">
                                                                                <div className="flex justify-between text-[12px] font-bold">
                                                                                    <span className={isDark ? "text-gray-400" : "text-gray-600"}>By Jobs (Count)</span>
                                                                                    <span className={isDark ? "text-white" : "text-[#111827]"}>{val}%</span>
                                                                                </div>
                                                                                <div className={cn("h-2 w-full rounded-full overflow-hidden", isDark ? "bg-white/5" : "bg-gray-100")}>
                                                                                    <div className="h-full bg-[#1D4ED8] transition-all duration-1000" style={{ width: `${val}%` }} />
                                                                                </div>
                                                                            </div>
                                                                            <div className="space-y-1.5">
                                                                                <div className="flex justify-between text-[12px] font-bold">
                                                                                    <span className={isDark ? "text-gray-400" : "text-gray-600"}>By Revenue ($)</span>
                                                                                    <span className={isDark ? "text-white" : "text-[#111827]"}>{val}%</span>
                                                                                </div>
                                                                                <div className={cn("h-2 w-full rounded-full overflow-hidden", isDark ? "bg-white/5" : "bg-gray-100")}>
                                                                                    <div className="h-full bg-[#1D4ED8] transition-all duration-1000" style={{ width: `${val}%` }} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}

                                                            {/* Tier Ranking Box */}
                                                            {selectedContact.tier && selectedContact.tier !== "N/A" && (
                                                                <div className={cn("p-4 rounded-[16px] border flex items-center gap-4", isDark ? "border-white/5 bg-white/[0.01]" : "border-gray-100 bg-white shadow-sm")}>
                                                                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                                                                        <Trophy size={24} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[12px] font-black text-[#1D4ED8] uppercase tracking-widest"> {selectedContact.tier}</p>
                                                                        <p className="text-[11px] font-bold text-gray-500">Top Performer Candidate</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : isIdentity && selectedContact.company ? (
                                                        <div className={cn("p-5 rounded-[16px] border space-y-4", isDark ? "border-white/5 bg-white/[0.01]" : "border-gray-100 bg-white shadow-sm")}>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8]">
                                                                    <Building2 size={20} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[13px] font-bold text-[#111827] dark:text-white leading-tight">{selectedContact.company}</p>
                                                                    <p className="text-[11px] font-medium text-gray-500">Primary Partner</p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    ) : (
                                                        <div className={cn("grid gap-x-6 gap-y-5", section.fields.length > 2 ? "grid-cols-2" : "grid-cols-1")}>
                                                            {section.fields.map(field => {
                                                                const val = getFieldValue(selectedContact, field);
                                                                const isFullWidth = ["address", "notes", "guidelines", "email", "email1", "email2", "email3", "phone", "phone2", "phone3", "trades", "subTrades"].includes(field.key);
                                                                const isNA = !val || val === "N/A" || val === "—";
                                                                const isCommunicable = field.key.toLowerCase().includes("phone") || field.key.toLowerCase().includes("email") || field.key.toLowerCase().includes("fax");
                                                                const isStatusField = ["accountStatus", "status", "complianceStatus"].includes(field.key);
                                                                const isTogglable = isStatusField && !isNA;

                                                                const handleStatusToggle = async (checked: boolean) => {
                                                                    const isHOA = selectedDesignation === "HOAs" || selectedDesignation === "Property Mgmt";
                                                                    const isVendor = selectedDesignation === "Vendors";
                                                                    const isEmployee = selectedDesignation === "Employees";
                                                                    let newStatus = "";
                                                                    if (isHOA || isEmployee) newStatus = checked ? "Active" : "Inactive";
                                                                    else if (isVendor) newStatus = checked ? "Compliant" : "Non-Compliant";
                                                                    if (!newStatus) return;

                                                                    try {
                                                                        const token = localStorage.getItem('token');
                                                                        await axios.put(`${import.meta.env.VITE_API_URL}/api/contacts/${selectedContact._id}`, {
                                                                            [field.key]: newStatus
                                                                        }, {
                                                                            headers: { Authorization: `Bearer ${token}` }
                                                                        });
                                                                        mutate();
                                                                        setSelectedContact(prev => prev ? { ...prev, [field.key]: newStatus } : null);
                                                                        toast.success(`${selectedContact.name} is now ${newStatus}`);
                                                                    } catch (error) {
                                                                        console.error("Error updating status:", error);
                                                                        toast.error("Failed to update status");
                                                                    }
                                                                };

                                                                const isPerformanceMetric = ["received", "signed", "completed", "revenue", "totalClaims", "managedUnits", "utilization"].includes(field.key);
                                                                const isRate = ["convRate", "utilization", "clientRating", "vendorRating"].includes(field.key);

                                                                return (
                                                                    <div key={field.key} className={cn("space-y-1.5 group", isFullWidth && "col-span-full")}>
                                                                        <div className="flex items-center justify-between">
                                                                            <p className={cn("text-[11px] font-bold uppercase tracking-wider", isDark ? "text-gray-500" : "text-gray-400")}>{field.label}</p>
                                                                            {isTogglable && (
                                                                                <Switch
                                                                                    checked={val === "Active" || val === "Compliant"}
                                                                                    onCheckedChange={handleStatusToggle}
                                                                                    className="scale-75 data-[state=checked]:bg-[#16A34A]"
                                                                                />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center justify-between gap-4">
                                                                            <div className={cn(
                                                                                "tracking-tight break-all",
                                                                                isPerformanceMetric ? "text-[24px] font-black text-[#1D4ED8]" : cn("text-[14px] font-semibold", isDark ? "text-white" : "text-[#111827]")
                                                                            )}>
                                                                                {field.type === 'currency' ? `$${Number(val || 0).toLocaleString()}` :
                                                                                    field.type === 'percent' ? `${val || 0}%` :
                                                                                        field.type === 'rating' ? `★ ${val || "0.0"}` :
                                                                                            (field.type === 'activity' || field.type === 'date') ? (val ? new Date(val).toLocaleDateString() : 'N/A') :
                                                                                                String(val || 'N/A')}
                                                                            </div>
                                                                            {isCommunicable && !isNA && (
                                                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-[6px] hover:bg-[#1D4ED8]/10 hover:text-[#1D4ED8] shrink-0" onClick={() => copyToClipboard(String(val), field.label)}><Copy size={14} /></Button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        });
                                    })()}

                                    {/* Internal Notes */}
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-3">
                                            <h4 className={cn("text-[14px] font-bold whitespace-nowrap", isDark ? "text-white" : "text-[#111827]")}>Internal Notes</h4>
                                            <div className={cn("h-px w-full", isDark ? "bg-white/10" : "bg-[#E5E7EB]")} />
                                        </div>
                                        <div className={cn("p-4 rounded-[12px] text-[13px] font-medium leading-relaxed italic border", isDark ? "bg-white/[0.03] border-white/10 text-gray-400" : "bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280]")}>
                                            {selectedContact.notes || "No internal notes available for this contact."}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <BulkUploadModal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} />
                {/* Edit Contact Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className={cn("sm:max-w-[700px] max-h-[90vh] overflow-y-auto scrollbar-hide rounded-[16px]", isDark ? "bg-[#1A1C23] border-white/10 shadow-2xl" : "bg-white border-[#E5E7EB]")}>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-[#111827]">Edit Contact</DialogTitle>
                            <p className="text-sm text-[#6B7280] font-medium">Modify contact information below</p>
                        </DialogHeader>

                        <AddContactForm
                            designation={editFormData.designation || "All Contacts"}
                            formData={editFormData}
                            setFormData={setEditFormData}
                        />

                        <DialogFooter className="pt-4 border-t border-[#E5E7EB]">
                            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)} disabled={isUpdating} className="font-semibold text-sm hover:bg-gray-100">Cancel</Button>
                            <Button onClick={handleUpdateContact} disabled={isUpdating} className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-8 font-semibold text-sm rounded-[10px] shadow-sm min-w-[160px]">
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {isUpdating ? "Updating..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Bulk Action Bar */}
                <AnimatePresence>
                    {selectedIds.size > 0 && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                        >
                            <div className={cn(
                                "flex items-center gap-6 px-8 py-5 rounded-[20px] border shadow-2xl backdrop-blur-xl",
                                isDark ? "bg-[#1A1C23]/90 border-white/10 shadow-black/50" : "bg-white/90 border-[#E5E7EB] shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                            )}>
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-bold uppercase tracking-[0.5px] text-[#1D4ED8]">Selection Mode</span>
                                    <span className={cn("text-[15px] font-bold", isDark ? "text-white" : "text-[#111827]")}>{selectedIds.size} Contacts Selected</span>
                                </div>

                                <div className="h-10 w-px bg-[#E5E7EB]" />

                                <div className="flex gap-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedIds(new Set())}
                                        className={cn("font-semibold text-sm", isDark ? "text-gray-400 hover:bg-white/5" : "text-[#6B7280] hover:bg-gray-100")}
                                    >
                                        Deselect
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                        className="font-bold text-sm bg-[#DC2626] hover:bg-rose-700 shadow-sm rounded-[10px] gap-2 px-6"
                                    >
                                        <Trash2 size={16} /> Delete Selected
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bulk Delete Confirmation Dialog */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent className={cn("rounded-[20px]", isDark ? "bg-[#1A1C23] border-white/10" : "bg-white border-[#E5E7EB]")}>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold text-[#111827]">Confirm Bulk Deletion</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm font-medium text-[#6B7280]">
                                This will permanently remove <span className="font-bold text-[#DC2626]">{selectedIds.size}</span> selected contacts from your directory. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6">
                            <AlertDialogCancel disabled={isBulkDeleting} className="font-semibold text-sm border-[#E5E7EB] rounded-[10px] hover:bg-gray-50">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleBulkDelete}
                                disabled={isBulkDeleting}
                                className="bg-[#DC2626] hover:bg-rose-700 text-white font-bold text-sm rounded-[10px] shadow-sm transition-all duration-300 hover:scale-[1.02] min-w-[140px]"
                            >
                                {isBulkDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {isBulkDeleting ? "Deleting..." : "Confirm Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DashboardLayout>
    );
};

export default ContactsPage;
