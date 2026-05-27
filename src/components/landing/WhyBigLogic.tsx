import { useState, useEffect } from "react";
import { 
  BarChart2, 
  HelpCircle, 
  Cpu, 
  Play, 
  ShieldCheck, 
  AlertCircle, 
  UploadCloud, 
  RefreshCw, 
  CheckCircle2, 
  FileText, 
  DollarSign, 
  Clock, 
  Check, 
  Database,
  Building,
  TrendingUp,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "parser" | "auditor" | "pipeline";

export const WhyBigLogic = () => {
  const [activeTab, setActiveTab] = useState<TabType>("parser");
  
  // Interactive tab state for Tab 2 (Compliance auditor)
  const [auditState, setAuditState] = useState<"warning" | "repairing" | "repaired">("warning");
  
  // Progress indicators for Tab 1 (Parser)
  const [parseProgress, setParseProgress] = useState(0);
  const [isParsing, setIsParsing] = useState(true);

  // Trigger parsing progress loop when parser tab is viewed
  useEffect(() => {
    if (activeTab === "parser") {
      setParseProgress(0);
      setIsParsing(true);
      const interval = setInterval(() => {
        setParseProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsParsing(false);
            return 100;
          }
          return prev + 4;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleAutoRepair = () => {
    if (auditState === "warning") {
      setAuditState("repairing");
      setTimeout(() => {
        setAuditState("repaired");
      }, 1500);
    }
  };

  const resetAudit = () => {
    setAuditState("warning");
  };

  return (
    <section id="why-us" className="py-24 bg-[#FCFBFE] bg-grid-landeros border-b border-[#311081]/5 font-sans-landeros text-[#1C1629] relative overflow-hidden">
      {/* Background soft gradients */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-[#6D28D9]/4 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-gradient-to-tr from-[#4F46E5]/3 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl text-left mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F1FC] border border-[#311081]/10 text-xs font-bold text-[#311081] tracking-wide mb-6">
            <Cpu className="w-4 h-4 text-[#6D28D9]" />
            <span>INTERACTIVE PRODUCT WALKTHROUGH</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#311081]">
            Inside the Engine Room. <br />
            Our Autonomous Control Center.
          </h2>
          <p className="text-lg md:text-xl font-semibold text-[#3C354D] max-w-2xl leading-relaxed">
            Stop relying on slow manual copy-paste estimators. Explore how our advanced agent dashboard ingests estimate files, audits insurer guidelines, and accelerates draw schedules in real-time.
          </p>
        </div>

        {/* Tab Selection Capsule - Framer styled */}
        <div className="flex justify-center mb-10 relative z-20">
          <div className="bg-[#F6F1FC] p-1.5 rounded-full border border-[#311081]/10 flex flex-wrap items-center gap-1 shadow-inner max-w-full">
            <button
              onClick={() => setActiveTab("parser")}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold font-tech-landeros uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === "parser"
                  ? "bg-[#311081] text-white shadow-md"
                  : "text-[#311081]/60 hover:text-[#311081]"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>1. Ingestion Parser</span>
            </button>
            <button
              onClick={() => setActiveTab("auditor")}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold font-tech-landeros uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === "auditor"
                  ? "bg-[#311081] text-white shadow-md"
                  : "text-[#311081]/60 hover:text-[#311081]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>2. Guideline Auditor</span>
            </button>
            <button
              onClick={() => setActiveTab("pipeline")}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold font-tech-landeros uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === "pipeline"
                  ? "bg-[#311081] text-white shadow-md"
                  : "text-[#311081]/60 hover:text-[#311081]"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>3. Draw Coordinator</span>
            </button>
          </div>
        </div>

        {/* Premium Dashboard UI Frame Mockup */}
        <div className="w-full max-w-5xl mx-auto border border-[#311081]/12 bg-white rounded-3xl shadow-landeros-lg hover:shadow-[0_25px_60px_rgba(109,40,217,0.12)] hover:border-[#6D28D9]/25 transition-all duration-500 overflow-hidden relative z-10">
          
          {/* macOS Title Bar */}
          <div className="bg-[#FCFBFE] border-b border-[#311081]/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400 block" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 block" />
              <span className="w-3 h-3 rounded-full bg-green-400 block" />
              <span className="text-[11px] font-bold font-tech-landeros text-[#311081]/40 tracking-wider uppercase ml-4">
                BIGLOGIC OPERATOR CONTROL BOARD // V2.4
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse" />
              <span className="text-[10px] font-extrabold font-tech-landeros text-emerald-600 tracking-wider uppercase">
                AI ENGINE ACTIVE
              </span>
            </div>
          </div>

          {/* Inner Layout Split (Sidebar + Dashboard Area) */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
            
            {/* Left Mock Sidebar Pane */}
            <div className="md:col-span-3 bg-[#FCFBFE] border-r border-[#311081]/5 p-5 flex flex-col justify-between hidden md:flex">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black font-tech-landeros text-[#311081]/30 tracking-widest uppercase mb-3">WORKSPACE</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#311081]/6 shadow-sm text-xs font-bold text-[#311081]">
                      <Building className="w-4 h-4 text-[#6D28D9]" />
                      <span className="truncate">HQ Reconstruction</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black font-tech-landeros text-[#311081]/30 tracking-widest uppercase mb-3">COGNITIVE MODULES</p>
                  <ul className="space-y-2 text-xs font-bold">
                    <li>
                      <button 
                        onClick={() => setActiveTab("parser")}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                          activeTab === "parser" 
                            ? "bg-[#311081]/5 text-[#311081] border-l-4 border-[#6D28D9]" 
                            : "text-[#645D75] hover:text-[#311081] hover:bg-[#F6F1FC]/50"
                        }`}
                      >
                        <UploadCloud className="w-4 h-4 text-[#6D28D9]" />
                        <span>Estimate Parser</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setActiveTab("auditor")}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                          activeTab === "auditor" 
                            ? "bg-[#311081]/5 text-[#311081] border-l-4 border-[#6D28D9]" 
                            : "text-[#645D75] hover:text-[#311081] hover:bg-[#F6F1FC]/50"
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-[#6D28D9]" />
                        <span>Carrier Auditor</span>
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => setActiveTab("pipeline")}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
                          activeTab === "pipeline" 
                            ? "bg-[#311081]/5 text-[#311081] border-l-4 border-[#6D28D9]" 
                            : "text-[#645D75] hover:text-[#311081] hover:bg-[#F6F1FC]/50"
                        }`}
                      >
                        <BarChart2 className="w-4 h-4 text-[#6D28D9]" />
                        <span>Draw Release Map</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom statistics panel */}
              <div className="bg-[#F6F1FC] border border-[#311081]/8 p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black text-[#311081]/60 tracking-wider uppercase font-tech-landeros">SAVINGS MONTHLY</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <p className="text-xl font-black text-[#311081] font-display-landeros">$5,820</p>
                <p className="text-[9px] font-semibold text-[#645D75] mt-1 leading-tight">Calculated based on 45 files ingested.</p>
              </div>
            </div>

            {/* Right Display Area */}
            <div className="md:col-span-9 p-6 md:p-8 flex flex-col justify-between h-full bg-white relative">
              <AnimatePresence mode="wait">
                
                {/* 1. PARSER TAB */}
                {activeTab === "parser" && (
                  <motion.div
                    key="parser"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 text-left w-full"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#311081]/5 pb-4">
                      <div>
                        <h4 className="text-lg font-black text-[#311081] font-tech-landeros uppercase tracking-tight">AI Ingestion Engine</h4>
                        <p className="text-xs font-semibold text-[#645D75] mt-0.5">Ingests ESX & PDF files, automatically matching item quantities and overhead codes.</p>
                      </div>
                      
                      <div className="bg-[#F6F1FC] border border-[#6D28D9]/15 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#6D28D9]" />
                        <span className="text-[11px] font-bold text-[#311081] font-tech-landeros tracking-wider uppercase">Residential_Water_Mitigation_402.pdf</span>
                      </div>
                    </div>

                    {/* Live Processing Simulation */}
                    <div className="bg-[#FCFBFE] border border-[#311081]/6 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="font-extrabold text-[#311081] flex items-center gap-2">
                          {isParsing ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 text-[#6D28D9] animate-spin" />
                              Parsing and grouping material lists...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              Extraction successfully compiled!
                            </>
                          )}
                        </span>
                        <span className="font-mono font-bold text-[#6D28D9]">{parseProgress}%</span>
                      </div>
                      <div className="w-full bg-[#F6F1FC] h-3.5 rounded-full overflow-hidden border border-[#311081]/5">
                        <div 
                          className="bg-gradient-to-r from-[#311081] to-[#6D28D9] h-full transition-all duration-100 ease-out shadow-[0_0_10px_rgba(109,40,217,0.3)]"
                          style={{ width: `${parseProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Extracted Data Rows Table mockup */}
                    <div className="border border-[#311081]/8 rounded-2xl overflow-hidden shadow-sm bg-white">
                      <div className="grid grid-cols-12 bg-[#311081] text-white text-[10px] font-black tracking-wider uppercase font-tech-landeros p-3 text-left">
                        <div className="col-span-5">MATERIAL CODE / DESCRIPTION</div>
                        <div className="col-span-2 text-center">QTY</div>
                        <div className="col-span-2 text-right">UNIT PRICE</div>
                        <div className="col-span-3 text-right">TOTAL COMPREHENSIVE</div>
                      </div>
                      
                      <div className="divide-y divide-[#311081]/5 font-sans-landeros text-xs font-semibold">
                        <div className={`grid grid-cols-12 p-3 text-left transition-colors duration-500 ${parseProgress >= 25 ? "bg-[#311081]/[0.01]" : "opacity-25"}`}>
                          <div className="col-span-5 text-[#311081] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>WTRDRY++ // Air Mover Ingress (Mitigation)</span>
                          </div>
                          <div className="col-span-2 text-center text-[#645D75]">24 Unit Days</div>
                          <div className="col-span-2 text-right text-[#645D75]">$32.50</div>
                          <div className="col-span-3 text-right font-bold text-[#311081]">$780.00</div>
                        </div>

                        <div className={`grid grid-cols-12 p-3 text-left transition-colors duration-500 ${parseProgress >= 50 ? "bg-[#311081]/[0.01]" : "opacity-25"}`}>
                          <div className="col-span-5 text-[#311081] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>DRYLF-20 // Drywall Tear-Out (Debris Remov)</span>
                          </div>
                          <div className="col-span-2 text-center text-[#645D75]">480 Sq Ft</div>
                          <div className="col-span-2 text-right text-[#645D75]">$2.75</div>
                          <div className="col-span-3 text-right font-bold text-[#311081]">$1,320.00</div>
                        </div>

                        <div className={`grid grid-cols-12 p-3 text-left transition-colors duration-500 ${parseProgress >= 75 ? "bg-[#311081]/[0.01]" : "opacity-25"}`}>
                          <div className="col-span-5 text-[#311081] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>DRYLF+FND // Drywall Hanging & Re-Texturing</span>
                          </div>
                          <div className="col-span-2 text-center text-[#645D75]">480 Sq Ft</div>
                          <div className="col-span-2 text-right text-[#645D75]">$6.20</div>
                          <div className="col-span-3 text-right font-bold text-[#311081]">$2,976.00</div>
                        </div>

                        <div className={`grid grid-cols-12 p-3 text-left transition-colors duration-500 ${parseProgress >= 95 ? "bg-[#311081]/[0.01]" : "opacity-25"}`}>
                          <div className="col-span-5 text-[#311081] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>PNT-EXTR // Anti-Microbial Sealant Spray</span>
                          </div>
                          <div className="col-span-2 text-center text-[#645D75]">950 Sq Ft</div>
                          <div className="col-span-2 text-right text-[#645D75]">$1.40</div>
                          <div className="col-span-3 text-right font-bold text-[#311081]">$1,330.00</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-4 text-xs">
                      <div className="flex gap-4">
                        <span className="text-[#645D75] font-semibold">TOTAL AUDITED ITEMS: <strong className="text-[#311081]">4/4 EXTRACTED</strong></span>
                        <span className="text-[#645D75] font-semibold">ACCURACY INDEX: <strong className="text-emerald-600">99.98%</strong></span>
                      </div>
                      <span className="text-[10px] font-bold bg-[#F6F1FC] border border-[#6D28D9]/10 px-3 py-1 rounded-full text-[#311081] uppercase tracking-wider font-tech-landeros shrink-0">
                        SAVED 3.2 ADMIN HOURS
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* 2. AUDITOR TAB */}
                {activeTab === "auditor" && (
                  <motion.div
                    key="auditor"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 text-left w-full"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#311081]/5 pb-4">
                      <div>
                        <h4 className="text-lg font-black text-[#311081] font-tech-landeros uppercase tracking-tight">Carrier Guideline Audit Engine</h4>
                        <p className="text-xs font-semibold text-[#645D75] mt-0.5">Audits estimates against target insurer compliance rules to prevent review bottlenecks.</p>
                      </div>
                      
                      {auditState === "repaired" && (
                        <button 
                          onClick={resetAudit}
                          className="text-[10px] font-bold font-tech-landeros text-[#6D28D9] border border-[#6D28D9]/20 hover:bg-[#F6F1FC] px-3 py-1.5 rounded-full transition-colors uppercase shrink-0"
                        >
                          Reset Demo
                        </button>
                      )}
                    </div>

                    {/* Interactive Guidelines Alert */}
                    {auditState === "warning" && (
                      <div className="bg-[#FEF2F2] border border-red-200 text-red-800 rounded-2xl p-5 flex items-start gap-4">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <p className="text-xs font-black font-tech-landeros uppercase tracking-wider text-red-700">COMPLIANCE BOTTLENECK DETECTED // HIGH IMPACT</p>
                          <p className="text-xs font-bold leading-relaxed text-red-800">
                            The submitted estimate has State Farm selected as the carrier. Drywall re-hang items lack the mandatory <strong>"Overhead and Profit (O&P) Joint Clause"</strong>. This omission will trigger an automatic guidelines audit reject, delaying bank draw funding by <strong>15 to 25 days</strong>.
                          </p>
                          <div className="pt-2">
                            <button
                              onClick={handleAutoRepair}
                              className="px-4 py-2 bg-red-600 text-white rounded-full text-xs font-black uppercase tracking-wider font-tech-landeros hover:bg-red-700 active:scale-95 transition-all shadow-md flex items-center gap-2"
                            >
                              <Settings className="w-3.5 h-3.5 animate-pulse" />
                              AUTO-REPAIR COMPLIANCE ERROR NOW
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {auditState === "repairing" && (
                      <div className="bg-[#FFFBEB] border border-amber-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mb-4" />
                        <h5 className="font-tech-landeros text-sm font-black text-amber-800 uppercase tracking-tight mb-1">Applying Cognitive Resolution...</h5>
                        <p className="text-xs font-semibold text-amber-700 max-w-sm">AI agent is scanning historical court files, carrier legal structures, and injecting compliant joint billing clauses.</p>
                      </div>
                    )}

                    {auditState === "repaired" && (
                      <div className="bg-[#ECFDF5] border border-emerald-200 text-emerald-800 rounded-2xl p-5 flex items-start gap-4 transition-all duration-500 animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <p className="text-xs font-black font-tech-landeros uppercase tracking-wider text-emerald-700">GUIDELINES AUDIT COMPLIANT // 100% SUCCESS</p>
                          <p className="text-xs font-bold leading-relaxed text-emerald-800">
                            <strong>"State Farm O&P Sub-Contractor Rule Amendment Clause"</strong> successfully injected into Page 4 Drywall section. PDF recalculated and certified under company brain legal vault. Payout bottleneck cleared.
                          </p>
                          <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 mt-2 bg-emerald-100/50 px-3 py-1 rounded-full w-fit border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            BOTTLENECK PREVENTED: SAVED 18 DAYS OF PAYMENT DELAY
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Audit Checklist Status */}
                    <div className="border border-[#311081]/8 rounded-2xl p-5 bg-[#FCFBFE] space-y-4">
                      <p className="text-[10px] font-black text-[#311081]/40 tracking-wider uppercase font-tech-landeros">INSURER AUDIT CHECKSUMS</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#311081]/5 shadow-sm">
                          <span className="text-xs font-semibold text-[#3C354D]">State Farm Photo-Proof Guidelines</span>
                          <span className="bg-emerald-100 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 rounded-full text-[10px] font-black font-tech-landeros uppercase">
                            PASSED (14/14)
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#311081]/5 shadow-sm">
                          <span className="text-xs font-semibold text-[#3C354D]">Tear-out Mitigation Date Match</span>
                          <span className="bg-emerald-100 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 rounded-full text-[10px] font-black font-tech-landeros uppercase">
                            PASSED
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#311081]/5 shadow-sm">
                          <span className="text-xs font-semibold text-[#3C354D]">O&P 10/10 Segment Joint Clause</span>
                          {auditState === "repaired" ? (
                            <span className="bg-emerald-100 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 rounded-full text-[10px] font-black font-tech-landeros uppercase flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" /> REPAIRED
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-700 border border-red-200/50 px-2 py-0.5 rounded-full text-[10px] font-black font-tech-landeros uppercase">
                              REJECT RISK
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#311081]/5 shadow-sm">
                          <span className="text-xs font-semibold text-[#3C354D]">Carrier Debris Fee Allowance Cap</span>
                          <span className="bg-emerald-100 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 rounded-full text-[10px] font-black font-tech-landeros uppercase">
                            PASSED
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. PIPELINE TAB */}
                {activeTab === "pipeline" && (
                  <motion.div
                    key="pipeline"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 text-left w-full"
                  >
                    <div className="border-b border-[#311081]/5 pb-4">
                      <h4 className="text-lg font-black text-[#311081] font-tech-landeros uppercase tracking-tight">Bank Draw schedule Release Map</h4>
                      <p className="text-xs font-semibold text-[#645D75] mt-0.5">Integrates directly with escrow lenders and draw inspectors, releasing funds instantly upon AI verified step completion.</p>
                    </div>

                    {/* Milestones Horizontal Path */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                      
                      {/* Connection bar */}
                      <div className="absolute top-[26px] left-[50px] right-[50px] h-[3px] bg-gradient-to-r from-emerald-500 via-emerald-500 to-[#311081]/10 hidden md:block z-0" />
                      
                      {/* Node 1 */}
                      <div className="bg-white border border-emerald-300 rounded-2xl p-4 shadow-sm text-center relative z-10 flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs mb-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <h5 className="font-tech-landeros text-[11px] font-black text-[#311081] uppercase tracking-wider leading-none">MITIGATION APPROVED</h5>
                        <p className="text-xs font-bold text-emerald-600 mt-1">$14,500.00</p>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 font-tech-landeros">
                          RELEASED IN 24H
                        </span>
                      </div>

                      {/* Node 2 */}
                      <div className="bg-white border border-emerald-300 rounded-2xl p-4 shadow-sm text-center relative z-10 flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs mb-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <h5 className="font-tech-landeros text-[11px] font-black text-[#311081] uppercase tracking-wider leading-none">TEAR-OUT VERIFIED</h5>
                        <p className="text-xs font-bold text-emerald-600 mt-1">$28,000.00</p>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 font-tech-landeros">
                          RELEASED IN 48H
                        </span>
                      </div>

                      {/* Node 3 */}
                      <div className="bg-white border border-[#311081]/15 rounded-2xl p-4 shadow-sm text-center relative z-10 flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-[#6D28D9] text-white flex items-center justify-center font-bold text-xs mb-3 shadow-[0_0_15px_rgba(109,40,217,0.3)] animate-pulse">
                          <Clock className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <h5 className="font-tech-landeros text-[11px] font-black text-[#311081] uppercase tracking-wider leading-none">DRYWALL RE-HANG</h5>
                        <p className="text-xs font-bold text-[#6D28D9] mt-1">$35,200.00</p>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#6D28D9] bg-[#F6F1FC] px-2 py-0.5 rounded-full mt-2 font-tech-landeros animate-pulse">
                          AI AUDITED // PENDING
                        </span>
                      </div>

                      {/* Node 4 */}
                      <div className="bg-white border border-[#311081]/6 rounded-2xl p-4 shadow-sm text-center relative z-10 flex flex-col items-center opacity-70">
                        <div className="w-9 h-9 rounded-full bg-[#645D75]/10 text-[#645D75] flex items-center justify-center font-bold text-xs mb-3">
                          <Database className="w-4 h-4" />
                        </div>
                        <h5 className="font-tech-landeros text-[11px] font-black text-[#311081]/50 uppercase tracking-wider leading-none">FINAL PNT / PULL</h5>
                        <p className="text-xs font-bold text-[#645D75]/60 mt-1">$12,000.00</p>
                        <span className="text-[9px] font-semibold tracking-wider text-[#645D75] bg-gray-50 px-2 py-0.5 rounded-full mt-2">
                          SCHEDULED
                        </span>
                      </div>
                    </div>

                    {/* Comparison ROI stats */}
                    <div className="bg-[#FCFBFE] border border-[#311081]/8 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-2xl bg-[#F6F1FC] border border-[#6D28D9]/10 flex items-center justify-center text-[#6D28D9] shadow-inner">
                          <DollarSign className="w-6 h-6 text-[#6D28D9]" />
                        </div>
                        <div>
                          <p className="text-xs font-black font-tech-landeros text-[#311081] uppercase tracking-tight">Draw Release Acceleration Index</p>
                          <p className="text-[11px] font-semibold text-[#645D75] mt-0.5">Average payment release times comparing local administrative draws against AI automated coordinates.</p>
                        </div>
                      </div>

                      <div className="flex gap-8 w-full md:w-auto shrink-0 justify-between md:justify-end border-t md:border-t-0 border-[#311081]/5 pt-4 md:pt-0">
                        <div>
                          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest font-tech-landeros block">TRADITIONAL DRAW</span>
                          <span className="text-xl font-extrabold text-[#645D75] font-display-landeros">45 Days Average</span>
                        </div>
                        <div className="border-l border-[#311081]/10 pl-6">
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest font-tech-landeros block">BIGLOGICAI SYSTEM</span>
                          <span className="text-xl font-black text-[#311081] font-display-landeros flex items-center gap-1.5 text-[#311081]">
                            48 Hours <span className="text-xs text-emerald-500 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full tracking-normal uppercase shrink-0 font-sans-landeros">SAVED 43D</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

        </div>

        {/* Footnote information badge */}
        <div className="mt-8 max-w-5xl mx-auto flex items-center gap-3 text-xs font-semibold text-[#645D75] text-left">
          <HelpCircle className="w-4 h-4 text-[#6D28D9] shrink-0" />
          <p>
            This interactive control panel simulates a standard commercial restoration workspace running under active insurance compliance. Click on tabs above to view specific automated pipeline segments.
          </p>
        </div>

      </div>
    </section>
  );
};
