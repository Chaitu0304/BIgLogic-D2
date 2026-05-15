import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, CheckCircle, Zap, Shield, Loader2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { billingService, authService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";

const Billing = () => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [userPlan, setUserPlan] = useState<string>("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("inactive");

  const PLANS = {
    monthly: {
      id: 'price_1QibVjSCkBLz5081N4e4rPzD', // Replace with LIVE Price ID
      name: 'Pro Monthly',
      amount: 199
    },
    annual: {
      id: 'price_1QibWPSCkBLz5081yiKyT7wd', // Replace with LIVE Price ID
      name: 'Pro Annual',
      amount: 1999
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch User Data for Plan
      const userRes = await authService.getMe();
      setUserPlan(userRes.data.plan || 'free');
      setSubscriptionStatus(userRes.data.subscriptionStatus || 'inactive');

      // Fetch Invoices
      const invoiceRes = await billingService.getInvoices();
      setInvoices(invoiceRes.data);
    } catch (error) {
      console.error("Failed to fetch billing data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planKey: 'monthly' | 'annual') => {
    setActionLoading(true);
    try {
      const plan = PLANS[planKey];
      const res = await billingService.createCheckoutSession(plan.id, plan.name);
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Subscribe Error", error);
      toast({ title: "Error", description: "Failed to start checkout", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePortal = async () => {
    setActionLoading(true);
    try {
      const res = await billingService.createPortalSession();
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Portal Error", error);
      toast({ title: "Error", description: "Failed to open billing portal", variant: "destructive" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadInvoice = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your plan, payment methods, and billing history.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className={theme === 'dark'
              ? "p-8 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm relative overflow-hidden"
              : "p-8 rounded-3xl border border-gray-200 bg-white/60 shadow-sm backdrop-blur-sm relative overflow-hidden"}>
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />

              <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 relative z-10">
                <div>
                  <div className={theme === 'dark'
                    ? "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4 border border-primary/20"
                    : "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mb-4 border border-indigo-100"}>
                    <Zap size={theme === 'dark' ? 14 : 12} className="fill-current" />
                    <span>Current Plan</span>
                  </div>
                  <h2 className={theme === 'dark'
                    ? "text-3xl font-bold text-foreground mb-2 uppercase"
                    : "text-3xl font-bold text-slate-900 mb-2 tracking-tight uppercase"}>
                    {userPlan.replace('_', ' ')}
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    {userPlan === 'free'
                      ? "Access basic features. Upgrade for unlimited processing."
                      : "Perfect for independent adjusters and small contracting firms."}
                  </p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className={theme === 'dark'
                      ? `px-2 py-1 rounded text-xs font-bold uppercase ${subscriptionStatus === 'active' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`
                      : `px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${subscriptionStatus === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-muted text-muted-foreground'}`}>
                      {subscriptionStatus}
                    </span>
                  </div>
                </div>
                <div className={theme === 'dark' ? "flex flex-col gap-3 min-w-[200px]" : "flex flex-col gap-3 min-w-[220px]"}>
                  {userPlan === 'free' ? (
                    <>
                      <Button
                        onClick={() => handleSubscribe('monthly')}
                        disabled={actionLoading}
                        className={theme === 'dark'
                          ? "w-full bg-primary text-primary-foreground hover:bg-primary/90"
                          : "w-full h-11 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 font-semibold"}
                      >
                        {actionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Subscribe Monthly ($199)"}
                      </Button>
                      <Button
                        onClick={() => handleSubscribe('annual')}
                        disabled={actionLoading}
                        variant="outline"
                        className={theme === 'dark'
                          ? "w-full border-primary/50 text-foreground"
                          : "w-full h-11 rounded-xl border-gray-200 text-slate-600 hover:bg-gray-50 transition-all font-semibold"}
                      >
                        {actionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Subscribe Annual ($1999)"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handlePortal}
                      disabled={actionLoading}
                      className={theme === 'dark'
                        ? "w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        : "w-full h-11 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 font-semibold"}
                    >
                      {actionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Manage Subscription"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-border">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Unlimited Estimate Extractions</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Priority Support</span>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className={theme === 'dark'
                ? "p-6 border-b border-border flex justify-between items-center"
                : "p-6 border-b border-gray-100 flex justify-between items-center"}>
                <h3 className={theme === 'dark'
                  ? "text-lg font-bold text-foreground"
                  : "text-lg font-semibold text-slate-900"}>Billing History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted/50 text-xs text-muted-foreground uppercase font-medium">
                    <tr>
                      <th className="p-4 pl-6">Invoice ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right pr-6">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">Loading history...</td>
                      </tr>
                    ) : invoices.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">No billing history found</td>
                      </tr>
                    ) : (
                      invoices.map((inv) => (
                        <tr key={inv._id} className="hover:bg-accent transition-colors">
                          <td className="p-4 pl-6 font-medium text-foreground text-xs font-mono">{inv.stripeInvoiceId.slice(-8)}</td>
                          <td className="p-4 text-muted-foreground text-sm">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                          <td className="p-4 text-foreground font-medium">${inv.amount}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-destructive border-destructive/20'
                              }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-4 text-right pr-6">
                            {inv.s3Url && (
                              <button
                                onClick={() => handleDownloadInvoice(inv.s3Url)}
                                className="p-2 text-primary hover:text-primary/80 transition-colors"
                                title="Download Invoice"
                              >
                                <Download size={18} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Sidebar / Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            <div className={theme === 'dark'
              ? "p-6 rounded-3xl border border-border bg-card/50 backdrop-blur-sm"
              : "p-6 rounded-3xl border border-gray-200 bg-white shadow-sm"}>
              <h3 className={theme === 'dark'
                ? "text-lg font-bold text-foreground mb-6"
                : "text-lg font-semibold text-slate-900 mb-6"}>Payment Security</h3>
              <div className={theme === 'dark'
                ? "p-6 rounded-xl bg-gradient-to-br from-muted/50 to-background border border-border mb-6 text-center"
                : "p-6 rounded-2xl bg-gray-50 border border-gray-100 mb-6 text-center"}>
                <Shield className={theme === 'dark' ? "text-emerald-400 mx-auto mb-3" : "text-indigo-600 mx-auto mb-3"} size={theme === 'dark' ? 48 : 40} />
                <h4 className={theme === 'dark' ? "text-foreground font-medium mb-2" : "text-slate-900 font-semibold mb-2"}>Encrypted & Secure</h4>
                <p className={theme === 'dark'
                  ? "text-sm text-muted-foreground"
                  : "text-xs text-slate-500 leading-relaxed"}>
                  All transactions are processed securely via Stripe. We do not store your card information.
                </p>
              </div>
              <Button
                onClick={handlePortal}
                className={theme === 'dark'
                  ? "w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  : "w-full h-11 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 font-semibold"}
              >
                {theme === 'dark' ? <ExternalLink size={16} className="mr-2" /> : <ExternalLink size={16} className="mr-2" />}
                External Billing Portal
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
