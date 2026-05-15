import { Button } from "@/components/ui/button";
import { ArrowRight, Check, PlayCircle, Zap, Users, ShieldCheck, Clock, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";

export const Hero = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background pt-20 pb-10">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-br from-indigo-500/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gradient-to-tr from-purple-500/10 to-transparent blur-3xl rounded-full" />
        
        {/* Subtle Grid / Lines */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${theme === 'dark' ? 'white' : 'black'} 1px, transparent 0)`, backgroundSize: '40px 40px' }} 
        />
        
        {/* Animated Line Effect */}
        <svg className="absolute top-1/4 right-0 w-full h-full opacity-20" viewBox="0 0 1000 1000" fill="none">
          <motion.path 
            d="M1000 100 C 800 150, 600 50, 400 200 S 200 350, 0 300" 
            stroke="url(#gradient-line)" 
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container relative z-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          
          {/* Left Column: Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start text-left max-w-2xl"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white dark:bg-indigo-900/50 shadow-sm border border-indigo-100 dark:border-indigo-800">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-100">AI-Powered Construction Intelligence</span>
              </div>
              <span className="text-xs font-medium text-indigo-600/80 dark:text-indigo-400/80 px-2">v1.0 Live</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05] text-foreground">
              From Xactimate <br />
              to Execution. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                In Seconds.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Turn messy insurance data into structured workflows, material insights, and ready-to-use documents.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
              <Button 
                onClick={() => navigate("/login")} 
                size="lg" 
                className="h-14 px-8 text-base rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-bold"
              >
                <Zap className="mr-2 w-5 h-5 fill-current" />
                Start Free Automation
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-base rounded-2xl border-2 border-border bg-background/50 backdrop-blur-sm hover:bg-accent transition-all group"
              >
                <PlayCircle className="mr-2 w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                See How It Works
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                "No setup required",
                "99% accuracy",
                "Used by contractors & adjusters"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 transition-colors group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800">
                    <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{feature}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="relative lg:h-[600px] flex items-center justify-center lg:justify-end"
          >
            {/* Background Glow for Image */}
            <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] rounded-full scale-110 pointer-events-none" />
            
            {/* The Image Wrapper */}
            <div className="relative z-10 w-full max-w-[650px] group">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* Visual accent lines around image */}
                <div className="absolute -top-10 -right-10 w-40 h-40 border-t-2 border-r-2 border-indigo-500/20 rounded-tr-[40px] pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 border-b-2 border-l-2 border-indigo-500/20 rounded-bl-[40px] pointer-events-none" />
                
                <img 
                  src="/hero-img.png" 
                  alt="BigLogic AI Dashboard" 
                  className="w-full h-auto drop-shadow-[0_20px_50px_rgba(79,70,229,0.2)] rounded-3xl border border-white/10"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 lg:mt-0 p-8 rounded-[2.5rem] bg-card/30 backdrop-blur-md border border-border/50 shadow-2xl shadow-indigo-500/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 items-center">
            
            {/* Trusted By */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Trusted by modern teams</span>
              <div className="flex -space-x-3 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover"
                    src={`https://i.pravatar.cc/100?u=user${i}`}
                    alt={`Team member ${i}`}
                  />
                ))}
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white text-xs font-bold ring-2 ring-background">
                  +850
                </div>
              </div>
              <span className="text-xs font-semibold text-foreground">Contractors & Adjusters</span>
            </div>

            {/* Stat 1 */}
            <div className="flex items-center gap-4 lg:justify-center border-l-0 lg:border-l border-border/50 pl-0 lg:pl-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">850+</div>
                <div className="text-xs text-muted-foreground font-medium">Active Teams</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-4 lg:justify-center lg:border-l border-border/50 lg:pl-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">1M+</div>
                <div className="text-xs text-muted-foreground font-medium">Estimates Processed</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-4 lg:justify-center lg:border-l border-border/50 lg:pl-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">60 Sec</div>
                <div className="text-xs text-muted-foreground font-medium">Avg. Processing Time</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-4 lg:justify-center lg:border-l border-border/50 lg:pl-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">99.8%</div>
                <div className="text-xs text-muted-foreground font-medium">Extraction Accuracy</div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />
    </section>
  );
};
