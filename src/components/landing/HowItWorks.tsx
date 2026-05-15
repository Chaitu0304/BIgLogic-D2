import React, { useRef } from 'react';
import { Search, Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from "../ThemeProvider";

const StepCard = ({ step, title, description, icon, index }: { step: string, title: string, description: string, icon: React.ReactElement, index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
      className="relative flex flex-col items-center text-center group"
    >
      {/* Step Number with Indigo Ring */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-card/80 border-2 border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.15)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground group-hover:text-white group-hover:bg-none transition-colors">{step}</div>
        </div>
        {/* Icon */}
        <div className="absolute -top-2 -right-2 bg-indigo-500 p-2 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
          {React.cloneElement(icon, { className: "w-5 h-5 text-white" })}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-indigo-400 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed max-w-sm">
        {description}
      </p>
    </motion.div>
  );
};

export const HowItWorks = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const steps = [
    {
      step: "1",
      title: "Connect Xactimate",
      description: "Securely link your Xactimate instance or upload ESX files directly to our encrypted platform.",
      icon: <Search className="w-6 h-6" />
    },
    {
      step: "2",
      title: "AI Analysis",
      description: "Our Gemini-powered agents parse line items, pricing, and materials in real-time.",
      icon: <CheckCircle2 className="w-6 h-6" />
    },
    {
      step: "3",
      title: "Instant Output",
      description: "Receive audit-ready draw schedules and material lists formatted for your specific workflow.",
      icon: <Clock className="w-6 h-6" />
    }
  ];

  return (
    <section id='how-it-works' className="relative py-24 bg-background text-foreground overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/40 to-background z-10" />
        <img
          src='/ai-core.png' // Utilizing the generated asset as ambient background if appropriate or keeping it cleaner
          alt='ambient-bg'
          className="w-full h-full object-cover opacity-5 blur-3xl scale-125"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 mb-6 backdrop-blur-sm">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Efficiency Redefined</span>
          </div> */}
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Intelligent Automation
          </h2>
          <p className="text-xl md:text-2xl font-light text-muted-foreground mb-6">
            From Upload to Actionable Data in <span className={`${theme === "dark" ? "text-indigo-400" : "text-indigo-600"} font-bold`}>Seconds</span>
          </p>
          <p className={`text-lg leading-relaxed max-w-2xl mx-auto ${theme === "dark" ? "text-white/80" : "text-gray-600"}`}>
            Bypass the manual data entry bottleneck. Our AI handles the heavy lifting so your team can focus on adjusting and building.
          </p>
        </motion.div>

        {/* Steps Section - Desktop */}
        <div className="hidden lg:block relative max-w-6xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute top-10 left-[16%] w-[68%] h-0.5 bg-border/50">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 origin-left"
            />
          </div>

          <div className="grid grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <StepCard {...step} index={index} />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Steps Section - Mobile */}
        <div className="lg:hidden space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex items-start space-x-6 group"
            >
              {/* Step Number */}
              <div className="flex-shrink-0 relative">
                <div className="w-16 h-16 rounded-full bg-card border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                  <div className="text-foreground text-xl font-bold">{step.step}</div>
                </div>
                {/* Icon */}
                <div className="absolute -top-2 -right-2 bg-indigo-500 p-1.5 rounded-lg shadow-md">
                  {React.cloneElement(step.icon, { className: "w-4 h-4 text-white" })}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-24"
        >
          <button
            onClick={() => navigate("/login")}
            className="group relative px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(var(--primary),0.3)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Automating Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-primary/10 bg-opacity-0 group-hover:bg-opacity-100 transition-opacity duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
