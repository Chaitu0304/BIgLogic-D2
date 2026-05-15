import { Building2, HardHat, Calculator, Briefcase, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../ThemeProvider";
import { useNavigate } from "react-router-dom";


const ProfessionalCard = ({ label, icon: Icon, description, delay }: { label: string, icon: any, description: string, delay: number }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="group relative p-8 rounded-3xl bg-card/50 border border-border hover:border-indigo-500/50 hover:bg-card transition-all duration-300 overflow-hidden"
    >
      {/* Hover Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme === "dark" ? "from-indigo-500/20 to-purple-500/20" : "from-indigo-100 to-purple-100"} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-border group-hover:ring-indigo-500/50`}>
          <Icon className={`w-8 h-8 ${theme === "dark" ? "text-white group-hover:text-indigo-400" : "text-indigo-600 group-hover:text-indigo-700"} transition-colors`} />
        </div>

        <h3 className="text-xl font-bold text-foreground mb-3">{label}</h3>
        <p className={`text-sm leading-relaxed mb-6 ${theme === "dark" ? "text-muted-foreground" : "text-gray-600 font-medium"}`}>
          {description}
        </p>

        <div onClick={() => navigate("/dashboard")} className={`cursor-pointer flex items-center ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"} text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>
          Get Started <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </motion.div>
  )
};

export const WhoItsFor = () => {
  const { theme } = useTheme();
  const professionals = [
    {
      icon: HardHat,
      label: "Restoration Contractors",
      description: "Automate Xactimate workflows to focus on rebuilding, not paperwork."
    },
    {
      icon: Building2,
      label: "Construction Firms",
      description: "Scale your estimating capacity without adding administrative overhead."
    },
    {
      icon: Calculator,
      label: "Insurance Estimators",
      description: "Ensure carrier-grade accuracy and compliance in every line item."
    },
    {
      icon: Briefcase,
      label: "Operations Teams",
      description: "Streamline project management with audit-ready data at your fingertips."
    }
  ];

  return (
    <section id="who-its-for" className="py-32 bg-background relative overflow-hidden">
      {/* Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${theme === "dark" ? "bg-indigo-900/20" : "bg-indigo-500/10"} blur-[120px] rounded-full`} />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
          >
            Built For <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme === "dark" ? "from-indigo-400 to-purple-400" : "from-indigo-800 to-purple-800"}`}>Industry Leaders</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-foreground max-w-2xl mx-auto"
          >
            Empowering every stakeholder in the restoration ecosystem with diverse intelligence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {professionals.map((prof, idx) => (
            <ProfessionalCard
              key={idx}
              {...prof}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
