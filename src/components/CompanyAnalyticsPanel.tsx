import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyAnalyticsService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Pencil,
  Trash2,
  Settings,
  ArrowUpRight,
  Activity,
  Target,
  BrainCircuit,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface RoleRate {
  _id: string;
  roleName: string;
  hourlyRate: number;
}

interface AnalyticsData {
  summary: {
    totalWorkflows: number;
    completedWorkflows: number;
    totalSessions: number;
    completedSessions: number;
    timeSavedHours: number;
    estimatedLaborSavings: number;
    costAvoidance: number;
    productivityIndex: string;
    adoptionRate: number;
    revenueAcceleration: number;
    totalIssuesCaught: number;
    totalQuestionsFlagged: number;
    totalChangeOrders: number;
    totalCompanyUsers: number;
    activeUsers: number;
  };
  usageByType: Record<string, number>;
  timeSavedByBot: Record<string, number>;
  roleRates: RoleRate[];
  manualBaselineMultiplier: number;
}

// ─── Default roles ──────────────────────────────────────────────────────────
const SUGGESTED_ROLES = [
  "Estimator",
  "Office/Admin Staff",
  "Project Manager",
  "Superintendent",
  "General Manager / Owner",
];

/**
 * Embeddable analytics panel — no DashboardLayout wrapper.
 * Drop this into any page to render the full company analytics UI.
 */
const CompanyAnalyticsPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── State ───────────────────────────────────────────────────────────────
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RoleRate | null>(null);
  const [formData, setFormData] = useState({ roleName: "", hourlyRate: "" });
  const [editId, setEditId] = useState<string | null>(null);

  // ── Auth ────────────────────────────────────────────────────────────────
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "company_admin" || user.role === "superadmin";

  // ── Queries ─────────────────────────────────────────────────────────────
  const { data: roleRates = [], isLoading: ratesLoading } = useQuery({
    queryKey: ["roleRates"],
    queryFn: async () => {
      const res = await companyAnalyticsService.getRoleRates();
      return res.data as RoleRate[];
    },
    enabled: isAdmin,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["companyAnalytics"],
    queryFn: async () => {
      const res = await companyAnalyticsService.getAnalytics();
      return res.data as AnalyticsData;
    },
    enabled: isAdmin,
  });

  // ── Mutations ───────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (data: { roleName: string; hourlyRate: number }) =>
      companyAnalyticsService.createRoleRate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleRates"] });
      queryClient.invalidateQueries({ queryKey: ["companyAnalytics"] });
      toast({ title: "Role rate added successfully" });
      setIsAddOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create role rate",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      companyAnalyticsService.updateRoleRate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleRates"] });
      queryClient.invalidateQueries({ queryKey: ["companyAnalytics"] });
      toast({ title: "Role rate updated" });
      setIsEditOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update role rate",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => companyAnalyticsService.deleteRoleRate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleRates"] });
      queryClient.invalidateQueries({ queryKey: ["companyAnalytics"] });
      toast({ title: "Role rate deleted" });
      setDeleteTarget(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    },
  });

  // ── Handlers ────────────────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({ roleName: "", hourlyRate: "" });
    setEditId(null);
  };

  const handleAdd = () => {
    if (!formData.roleName || !formData.hourlyRate) return;
    createMutation.mutate({
      roleName: formData.roleName,
      hourlyRate: Number(formData.hourlyRate),
    });
  };

  const handleEdit = (rate: RoleRate) => {
    setEditId(rate._id);
    setFormData({ roleName: rate.roleName, hourlyRate: String(rate.hourlyRate) });
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editId || !formData.roleName || !formData.hourlyRate) return;
    updateMutation.mutate({
      id: editId,
      data: { roleName: formData.roleName, hourlyRate: Number(formData.hourlyRate) },
    });
  };

  // ── Helpers ─────────────────────────────────────────────────────────────
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toLocaleString()}`;

  // Don't render anything for non-admin users
  if (!isAdmin) return null;

  const s = analytics?.summary;

  // ── Summary stat cards config ─────────────────────────────────────────
  const statCards = s
    ? [
      {
        title: "Labor Savings",
        value: fmt(s.estimatedLaborSavings),
        icon: DollarSign,
        sub: `${s.timeSavedHours} hrs saved`,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
      },
      {
        title: "Cost Avoidance",
        value: fmt(s.costAvoidance),
        icon: ShieldCheck,
        sub: `${s.totalIssuesCaught} issues caught`,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
      },
      {
        title: "Productivity Index",
        value: `${s.productivityIndex}x`,
        icon: TrendingUp,
        sub: "manual ÷ automated",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
      },
      {
        title: "Adoption Rate",
        value: `${s.adoptionRate}%`,
        icon: Users,
        sub: `${s.activeUsers}/${s.totalCompanyUsers} users`,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
      },
      {
        title: "Revenue Acceleration",
        value: fmt(s.revenueAcceleration),
        icon: Zap,
        sub: "cycle-time reduction",
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
      },
      {
        title: "Change Orders Found",
        value: String(s.totalChangeOrders),
        icon: AlertTriangle,
        sub: `${s.totalQuestionsFlagged} questions flagged`,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
      },
    ]
    : [];

  return (
    <>
      {/* ═══════════ SECTION HEADER ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
          <BarChart3 size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Productivity Analytics</h2>
          <p className="text-xs text-muted-foreground">
            AI-driven productivity metrics · Admin only
          </p>
        </div>
      </motion.div>

      {/* ═══════════ ROLE RATE SETTINGS ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Role-Based Hourly Rates
              </h2>
              <p className="text-xs text-muted-foreground">
                Admin-only · Rates are used to calculate labor savings
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsAddOpen(true);
            }}
            className="bg-indigo-600 text-white hover:bg-indigo-700 gap-2"
            size="sm"
          >
            <Plus size={16} />
            Add Role
          </Button>
        </div>

        <div className="p-0">
          {ratesLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading rates…</div>
          ) : roleRates.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No role rates configured yet. Add roles to start tracking labor savings.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTED_ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setFormData({ roleName: role, hourlyRate: "" });
                      setIsAddOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs bg-muted border border-border text-muted-foreground hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-300 transition-all"
                  >
                    + {role}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="p-4 pl-6 font-medium">Role</th>
                  <th className="p-4 font-medium">Hourly Rate</th>
                  <th className="p-4 pr-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {roleRates.map((rate) => (
                  <tr
                    key={rate._id}
                    className="group hover:bg-accent transition-colors"
                  >
                    <td className="p-4 pl-6">
                      <span className="text-foreground font-medium">
                        {rate.roleName}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-emerald-500 font-semibold">
                        ${rate.hourlyRate.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground text-xs ml-1">/hr</span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-indigo-400"
                          onClick={() => handleEdit(rate)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-400"
                          onClick={() => setDeleteTarget(rate)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* ═══════════ PRODUCTIVITY ANALYTICS ═══════════ */}
      {analyticsLoading ? (
        <div className="p-12 text-center text-gray-500">
          Computing analytics…
        </div>
      ) : s ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + idx * 0.06 }}
                >
                  <div
                    className={`p-5 rounded-2xl border ${card.border} bg-card/50 backdrop-blur-sm hover:bg-accent transition-all duration-300 group`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`p-3 rounded-xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                        <ArrowUpRight size={12} />
                        {card.sub}
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      {card.title}
                    </h3>
                    <p className="text-2xl font-bold text-foreground tracking-tight">
                      {card.value}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Bot Usage & Time Saved ─────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage Frequency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <BarChart3 size={20} />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Bot Usage Frequency
                </h3>
              </div>
              {Object.keys(analytics?.usageByType || {}).length === 0 ? (
                <p className="text-gray-500 text-sm">No usage data yet.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(analytics!.usageByType).map(
                    ([type, count]) => {
                      const maxCount = Math.max(
                        ...Object.values(analytics!.usageByType)
                      );
                      const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{type}</span>
                            <span className="text-foreground font-medium">
                              {count}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                duration: 0.8,
                                delay: 0.2,
                                ease: "easeOut",
                              }}
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </motion.div>

            {/* Time Saved per Bot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Clock size={20} />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Time Saved by Bot
                </h3>
              </div>
              {Object.keys(analytics?.timeSavedByBot || {}).length === 0 ? (
                <p className="text-gray-500 text-sm">No time-saved data yet.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(analytics!.timeSavedByBot).map(
                    ([type, hours]) => {
                      const maxHours = Math.max(
                        ...Object.values(analytics!.timeSavedByBot)
                      );
                      const pct =
                        maxHours > 0 ? (hours / maxHours) * 100 : 0;
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{type}</span>
                            <span className="text-foreground font-medium">
                              {hours} hrs
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                duration: 0.8,
                                delay: 0.2,
                                ease: "easeOut",
                              }}
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Extended Metrics Row ────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Workflow Completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.65 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Activity size={18} />
                </div>
                <h4 className="text-sm font-semibold text-foreground">
                  Completion Rates
                </h4>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Workflows</span>
                    <span>
                      {s.completedWorkflows}/{s.totalWorkflows}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${s.totalWorkflows > 0 ? (s.completedWorkflows / s.totalWorkflows) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Field Notes Sessions</span>
                    <span>
                      {s.completedSessions}/{s.totalSessions}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{
                        width: `${s.totalSessions > 0 ? (s.completedSessions / s.totalSessions) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Error Reduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                  <Target size={18} />
                </div>
                <h4 className="text-sm font-semibold text-foreground">
                  Error Reduction
                </h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issues Caught</span>
                  <span className="text-foreground font-medium">
                    {s.totalIssuesCaught}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions Flagged</span>
                  <span className="text-foreground font-medium">
                    {s.totalQuestionsFlagged}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Change Orders Found</span>
                  <span className="text-foreground font-medium">
                    {s.totalChangeOrders}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border/50">
                  <span className="text-muted-foreground">Est. Savings</span>
                  <span className="text-emerald-500 font-semibold">
                    {fmt(s.costAvoidance)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* AI Intelligence */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.75 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <BrainCircuit size={18} />
                </div>
                <h4 className="text-sm font-semibold text-foreground">
                  Intelligence Summary
                </h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Automations</span>
                  <span className="text-foreground font-medium">
                    {s.totalWorkflows + s.totalSessions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="text-foreground font-medium">
                    {s.activeUsers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Configured Roles</span>
                  <span className="text-foreground font-medium">
                    {roleRates.length}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border/50">
                  <span className="text-muted-foreground">Baseline Multiplier</span>
                  <span className="text-indigo-400 font-semibold">
                    {analytics?.manualBaselineMultiplier}x
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Role Rates in Analytics Context */}
          {roleRates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Labor Cost Breakdown
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Time saved × role rates = estimated labor savings
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roleRates.map((rate) => {
                  const roleSavings =
                    s.timeSavedHours *
                    (rate.hourlyRate /
                      roleRates.reduce((a, b) => a + b.hourlyRate, 0)) *
                    roleRates.reduce((a, b) => a + b.hourlyRate, 0) /
                    roleRates.length;
                  return (
                    <div
                      key={rate._id}
                      className="p-4 rounded-xl bg-card border border-border hover:border-indigo-500/20 transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground mb-1">
                        {rate.roleName}
                      </p>
                      <p className="text-xl font-bold text-purple-400">
                        {fmt(Math.round(roleSavings))}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        @${rate.hourlyRate}/hr · {s.timeSavedHours} hrs
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </>
      ) : null}

      {/* ═══════════ ADD DIALOG ═══════════ */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bg-background border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Role Rate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Role Name
              </label>
              <Input
                placeholder="e.g. Project Manager"
                value={formData.roleName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, roleName: e.target.value }))
                }
                className="bg-muted border-border text-foreground"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SUGGESTED_ROLES.filter(
                  (r) => !roleRates.some((rr) => rr.roleName === r)
                ).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, roleName: role }))
                    }
                    className="px-2 py-0.5 rounded text-[10px] bg-muted border border-border text-muted-foreground hover:text-indigo-300 hover:border-indigo-500/30 transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Hourly Rate ($)
              </label>
              <Input
                type="number"
                min={0}
                step={0.01}
                placeholder="85.00"
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, hourlyRate: e.target.value }))
                }
                className="bg-muted border-border text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsAddOpen(false)}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={createMutation.isPending}
              className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              {createMutation.isPending ? "Saving…" : "Add Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════ EDIT DIALOG ═══════════ */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-background border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Role Rate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Role Name
              </label>
              <Input
                value={formData.roleName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, roleName: e.target.value }))
                }
                className="bg-muted border-border text-foreground"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Hourly Rate ($)
              </label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, hourlyRate: e.target.value }))
                }
                className="bg-muted border-border text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsEditOpen(false)}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              {updateMutation.isPending ? "Saving…" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════ DELETE CONFIRMATION ═══════════ */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-background border-border text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role Rate</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete the rate for{" "}
              <strong className="text-foreground">{deleteTarget?.roleName}</strong>?
              This will affect analytics calculations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-border text-muted-foreground hover:bg-accent hover:text-foreground">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors border-0"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CompanyAnalyticsPanel;
