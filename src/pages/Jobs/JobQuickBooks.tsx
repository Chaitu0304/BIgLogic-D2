import DashboardLayout from "@/components/DashboardLayout";
import AccountingHubView from "../Accounting/AccountingHubView";

const JobQuickBooks = () => {
    return (
        <DashboardLayout>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <AccountingHubView hideHeader={true} />
            </div>
        </DashboardLayout>
    );
};

export default JobQuickBooks;
