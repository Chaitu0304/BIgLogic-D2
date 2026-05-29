import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import WorkflowHistory from "./pages/WorkflowHistory";
import Billing from "./pages/Billing";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import XactimateWorkflow from "./pages/XactimateWorkflow";
import MaterialExtractionWorkflow from "./pages/MaterialExtractionWorkflow";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import WorkflowExecutionHistory from "./pages/admin/WorkflowExecutionHistory";
import BotManagement from "./pages/admin/BotManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import AdminManagement from "./pages/admin/AdminManagement";
import CompanyManagement from "./pages/admin/CompanyManagement";
import VoiceTranscriptionWorkflow from "./pages/VoiceTranscriptionWorkflow";
import FieldNotesDashboard from "./pages/FieldNotesDashboard";
import EstimateToExcelWorkflow from "./pages/EstimateToExcelWorkflow";
import TeamManagement from "./pages/dashboard/TeamManagement";
import CompanyAnalytics from "./pages/dashboard/CompanyAnalytics";
import EstimateTraining from "./pages/EstimateTraining";
import CreateJob from "./pages/Jobs/CreateJob";
import JobDetailsPlaceholder from "./pages/Jobs/JobDetailsPlaceholder";
import ContactsPage from "./pages/Jobs/ContactsPage";
import JobDashboard from "./pages/Jobs/JobDashboard";
import JobListView from "./pages/Jobs/JobListView";
import JobQuickBooks from "./pages/Jobs/JobQuickBooks";
import JobReports from "./pages/Jobs/JobReports";
import DatabaseLayout from "./components/layouts/DatabaseLayout";
import { Outlet } from "react-router-dom";
import ReportsPage from "./pages/Reports/ReportsPage";
import CompanyBrain from "./pages/CompanyBrain";
import SharedBrainChat from "./pages/SharedBrainChat";
import AccountingHub from "./pages/Accounting/AccountingHub";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";

import ProtectedRoute from "./components/ProtectedRoute";
import PrivateRoute from "./components/PrivateRoute";
import { SaaSHeroMockup } from "./pages/SaaSHeroMockup";
import PermissionRoute from "./components/PermissionRoute";
import { ThemeProvider } from "./components/ThemeProvider";
import DatesTab from "./pages/Jobs/tabs/DatesTab";
import DocumentsTab from "./pages/Jobs/tabs/DocumentsTab";
import EstimatesTab from "./pages/Jobs/tabs/EstimatesTab";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/recreate-hero" element={<SaaSHeroMockup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/signup" element={<AdminSignup />} />

                        {/* User Protected Routes */}
                        <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/history" element={<WorkflowHistory />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/billing" element={<Billing />} />
                            <Route path="/team" element={<TeamManagement />} />
                            <Route path="/company-analytics" element={<CompanyAnalytics />} />

                            {/* Workflows */}
                            <Route path="/workflow/xactimate" element={<XactimateWorkflow />} />
                            <Route path="/workflow/material-extraction" element={<MaterialExtractionWorkflow />} />
                            <Route path="/workflow/voice-transcription" element={<VoiceTranscriptionWorkflow />} />
                            <Route path="/workflow/estimate-to-excel" element={<EstimateToExcelWorkflow />} />

                            {/* Field Notes Admin Dashboard */}
                            <Route element={<PermissionRoute requiredPermission="fieldNotes" />}>
                                <Route path="/fieldnotes" element={<FieldNotesDashboard />} />
                            </Route>

                            {/* Job Management (Isolated Module) */}
                            <Route element={<PermissionRoute requiredPermission="activeJobs" />}>
                                <Route path="/jobs" element={<Navigate to="/jobs/dashboard" replace />} />
                                <Route path="/jobs/dashboard" element={<JobDashboard />} />
                                <Route path="/jobs/list" element={<JobListView />} />
                                <Route path="/jobs/contacts" element={<ContactsPage />} />
                                <Route path="/jobs/quickbooks" element={<JobQuickBooks />} />
                                <Route path="/jobs/reports" element={<JobReports />} />
                                <Route path="/jobs/new" element={<CreateJob />} />

                                <Route path="/jobs/list/:id/*" element={<JobDetailsPlaceholder />} />

                            </Route>

                            <Route path="/reports" element={<ReportsPage />} />

                            <Route element={<PermissionRoute requiredPermission="estimateTraining" />}>
                                <Route path="/estimate-training" element={<EstimateTraining />} />
                            </Route>

                            {/* Company Brain */}
                            <Route element={<PermissionRoute requiredPermission="companyBrain" />}>
                                <Route path="/company-brain" element={<CompanyBrain />} />
                            </Route>

                            <Route path="/accounting" element={<AccountingHub />} />
                        </Route>

                        {/* Public Shared Routes */}
                        <Route path="/share/brain/:token" element={<SharedBrainChat />} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<Navigate to="/admin/login" />} />
                        <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/companies" element={<CompanyManagement />} />
                            <Route path="/admin/users" element={<UserManagement />} />
                            <Route path="/admin/workflow-history" element={<WorkflowExecutionHistory />} />
                            <Route path="/admin/bots" element={<BotManagement />} />
                            <Route path="/admin/settings" element={<SystemSettings />} />
                            <Route path="/admin/admins" element={<AdminManagement />} />
                        </Route>

                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export default App;
