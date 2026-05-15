import { Check, Shield, Zap, BarChart3, Lock, ZapOff, Sparkles, TrendingUp } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { motion } from "framer-motion";

export const WhyBigLogic = () => {
  const { theme } = useTheme();
  
  const reasons = [
    {
      title: "Accuracy-First AI",
      description: "Models trained specifically on Xactimate and industry-standard documents.",
      icon: Sparkles,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    },
    {
      title: "End-to-End Automation",
      description: "Complete workflow automation, from initial upload to final branded reports.",
      icon: Zap,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Enterprise Security",
      description: "Bank-grade data encryption and security standards built-in by default.",
      icon: Shield,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Transparent Logic",
      description: "Complete audit logs for every AI action—know exactly how your data is processed.",
      icon: BarChart3,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Unlimited Scalability",
      description: "AI services that adapt and scale effortlessly with your project volume.",
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    }
  ];

  return (
    <section id="why-us" className="py-32 bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${theme === "dark" ? "bg-indigo-900/10" : "bg-indigo-500/5"} blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3`} />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-8 tracking-tight ${theme === "dark" ? "text-white" : "text-black text-center lg:text-left"}`}>
              Why Choose <br />
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${theme === "dark" ? "from-indigo-400 to-purple-400" : "from-indigo-600 to-purple-600"}`}>
                BigLogic.ai?
              </span>
            </h2>
            <p className={`text-xl leading-relaxed mb-10 ${theme === "dark" ? "text-muted-foreground" : "text-gray-600 text-center lg:text-left"}`}>
              We don't just wrap simple LLMs. We build specialized, logic-driven agents that deeply understand the nuances of construction estimating and insurance mitigation workflows.
            </p>
            
            <div className="hidden lg:block">
               <div className={`p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-md relative overflow-hidden group`}>
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="relative z-10">
                    <div className="text-sm font-bold uppercase tracking-widest text-indigo-500 mb-4">Core Philosophy</div>
                    <div className={`text-lg italic ${theme === "dark" ? "text-white/90" : "text-gray-900"}`}>
                      "Precision isn't an option in restoration—it's the standard. We built BigLogic to mirror the expert logic of the field."
                    </div>
                 </div>
               </div>
            </div>
          </motion.div>

          <div className="grid gap-6">
            {reasons.map((reason, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ x: 10 }}
                className={`p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm shadow-xl shadow-black/5 hover:border-indigo-500/30 hover:bg-card transition-all duration-300 flex items-start gap-6 group`}
              >
                <div className={`w-14 h-14 rounded-xl ${reason.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 ring-1 ring-border mt-1`}>
                  <reason.icon className={`w-7 h-7 ${reason.color}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900 font-bold"}`}>{reason.title}</h3>
                  <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-muted-foreground" : "text-gray-600"}`}>
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
