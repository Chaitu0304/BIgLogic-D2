import { ShieldCheck, Lock, FolderLock, Scale, ShieldAlert } from "lucide-react";

export const TrustSecurity = () => {
  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: "SOC 2 Type II Certified",
      desc: "Our internal data policies are verified and audited by top-tier compliance agencies to ensure total administrative and operational safety.",
      tag: "SOC2 COMPLIANT"
    },
    {
      icon: Lock,
      title: "AES-256 Encryption",
      desc: "All estimates, customer lists, and exported Excel files are encrypted in transit and at rest using bank-grade security protocols.",
      tag: "MILITARY GRADE"
    },
    {
      icon: FolderLock,
      title: "Isolated Tenant Workspaces",
      desc: "Your data stays yours. Your estimates are processed in sandboxed environments and are never used to train public models.",
      tag: "100% PRIVATE"
    },
    {
      icon: Scale,
      title: "Carrier Guideline Compliant",
      desc: "Every draw schedule is formatted according to standard guidelines of top U.S. insurance carriers and lender bank structures.",
      tag: "INSURER AUDITED"
    }
  ];

  return (
    <section id="security" className="py-24 bg-[#FCFBFE] bg-grid-landeros border-b border-[#311081]/5 font-sans-landeros text-[#1C1629] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-gradient-to-tr from-[#6D28D9]/3 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl text-left mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F1FC] border border-[#311081]/10 text-xs font-bold text-[#311081] tracking-wide mb-6">
            <ShieldAlert className="w-4 h-4 text-[#6D28D9]" />
            <span>ENTERPRISE LIABILITY SAFEGUARDS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#311081]">
            Bank-Grade Security. <br />
            Built For Enterprise Restoration.
          </h2>
          <p className="text-lg md:text-xl font-medium text-[#645D75] max-w-2xl leading-relaxed">
            Estimates represent sensitive project capital and customer information. We maintain ironclad systems to ensure complete compliance and security.
          </p>
        </div>

        {/* Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {securityFeatures.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={index} 
                className="bg-white border border-[#311081]/8 p-6 shadow-landeros rounded-3xl flex flex-col justify-between hover:border-[#6D28D9]/25 hover:shadow-landeros-lg transition-all duration-300 group"
              >
                <div>
                  {/* Icon Block */}
                  <div className="w-12 h-12 rounded-2xl bg-[#F6F1FC] border border-[#311081]/5 flex items-center justify-center mb-6 text-[#6D28D9] group-hover:bg-[#311081] group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  {/* Title */}
                  <h3 className="font-tech-landeros text-lg font-bold text-[#311081] mb-3">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="font-medium text-xs leading-relaxed text-[#645D75] mb-6">
                    {feat.desc}
                  </p>
                </div>

                {/* Security Tag */}
                <div className="mt-auto border-t border-[#311081]/5 pt-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#F6F1FC] border border-[#311081]/10 text-[9px] font-bold tracking-wider text-[#311081] font-tech-landeros">
                    {feat.tag}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

