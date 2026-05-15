import ReportsTab from "./tabs/ReportsTab";
import DashboardLayout from "@/components/DashboardLayout";

const JobReports = () => {
    return (
        <DashboardLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ReportsTab />
            </div>
        </DashboardLayout>
    );
};

export default JobReports;
