import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, TrendingUp, MoreHorizontal, ArrowUpRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { workflowService } from "@/services/api";
import CompanyAnalyticsPanel from "@/components/CompanyAnalyticsPanel";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const res = await workflowService.getMyWorkflows({ limit: 10 });
      return res.data;
    }
  });

  const workflows = data?.workflows || [];
  const totalWorkflows = data?.totalWorkflows || 0;

  // Note: These counts are now based on the latest 10 workflows due to pagination. 
  // Ideally, we should have a dedicated stats endpoint.
  const completedWorkflows = workflows.filter((w: any) => w.status === 'Completed').length;
  const processingWorkflows = workflows.filter((w: any) => w.status === 'Processing').length;
  // Mock value calculation
  const estValue = `$${(totalWorkflows * 1.5).toFixed(1)}k`;

  const stats = [
    {
      title: "Total Workflows",
      value: totalWorkflows.toString(),
      icon: FileText,
      trend: "+12.5%",
      color: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Completed",
      value: completedWorkflows.toString(),
      icon: CheckCircle,
      trend: "+92%",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    {
      title: "Processing",
      value: processingWorkflows.toString(),
      icon: Zap,
      trend: "Active",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20"
    },
    {
      title: "Est. Value",
      value: estValue,
      icon: TrendingUp,
      trend: "+8.2%",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your automated estimation workflows.</p>
          </div>

        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className={`p-6 rounded-2xl border ${stat.border} bg-card/50 backdrop-blur-sm hover:bg-accent transition-all duration-300 group`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-800 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                      <ArrowUpRight size={12} />
                      {stat.trend}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                    <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Productivity Analytics (admin-only, self-guarded) */}
        <CompanyAnalyticsPanel />

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
            <button onClick={() => navigate("/history")} className="text-sm text-primary hover:text-primary/80 transition-colors">View All</button>
          </div>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="p-6 font-medium">Project Name</th>
                    <th className="p-6 font-medium">Type</th>
                    {/* <th className="p-6 font-medium">Value</th> */}
                    <th className="p-6 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {isLoading ? (
                    <tr><td className="p-6 text-foreground text-center" colSpan={4}>Loading...</td></tr>
                  ) : workflows.length === 0 ? (
                    <tr><td className="p-6 text-muted-foreground text-center" colSpan={4}>No recent activity</td></tr>
                  ) : (
                    workflows.slice(0, 5).map((activity: any, idx: number) => (
                      <tr key={activity._id || idx} className="group hover:bg-accent transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                              <FileText size={18} />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {activity.projectName || activity.inputFiles?.[0]?.originalName || `Workflow #${activity._id.slice(-6)}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(activity.startedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-sm text-muted-foreground">{activity.workflowType}</td>
                        {/* <td className="p-6 text-sm text-white font-medium">N/A</td> */}
                        <td className="p-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${activity.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : activity.status === "Processing"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                            }`}>
                            {activity.status}
                          </span>
                        </td>
                      </tr>
                    )))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
