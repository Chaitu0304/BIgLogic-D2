import { useEffect, useRef } from "react";
import {
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Search,
  Database,
  Brain,
  Zap,
  Cpu,
  BarChart3
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../ThemeProvider";

gsap.registerPlugin(ScrollTrigger);

export const Services = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const leftFeaturesRef = useRef<HTMLDivElement>(null);
  const rightFeaturesRef = useRef<HTMLDivElement>(null);

  const features = {
    left: [
      {
        icon: Brain,
        title: "AI Draw Schedule Agent",
        description: "Automatically generates milestone-based draw schedules from Xactimate estimates in seconds, removing manual calculations and delays."
      },
      {
        icon: ShieldCheck,
        title: "Audit-Grade Accuracy",
        description: "Every output is validated through structured AI logic and deterministic checks, producing results that stand up to insurance carrier audits."
      },
      {
        icon: FileText,
        title: "Instant, Branded PDF Reports",
        description: "Generate professional, submission-ready PDF reports instantly—ready for lenders, carriers, and internal teams."
      }
    ],
    right: [
      {
        icon: Search,
        title: "Deep Material Extraction",
        description: "Identifies and extracts homeowner material-selection items hidden deep within Xactimate line items—without manual review."
      },
      {
        icon: Database,
        title: "Clean Data Export",
        description: "Converts unstructured estimate data into clean JSON and Excel formats, ready for ERPs, CRMs, and downstream systems."
      },
      {
        icon: CheckCircle2,
        title: "Carrier-Compliant Outputs",
        description: "All outputs follow major insurance carrier guidelines, ensuring compliance, consistency, and faster approvals."
      }
    ]
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Core Animation (Floating & Pulse)
      gsap.to(coreRef.current, {
        y: -15,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".core-glow", {
        scale: 1.15,
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Scroll Trigger Animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate Center First
      tl.from(coreRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.5)"
      });

      // Animate Left Features
      tl.from(leftFeaturesRef.current?.children || [], {
        x: -40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4");

      // Animate Right Features
      tl.from(rightFeaturesRef.current?.children || [], {
        x: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.6");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="services" className="relative py-24 bg-background overflow-hidden min-h-screen flex items-center">
      {/* Background Ambience */}
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${theme === "dark" ? "from-indigo-900/20" : "from-indigo-500/10"} via-background to-background`} />

      <div className="container relative mx-auto px-4 z-10">
        {/* Header */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6 backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">The Intelligence Layer for Restoration Workflows</span>
          </div> */}
          <h2 className={`text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${theme === "dark" ? "from-white via-white/90 to-white/60" : "from-gray-900 via-indigo-950 to-gray-800"} mb-6 tracking-tight`}>
            BigLogic.ai: <br className="hidden md:block" />
            Precision at Enterprise Scale
          </h2>
          <p className={`text-xl text-muted-foreground leading-relaxed ${theme === "dark" ? "text-white" : "text-black"}`}>
            BigLogic.ai uses Gemini-powered AI agents to process Xactimate documents with exceptional speed,
            accuracy, and consistency—built for real-world construction and insurance operations.
          </p>
        </div>

        {/* God Layout */}
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 items-center">

          {/* Left Features */}
          <div ref={leftFeaturesRef} className="space-y-16 lg:text-right">
            {features.left.map((feature, idx) => (
              <div key={idx} className="group relative">
                <div className="flex flex-col lg:flex-row-reverse items-center lg:items-start gap-5 mx-auto lg:mx-0 max-w-sm ml-auto">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-card/80 border border-border flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                      <feature.icon className="w-7 h-7 text-indigo-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-indigo-400 transition-colors duration-300">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors duration-300 font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Center Core */}
          <div className="relative flex flex-col justify-center items-center py-12 lg:py-0">
            <div ref={coreRef} className="relative w-full max-w-[500px] aspect-square flex items-center justify-center mb-8">
              {/* Glow Effect behind */}
              <div className="core-glow absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full" />

              {/* Image */}
              <img
                src="/ai-core.png"
                alt="Gemini AI Core"
                className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_50px_rgba(99,102,241,0.2)]"
              />

              {/* Orbiting Elements */}
              <div className="absolute inset-0 z-0 animate-[spin_15s_linear_infinite] opacity-40">
                <div className="absolute top-[10%] left-1/2 w-2 h-2 bg-indigo-400 rounded-full blur-[2px] shadow-[0_0_10px_rgba(99,102,241,1)]" />
                <div className="absolute bottom-[10%] right-1/2 w-3 h-3 bg-cyan-400 rounded-full blur-[2px] shadow-[0_0_10px_rgba(34,211,238,1)]" />
              </div>
            </div>

            {/* Core Label */}
            <div className="text-center relative z-10 max-w-xs mx-auto">
              <div className="inline-flex items-center gap-2 mb-3 text-foreground font-bold text-xl tracking-wide">
                <Cpu className="w-6 h-6 text-indigo-600 animate-pulse" />
                Gemini AI Core
              </div>
              <p className={`text-sm text-muted-foreground leading-relaxed border-t border-border pt-3 ${theme === "dark" ? "text-white" : "text-black"}`}>
                Powered by Google Gemini, our AI understands complex construction data, financial structures, and estimate logic with enterprise precision.
              </p>
            </div>
          </div>

          {/* Right Features */}
          <div ref={rightFeaturesRef} className="space-y-16 lg:text-left">
            {features.right.map((feature, idx) => (
              <div key={idx} className="group relative">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-5 mx-auto lg:mx-0 max-w-sm mr-auto">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-card/80 border border-border flex items-center justify-center group-hover:bg-cyan-600 group-hover:border-cyan-500 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_30px_rgba(8,145,178,0.4)]">
                      <feature.icon className="w-7 h-7 text-cyan-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-cyan-400 transition-colors duration-300">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors duration-300 font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom CTA / Status */}
        <div className="text-center mt-28 pt-12 border-t border-border">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-80">
            <span className={`flex items-center gap-2 ${theme === "dark" ? "text-emerald-400/90" : "text-emerald-600"} font-mono text-sm tracking-widest uppercase`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${theme === "dark" ? "bg-emerald-400" : "bg-emerald-500"} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${theme === "dark" ? "bg-emerald-500" : "bg-emerald-600"}`}></span>
              </span>
              System Online
            </span>
            <span className={`flex items-center gap-2 ${theme === "dark" ? "text-indigo-300/60" : "text-indigo-600"} font-mono text-sm tracking-widest uppercase`}>
              <ShieldCheck className="w-4 h-4" />
              Secure
            </span>
            <span className={`flex items-center gap-2 ${theme === "dark" ? "text-indigo-300/60" : "text-indigo-600"} font-mono text-sm tracking-widest uppercase`}>
              <CheckCircle2 className="w-4 h-4" />
              Production-Ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
