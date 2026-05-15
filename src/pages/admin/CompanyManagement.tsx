import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus, Search, Mail, User, Lock, Users, Edit, Trash2, Shield, ShieldOff, IterationCcw, AlertTriangle } from "lucide-react";
import api from "@/services/api";
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

interface Company {
    _id: string;
    name: string;
    email: string;
    logo?: string;
    createdAt: string;
    status: string;
    plan: string;
}

interface CompanyUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    accountStatus: string;
    lastLogin?: string;
    avatar?: string;
}

const CompanyManagement = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 15;

    // New Company Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newCompany, setNewCompany] = useState({
        companyName: "",
        masterEmail: "",
        masterName: "",
        masterPassword: "",
        logo: "",
        details: "",
        plan: "free"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit & Users State
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({ companyName: "", masterEmail: "", masterPassword: "" });

    const [isUsersOpen, setIsUsersOpen] = useState(false);
    const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [userSearchTerm, setUserSearchTerm] = useState("");

    // Delete State
    const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchCompanies(currentPage, searchTerm);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, currentPage]);

    const fetchCompanies = async (page: number, search: string) => {
        setIsLoading(true);
        try {
            // Updated to pass params
            const response = await api.get("/admin/companies", {
                params: {
                    page,
                    limit,
                    search
                }
            });
            // Handle both response formats (if just array or object with data)
            // Backend now returns: { companies, total, page, pages }
            if (response.data.companies) {
                setCompanies(response.data.companies);
                setTotalPages(response.data.pages);
            } else {
                setCompanies([]); // Fallback
            }
        } catch (error) {
            console.error("Failed to fetch companies", error);
            setCompanies([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post("/auth/company/register", newCompany);

            toast({
                title: "Company Created",
                description: "Company and Master User have been successfully created.",
            });
            setIsDialogOpen(false);
            setNewCompany({
                companyName: "",
                masterEmail: "",
                masterName: "",
                masterPassword: "",
                logo: "",
                details: "",
                plan: "free"
            });
            fetchCompanies(currentPage, searchTerm);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create company",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (company: Company) => {
        setSelectedCompany(company);
        setEditForm({
            companyName: company.name,
            masterEmail: company.email,
            masterPassword: ""
        });
        setIsEditOpen(true);
    };

    const handleUpdateCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompany) return;
        setIsSubmitting(true);
        try {
            await api.put(`/admin/companies/${selectedCompany._id}`, editForm);
            toast({ title: "Success", description: "Company details updated." });
            setIsEditOpen(false);
            fetchCompanies(currentPage, searchTerm);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update company",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewUsers = async (company: Company) => {
        setSelectedCompany(company);
        setIsUsersOpen(true);
        setIsLoadingUsers(true);
        setUserSearchTerm(""); // Reset search
        try {
            const res = await api.get(`/admin/companies/${company._id}/users`);
            setCompanyUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
            toast({ title: "Error", description: "Failed to load company users", variant: "destructive" });
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await api.put(`/admin/users/${userId}/status`, { status: newStatus });
            toast({ title: "Status Updated", description: `User is now ${newStatus}.` });
            // Refresh users list
            setCompanyUsers(prev => prev.map(u => u._id === userId ? { ...u, accountStatus: newStatus } : u));
        } catch (error) {
            toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
        }
    };

    const handleToggleCompanyStatus = async (companyId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            await api.put(`/admin/companies/${companyId}/status`, { status: newStatus });
            toast({ title: "Company Status Updated", description: `Company is now ${newStatus}.` });
            fetchCompanies(currentPage, searchTerm);
        } catch (error: any) {
            toast({ title: "Error", description: error.response?.data?.message || "Failed to update company status", variant: "destructive" });
        }
    };

    const handleDeleteClick = (company: Company) => {
        setCompanyToDelete(company);
        setIsDeleteAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!companyToDelete) return;

        try {
            await api.delete(`/admin/companies/${companyToDelete._id}`);
            toast({
                title: "Company Deleted",
                description: "Company and associated data have been permanently deleted.",
            });
            fetchCompanies(currentPage, searchTerm);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete company",
                variant: "destructive",
            });
        } finally {
            setIsDeleteAlertOpen(false);
            setCompanyToDelete(null);
        }
    };

    const filteredUsers = companyUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Company Admin Management</h1>
                        <p className="text-muted-foreground">Manage customer companies, update details, and manage access</p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                                <Plus size={18} /> Add Company
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-popover border-border text-foreground">
                            <DialogHeader>
                                <DialogTitle>Add New Company</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateCompany} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            placeholder="e.g. Acme Corp"
                                            className="pl-9 bg-background border-border"
                                            value={newCompany.companyName}
                                            onChange={(e) => setNewCompany({ ...newCompany, companyName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Master User Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            placeholder="e.g. John Doe"
                                            className="pl-9 bg-background border-border"
                                            value={newCompany.masterName}
                                            onChange={(e) => setNewCompany({ ...newCompany, masterName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Master Email (Login)</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            type="email"
                                            placeholder="admin@acme.com"
                                            className="pl-9 bg-background border-border"
                                            value={newCompany.masterEmail}
                                            onChange={(e) => setNewCompany({ ...newCompany, masterEmail: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Master Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input
                                            type="password"
                                            placeholder="******"
                                            className="pl-9 bg-background border-border"
                                            value={newCompany.masterPassword}
                                            onChange={(e) => setNewCompany({ ...newCompany, masterPassword: e.target.value })}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500" disabled={isSubmitting}>
                                    {isSubmitting ? "Creating..." : "Create Company"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex items-center gap-4 bg-accent/50 p-4 rounded-xl border border-border">
                    <Search className="text-muted-foreground" size={20} />
                    <Input
                        placeholder="Search companies by name or email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on search
                        }}
                        className="bg-transparent border-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                    />
                </div>

                <div className="rounded-xl border border-border overflow-hidden bg-card">
                    <Table>
                        <TableHeader className="bg-accent/50">
                            <TableRow className="hover:bg-transparent border-border">
                                <TableHead className="text-muted-foreground">Company Name</TableHead>
                                <TableHead className="text-muted-foreground">Master Email</TableHead>
                                <TableHead className="text-muted-foreground">Status</TableHead>
                                <TableHead className="text-muted-foreground">Created At</TableHead>
                                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-400">Loading...</TableCell>
                                </TableRow>
                            ) : companies.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-400">No companies found</TableCell>
                                </TableRow>
                            ) : (
                                companies.map((company) => (
                                    <TableRow key={company._id} className="border-border hover:bg-accent/50">
                                        <TableCell className="font-medium text-foreground flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold overflow-hidden border border-border">
                                                {company.logo ? (
                                                    <img
                                                        src={company.logo}
                                                        alt={company.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            // Fallback logic could be complex here, checking parent to remove overflow hidden? 
                                                            // Simplest is to just let it hide and maybe we see empty box.
                                                            // Ideally we'd swap to initials. 
                                                        }}
                                                    />
                                                ) : (
                                                    company.name.substring(0, 2).toUpperCase()
                                                )}
                                            </div>
                                            {company.name}
                                        </TableCell>
                                        <TableCell className="text-foreground/80">{company.email}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs ${(company.status || 'active') === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                                                {company.status || 'active'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => handleViewUsers(company)} title="View Users" className="text-foreground">
                                                    <Users size={18} />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleEditClick(company)} title="Edit Company" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                                                    <Edit size={18} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleToggleCompanyStatus(company._id, company.status || 'active')}
                                                    className={(company.status || 'active') === 'active' ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10" : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"}
                                                    title={(company.status || 'active') === 'active' ? "Revoke Company Access" : "Grant Company Access"}
                                                >
                                                    {(company.status || 'active') === 'active' ? <Shield size={18} /> : <ShieldOff size={18} />}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDeleteClick(company)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                    title="Delete Company"
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center bg-accent/50 p-4 rounded-xl border border-border">
                    <span className="text-muted-foreground text-sm">
                        Page {currentPage} of {Math.max(1, totalPages)}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || isLoading}
                            className="bg-transparent border-border text-foreground hover:bg-accent/50 hover:text-foreground disabled:opacity-50"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || isLoading}
                            className="bg-transparent border-border text-foreground hover:bg-accent/50 hover:text-foreground disabled:opacity-50"
                        >
                            Next
                        </Button>
                    </div>
                </div>

                {/* Edit Company Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="bg-popover border-border text-foreground max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Company</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateCompany} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Company Name</Label>
                                <Input
                                    className="bg-background border-border"
                                    value={editForm.companyName}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, companyName: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Master Email (Login)</Label>
                                <Input
                                    type="email"
                                    className="bg-background border-border"
                                    value={editForm.masterEmail}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, masterEmail: e.target.value }))}
                                    required
                                />
                                <p className="text-xs text-amber-500/80">Changing this will update the Master User's login email.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>New Master Password (Optional)</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="password"
                                        placeholder="Leave blank to keep current"
                                        className="pl-9 bg-background border-border"
                                        value={editForm.masterPassword || ""}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, masterPassword: e.target.value }))}
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500" disabled={isSubmitting}>
                                {isSubmitting ? "Updating..." : "Update Company"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Company Users Dialog */}
                <Dialog open={isUsersOpen} onOpenChange={setIsUsersOpen}>
                    <DialogContent className="bg-popover border-border text-foreground max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Users - {selectedCompany?.name}</DialogTitle>
                        </DialogHeader>

                        <div className="flex items-center gap-4 bg-accent/50 p-3 rounded-lg border border-border mt-2 mb-4">
                            <Search className="text-muted-foreground" size={16} />
                            <Input
                                placeholder="Search users..."
                                value={userSearchTerm}
                                onChange={(e) => setUserSearchTerm(e.target.value)}
                                className="bg-transparent border-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 h-8"
                            />
                        </div>

                        <div className="mt-0">
                            {isLoadingUsers ? (
                                <div className="text-center py-8 text-gray-400">Loading users...</div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-accent/50">
                                        <TableRow className="border-border">
                                            <TableHead className="text-muted-foreground">Name</TableHead>
                                            <TableHead className="text-muted-foreground">Email</TableHead>
                                            <TableHead className="text-muted-foreground">Role</TableHead>
                                            <TableHead className="text-muted-foreground">Status</TableHead>
                                            <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No users found.</TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map(user => (
                                                <TableRow key={user._id} className="border-border hover:bg-accent/50">
                                                    <TableCell className="font-medium text-foreground">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full overflow-hidden bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-border">
                                                                {user.avatar ? (
                                                                    <img
                                                                        src={user.avatar}
                                                                        alt={user.name}
                                                                        className="h-full w-full object-cover"
                                                                        onError={(e) => {
                                                                            e.currentTarget.style.display = 'none'; // Fallback to initials if load fails
                                                                            e.currentTarget.parentElement?.classList.remove('overflow-hidden'); // Ensure initials are visible? Actually easier to just hide img and show text behind? 
                                                                            // Better approach: React Condition. But raw DOM manipulation is tricky here.
                                                                            // Let's rely on standard fallback: 
                                                                            // If img fails, simple Hide it. But we need text behind it.
                                                                            // Actually, simply:
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <span>{user.name.substring(0, 2).toUpperCase()}</span>
                                                                )}
                                                            </div>
                                                            {user.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-foreground/80">{user.email}</TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        <span className={`px-2 py-1 rounded text-xs ${user.role === 'company_admin' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-muted text-muted-foreground'}`}>
                                                            {user.role === 'company_admin' ? 'Master' : 'User'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`px-2 py-1 rounded text-xs ${user.accountStatus === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                                                            {user.accountStatus}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {user.role !== 'company_admin' && ( // Don't allow revoking Master this way? Or allow? Assuming Super Admin can revoke anyone.
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleToggleUserStatus(user._id, user.accountStatus)}
                                                                className={user.accountStatus === 'active' ? "text-red-400 hover:text-red-300 hover:bg-red-400/10" : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"}
                                                                title={user.accountStatus === 'active' ? "Revoke Access" : "Grant Access"}
                                                            >
                                                                {user.accountStatus === 'active' ? <ShieldOff size={18} /> : <Shield size={18} />}
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Alert */}
                <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                    <AlertDialogContent className="bg-popover border-border text-foreground">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-red-500">
                                <AlertTriangle className="h-5 w-5" />
                                Delete Company Forever?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400 mt-2">
                                <p className="mb-2">
                                    You are about to delete <strong>{companyToDelete?.name}</strong>.
                                </p>
                                <p className="text-red-400 bg-red-950/30 p-3 rounded-md border border-red-900/50 text-sm">
                                    Warning: This will permanently delete the company account, workflows and all Team members accounts and their executions also.So please be careful while deleting,You can revoke the company access from the company page.
                                </p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleConfirmDelete}
                                className="bg-red-600 hover:bg-red-700 text-white border-0"
                            >
                                Delete Everything
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
};

export default CompanyManagement;
