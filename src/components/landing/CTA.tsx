import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeProvider";

export const CTA = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  return (
    <section className="py-32 relative overflow-hidden bg-background flex items-center justify-center min-h-[60vh]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${theme === "dark" ? "from-indigo-900/10 via-background to-purple-900/10" : "from-indigo-100 via-white to-purple-100"}`} />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${theme === "dark" ? "bg-indigo-500/5" : "bg-indigo-300/10"} blur-[150px] rounded-full animate-pulse`} />
      </div>

      <div className="container relative z-10 px-4 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-12 rounded-3xl overflow-hidden border border-border bg-card/50 backdrop-blur-2xl shadow-2xl"
        >
          {/* Decorative Glows */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/30 blur-[50px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/30 blur-[50px] translate-x-1/2 translate-y-1/2" />

          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Join the Future of Restoration</span>
          </div> */}

          <h2 className={`text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight ${theme === "dark" ? "text-foreground" : "text-gray-900"}`}>
            Turn Complex Documents Into <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme === "dark" ? "from-indigo-400 to-purple-400" : "from-indigo-600 to-purple-600"}`}>Actionable Results</span>
          </h2>

          <p className={`text-xl mb-10 max-w-2xl mx-auto ${theme === "dark" ? "text-muted-foreground" : "text-gray-600"}`}>
            Stop wrestling with Xactimate data. Start automating your workflow with the only AI built specifically for the restoration industry.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate("/login")}
              size="lg" className="h-14 px-8 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/10">
              Start Using BigLogic.ai
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => navigate("/login")}
              size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-border text-foreground hover:bg-accent transition-all">
              Schedule a Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
