import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
    User as UserIcon,
    Phone,
    Mail,
    Briefcase,
    Save,
    Users,
    Trash2,
    Plus,
    X,
    MessageSquare,
    MoreVertical,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { adminService } from "@/services/adminService"; // Assuming we added fetchCompanyUsers here or create new service
import api from "@/services/api";
import { useTheme } from "@/components/ThemeProvider";

const ParticipantsTab = () => {
    const { theme } = useTheme();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<any>({});
    const [initialized, setInitialized] = useState(false);

    // Add Member Dialog State
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [addMode, setAddMode] = useState<"select" | "manual">("select");
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [manualMember, setManualMember] = useState({ name: "", email: "", role: "", phone: "" });
    const [isRoleDropdown, setIsRoleDropdown] = useState(true);

    // Fetch Job Data
    const { data: jobData, isLoading: isJobLoading } = useQuery({
        queryKey: ["job", id],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await api.get(`/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!id
    });

    const job = jobData?.job;
    const participants = job?.participants || {};

    // Fetch Company Users for Dropdown
    const { data: companyUsers, isLoading: isUsersLoading } = useQuery({
        queryKey: ["companyUsers"],
        queryFn: async () => {
            return adminService.fetchCompanyUsers();
        }
    });

    // Initialize local state
    useEffect(() => {
        if (job && job.participants && !initialized) {
            setFormData(JSON.parse(JSON.stringify(job.participants)));
            setInitialized(true);
        }
    }, [job, initialized]);

    // Mutation to update participants
    const updateMutation = useMutation({
        mutationFn: async (updatedParticipants: any) => {
            const token = localStorage.getItem("token");
            return await api.put(`/jobs/${id}`, { participants: updatedParticipants }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["job", id] });
            toast.success("Participants updated successfully");
            setIsAddMemberOpen(false);
            resetAddForm();
        },
        onError: () => {
            toast.error("Failed to update participants");
        }
    });

    const resetAddForm = () => {
        setSelectedUserId("");
        setSelectedRole("");
        setManualMember({ name: "", email: "", role: "", phone: "" });
    };

    const handleAddMember = () => {
        const currentInternal = formData.internal || [];

        let newMember;
        if (addMode === "select") {
            if (!selectedUserId || !selectedRole) {
                toast.error("Please select a user and role");
                return;
            }
            const user = companyUsers?.find((u: any) => u.id === selectedUserId);
            if (!user) return;

            // Check if already added
            if (currentInternal.some((m: any) => m.user?._id === selectedUserId || m.user === selectedUserId)) {
                toast.error("User already assigned to this job");
                return;
            }

            newMember = {
                user: selectedUserId,
                role: selectedRole,
                isManual: false
            };
        } else {
            if (!manualMember.name || !manualMember.role) {
                toast.error("Name and Role are required");
                return;
            }
            newMember = {
                ...manualMember,
                isManual: true
            };
        }

        const updatedParticipants = {
            ...formData,
            internal: [...currentInternal, newMember]
        };

        setFormData(updatedParticipants); // Optimistic update
        updateMutation.mutate(updatedParticipants);
    };

    const handleRemoveMember = (index: number) => {
        const currentInternal = [...(formData.internal || [])];
        currentInternal.splice(index, 1);
        const updatedParticipants = {
            ...formData,
            internal: currentInternal
        };
        setFormData(updatedParticipants);
        updateMutation.mutate(updatedParticipants);
    };

    const handleExternalChange = (field: string, value: string, subField?: string) => {
        const currentExternal = { ...(formData.external || {}) };
        if (subField) {
            if (!currentExternal[field]) currentExternal[field] = {};
            currentExternal[field][subField] = value;
        } else {
            currentExternal[field] = value;
        }
        setFormData({ ...formData, external: currentExternal });
    };

    const handlePrimaryContactChange = (field: string, value: string) => {
        setFormData({
            ...formData,
            primaryContact: {
                ...(formData.primaryContact || {}),
                [field]: value
            }
        });
    };

    if (isJobLoading) return <Skeleton className="w-full h-[600px]" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Participants</h2>
                    <p className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Manage internal team and external contacts.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => updateMutation.mutate(formData)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 shadow-lg shadow-indigo-500/20"
                        disabled={updateMutation.isPending}
                    >
                        {updateMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Internal Team */}
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden lg:col-span-2`}>
                    <CardHeader className={`border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-slate-50/50'} flex flex-row items-center justify-between`}>
                        <div>
                            <CardTitle className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                                <Users className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} /> Internal Team
                            </CardTitle>
                            <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500 font-normal'}`}>Assignments for this project.</CardDescription>
                        </div>
                        <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className={`rounded-xl px-4 font-medium ${theme === 'dark' ? 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10' : 'border-slate-200 text-indigo-600 hover:bg-slate-50 shadow-sm'}`}>
                                    <Plus className="h-4 w-4 mr-2" /> Add Member
                                </Button>
                            </DialogTrigger>
                            <DialogContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-gray-200 text-indigo-950 shadow-2xl'} rounded-3xl overflow-hidden`}>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black">Add Team Member</DialogTitle>
                                </DialogHeader>
                                <Tabs value={addMode} onValueChange={(v: any) => setAddMode(v)}>
                                    <TabsList className={`w-full grid grid-cols-2 p-1 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} rounded-xl`}>
                                        <TabsTrigger value="select" className="rounded-lg font-medium data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Select Existing</TabsTrigger>
                                        <TabsTrigger value="manual" className="rounded-lg font-medium data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Manual Entry</TabsTrigger>
                                    </TabsList>
                                    <div className="py-6 space-y-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-bold opacity-70">Role</Label>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-wider ${!isRoleDropdown ? "text-indigo-600" : "text-gray-500"}`}>Custom</span>
                                                    <Switch
                                                        checked={isRoleDropdown}
                                                        onCheckedChange={setIsRoleDropdown}
                                                        className="data-[state=checked]:bg-indigo-600"
                                                    />
                                                    <span className={`text-[10px] font-black uppercase tracking-wider ${isRoleDropdown ? "text-indigo-600" : "text-gray-500"}`}>Standard</span>
                                                </div>
                                            </div>

                                            {isRoleDropdown ? (
                                                <Select
                                                    value={addMode === 'select' ? selectedRole : manualMember.role}
                                                    onValueChange={(val) => addMode === 'select' ? setSelectedRole(val) : setManualMember({ ...manualMember, role: val })}
                                                >
                                                    <SelectTrigger className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10' : 'bg-gray-50 ring-gray-200 shadow-sm'}`}>
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                    <SelectContent className={`${theme === 'dark' ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-white border-gray-100 text-indigo-950 shadow-2xl'}`}>
                                                        <SelectItem value="Project Manager">Project Manager</SelectItem>
                                                        <SelectItem value="Estimator">Estimator</SelectItem>
                                                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                                                        <SelectItem value="Accounting">Accounting</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Input
                                                    placeholder="e.g. Project Manager, Estimator"
                                                    value={addMode === 'select' ? selectedRole : manualMember.role}
                                                    onChange={(e) => addMode === 'select' ? setSelectedRole(e.target.value) : setManualMember({ ...manualMember, role: e.target.value })}
                                                    className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10' : 'bg-gray-50 ring-gray-200 shadow-sm'}`}
                                                />
                                            )}
                                        </div>

                                        {addMode === 'select' ? (
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold opacity-70">Select User</Label>
                                                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                                    <SelectTrigger className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10' : 'bg-gray-50 ring-gray-200 shadow-sm'}`}>
                                                        <SelectValue placeholder="Select team member" />
                                                    </SelectTrigger>
                                                    <SelectContent className={`${theme === 'dark' ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-white border-gray-100 text-indigo-950 shadow-2xl'}`}>
                                                        {companyUsers?.map((u: any) => (
                                                            <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="space-y-3">
                                                    <Label className="text-sm font-bold opacity-70">Name</Label>
                                                    <Input
                                                        value={manualMember.name}
                                                        onChange={(e) => setManualMember({ ...manualMember, name: e.target.value })}
                                                        className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10' : 'bg-gray-50 ring-gray-200 shadow-sm'}`}
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-sm font-bold opacity-70">Email</Label>
                                                    <Input
                                                        value={manualMember.email}
                                                        onChange={(e) => setManualMember({ ...manualMember, email: e.target.value })}
                                                        className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10' : 'bg-gray-50 ring-gray-200 shadow-sm'}`}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <DialogFooter className="gap-3">
                                        <Button variant="ghost" onClick={() => setIsAddMemberOpen(false)} className="rounded-xl font-medium">Cancel</Button>
                                        <Button onClick={handleAddMember} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-8 shadow-lg shadow-indigo-500/20">Add Member</Button>
                                    </DialogFooter>
                                </Tabs>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className="p-6">
                        {(!formData.internal || formData.internal.length === 0) && (
                            <div className={`text-center py-20 ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-900/40'} font-medium italic`}>No team members assigned yet.</div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {formData.internal?.map((member: any, index: number) => {
                                // Determine display data
                                const isManual = member.isManual;

                                // Handle if member.user is just ID (before populate) or object
                                let name = isManual ? member.name : "Loading...";
                                let email = isManual ? member.email : "";
                                let avatar = null;
                                const role = member.role;

                                if (!isManual && member.user) {
                                    if (typeof member.user === 'object') {
                                        name = member.user.name;
                                        email = member.user.email;
                                        avatar = member.user.avatar;
                                    } else {
                                        // It's a string ID during optimistic phase, look it up
                                        const foundUser = companyUsers?.find((u: any) => u.id === member.user || u._id === member.user);
                                        if (foundUser) {
                                            name = (foundUser as any).name;
                                            email = (foundUser as any).email;
                                            avatar = (foundUser as any).avatar;
                                        }
                                    }
                                }

                                return (
                                    <div key={index} className={`flex items-center justify-between p-5 rounded-2xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/[0.03] ring-white/5 hover:bg-white/[0.05]' : 'bg-gray-50 ring-gray-100 hover:bg-indigo-50/50 hover:ring-indigo-100'} transition-all group relative overflow-hidden`}>
                                        <div className="flex items-center gap-4">
                                            <Avatar className={`h-12 w-12 ring-2 ${theme === 'dark' ? 'ring-white/10' : 'ring-indigo-100'}`}>
                                                <AvatarImage src={avatar} />
                                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black">
                                                    {name?.charAt(0) || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                             <div>
                                                <div className={`text-xs font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>{role}</div>
                                                <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{name}</div>
                                                {email && <div className={`text-[10px] font-normal opacity-60 truncate max-w-[150px] ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>{email}</div>}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                            onClick={() => handleRemoveMember(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Customer / Primary Contact */}
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden`}>
                     <CardHeader className={`border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-slate-50/50'}`}>
                        <CardTitle className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                            <UserIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} /> Primary Contact
                        </CardTitle>
                        <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500 font-normal'}`}>Customer contact information.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                         <div className="space-y-2">
                            <Label className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Name</Label>
                            <Input
                                value={formData.primaryContact?.name || ""}
                                onChange={(e) => handlePrimaryContactChange("name", e.target.value)}
                                className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-slate-50 ring-slate-200 text-slate-900 shadow-sm'}`}
                                placeholder="Customer Name"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-900/40'}`}>Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                    <Input
                                        value={formData.primaryContact?.phone || ""}
                                        onChange={(e) => handlePrimaryContactChange("phone", e.target.value)}
                                        className={`pl-10 rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}
                                        placeholder="(555) 123-4567"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-900/40'}`}>Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                    <Input
                                        value={formData.primaryContact?.email || ""}
                                        onChange={(e) => handlePrimaryContactChange("email", e.target.value)}
                                        className={`pl-10 rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}
                                        placeholder="customer@example.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* External Contacts */}
                <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden`}>
                     <CardHeader className={`border-b ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-slate-50/50'}`}>
                        <CardTitle className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                            <Briefcase className={`h-5 w-5 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} /> External Contacts
                        </CardTitle>
                        <CardDescription className={`${theme === 'dark' ? 'text-gray-400' : 'text-slate-500 font-normal'}`}>Insurance and third-party details.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                         <div className="space-y-2">
                            <Label className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Insurance Carrier</Label>
                            <Input
                                value={formData.external?.insuranceCarrier || ""}
                                onChange={(e) => handleExternalChange("insuranceCarrier", e.target.value)}
                                className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-slate-50 ring-slate-200 text-slate-900 shadow-sm'}`}
                                placeholder="State Farm, Allstate, etc."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-900/40'}`}>Primary Adjuster</Label>
                                <div className="space-y-2">
                                    <Input
                                        value={formData.external?.primaryAdjuster?.name || ""}
                                        onChange={(e) => handleExternalChange("primaryAdjuster", e.target.value, "name")}
                                        className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}
                                        placeholder="Name"
                                    />
                                    <Input
                                        value={formData.external?.primaryAdjuster?.email || ""}
                                        onChange={(e) => handleExternalChange("primaryAdjuster", e.target.value, "email")}
                                        className={`rounded-xl border-0 ring-1 text-xs ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}
                                        placeholder="Email"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-900/40'}`}>Field Adjuster</Label>
                                <div className="space-y-2">
                                    <Input
                                        value={formData.external?.fieldAdjuster?.name || ""}
                                        onChange={(e) => handleExternalChange("fieldAdjuster", e.target.value, "name")}
                                        className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}
                                        placeholder="Name"
                                    />
                                    <Input
                                        value={formData.external?.fieldAdjuster?.email || ""}
                                        onChange={(e) => handleExternalChange("fieldAdjuster", e.target.value, "email")}
                                        className={`rounded-xl border-0 ring-1 text-xs ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}
                                        placeholder="Email"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-900/40'}`}>TPA Company</Label>
                                <Input
                                    value={formData.external?.tpaCompany || ""}
                                    onChange={(e) => handleExternalChange("tpaCompany", e.target.value)}
                                    className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}
                                    placeholder="Sedgwick, Alacrity, etc."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-900/40'}`}>Property Management</Label>
                                <Input
                                    value={formData.external?.propertyManagement || ""}
                                    onChange={(e) => handleExternalChange("propertyManagement", e.target.value)}
                                    className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}
                                    placeholder="Company Name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-indigo-900/40'}`}>Referral Source</Label>
                            <Input
                                value={formData.external?.referralSource || ""}
                                onChange={(e) => handleExternalChange("referralSource", e.target.value)}
                                className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-gray-50 ring-gray-200 text-indigo-950 shadow-sm'}`}
                                placeholder="How did they hear about us?"
                            />
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ParticipantsTab;
