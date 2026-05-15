import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Search, Plus, MoreHorizontal, Shield, KeyRound, UserX, Loader2, Eye, FileText, CheckCircle, Zap, User as UserIcon, Mail, Phone, MapPin, Briefcase, AlertCircle, Download, Building2, Trash2 } from "lucide-react";
import { adminService, User } from "@/services/adminService";
import { fileService } from "@/services/api";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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

const UserManagement = () => {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [isGrouped, setIsGrouped] = useState(false);

    // Create User State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [creating, setCreating] = useState(false);

    // Company Selection State
    const [companiesList, setCompaniesList] = useState<any[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);

    // Initial Fetch
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminService.fetchUsers(page, 10, search, undefined, 'admin');
            setUsers(data.users);
            setTotalPages(Math.ceil(data.total / 10));
        } catch (error) {
            console.error("Failed to fetch users", error);
            toast({
                title: "Error",
                description: "Failed to load users",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchAllCompanies = async () => {
        try {
            const data = await adminService.fetchCompanies(1, 100, "");
            if (data.companies) {
                setCompaniesList(data.companies);
            }
        } catch (error) {
            console.error("Failed to fetch companies list", error);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchUsers();
        }, 300); // Debounce search
        return () => clearTimeout(timeout);
    }, [page, search]);

    // Fetch companies on mount
    useEffect(() => {
        fetchAllCompanies();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            await adminService.createUser(newEmail, newPassword, selectedCompanyId || undefined);
            toast({
                title: "User Created",
                description: `Successfully created user ${newEmail}`,
            });
            setIsCreateOpen(false);
            setNewEmail("");
            setNewPassword("");
            setSelectedCompanyId("");
            fetchUsers(); // Refresh list
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create user",
                variant: "destructive",
            });
        } finally {
            setCreating(false);
        }
    };


    // Action Dialog State
    const [actionUser, setActionUser] = useState<User | null>(null);
    const [actionType, setActionType] = useState<'deactivate' | 'activate' | 'delete' | null>(null);
    const [isActionOpen, setIsActionOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // View Modal State
    const [viewUser, setViewUser] = useState<User | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Stats State
    const [userStats, setUserStats] = useState<any>(null);
    const [statsLoading, setStatsLoading] = useState(false);

    // Workflow History State
    const [userWorkflows, setUserWorkflows] = useState<any[]>([]);
    const [workflowLoading, setWorkflowLoading] = useState(false);
    const [workflowPage, setWorkflowPage] = useState(1);
    const [workflowTotalPages, setWorkflowTotalPages] = useState(1);
    const [workflowSearch, setWorkflowSearch] = useState("");
    const [workflowDateRange, setWorkflowDateRange] = useState({ from: "", to: "" });

    const [viewTab, setViewTab] = useState("profile");

    // Fetch workflows for selected user
    const fetchUserWorkflows = async (userId: string, pageNum: number) => {
        setWorkflowLoading(true);
        try {
            const data = await adminService.getUserWorkflows(userId, {
                page: pageNum,
                limit: 10,
                search: workflowSearch,
                startDate: workflowDateRange.from,
                endDate: workflowDateRange.to
            });
            setUserWorkflows(data.workflows);
            setWorkflowTotalPages(data.totalPages);
        } catch (error) {
            console.error("Failed to fetch user workflows");
        } finally {
            setWorkflowLoading(false);
        }
    }

    // Fetch Stats
    const fetchUserStats = async (userId: string) => {
        setStatsLoading(true);
        try {
            const stats = await adminService.getUserStats(userId);
            setUserStats(stats);
        } catch (error) {
            console.error("Failed to fetch user stats");
        } finally {
            setStatsLoading(false);
        }
    }

    useEffect(() => {
        if (viewUser && viewTab === "history") {
            const timeout = setTimeout(() => {
                fetchUserWorkflows(viewUser.id, workflowPage);
            }, 300);
            return () => clearTimeout(timeout);
        }
        if (viewUser && viewTab === "dashboard") {
            fetchUserStats(viewUser.id);
        }
    }, [viewUser, viewTab, workflowPage, workflowSearch, workflowDateRange]); // Add dependencies


    const openActionDialog = (user: User, type: 'deactivate' | 'activate' | 'delete') => {
        setActionUser(user);
        setActionType(type);
        setIsActionOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!actionUser || !actionType) return;
        setActionLoading(true);
        try {
            if (actionType === 'deactivate') {
                await adminService.updateUserStatus(actionUser.id, 'banned');
                toast({
                    title: "User Deactivated",
                    description: "User access has been revoked.",
                });
                fetchUsers();
                fetchUsers();
            } else if (actionType === 'activate') {
                await adminService.updateUserStatus(actionUser.id, 'active');
                toast({
                    title: "User Activated",
                    description: "User access restored.",
                });
                fetchUsers();
            } else if (actionType === 'delete') {
                await adminService.deleteUser(actionUser.id);
                toast({
                    title: "User Deleted",
                    description: "User and all associated data have been permanently deleted.",
                });
                fetchUsers();
            }
            setIsActionOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to ${actionType} user`,
                variant: "destructive",
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleViewFile = async (key: string, name: string) => {
        try {
            toast({
                title: "Opening file...",
                description: `Fetching access link for ${name}`,
            });

            const response = await fileService.getDownloadUrl(key);
            const url = response.data.url;

            if (url) {
                window.open(url, '_blank');
                toast({
                    title: "File opened",
                    description: "The file is now open in a new tab.",
                    className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                });
            }
        } catch (error) {
            console.error("View failed:", error);
            toast({
                title: "Access failed",
                description: "Could not generate access link.",
                variant: "destructive",
            });
        }
    };

    const handleViewUser = (user: User) => {
        setViewUser(user);
        setViewTab("profile");
        setWorkflowPage(1);
        setWorkflowSearch("");
        setWorkflowDateRange({ from: "", to: "" });
        setUserStats(null);
        setIsViewOpen(true);
    };

    // Dashboard Stats Calculation
    const calculateUserStats = () => {
        // Note: This is an estimation based on fetched workflows (first page + total count)
        // For accurate total stats we rely on totalWorkflows count from backend
        // and estimation for status breakdown if not fully available
        // A dedicated stats endpoint per user would be better.
        // For now, using the data we have.
        const total = userWorkflows.length > 0 ? (userWorkflows as any).totalWorkflows || userWorkflows.length : 0;
        // We can't know exact Completed/Processing counts without fetching all or stats API
        // So we will show "Recent Activity" stats or just "-" for now if data is partial
        return { total };
    };


    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* ... (Header Section same as before) ... */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
                        <p className="text-muted-foreground">Manage access, roles, and security for all platform users.</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-red-600 hover:bg-red-700 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-popover border-border text-foreground">
                            <DialogHeader>
                                <DialogTitle>Create New User</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Add a new user to the system. They will receive an email with their credentials.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateUser} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="user@company.com"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        required
                                        className="bg-background border-border text-foreground"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Initial Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={newPassword}
                                        placeholder="Enter password (6 chars must)"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="bg-background border-border text-foreground"
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label>Company (Optional)</Label>
                                    <Popover open={isCompanyOpen} onOpenChange={setIsCompanyOpen} modal={true}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={isCompanyOpen}
                                                className="justify-between bg-background border-border text-foreground hover:bg-accent/50 hover:text-foreground"
                                            >
                                                {selectedCompanyId
                                                    ? companiesList.find((company) => company._id === selectedCompanyId)?.name
                                                    : "Select company..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0 bg-popover border-border text-foreground z-[200]">
                                            <Command className="bg-transparent">
                                                <CommandInput placeholder="Search company..." className="text-white" />
                                                <CommandList>
                                                    <CommandEmpty>No company found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {companiesList.map((company) => (
                                                            <CommandItem
                                                                key={company._id}
                                                                value={company.name}
                                                                onSelect={() => {
                                                                    setSelectedCompanyId(company._id === selectedCompanyId ? "" : company._id)
                                                                    setIsCompanyOpen(false)
                                                                }}
                                                                className="text-gray-300 hover:bg-white/10 cursor-pointer"
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedCompanyId === company._id ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span>{company.name}</span>
                                                                    <span className="text-xs text-gray-500">{company.email}</span>
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <p className="text-xs text-gray-500">Assigning a company will make this user a Team Member of that company.</p>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={creating}>
                                        {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Create Account
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-foreground">All Users</CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search users..."
                                    className="pl-9 bg-accent/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-red-500/50"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-end mb-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsGrouped(!isGrouped)}
                                        className={`gap-2 ${isGrouped ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500' : 'text-foreground border-border'}`}
                                    >
                                        <Building2 size={16} />
                                        {isGrouped ? "Ungroup" : "Group by Company"}
                                    </Button>
                                </div>
                                {isGrouped ? (
                                    <div className="space-y-6">
                                        {Object.entries(
                                            users.reduce((acc, user) => {
                                                const company = user.companyName || "No Company";
                                                if (!acc[company]) acc[company] = [];
                                                acc[company].push(user);
                                                return acc;
                                            }, {} as Record<string, User[]>)
                                        ).map(([companyName, companyUsers]) => (
                                            <div key={companyName} className="rounded-md border border-border overflow-hidden">
                                                <div className="bg-accent/50 px-4 py-2 border-b border-border font-semibold text-foreground flex items-center gap-2">
                                                    <Building2 size={16} className="text-gray-400" />
                                                    {companyName}
                                                    <span className="text-xs text-gray-400 font-normal">({companyUsers.length} users)</span>
                                                </div>
                                                <Table>
                                                    <TableHeader className="bg-accent/50 border-border">
                                                        <TableRow className="border-border hover:bg-transparent">
                                                            <TableHead className="text-muted-foreground">User</TableHead>
                                                            <TableHead className="text-muted-foreground">Status</TableHead>
                                                            <TableHead className="text-muted-foreground">Role</TableHead>
                                                            <TableHead className="text-muted-foreground">Created</TableHead>
                                                            <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {companyUsers.map((user) => (
                                                        <TableRow key={user.id} className="border-border hover:bg-accent/50 transition-colors">
                                                                <TableCell className="font-medium text-foreground">
                                                                    <div className="flex items-center gap-3">
                                                                        <Avatar className="h-8 w-8">
                                                                            <AvatarImage src={user.avatar} className="object-cover" />
                                                                            <AvatarFallback className="bg-accent text-muted-foreground text-xs">
                                                                                {user.email.slice(0, 2).toUpperCase()}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        {user.email}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${user.status === 'active'
                                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                                        }`}>
                                                                        {user.status === 'banned' ? 'Deactivated' : user.status}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="text-foreground/80 capitalize">{user.role}</TableCell>
                                                                <TableCell className="text-muted-foreground text-sm">
                                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    {/* Actions Dropdown Reused */}
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                                                                <span className="sr-only">Open menu</span>
                                                                                <MoreHorizontal className="h-4 w-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" className="bg-popover border-border text-foreground">
                                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                            <DropdownMenuItem onClick={() => handleViewUser(user)} className="hover:bg-accent cursor-pointer">
                                                                                <Eye className="w-4 h-4 mr-2" />
                                                                                View Details
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)} className="hover:bg-accent cursor-pointer">
                                                                                <Mail className="w-4 h-4 mr-2" />
                                                                                Copy Email
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuSeparator className="bg-border" />
                                                                            {user.status === 'active' ? (
                                                                                <DropdownMenuItem
                                                                                    className="hover:bg-accent cursor-pointer text-red-500"
                                                                                    onClick={() => openActionDialog(user, 'deactivate')}
                                                                                >
                                                                                    <UserX className="w-4 h-4 mr-2" />
                                                                                    Deactivate User
                                                                                </DropdownMenuItem>
                                                                            ) : (
                                                                                <DropdownMenuItem
                                                                                    className="hover:bg-accent cursor-pointer text-emerald-500"
                                                                                    onClick={() => openActionDialog(user, 'activate')}
                                                                                >
                                                                                    <Shield className="w-4 h-4 mr-2" />
                                                                                    Activate User
                                                                                </DropdownMenuItem>
                                                                            )}

                                                                            {!user.isMaster && (
                                                                                <>
                                                                                    <DropdownMenuSeparator className="bg-border" />
                                                                                    <DropdownMenuItem
                                                                                        className="hover:bg-red-500/10 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
                                                                                        onClick={() => openActionDialog(user, 'delete')}
                                                                                    >
                                                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                                                        Delete User
                                                                                    </DropdownMenuItem>
                                                                                </>
                                                                            )}
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-md border border-border">
                                        <Table>
                                            <TableHeader className="bg-accent/50 border-border">
                                                <TableRow className="border-border hover:bg-transparent">
                                                    <TableHead className="text-muted-foreground">User</TableHead>
                                                    <TableHead className="text-muted-foreground">Company</TableHead>
                                                    <TableHead className="text-muted-foreground">Status</TableHead>
                                                    <TableHead className="text-muted-foreground">Role</TableHead>
                                                    <TableHead className="text-muted-foreground">Created</TableHead>
                                                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {users.map((user) => (
                                                    <TableRow key={user.id} className="border-border hover:bg-accent/50 transition-colors">
                                                        <TableCell className="font-medium text-foreground">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage src={user.avatar} className="object-cover" />
                                                                    <AvatarFallback className="bg-accent text-muted-foreground text-xs">
                                                                        {user.email.slice(0, 2).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                {user.email}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-foreground/80">
                                                            {user.companyName || "No Company"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${user.status === 'active'
                                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                                }`}>
                                                                {user.status === 'banned' ? 'Deactivated' : user.status}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-foreground/80 capitalize">{user.role}</TableCell>
                                                        <TableCell className="text-muted-foreground text-sm">
                                                            {new Date(user.createdAt).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                                                        <span className="sr-only">Open menu</span>
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="bg-popover border-border text-foreground">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuItem onClick={() => handleViewUser(user)} className="hover:bg-accent cursor-pointer">
                                                                        <Eye className="w-4 h-4 mr-2" />
                                                                        View Details
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)} className="hover:bg-accent cursor-pointer">
                                                                        <Mail className="w-4 h-4 mr-2" />
                                                                        Copy Email
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator className="bg-border" />
                                                                    {user.status === 'active' ? (
                                                                        <DropdownMenuItem
                                                                            className="hover:bg-accent cursor-pointer text-red-500"
                                                                            onClick={() => openActionDialog(user, 'deactivate')}
                                                                        >
                                                                            <UserX className="w-4 h-4 mr-2" />
                                                                            Deactivate User
                                                                        </DropdownMenuItem>
                                                                    ) : (
                                                                        <DropdownMenuItem
                                                                            className="hover:bg-accent cursor-pointer text-emerald-500"
                                                                            onClick={() => openActionDialog(user, 'activate')}
                                                                        >
                                                                            <Shield className="w-4 h-4 mr-2" />
                                                                            Activate User
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                    {!user.isMaster && (
                                                                        <>
                                                                            <DropdownMenuSeparator className="bg-border" />
                                                                            <DropdownMenuItem
                                                                                className="hover:bg-red-500/10 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
                                                                                onClick={() => openActionDialog(user, 'delete')}
                                                                            >
                                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                                Delete User
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    )}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Pagination */}
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                                className="bg-transparent border-border text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || loading}
                                className="bg-transparent border-border text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                            >
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Confirmation Action Dialog */}
                <Dialog open={isActionOpen} onOpenChange={setIsActionOpen}>
                    <DialogContent className="bg-popover border-border text-foreground">
                        <DialogHeader>
                            <DialogTitle className="capitalize">{`${actionType} User`}</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                {actionType === 'deactivate' && "This will revoke the user's access to the platform immediately."}
                                {actionType === 'activate' && "This will restore the user's access to the platform."}
                                {actionType === 'delete' && "WARNING: This will permanently delete the user and ALL associated data (files, workflows, invoices) from S3 and the database. This action cannot be undone."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-sm text-muted-foreground">User: <span className="font-semibold text-foreground">{actionUser?.email}</span></p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsActionOpen(false)} className="border-border text-foreground hover:bg-accent/50">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmAction}
                                disabled={actionLoading}
                                className={`${actionType === 'activate' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                            >
                                {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* View User Modal */}
                <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                    <DialogContent className="bg-popover border-border text-foreground w-full max-w-7xl h-[90vh] flex flex-col p-0 overflow-hidden">
                        <DialogHeader className="p-6 border-b border-border bg-accent/20">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-border">
                                    <AvatarImage src={viewUser?.avatar} className="object-cover" />
                                    <AvatarFallback className="bg-indigo-600 text-white text-xl font-bold">
                                        {viewUser?.email.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <DialogTitle className="text-2xl font-bold">{viewUser?.email}</DialogTitle>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="border-border text-muted-foreground capitalize">
                                            {viewUser?.role}
                                        </Badge>
                                        <Badge className={`capitalize ${viewUser?.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {viewUser?.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="flex-1 overflow-hidden flex flex-col">
                            <Tabs value={viewTab} onValueChange={setViewTab} className="h-full flex flex-col">
                                <div className="px-6 border-b border-border bg-accent/20">
                                    <TabsList className="bg-transparent h-12 p-0 gap-6">
                                        <TabsTrigger value="profile" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-400 rounded-none h-full px-0">
                                            User Profile
                                        </TabsTrigger>
                                        <TabsTrigger value="dashboard" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-400 rounded-none h-full px-0">
                                            Dashboard Stats
                                        </TabsTrigger>
                                        <TabsTrigger value="history" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-400 rounded-none h-full px-0">
                                            Workflow History
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                    <TabsContent value="profile" className="m-0 space-y-6">
                                        {/* Profile Content Same as before */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                                    <UserIcon size={18} className="text-indigo-400" /> Detailed Info
                                                </h3>
                                                <div className="space-y-3">
                                                    <div className="p-4 rounded-xl bg-accent/50 border border-border">
                                                        <p className="text-sm text-muted-foreground">Email</p>
                                                        <p className="text-foreground font-medium">{viewUser?.email}</p>
                                                    </div>
                                                    <div className="p-4 rounded-xl bg-accent/50 border border-border">
                                                        <p className="text-sm text-muted-foreground">User ID</p>
                                                        <p className="text-foreground font-medium font-mono text-sm">{viewUser?.id}</p>
                                                    </div>
                                                    <div className="p-4 rounded-xl bg-accent/50 border border-border">
                                                        <p className="text-sm text-muted-foreground">Joined Date</p>
                                                        <p className="text-foreground font-medium">{new Date(viewUser?.createdAt || "").toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="p-4 rounded-xl bg-accent/50 border border-border">
                                                        <p className="text-sm text-muted-foreground">Last Login</p>
                                                        <p className="text-foreground font-medium">{viewUser?.lastLogin ? new Date(viewUser.lastLogin).toLocaleString() : 'Never'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                    <Briefcase size={18} className="text-indigo-400" /> Subscription & Plan
                                                </h3>
                                                <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20">
                                                    <p className="text-muted-foreground mb-2">Current Plan</p>
                                                    <h4 className="text-2xl font-bold text-foreground capitalize mb-4">{viewUser?.subscription} Plan</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <CheckCircle size={14} className="text-emerald-400" />
                                                            <span>Full Access to Workflows</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <CheckCircle size={14} className="text-emerald-400" />
                                                            <span>Priority Support</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="dashboard" className="m-0 space-y-6">
                                        {statsLoading ? (
                                            <div className="flex justify-center p-12">
                                                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                                            </div>
                                        ) : userStats ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                {[
                                                    { title: "Total Workflows", value: userStats.totalWorkflows, icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                                                    { title: "Completed", value: userStats.completedWorkflows, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                                                    { title: "Processing", value: userStats.processingWorkflows, icon: Zap, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
                                                    { title: "Failed", value: userStats.failedWorkflows, icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" }
                                                ].map((stat, idx) => {
                                                    const Icon = stat.icon;
                                                    return (
                                                        <motion.div
                                                            key={stat.title}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                                                        >
                                                            <div className={`p-6 rounded-2xl border ${stat.border} bg-card backdrop-blur-sm hover:bg-accent transition-all duration-300 group`}>
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                                                        <Icon size={20} />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                                                                    <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center p-8 text-gray-500">Failed to load stats.</div>
                                        )}

                                        <div className="bg-accent/50 p-4 rounded-lg border border-border mt-8">
                                            <p className="text-muted-foreground text-center italic">User activity metrics are updated in real-time.</p>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="history" className="m-0 space-y-4">
                                        <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center justify-between bg-accent/50 p-4 rounded-xl border border-border">
                                            <h3 className="text-lg font-semibold text-foreground">Execution History</h3>
                                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                                    <Input
                                                        placeholder="Search workflows..."
                                                        className="pl-9 bg-background border-border text-foreground w-full sm:w-64"
                                                        value={workflowSearch}
                                                        onChange={(e) => { setWorkflowSearch(e.target.value); setWorkflowPage(1); }}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="date"
                                                        className="bg-background border-border text-foreground w-auto"
                                                        value={workflowDateRange.from}
                                                        onChange={(e) => { setWorkflowDateRange(prev => ({ ...prev, from: e.target.value })); setWorkflowPage(1); }}
                                                    />
                                                    <span className="text-muted-foreground">-</span>
                                                    <Input
                                                        type="date"
                                                        className="bg-background border-border text-foreground w-auto"
                                                        value={workflowDateRange.to}
                                                        onChange={(e) => { setWorkflowDateRange(prev => ({ ...prev, to: e.target.value })); setWorkflowPage(1); }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {workflowLoading ? (
                                            <div className="flex justify-center p-12">
                                                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                                            </div>
                                        ) : userWorkflows.length === 0 ? (
                                            <div className="text-center p-12 text-muted-foreground bg-accent/50 rounded-xl border border-border">
                                                No workflows found matching your criteria.
                                            </div>
                                        ) : (
                                            <>
                                                <div className="rounded-xl border border-border overflow-hidden">
                                                    <Table>
                                                        <TableHeader className="bg-accent/50">
                                                            <TableRow className="border-border">
                                                                <TableHead className="text-muted-foreground">Project / Workflow</TableHead>
                                                                <TableHead className="text-muted-foreground">Type</TableHead>
                                                                <TableHead className="text-muted-foreground">Date</TableHead>
                                                                <TableHead className="text-muted-foreground">Status</TableHead>
                                                                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {userWorkflows.map((wf) => (
                                                                <TableRow key={wf._id} className="border-border hover:bg-accent/50">
                                                                    <TableCell className="text-foreground font-medium">
                                                                        <div className="flex items-center gap-3">
                                                                            <FileText size={16} className="text-indigo-400" />
                                                                            {wf.projectName || wf.inputFiles?.[0]?.originalName || `ID: ${wf._id.slice(-6)}`}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-muted-foreground">{wf.workflowType}</TableCell>
                                                                    <TableCell className="text-muted-foreground">{new Date(wf.startedAt).toLocaleDateString()}</TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="outline" className={`
                                                                        ${wf.status === 'Completed' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' : 'border-indigo-500/20 text-indigo-400 bg-indigo-500/10'}
                                                                       
                                                                    `}>
                                                                            {wf.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="flex justify-end gap-2">
                                                                            {wf.inputFiles?.[0] && (
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() => handleViewFile(wf.inputFiles[0].path, wf.inputFiles[0].originalName || 'Input File')}
                                                                                    className="text-muted-foreground hover:text-foreground hover:bg-accent"
                                                                                    title="View Input File"
                                                                                >
                                                                                    <Eye size={14} className="mr-2" /> View Input
                                                                                </Button>
                                                                            )}

                                                                            {wf.status === "Completed" && wf.outputFiles?.[0] && (
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() => handleViewFile(wf.outputFiles[0].path, wf.outputFiles[0].originalName || 'Output File')}
                                                                                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                                                                    title="View Output File"
                                                                                >
                                                                                    <Eye size={14} className="mr-2" /> View Output
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>

                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => setWorkflowPage(p => Math.max(1, p - 1))} disabled={workflowPage === 1} className="border-border text-foreground hover:bg-accent">Previous</Button>
                                                    <span className="text-sm text-muted-foreground">Page {workflowPage} of {workflowTotalPages}</span>
                                                    <Button variant="outline" size="sm" onClick={() => setWorkflowPage(p => Math.min(workflowTotalPages, p + 1))} disabled={workflowPage === workflowTotalPages} className="border-border text-foreground hover:bg-accent">Next</Button>
                                                </div>
                                            </>
                                        )}
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>

                        <DialogFooter className="p-4 border-t border-border bg-accent/20">
                            <Button variant="outline" onClick={() => setIsViewOpen(false)} className="border-border text-foreground hover:bg-accent hover:text-foreground">
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;
