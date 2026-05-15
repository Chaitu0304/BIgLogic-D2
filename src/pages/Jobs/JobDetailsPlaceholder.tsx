import { Routes, Route, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/ThemeProvider";

import DatesTab from "./tabs/DatesTab";
import DocumentsTab from "./tabs/DocumentsTab";
import FinancialsTab from "./tabs/FinancialsTab";
import QuickBooksJobTab from "./tabs/QuickBooksJobTab";
import ParticipantsTab from "./tabs/ParticipantsTab";
import NotesTab from "./tabs/NotesTab";
import PhotosTab from "./tabs/PhotosTab";
import EstimatesTab from "./tabs/EstimatesTab";
import DashboardLayout from "@/components/DashboardLayout";
import JobLayout from "@/layouts/JobLayout";

const JobOverview = () => {
    const { theme } = useTheme();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className={`border-0 ring-1 rounded-3xl overflow-hidden shadow-xl ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/5' : 'bg-white ring-slate-100 shadow-slate-200/50'
                }`}>
                <CardContent className="pt-8 px-8 pb-10 text-center">
                    <div className={`h-16 w-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-50 text-indigo-600 shadow-sm'}`}>
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Quick Actions</h3>
                    <p className={`text-sm font-medium leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                        Select a tab to manage job documentation, communication, and financials.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

const JobDetailsPlaceholder = () => {
    return (
        <DashboardLayout>
            <JobLayout>
                <Routes>
                    <Route index element={<Navigate to="dates" replace />} />
                    <Route path="dates" element={<DatesTab />} />
                    <Route path="documents" element={<DocumentsTab />} />
                    <Route path="estimates" element={<EstimatesTab />} />
                    <Route path="notes" element={<NotesTab />} />
                    <Route path="photos" element={<PhotosTab />} />
                    <Route path="accounting" element={<FinancialsTab />} />
                    <Route path="quickbooks" element={<QuickBooksJobTab />} />
                    <Route path="participants" element={<ParticipantsTab />} />
                </Routes>
            </JobLayout>
        </DashboardLayout>

    );
};

export default JobDetailsPlaceholder;
