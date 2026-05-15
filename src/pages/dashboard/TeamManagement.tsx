import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, User, Mail, Trash2, Edit2, ShieldCheck, XCircle, Eye, EyeOff } from "lucide-react";
import api, { companyService } from "@/services/api";
import { useTheme } from "@/components/ThemeProvider";
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

const TeamManagement = () => {
    const { theme } = useTheme();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const DEFAULT_PERMISSIONS = {
        overview: true,
        activeServices: true,
        workflowHistory: true,
        billing: false,
        profile: false,
        viewAllWorkflows: false,
        activeJobs: false,
        fieldNotes: false,
        estimateTraining: false,
        companyBrain: true,
        teamManagement: false,
        allowedBots: [] as string[]
    };

    // New User Form
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        permissions: { ...DEFAULT_PERMISSIONS }
    });

    const [showPassword, setShowPassword] = useState(false);

    // For editing
    const [editingUser, setEditingUser] = useState<string | null>(null);

    // For Deletion
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);

    // Fetch available bots from backend (or hardcode for now if dynamic list not available easily)
    // Assuming we have a fixed list or can fetch. For now, hardcoding common ones.
    const availableBots = [
        { id: "xactimate", name: "Xactimate Processing" },
        { id: "material-extraction", name: "Material Extraction" },
        { id: "voice-transcription", name: "Voice Transcription" }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await companyService.getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
            // toast({ title: "Error", description: "Failed to load team members", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingUser) {
                const updatePayload: any = { ...newUser };
                // Only send password if it's been changed (non-empty)
                if (!updatePayload.password) {
                    delete updatePayload.password;
                }
                await companyService.updateUser(editingUser, updatePayload);
                toast({ title: "Updated", description: "User updated successfully" });
            } else {
                await companyService.addUser(newUser);
                toast({
                    title: "User Created",
                    description: "User added successfully.",
                });
            }
            setIsDialogOpen(false);
            setEditingUser(null);
            resetForm();
            fetchUsers();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to save user",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (user: any) => {
        setUserToDelete(user);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await companyService.deleteUser(userToDelete._id);
            toast({ title: "Removed", description: "User removed from company" });
            fetchUsers();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to remove user",
                variant: "destructive",
            });
        } finally {
            setDeleteConfirmOpen(false);
            setUserToDelete(null);
        }
    };

    const handleToggleStatus = async (user: any) => {
        const newStatus = user.accountStatus === 'active' ? 'inactive' : 'active';
        try {
            // We reuse the update endpoint which we modified to accept status
            await companyService.updateUser(user._id, { accountStatus: newStatus });
            toast({ title: "Status Updated", description: `User is now ${newStatus}` });
            fetchUsers();
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive",
            });
        }
    };

    const openEdit = (user: any) => {
        setNewUser({
            name: user.name,
            email: user.email,
            password: "", // Reset password field for edit
            permissions: { ...DEFAULT_PERMISSIONS, ...(user.permissions || {}) }
        });
        setEditingUser(user._id);
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setNewUser({
            name: "",
            email: "",
            password: "",
            permissions: { ...DEFAULT_PERMISSIONS }
        });
        setShowPassword(false);
        setEditingUser(null);
    };

    const toggleBot = (botId: string) => {
        setNewUser(prev => {
            const currentBots = prev.permissions.allowedBots || [];
            if (currentBots.includes(botId)) {
                return { ...prev, permissions: { ...prev.permissions, allowedBots: currentBots.filter(id => id !== botId) } };
            } else {
                return { ...prev, permissions: { ...prev.permissions, allowedBots: [...currentBots, botId] } };
            }
        });
    };

    const filteredUsers = users.filter(
        (u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="max-w-6xl  space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className={theme === 'dark' ? "text-3xl font-bold text-white" : "text-3xl font-bold text-slate-900"}>Team Management</h1>
                        <p className={theme === 'dark' ? "text-gray-400" : "text-slate-500"}>Manage your team members and their permissions</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                                <Plus size={18} /> Add Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className={theme === 'dark'
                            ? "bg-zinc-900 border-white/10 text-white max-w-lg overflow-y-auto max-h-[90vh]"
                            : "bg-white border-gray-200 text-slate-900 max-w-lg overflow-y-auto max-h-[90vh] shadow-2xl"}>
                            <DialogHeader>
                                <DialogTitle>{editingUser ? "Edit User" : "Add New Team Member"}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSaveUser} className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                            value={newUser.name}
                                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                            required
                                            className={theme === 'dark' ? "bg-black/40 border-white/10" : "bg-white border-gray-200"}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            required
                                            disabled={!!editingUser} // Prevent changing email for now for simplicity
                                            className={theme === 'dark' ? "bg-black/40 border-white/10" : "bg-white border-gray-200"}
                                            placeholder="john@company.com"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label>New Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                value={newUser.password}
                                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                                required={!editingUser}
                                                className={theme === 'dark' ? "bg-black/40 border-white/10 pr-10" : "bg-white border-gray-200 pr-10"}
                                                placeholder={editingUser ? "Leave blank to keep current" : "******"}
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className={theme === 'dark' ? "space-y-3 pt-4 border-t border-white/10" : "space-y-3 pt-4 border-t border-gray-100"}>
                                    <div className="flex items-center justify-between">
                                        <h4 className={theme === 'dark' ? "font-medium text-sm text-gray-300" : "font-semibold text-sm text-slate-700"}>Tab Access</h4>
                                        <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full font-medium">Enterprise Grade</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'overview', label: 'Overview' },
                                            { id: 'activeServices', label: 'Super Agents' },
                                            { id: 'workflowHistory', label: 'Workflow History' },
                                            { id: 'fieldNotes', label: 'Field Notes' },
                                            { id: 'estimateTraining', label: 'Estimate Training' },
                                            { id: 'companyBrain', label: 'Company Brain' },
                                            { id: 'activeJobs', label: 'Jobs Database' },
                                            { id: 'viewAllWorkflows', label: 'View All Team Executions' },
                                            { id: 'billing', label: 'Billing & Plans' },
                                            { id: 'profile', label: 'Profile' },
                                            { id: 'teamManagement', label: 'Team Management' },
                                        ].map((perm) => (
                                            <div key={perm.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                                                <Checkbox
                                                    id={perm.id}
                                                    checked={newUser.permissions[perm.id as keyof typeof newUser.permissions] as boolean}
                                                    onCheckedChange={(checked) =>
                                                        setNewUser(prev => ({
                                                            ...prev,
                                                            permissions: { ...prev.permissions, [perm.id]: !!checked }
                                                        }))
                                                    }
                                                    className={theme === 'dark' ? "border-white/20" : "border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"}
                                                />
                                                <Label htmlFor={perm.id} className="cursor-pointer font-normal text-xs">{perm.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={theme === 'dark' ? "space-y-3 pt-4 border-t border-white/10" : "space-y-3 pt-4 border-t border-gray-100"}>
                                    <h4 className={theme === 'dark' ? "font-medium text-sm text-gray-300" : "font-semibold text-sm text-slate-700"}>Bot Access</h4>
                                    <p className={theme === 'dark' ? "text-xs text-gray-500" : "text-xs text-slate-500"}>Select which bots this user can access (requires 'Active Services' access)</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {availableBots.map((bot) => (
                                            <div key={bot.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`bot-${bot.id}`}
                                                    checked={newUser.permissions.allowedBots?.includes(bot.id)}
                                                    onCheckedChange={() => toggleBot(bot.id)}
                                                    className={theme === 'dark' ? "border-white/20" : "border-gray-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"}
                                                />
                                                <Label htmlFor={`bot-${bot.id}`} className="cursor-pointer font-normal">{bot.name}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                <Button type="submit" className="w-full bg-indigo-600" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : (editingUser ? "Update User" : "Create User")}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className={theme === 'dark'
                    ? "flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10"
                    : "flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200"}>
                    <Search className={theme === 'dark' ? "text-gray-400" : "text-slate-400"} size={20} />
                    <Input
                        placeholder="Search team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none text-foreground placeholder:text-gray-500 focus-visible:ring-0"
                    />
                </div>

                <div className={theme === 'dark'
                    ? "rounded-xl border border-white/10 overflow-hidden bg-black/40"
                    : "rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm"}>
                    <Table>
                        <TableHeader className={theme === 'dark' ? "bg-white/5" : "bg-gray-50"}>
                            <TableRow className={theme === 'dark' ? "hover:bg-transparent border-white/10" : "hover:bg-transparent border-gray-100"}>
                                <TableHead className={theme === 'dark' ? "text-gray-400" : "text-slate-500 font-semibold"}>Name</TableHead>
                                <TableHead className={theme === 'dark' ? "text-gray-400" : "text-slate-500 font-semibold"}>Email</TableHead>
                                <TableHead className={theme === 'dark' ? "text-gray-400" : "text-slate-500 font-semibold"}>Access</TableHead>
                                <TableHead className={theme === 'dark' ? "text-right text-gray-400" : "text-right text-slate-500 font-semibold"}>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow className={theme === 'dark' ? "border-white/10" : "border-gray-100"}>
                                    <TableCell colSpan={4} className="text-center py-8">Loading...</TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow className={theme === 'dark' ? "border-white/10" : "border-gray-100"}>
                                    <TableCell colSpan={4} className="text-center py-8">No users found</TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user._id} className={theme === 'dark' ? "border-white/10 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50/50"}>
                                        <TableCell className={theme === 'dark' ? "font-medium text-white" : "font-semibold text-slate-900"}>{user.name}</TableCell>
                                        <TableCell className={theme === 'dark' ? "text-gray-400" : "text-slate-600"}>{user.email}</TableCell>
                                        <TableCell className={theme === 'dark' ? "text-gray-400" : "text-slate-600"}>
                                            <div className="flex flex-wrap gap-1">
                                                {Object.entries(user.permissions || {}).filter(([k, v]) => v === true && k !== 'allowedBots').map(([k]) => (
                                                    <span key={k} className={theme === 'dark'
                                                        ? "text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 capitalize"
                                                        : "text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded capitalize font-medium"}>
                                                        {k === 'activeServices' ? 'Super Agents' : k.replace(/([A-Z])/g, ' $1').trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {user.role !== 'company_admin' && (
                                                <div className="flex justify-end gap-2 items-center">
                                                    <span className={theme === 'dark'
                                                        ? `text-xs px-2 py-0.5 rounded ${user.accountStatus === 'inactive' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`
                                                        : `text-[10px] px-2 py-0.5 rounded-full border font-semibold ${user.accountStatus === 'inactive' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                        {user.accountStatus === 'inactive' ? 'Inactive' : 'Active'}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleToggleStatus(user)}
                                                        className={theme === 'dark'
                                                            ? `h-8 px-2 text-xs ${user.accountStatus === 'inactive' ? 'text-emerald-400 hover:text-emerald-300' : 'text-red-400 hover:text-red-300'}`
                                                            : `h-8 px-2 text-xs font-semibold ${user.accountStatus === 'inactive' ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50' : 'text-red-600 hover:text-red-700 hover:bg-red-50'}`}
                                                    >
                                                        {user.accountStatus === 'inactive' ? 'Activate' : 'Deactivate'}
                                                    </Button>

                                                    <Button variant="ghost" size="icon" onClick={() => openEdit(user)} className={theme === 'dark' ? "h-8 w-8 text-indigo-400" : "h-8 w-8 text-indigo-600 hover:bg-indigo-50"}>
                                                        <Edit2 size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(user)} className={theme === 'dark' ? "h-8 w-8 text-red-400" : "h-8 w-8 text-red-600 hover:bg-red-50"}>
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                    <AlertDialogContent className={theme === 'dark' ? "bg-zinc-900 border-white/10 text-white" : "bg-white border-gray-200 text-slate-900 shadow-2xl"}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className={theme === 'dark' ? "text-gray-400" : "text-slate-500"}>
                                Please be carefull ,once you delete this user,his workflow executions and profile data will be deleted forever
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className={theme === 'dark'
                                ? "bg-transparent border-white/10 text-white hover:bg-white/5"
                                : "bg-white border-gray-200 text-slate-600 hover:bg-gray-50"}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white border-none">Delete User</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DashboardLayout>
    );
};

export default TeamManagement;
