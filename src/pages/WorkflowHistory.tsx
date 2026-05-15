import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Download, FileText, CheckCircle, Clock, AlertCircle, Mail, Send, Loader2, ChevronLeft, ChevronRight, Search, Calendar, User, PlayCircle, Edit2, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { workflowService, fileService, default as api } from "@/services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import VoiceTranscriptionDetailModal from "@/components/VoiceTranscriptionDetailModal";
import { useTheme } from "@/components/ThemeProvider";

const WorkflowHistory = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: string, to: string }>({ from: "", to: "" });
  const [projectNameQuery, setProjectNameQuery] = useState("All");
  const [workflowTypeQuery, setWorkflowTypeQuery] = useState("All");
  const [statusQuery, setStatusQuery] = useState("All");
  const [isGroupByCompany, setIsGroupByCompany] = useState(true); // Toggle for "View All" (Group by User)

  // Permission Check
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canViewAll = user.role === 'company_admin' || user.role === 'superadmin' || user.permissions?.viewAllWorkflows;

  const { data, isLoading } = useQuery({
    queryKey: ['workflows-history', page, search, dateRange, projectNameQuery, workflowTypeQuery, statusQuery, isGroupByCompany], // Add dependencies
    queryFn: async () => {
      // If "Group by User" is NOT checked, we want to see only OUR workflows.
      // But the backend will return ALL if we send nothing and have permission.
      // So logic:
      // If I HAVE perm:
      //   - Toggle OFF: I want only MINE -> send userId = myId
      //   - Toggle ON: I want ALL -> send nothing (backend returns all by default for admin/perm) or send query param to be explicit?
      //   Actually, backend `getMyWorkflows`:
      //     - if hasFullAccess && companyId:
      //         if query.userId -> filter by that user
      //         else -> return all
      //     - else -> return mine

      // So if I have perm:
      //   - Want MINE (Toggle OFF): Send userId = myId
      //   - Want ALL (Toggle ON): Send nothing (or userId=null) is fine.

      const params: any = {
        page,
        limit: 10,
        search,
        startDate: dateRange.from,
        endDate: dateRange.to,
        projectName: projectNameQuery,
        workflowType: workflowTypeQuery,
        status: statusQuery
      };

      if (canViewAll && !isGroupByCompany) {
        // Force filter to my own workflows even if I have permission to see all
        params.userId = user._id || user.id;
      }

      const res = await workflowService.getMyWorkflows(params);
      return res.data;
    }
  });

  const workflows = data?.workflows || [];
  const totalPages = data?.totalPages || 1;

  // Fetch filter options
  const { data: filtersData } = useQuery({
    queryKey: ['workflow-filters'],
    queryFn: async () => {
      const res = await workflowService.getWorkflowFilters();
      return res.data;
    }
  });

  const projectNamesForSelect = filtersData?.projectNames || [];
  const workflowTypesForSelect = filtersData?.workflowTypes || [];


  // Email State
  const [emailWorkflow, setEmailWorkflow] = useState<any | null>(null);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailForm, setEmailForm] = useState({
    emails: "",
    pmName: "",
    jobName: ""
  });

  // Voice Transcription Detail Modal
  const [voiceDetailWorkflow, setVoiceDetailWorkflow] = useState<any | null>(null);
  const [isVoiceDetailOpen, setIsVoiceDetailOpen] = useState(false);

  const handleDownload = async (key: string, name: string) => {
    try {
      toast({
        title: "Fetching download link...",
        description: `Preparing download for ${name}`,
      });

      const response = await fileService.getDownloadUrl(key);
      const url = response.data.url;

      if (url) {
        window.open(url, '_blank');
        toast({
          title: "Download started",
          description: "Your file should begin downloading shortly.",
          // className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        });
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download failed",
        description: "Could not generate download link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOpenEmail = (workflow: any) => {
    setEmailWorkflow(workflow);
    setEmailForm({ emails: "", pmName: "", jobName: "" });
    setIsEmailOpen(true);
  };

  const handleSendEmail = async () => {
    if (!emailForm.emails) {
      toast({ title: "Error", description: "Please enter at least one email address", variant: "destructive" });
      return;
    }

    setIsSending(true);
    try {
      if (emailWorkflow.workflowType === "Material Extraction") {
        await api.post("/material-extraction/email", {
          workflowId: emailWorkflow._id,
          emails: emailForm.emails,
          // Removed manual pm/job name inputs, rely on stored values
        });
      } else {
        // Xactimate or others
        await api.post("/xactimate/email", {
          workflowId: emailWorkflow._id,
          emails: emailForm.emails
        });
      }

      toast({
        title: "Email Sent",
        description: "The report has been emailed successfully.",
        className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      });
      setIsEmailOpen(false);
    } catch (error: any) {
      console.error("Email error:", error);
      toast({
        title: "Email Failed",
        description: error.response?.data?.message || "Failed to send email. Note: Older workflows may not support this feature.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Processing":
      case "Pending": return "text-primary bg-primary/10 border-primary/20";
      case "Error":
      case "Failed": return "text-destructive bg-destructive/10 border-destructive/20";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle size={14} className="mr-1.5" />;
      case "Processing":
      case "Pending": return <Clock size={14} className="mr-1.5" />;
      case "Error":
      case "Failed": return <AlertCircle size={14} className="mr-1.5" />;
      default: return null;
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground">Workflow History</h1>
          <p className="text-muted-foreground">View and manage your past workflow executions</p>
        </div>

        <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          {/* <h2 className="text-xl px-6 py-4 font-semibold text-white">Recent Workflows</h2> */}
          <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">


            <div className="flex flex-col lg:flex-row flex-wrap gap-3 items-start lg:items-center w-full lg:w-auto lg:mt-0">
              {/* Group By Toggle for Admins/Permitted Users */}
              {canViewAll && (
                <Button
                  variant="outline"
                  onClick={() => setIsGroupByCompany(!isGroupByCompany)}
                  className={`gap-2 border-white/10 w-full lg:w-auto whitespace-normal h-auto py-2 ${!isGroupByCompany ? theme === 'dark' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-indigo-100 text-indigo-800 border-indigo-200' : theme === 'dark' ? 'bg-black/20 text-gray-400 ' : 'bg-gray-100 text-gray-600'}`}
                >
                  <User size={16} className="shrink-0" />
                  <span className="truncate">{isGroupByCompany ? "Show your Executions Only" : "Show All Members Executions"}</span>
                </Button>
              )}

              {/* Search */}
              <div className="relative w-full lg:w-auto shrink-0">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} shrink-0`} size={16} />
                <Input
                  placeholder="Search workflows..."
                  className={`pl-9 ${theme === 'dark' ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} w-full lg:w-64`}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>

              {/* Select Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0">
                <select
                  value={projectNameQuery}
                  onChange={(e) => { setProjectNameQuery(e.target.value); setPage(1); }}
                  className="pl-3 pr-8 py-2 bg-background border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1em_1em] bg-caret-down hover:bg-accent transition-colors cursor-pointer w-full sm:w-48 truncate"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                >
                  <option value="All" className="bg-background text-foreground">All Projects</option>
                  {projectNamesForSelect.map((name: string) => (
                    <option key={name} value={name} className="bg-background text-foreground">{name}</option>
                  ))}
                </select>

                <select
                  value={workflowTypeQuery}
                  onChange={(e) => { setWorkflowTypeQuery(e.target.value); setPage(1); }}
                  className="pl-3 pr-8 py-2 bg-background border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1em_1em] bg-caret-down hover:bg-accent transition-colors cursor-pointer w-full sm:w-40 truncate"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                >
                  <option value="All" className="bg-background text-foreground">All Types</option>
                  {workflowTypesForSelect.map((type: string) => (
                    <option key={type} value={type} className="bg-background text-foreground">{type}</option>
                  ))}
                </select>

                <select
                  value={statusQuery}
                  onChange={(e) => { setStatusQuery(e.target.value); setPage(1); }}
                  className="pl-3 pr-8 py-2 bg-background border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1em_1em] bg-caret-down hover:bg-accent transition-colors cursor-pointer w-full sm:w-36 truncate"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                >
                  <option value="All" className="bg-background text-foreground">All Statuses</option>
                  <option value="Completed" className="bg-background text-foreground">Completed</option>
                  <option value="Processing" className="bg-background text-foreground">Processing</option>
                  <option value="Pending" className="bg-background text-foreground">Pending</option>
                  <option value="Failed" className="bg-background text-foreground">Failed</option>
                  <option value="Error" className="bg-background text-foreground">Error</option>
                </select>
              </div>

              {/* Date Filter - Simple Inputs for now */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto shrink-0">
                <div className="relative w-full sm:w-auto">
                  <input
                    type="date"
                    className="pl-3 pr-2 py-2 bg-background border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full"
                    value={dateRange.from}
                    onChange={(e) => { setDateRange(prev => ({ ...prev, from: e.target.value })); setPage(1); }}
                  />
                </div>
                <span className="hidden sm:inline text-muted-foreground">-</span>
                <div className="relative w-full sm:w-auto">
                  <input
                    type="date"
                    className="pl-3 pr-2 py-2 bg-background border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full"
                    value={dateRange.to}
                    onChange={(e) => { setDateRange(prev => ({ ...prev, to: e.target.value })); setPage(1); }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground text-sm uppercase tracking-wider">Project Name</th>
                  {canViewAll && isGroupByCompany && (
                    <th className="text-left py-4 px-6 font-medium text-muted-foreground text-sm uppercase tracking-wider">User</th>
                  )}
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground text-sm uppercase tracking-wider">Date</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground text-sm uppercase tracking-wider">Type</th>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground text-sm uppercase tracking-wider">Status</th>
                  <th className="text-right py-4 px-6 font-medium text-muted-foreground text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td className={`p-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-center`} colSpan={canViewAll && isGroupByCompany ? 6 : 5}>Loading...</td></tr>
                ) : workflows.length === 0 ? (
                  <tr><td className="p-6 text-gray-500 text-center" colSpan={canViewAll && isGroupByCompany ? 6 : 5}>No workflows found</td></tr>
                ) : (
                  workflows.map((workflow: any, index: number) => (
                    <motion.tr
                      key={workflow._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-primary/10 text-primary group-hover:bg-primary/20' : 'bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200'} transition-colors`}>
                            <FileText size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className={`font-semibold ${theme === 'dark' ? 'text-foreground group-hover:text-primary' : 'text-gray-900 group-hover:text-indigo-700'} transition-colors`}>
                              {workflow.projectName || workflow.inputFiles?.[0]?.originalName || `Workflow #${workflow._id.slice(-6)}`}
                            </span>
                            {/* Display PM and Job Name if available */}
                            {(workflow.pmName || workflow.jobName) && (
                              <span className="text-xs text-muted-foreground">
                                {workflow.pmName && `PM: ${workflow.pmName}`}
                                {workflow.pmName && workflow.jobName && " | "}
                                {workflow.jobName && `Job: ${workflow.jobName}`}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {canViewAll && isGroupByCompany && (
                        <td className="py-4 px-6 text-muted-foreground text-sm">
                          <div className="flex flex-col">
                            <span className={`${theme === 'dark' ? 'text-foreground' : 'text-gray-900'} font-semibold`}>{workflow.user?.name || "Unknown"}</span>
                            <span className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>{workflow.user?.email}</span>
                          </div>
                        </td>
                      )}
                      <td className="py-4 px-6 text-muted-foreground">
                        {new Date(workflow.startedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 font-mono text-sm">
                        <span className={`flex items-center gap-1.5 ${workflow.isVoiceSession ? 'text-primary' : 'text-muted-foreground'}`}>
                          {workflow.isVoiceSession && <Mic size={14} />}
                          {workflow.workflowType}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(workflow.status)}`}>
                          {getStatusIcon(workflow.status)}
                          {workflow.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          {workflow.inputFiles?.[0] && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(workflow.inputFiles[0].path, workflow.inputFiles[0].originalName || 'Input File')}
                              className={`${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 font-medium'}`}
                              title="Download Input File"
                            >
                              <FileText size={16} className="mr-2" />
                            </Button>
                          )}

                          {workflow.status === "Completed" && workflow.outputFiles?.[0] && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload(workflow.outputFiles[0].path, workflow.outputFiles[0].originalName || 'Output File')}
                                className={`${theme === 'dark' ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold'}`}
                                title="Download Output File"
                              >
                                <Download size={16} className="mr-2" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEmail(workflow)}
                                className={`${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10' : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold'}`}
                                title="Email Output"
                              >
                                <Mail size={16} className="mr-2" />
                              </Button>

                              {workflow.workflowType === 'Xactimate' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate('/workflow/xactimate', { state: { workflowId: workflow._id, editMode: true } })}
                                  className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                                  title="Edit Schedule"
                                >
                                  <Edit2 size={16} className="mr-2" />
                                </Button>
                              )}
                            </>
                          )}
                          {workflow.workflowType === 'Xactimate' && ['Pending', 'Processing', 'Waiting for Selection', 'Waiting for Schedule'].includes(workflow.status) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate('/workflow/xactimate', { state: { workflowId: workflow._id } })}
                              className={`${theme === 'dark' ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-bold'}`}
                              title="Resume Workflow"
                            >
                              <PlayCircle size={16} className="mr-2" /> Resume
                            </Button>
                          )}

                          {/* Voice Transcription: Full action set */}
                          {workflow.isVoiceSession && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Download session data as JSON
                                  const data = workflow.voiceData;
                                  if (!data) return;
                                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `${workflow.projectName || 'field-notes'}_report.json`;
                                  a.click();
                                  URL.revokeObjectURL(url);
                                  toast({ title: "Download started", description: "Field notes report downloading." });
                                }}
                                className="text-gray-400 hover:text-white hover:bg-white/10"
                                title="Download Report"
                              >
                                <Download size={16} className="mr-1" />
                              </Button>

                              {workflow.status === "Completed" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenEmail(workflow)}
                                  className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                                  title="Email Report"
                                >
                                  <Mail size={16} className="mr-1" />
                                </Button>
                              )}

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setVoiceDetailWorkflow(workflow);
                                  setIsVoiceDetailOpen(true);
                                }}
                                className={`${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10' : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold'}`}
                                title="View Field Notes Details"
                              >
                                <FileText size={16} className="mr-1" /> View
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )))
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-border p-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
        <DialogContent className="bg-background border-border text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Report</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Send the newly generated {emailWorkflow?.workflowType === "Material Extraction" ? "Selection List" : "Contract"} to recipients.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Inputs removed as requested */}

            <div className="space-y-2">
              <Label htmlFor="emails" className="text-muted-foreground">Recipient Emails (comma separated)</Label>
              <Input
                id="emails"
                placeholder="client@example.com, pm@example.com"
                value={emailForm.emails}
                onChange={(e) => setEmailForm({ ...emailForm, emails: e.target.value })}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEmailOpen(false)} className="text-muted-foreground hover:bg-accent">
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              disabled={isSending}
            >
              {isSending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Voice Transcription Detail Modal */}
      <VoiceTranscriptionDetailModal
        open={isVoiceDetailOpen}
        onOpenChange={setIsVoiceDetailOpen}
        workflow={voiceDetailWorkflow}
      />
    </DashboardLayout >
  );
};

export default WorkflowHistory;
