
import { useEffect, useState, useCallback } from "react";
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, MoreHorizontal, Shield, KeyRound, UserMinus, Loader2, Edit2, ShieldAlert, UserX } from "lucide-react";
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
import { adminService, User } from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ... existing imports ...

const AdminManagement = () => {
    const { toast } = useToast();
    const [admins, setAdmins] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");

    // Create Admin State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [creating, setCreating] = useState(false);

    // Edit Admin State
    const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
    const [editEmail, setEditEmail] = useState("");
    const [updating, setUpdating] = useState(false);

    // Reset Password State
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [resetUserId, setResetUserId] = useState<string | null>(null);
    const [newResetPassword, setNewResetPassword] = useState("");
    const [resetting, setResetting] = useState(false);

    // Revoke/Restore Access State
    const [isRevokeOpen, setIsRevokeOpen] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
    const [selectedAdminStatus, setSelectedAdminStatus] = useState<'active' | 'inactive' | 'banned'>('active');
    const [statusProcessing, setStatusProcessing] = useState(false);

    // Delete Admin State
    const [adminToDelete, setAdminToDelete] = useState<User | null>(null);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    // Fetch Admins
    const fetchAdmins = useCallback(async () => { // ... unchanged ...
        console.log("Fetching Admins...");
        setLoading(true);
        try {
            const data = await adminService.fetchUsers(page, 10, search, 'admin');
            console.log("Fetched Admins:", data);
            setAdmins(data.users);
            setTotalPages(Math.ceil(data.total / 10));
        } catch (error) {
            console.error("Failed to fetch admins", error);
            toast({
                title: "Error",
                description: "Failed to load admin list",
                variant: "destructive",
            });
        } finally {
            console.log("Finished fetching Admins");
            setLoading(false);
        }
    }, [page, search, toast]);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    // ... handleCreateAdmin, handleUpdateAdmin, etc. (unchanged logic, preserving)

    const handleDeleteClick = (admin: User) => {
        if (admin.email === 'superadmin@biglogic.ai') {
            toast({
                title: "Action Denied",
                description: "You cannot delete the main Super Admin account.",
                variant: "destructive",
            });
            return;
        }
        setAdminToDelete(admin);
        setIsDeleteAlertOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!adminToDelete) return;
        try {
            await adminService.deleteAdmin(adminToDelete.id);
            toast({
                title: "Admin Deleted",
                description: "The admin account has been permanently deleted.",
                variant: "destructive",
            });
            fetchAdmins();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete admin",
                variant: "destructive",
            });
        } finally {
            setIsDeleteAlertOpen(false);
            setAdminToDelete(null);
        }
    };


    // useEffect restored above

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            await adminService.createAdmin(newEmail, newPassword);
            toast({
                title: "Admin Created",
                description: `Successfully granted admin privileges to ${newEmail}`,
            });
            setIsCreateOpen(false);
            setNewEmail("");
            setNewPassword("");
            fetchAdmins();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create admin user",
                variant: "destructive",
            });
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAdmin) return;
        setUpdating(true);
        try {
            await adminService.updateAdmin(editingAdmin.id, { email: editEmail });
            toast({
                title: "Admin Updated",
                description: "Admin details updated successfully.",
            });
            setEditingAdmin(null);
            fetchAdmins();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update admin",
                variant: "destructive",
            });
        } finally {
            setUpdating(false);
        }
    };

    const openResetPasswordModal = (userId: string) => {
        setResetUserId(userId);
        setNewResetPassword("");
        setIsResetOpen(true);
    };

    const handleConfirmResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetUserId || !newResetPassword) return;

        setResetting(true);
        try {
            await adminService.resetPassword(resetUserId, newResetPassword);
            toast({
                title: "Password Reset",
                description: "Password has been updated successfully.",
            });
            setIsResetOpen(false);
            setResetUserId(null);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reset password",
                variant: "destructive",
            });
        } finally {
            setResetting(false);
        }
    };

    const handleStatusClick = (admin: User) => {
        setSelectedAdminId(admin.id);
        setSelectedAdminStatus(admin.status);
        setIsRevokeOpen(true);
    };

    const confirmStatusChange = async () => {
        if (!selectedAdminId) return;
        setStatusProcessing(true);
        const newStatus = selectedAdminStatus === 'active' ? 'inactive' : 'active';
        try {
            await adminService.updateUserStatus(selectedAdminId, newStatus);
            toast({
                title: newStatus === 'inactive' ? "Access Revoked" : "Access Restored",
                description: newStatus === 'inactive'
                    ? "Admin access has been revoked."
                    : "Admin access has been restored.",
                variant: newStatus === 'inactive' ? 'destructive' : 'default',
            });
            setIsRevokeOpen(false);
            setSelectedAdminId(null);
            fetchAdmins();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update admin status",
                variant: "destructive",
            });
        } finally {
            setStatusProcessing(false);
        }
    };

    // ...



    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                            <ShieldAlert className="text-red-500" />  Super Admin Management
                        </h1>
                        <p className="text-muted-foreground">Manage system administrators and their security credentials.</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-red-600 hover:bg-red-700 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Super Admin
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-popover border-border text-foreground">
                            <DialogHeader>
                                <DialogTitle>Grant Admin Access</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    Create a new administrator account with full system privileges.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateAdmin} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@company.com"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        required
                                        className="bg-background border-border"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Temporary Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter temporary password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="bg-background border-border"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={creating}>
                                        {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Create Admin
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Dialog */}
                    <Dialog open={!!editingAdmin} onOpenChange={(open) => !open && setEditingAdmin(null)}>
                        <DialogContent className="bg-popover border-border text-foreground">
                            <DialogHeader>
                                <DialogTitle>Edit Admin Details</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleUpdateAdmin} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email Address</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        required
                                        className="bg-background border-border"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={updating}>
                                        {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Reset Password Dialog */}
                    <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                        <DialogContent className="bg-popover border-border text-foreground">
                            <DialogHeader>
                                <DialogTitle>Reset Password</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    Enter a new password for this administrator.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleConfirmResetPassword} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reset-password">New Password</Label>
                                    <Input
                                        id="reset-password"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newResetPassword}
                                        onChange={(e) => setNewResetPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="bg-background border-border"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white" disabled={resetting}>
                                        {resetting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Update Password
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Revoke/Restore Access Confirmation Dialog */}
                    <Dialog open={isRevokeOpen} onOpenChange={setIsRevokeOpen}>
                        <DialogContent className="bg-popover border-border text-foreground">
                            <DialogHeader>
                                <DialogTitle>{selectedAdminStatus === 'active' ? 'Revoke Admin Access' : 'Restore Admin Access'}</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    {selectedAdminStatus === 'active'
                                        ? "Are you sure you want to revoke access for this admin? They will be marked as inactive and unable to log in."
                                        : "Are you sure you want to restore access for this admin? They will be able to log in again."
                                    }
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button variant="ghost" onClick={() => setIsRevokeOpen(false)} className="text-muted-foreground hover:text-foreground hover:bg-accent">
                                    Cancel
                                </Button>
                                <Button
                                    className={selectedAdminStatus === 'active' ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}
                                    onClick={confirmStatusChange}
                                    disabled={statusProcessing}
                                >
                                    {statusProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {selectedAdminStatus === 'active' ? 'Revoke Access' : 'Restore Access'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Delete Admin Confirmation Dialog */}
                    <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                        <AlertDialogContent className="bg-popover border-border text-foreground">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2 text-red-500">
                                    <ShieldAlert className="h-5 w-5" />
                                    Delete Admin Account?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground mt-2">
                                    <p className="mb-2">
                                        You are about to permanently delete the admin account for <strong>{adminToDelete?.email}</strong>.
                                    </p>
                                    <p className="text-red-400 bg-red-950/30 p-3 rounded-md border border-red-900/50 text-sm">
                                        Warning: This action cannot be undone. This user will lose all administrative access immediately.
                                    </p>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel className="bg-transparent border-border text-foreground hover:bg-accent hover:text-foreground">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleConfirmDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white border-0"
                                >
                                    Yes, Delete Admin
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-foreground">Administrator Accounts</CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search admins..."
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
                            <div className="rounded-md border border-border">
                                <Table>
                                    <TableHeader className="bg-accent/50 border-border">
                                        <TableRow className="border-border hover:bg-transparent">
                                            <TableHead className="text-muted-foreground">Admin User</TableHead>
                                            <TableHead className="text-muted-foreground">Last Login</TableHead>
                                            <TableHead className="text-muted-foreground">Created At</TableHead>
                                            <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {admins.map((admin) => (
                                            <TableRow key={admin.id} className="border-border hover:bg-accent/50 transition-colors">
                                                <TableCell className="font-medium text-foreground">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 ring-2 ring-red-500/20">
                                                            <AvatarFallback className="bg-red-900/50 text-red-200 text-xs">
                                                                {admin.email.slice(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{admin.email}</div>
                                                            <div className="text-xs text-muted-foreground">Super Admin</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {new Date(admin.createdAt).toLocaleDateString()}
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
                                                            <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setEditEmail(admin.email);
                                                                    setEditingAdmin(admin);
                                                                }}
                                                                className="hover:bg-accent cursor-pointer"
                                                            >
                                                                <Edit2 className="w-4 h-4 mr-2" />
                                                                Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="hover:bg-accent cursor-pointer text-yellow-400"
                                                                onClick={() => openResetPasswordModal(admin.id)}
                                                            >
                                                                <KeyRound className="w-4 h-4 mr-2" />
                                                                Reset Password
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-border" />
                                                            <DropdownMenuItem
                                                                className={admin.status === 'active' ? "hover:bg-accent cursor-pointer text-orange-400" : "hover:bg-accent cursor-pointer text-green-500"}
                                                                onClick={() => handleStatusClick(admin)}
                                                            >
                                                                {admin.status === 'active' ? (
                                                                    <>
                                                                        <UserMinus className="w-4 h-4 mr-2" />
                                                                        Revoke Access
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Shield className="w-4 h-4 mr-2" />
                                                                        Restore Access
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>

                                                            {admin.email !== 'superadmin@biglogic.ai' && (
                                                                <DropdownMenuItem
                                                                    className="hover:bg-accent cursor-pointer text-red-500"
                                                                    onClick={() => handleDeleteClick(admin)}
                                                                >
                                                                    <UserX className="w-4 h-4 mr-2" />
                                                                    Delete Admin
                                                                </DropdownMenuItem>
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

                        {/* Pagination (reused logic) */}
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                                className="bg-transparent border-border text-muted-foreground hover:bg-accent hover:text-foreground"
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
                                className="bg-transparent border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                            >
                                Next
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminManagement;
