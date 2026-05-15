import DashboardLayout from "@/components/DashboardLayout";
import CompanyAnalyticsPanel from "@/components/CompanyAnalyticsPanel";
import { motion } from "framer-motion";

/**
 * Standalone /company-analytics route.
 * Re-uses the same CompanyAnalyticsPanel that is embedded in the Dashboard.
 */
const CompanyAnalytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Productivity Analytics
          </h1>
          <p className="text-gray-400">
            Configure role rates and track your company's AI-driven productivity metrics.
          </p>
        </motion.div>

        <CompanyAnalyticsPanel />
      </div>
    </DashboardLayout>
  );
};

export default CompanyAnalytics;
