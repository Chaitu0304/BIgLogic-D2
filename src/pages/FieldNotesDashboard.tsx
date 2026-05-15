import DashboardLayout from "@/components/DashboardLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fieldNotesService } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import VoiceTranscriptionDetailModal from "@/components/VoiceTranscriptionDetailModal";
import {
    FolderOpen,
    Mic,
    ListTodo,
    Image,
    AudioLines,
    Clock,
    CheckCircle,
    AlertCircle,
    Send,
    Users,
    BarChart3,
    FileText,
    Loader2,
    TrendingUp,
    Eye,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const FieldNotesDashboard = () => {
    const { theme } = useTheme();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Permission check
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isCompanyAdmin = user.role === "company_admin" || user.role === "superadmin";
    const hasPermission = user.permissions?.fieldNotes === true;

    const [activeProjectTab, setActiveProjectTab] = useState<"projects" | "sessions">("projects");
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const { toast } = useToast();

    if (!isCompanyAdmin && !hasPermission) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
                        <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
                        <p className="text-muted-foreground">You need Company Admin access to view this page.</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ["fieldnotes-dashboard"],
        queryFn: async () => {
            const res = await fieldNotesService.getDashboardStats();
            return res.data;
        },
        refetchInterval: 30000,
    });

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
                        <h2 className="text-xl font-bold text-foreground mb-2">Failed to Load</h2>
                        <p className="text-muted-foreground">Could not fetch Field Notes data. Please try again.</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const counts = data?.counts || {};
    const sessionStatuses = data?.sessionStatuses || {};
    const taskStatuses = data?.taskStatuses || {};
    const modeBreakdown = data?.modeBreakdown || {};
    const recentSessions = data?.recentSessions || [];
    const projects = data?.projects || [];
    const topUsers = data?.topUsers || [];

    const statCards = [
        { label: "Projects", value: counts.projects || 0, icon: FolderOpen, gradient: "from-indigo-600 to-indigo-400" },
        { label: "Sessions", value: counts.sessions || 0, icon: Mic, gradient: "from-purple-600 to-purple-400" },
        { label: "Tasks", value: counts.tasks || 0, icon: ListTodo, gradient: "from-emerald-600 to-emerald-400" },
        { label: "Media Files", value: counts.media || 0, icon: Image, gradient: "from-amber-600 to-amber-400" },
        { label: "Audio Notes", value: counts.audioNotes || 0, icon: AudioLines, gradient: "from-cyan-600 to-cyan-400" },
    ];

    const getStatusColor = (status: string) => {
        if (theme === "light") {
            switch (status) {
                case "sent": case "completed": case "done": return "text-emerald-700 bg-emerald-50 border-emerald-100";
                case "pending": case "not_sent": return "text-amber-700 bg-amber-50 border-amber-100";
                case "received": case "in_progress": return "text-indigo-700 bg-indigo-50 border-indigo-100";
                case "failed": case "blocked": return "text-red-700 bg-red-50 border-red-100";
                case "open": return "text-blue-700 bg-blue-50 border-blue-100";
                default: return "text-slate-600 bg-slate-100 border-slate-200";
            }
        }
        switch (status) {
            case "sent": case "completed": case "done": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
            case "pending": case "not_sent": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
            case "received": case "in_progress": return "text-indigo-500 bg-indigo-500/10 border-indigo-500/20";
            case "failed": case "blocked": return "text-destructive bg-destructive/10 border-destructive/20";
            case "open": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
            default: return "text-muted-foreground bg-muted border-border";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "sent": case "completed": case "done": return <CheckCircle size={12} />;
            case "pending": case "not_sent": return <Clock size={12} />;
            case "received": case "in_progress": return <Send size={12} />;
            case "failed": case "blocked": return <AlertCircle size={12} />;
            default: return <Clock size={12} />;
        }
    };

    const handleViewProject = (p: any) => {
        setSelectedProject({
            _id: p._id,
            projectName: p.name,
            startedAt: p.createdAt,
            isVoiceSession: true,
            voiceData: p.voiceData,
        });
        setModalOpen(true);
    };

    const handleDeleteProject = (id: string) => {
        setProjectToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteProject = async () => {
        if (!projectToDelete) return;
        const id = projectToDelete;
        setDeletingId(id);
        setIsDeleteDialogOpen(false);

        try {
            await fieldNotesService.adminDeleteProject(id);
            queryClient.invalidateQueries({ queryKey: ["fieldnotes-dashboard"] });
            toast({
                title: "Project Deleted",
                description: "The project and all associated data have been permanently removed.",
            });
        } catch (err) {
            console.error("Failed to delete project:", err);
            toast({
                title: "Deletion Failed",
                description: "Failed to delete project. Please try again.",
                variant: "destructive",
            });
        } finally {
            setDeletingId(null);
            setProjectToDelete(null);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 shadow-lg shadow-indigo-500/20">
                            <FileText size={24} className="text-white" />
                        </div>
                        Field Notes Dashboard
                    </h1>
                    <p className="text-muted-foreground">Complete overview of FieldNotesAI projects, sessions, and tasks</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {statCards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className={cn(
                                    "rounded-2xl border transition-all group p-5",
                                    theme === "light" 
                                        ? "bg-white border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60" 
                                        : "bg-card/50 border-border backdrop-blur-sm hover:bg-card/80"
                                )}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient} shadow-lg shadow-indigo-500/10`}>
                                        <Icon size={18} className="text-white" />
                                    </div>
                                    <TrendingUp size={14} className={cn(
                                        "transition-colors",
                                        theme === "light" ? "text-slate-300 group-hover:text-slate-400" : "text-muted-foreground/40 group-hover:text-muted-foreground"
                                    )} />
                                </div>
                                <div className="text-2xl font-bold text-foreground">{card.value.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground mt-1 font-medium">{card.label}</div>
                            </motion.div>
                        );
                    })}
                </div>


                {/* Mode Breakdown */}
                {Object.keys(modeBreakdown).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={cn(
                            "rounded-2xl border p-5",
                            theme === "light" ? "bg-white border-slate-200 shadow-md shadow-slate-200/40" : "bg-card/50 border-border backdrop-blur-sm"
                        )}
                    >
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(modeBreakdown).map(([mode, count]) => (
                                <span key={mode} className={cn(
                                    "text-xs rounded-lg px-3 py-1.5 transition-colors",
                                    theme === "light" ? "bg-slate-50 border border-slate-100 text-slate-600" : "bg-muted border border-border text-muted-foreground"
                                )}>
                                    {mode} <span className="text-foreground font-bold ml-1">{count as number}</span>
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Projects / Sessions Tabs */}
                <div className={cn(
                    "rounded-2xl border overflow-hidden shadow-xl",
                    theme === "light" ? "bg-white border-slate-200 shadow-slate-200/50" : "bg-card/30 border-border backdrop-blur-sm"
                )}>
                    <div className={cn(
                        "p-6 border-b flex flex-wrap items-center justify-between gap-4",
                        theme === "light" ? "border-slate-100" : "border-border"
                    )}>
                        <div className={cn(
                            "flex gap-1 rounded-xl p-1",
                            theme === "light" ? "bg-slate-50" : "bg-muted/50"
                        )}>
                            <button
                                onClick={() => setActiveProjectTab("projects")}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                                    activeProjectTab === "projects" 
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                        : theme === "light" ? "text-slate-500 hover:text-slate-700 hover:bg-slate-100" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <FolderOpen size={14} className="inline mr-2" />
                                Projects ({projects.length})
                            </button>
                            <button
                                onClick={() => setActiveProjectTab("sessions")}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                                    activeProjectTab === "sessions" 
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                        : theme === "light" ? "text-slate-500 hover:text-slate-700 hover:bg-slate-100" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <Mic size={14} className="inline mr-2" />
                                Recent Sessions ({recentSessions.length})
                            </button>
                        </div>
                        {activeProjectTab === "projects" && projects.length > 10 && (
                            <button
                                onClick={() => navigate("/workflow/voice-transcription")}
                                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                            >
                                View All →
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        {activeProjectTab === "projects" ? (
                            <table className="w-full">
                                <thead className={theme === "light" ? "bg-slate-50/80" : "bg-muted/50"}>
                                    <tr>
                                        <th className="text-left py-4 px-6 font-bold text-foreground text-xs uppercase tracking-wider">Project</th>
                                        <th className="text-left py-4 px-6 font-bold text-foreground text-xs uppercase tracking-wider">User</th>
                                        <th className="text-left py-4 px-6 font-bold text-foreground text-xs uppercase tracking-wider">Meeting Type</th>
                                        <th className="text-left py-4 px-6 font-bold text-foreground text-xs uppercase tracking-wider">Participants</th>
                                        <th className="text-center py-4 px-6 font-bold text-foreground text-xs uppercase tracking-wider">Tasks</th>
                                        <th className="text-left py-4 px-6 font-bold text-foreground text-xs uppercase tracking-wider">Status</th>
                                        <th className="text-left py-4 px-6 font-bold text-foreground text-xs uppercase tracking-wider">Created</th>
                                        <th className="text-center py-4 px-6 font-bold text-foreground text-xs uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={cn(
                                    "divide-y",
                                    theme === "light" ? "divide-slate-100" : "divide-border"
                                )}>
                                    {projects.length === 0 ? (
                                        <tr><td colSpan={8} className="py-12 text-center text-muted-foreground">No projects found</td></tr>
                                    ) : (
                                        projects.slice(0, 10).map((p: any, index: number) => (
                                            <motion.tr
                                                key={p._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className={cn(
                                                    "transition-colors",
                                                    theme === "light" ? "hover:bg-slate-50/50" : "hover:bg-muted/50"
                                                )}
                                            >
                                                <td className="py-3.5 px-6">
                                                    <div>
                                                        <p className="text-foreground font-medium text-sm">{p.name}</p>
                                                        {p.jobId && <p className="text-[10px] text-muted-foreground mt-0.5">Job: {p.jobId}</p>}
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-6">
                                                    <p className="text-sm text-foreground/80">{p.user?.name || "—"}</p>
                                                    <p className="text-[10px] text-muted-foreground">{p.user?.email}</p>
                                                </td>
                                                <td className="py-3.5 px-6">
                                                    <span className={cn(
                                                        "text-xs border rounded-lg px-2.5 py-1 capitalize",
                                                        theme === "light" ? "bg-slate-50 border-slate-100 text-slate-600" : "bg-muted border border-border text-muted-foreground"
                                                    )}>{p.areaType || p.mode || "—"}</span>
                                                </td>
                                                <td className="py-3.5 px-6">
                                                    {p.participants && p.participants.length > 0 ? (
                                                        <div className="flex items-center gap-1">
                                                            <div className="flex -space-x-2">
                                                                {p.participants.slice(0, 3).map((pt: any, i: number) => (
                                                                    <div key={i} className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-background flex items-center justify-center text-[9px] font-bold text-primary-foreground shadow-sm" title={`${pt.name} (${pt.role})`}>
                                                                        {pt.name?.charAt(0).toUpperCase() || "?"}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {p.participants.length > 3 && (
                                                                <span className="text-[10px] text-muted-foreground ml-1">+{p.participants.length - 3}</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground/50">—</span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-6 text-center text-sm text-foreground font-medium">{p.taskCount}</td>
                                                <td className="py-3.5 px-6">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border ${getStatusColor(p.webhookStatus || 'pending')}`}>
                                                        {getStatusIcon(p.webhookStatus || 'pending')}
                                                        {(p.webhookStatus || "pending").replace(/_/g, " ")}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-6 text-sm text-muted-foreground">
                                                    {new Date(p.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-3.5 px-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleViewProject(p)}
                                                            className="p-2 rounded-lg bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600/20 transition-colors"
                                                            title="View Summary, Tasks & Transcript"
                                                        >
                                                            <Eye size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProject(p._id)}
                                                            disabled={deletingId === p._id}
                                                            className="p-2 rounded-lg bg-red-600/10 text-red-600 hover:bg-red-600/20 transition-colors disabled:opacity-50"
                                                            title="Delete Project"
                                                        >
                                                            {deletingId === p._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full">
                                <thead className={theme === "light" ? "bg-slate-50/80" : "bg-muted/50"}>
                                    <tr>
                                        <th className="text-left py-4 px-6 font-bold text-foreground text-xs uppercase tracking-wider">Project</th>
                                        <th className="text-left py-4 px-6 font-bold text-foreground text-xs uppercase tracking-wider">User</th>
                                        <th className="text-left py-4 px-6 font-bold text-foreground text-xs uppercase tracking-wider">Type</th>
                                        <th className="text-left py-4 px-6 font-bold text-foreground text-xs uppercase tracking-wider">Area</th>
                                        <th className="text-left py-4 px-6 font-bold text-foreground text-xs uppercase tracking-wider">Status</th>
                                        <th className="text-left py-4 px-6 font-bold text-foreground text-xs uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className={cn(
                                    "divide-y",
                                    theme === "light" ? "divide-slate-100" : "divide-border"
                                )}>
                                    {recentSessions.length === 0 ? (
                                        <tr><td colSpan={6} className="py-12 text-center text-muted-foreground">No sessions found</td></tr>
                                    ) : (
                                        recentSessions.map((s: any, index: number) => (
                                            <motion.tr
                                                key={s._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className={cn(
                                                    "transition-colors",
                                                    theme === "light" ? "hover:bg-slate-50/50" : "hover:bg-muted/50"
                                                )}
                                            >
                                                <td className="py-3.5 px-6">
                                                    <p className="text-foreground font-medium text-sm">{s.projectName}</p>
                                                    {s.jobId && <p className="text-[10px] text-muted-foreground mt-0.5">Job: {s.jobId}</p>}
                                                </td>
                                                <td className="py-3.5 px-6">
                                                    <p className="text-sm text-foreground/80">{s.user?.name || "—"}</p>
                                                </td>
                                                <td className="py-3.5 px-6">
                                                    <span className="text-xs text-indigo-600 bg-indigo-600/10 px-2.5 py-1 rounded-full capitalize font-medium">{s.sessionType || s.mode || "—"}</span>
                                                </td>
                                                <td className="py-3.5 px-6 text-sm text-muted-foreground capitalize">{s.areaType || "—"}</td>
                                                <td className="py-3.5 px-6">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border ${getStatusColor(s.webhookStatus || 'pending')}`}>
                                                        {getStatusIcon(s.webhookStatus || 'pending')}
                                                        {(s.webhookStatus || "pending").replace(/_/g, " ")}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-6 text-sm text-muted-foreground">
                                                    {new Date(s.createdAt).toLocaleDateString()}
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <VoiceTranscriptionDetailModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                workflow={selectedProject}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-card border-border text-foreground sm:max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="w-5 h-5" />
                            Confirm Project Deletion
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Are you sure you want to delete this project and all its data? Resulting analyses, tasks, and media files will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground hover:bg-muted"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteProject}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-[0_0_15px_rgba(var(--destructive),0.3)]"
                        >
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default FieldNotesDashboard;
