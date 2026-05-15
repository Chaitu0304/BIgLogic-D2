import { Shield, Lock, FileKey, Server, Check, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../ThemeProvider";

const SecurityFeature = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => {
  const { theme } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent/50 transition-colors duration-300 group"
    >
      <div className={`shrink-0 p-3 rounded-lg ${theme === "dark" ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-indigo-100 border-indigo-200 text-indigo-600"} border`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-indigo-400 transition-colors">{title}</h3>
        <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-muted-foreground" : "text-gray-600"}`}>{description}</p>
      </div>
    </motion.div>
  );
};

export const TrustSecurity = () => {
  const { theme } = useTheme();
  const features = [
    {
      icon: Shield,
      title: "SOC 2 Type II Ready",
      description: "Our infrastructure aligns with stringent controls ensuring data availability and confidentiality."
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "Data is encrypted at rest (AES-256) and in transit (TLS 1.3) to prevent unauthorized access."
    },
    {
      icon: FileKey,
      title: "Private Workspaces",
      description: "Customer data is logically isolated. Your estimates and schedules are never used to train global models."
    },
    {
      icon: Server,
      title: "Enterprise Compliance",
      description: "Built to meet the rigorous security standards of major insurance carriers and financial institutions."
    }
  ];

  return (
    <section id="security" className="py-24 bg-background relative overflow-hidden border-t border-border">
      {/* Ambient Bacgkround */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Column: Text & Features */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                <Lock className="w-3 h-3" />
                <span>Bank-Grade Security</span>
              </div> */}
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Your Data, <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme === "dark" ? "from-indigo-400 to-emerald-400" : "from-indigo-700 to-emerald-600"}`}>Uncompromised.</span>
              </h2>
              <p className={`text-xl leading-relaxed ${theme === "dark" ? "text-muted-foreground" : "text-gray-600"}`}>
                We prioritize security as much as speed. Operate with confidence knowing your sensitive claims data is protected by enterprise-grade defenses.
              </p>
            </motion.div>

            <div className="grid gap-2">
              {features.map((feature, idx) => (
                <SecurityFeature key={idx} {...feature} delay={idx * 0.15 + 0.3} />
              ))}
            </div>
          </div>

          {/* Right Column: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full" />
            <div className={`relative rounded-3xl overflow-hidden border border-border bg-card/50 backdrop-blur-xl shadow-2xl`}>
              {/* Mock UI for Security Dashboard */}
              <div className="p-6 border-b border-border flex items-center justify-between bg-accent/20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className={`text-xs font-mono ${theme === "dark" ? "text-muted-foreground" : "text-gray-500"}`}>SECURE_CONNECTION_ESTABLISHED</div>
              </div>
              <div className="p-8 space-y-6">
                <div className={`flex items-center justify-between p-4 rounded-xl ${theme === "dark" ? "bg-muted/40" : "bg-white"} border border-border shadow-sm`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}>
                      <Check className="w-5 h-5" />
                    </div>
                    <div className="text-sm">
                      <div className="text-foreground font-semibold">Encryption Active</div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider font-mono">AES-256-GCM</div>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl ${theme === "dark" ? "bg-muted/40" : "bg-white"} border border-border shadow-sm`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}>
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="text-sm">
                      <div className="text-foreground font-semibold">Access Control</div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider font-mono">RBAC_ENFORCED</div>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                    <span>Core System Integrity</span>
                    <span className={`${theme === "dark" ? "text-emerald-400" : "text-emerald-600"} font-bold`}>100% Secure</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border">
                    <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-500 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
