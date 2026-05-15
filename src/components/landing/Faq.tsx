import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, FileText, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeProvider';

const Faq = () => {
    const { theme } = useTheme();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "What makes BigLogic different from standard Xactimate macros?",
            answer: "BigLogic uses intelligent context-aware agents, not rigid macros. It understands the nuances of the estimate, local building codes, and carrier guidelines to generate project-specific schedules and extractions that macros simply can't match."
        },
        {
            question: "Is my data secure?",
            answer: "Absolutely. We are SOC 2 Type II ready with end-to-end encryption. Your estimate data is processed in isolated workspaces and never used to train our public models without explicit consent."
        },
        {
            question: "How long does it take to process an estimate?",
            answer: "Most estimates are processed in under 30 seconds. Large commercial losses with thousands of line items may take up to 2 minutes—still 95% faster than manual review."
        },
        {
            question: "Can I customize the draw schedule output?",
            answer: "Yes. You can define custom milestone percentages, retention rates, and grouping logic to match your specific lender requirements or internal cash flow models."
        },
        {
            question: "Do you support ESX files?",
            answer: "Yes, we support direct ESX upload as well as PDF integration. ESX files provide the highest accuracy for data extraction."
        },
        {
            question: "What carriers are supported?",
            answer: "Our engine is trained on guidelines from the top 10 major US carriers. We constantly update our rulesets to ensure your outputs remain compliant."
        }
    ];

    return (
        <section id="faq" className="py-24 bg-background text-foreground relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] ${theme === "dark" ? "bg-indigo-900/5" : "bg-indigo-500/5"} blur-[100px] rounded-full`} />
                <div className={`absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] ${theme === "dark" ? "bg-purple-900/5" : "bg-purple-500/5"} blur-[100px] rounded-full`} />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column - FAQ Content */}
                    <div className="space-y-8">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme === "dark" ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-indigo-100 border-indigo-200 text-indigo-600"} text-sm font-medium mb-6`}>
                                <HelpCircle className="w-4 h-4" />
                                <span>Support Center</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                                Frequently Asked <br />
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme === "dark" ? "from-indigo-400 to-purple-400" : "from-indigo-600 to-purple-600"}`}>Questions</span>
                            </h2>
                            <p className={`text-lg leading-relaxed max-w-lg ${theme === "dark" ? "text-muted-foreground" : "text-gray-600"}`}>
                                Everything you need to know about automating your pre-construction workflow.
                            </p>
                        </motion.div>

                        {/* FAQ Items */}
                        <div className="space-y-4">
                            {faqData.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group"
                                >
                                    <div
                                        onClick={() => toggleItem(index)}
                                        className={`bg-card/50 border ${openIndex === index ? 'border-indigo-500/50 bg-card' : 'border-border'} rounded-xl overflow-hidden transition-all duration-300 cursor-pointer hover:border-indigo-500/30`}
                                    >
                                        <div className="p-6 flex justify-between items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${openIndex === index ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                                                    <span className="text-sm font-bold">{index + 1}</span>
                                                </div>
                                                <h3 className={`font-semibold text-lg transition-colors duration-300 ${openIndex === index ? 'text-foreground' : theme === 'dark' ? 'text-muted-foreground group-hover:text-indigo-300' : 'text-gray-600 group-hover:text-indigo-600'}`}>
                                                    {item.question}
                                                </h3>
                                            </div>
                                            <div className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-indigo-400' : 'text-muted-foreground'}`}>
                                                <ChevronDown className="w-5 h-5" />
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {openIndex === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                >
                                                    <div className="px-6 pb-6 pl-[4.5rem] pr-8">
                                                        <p className="text-muted-foreground leading-relaxed border-t border-border pt-4">
                                                            {item.answer}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Visual/Stats */}
                    <div className="lg:pl-8 lg:sticky lg:top-32">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className={`relative rounded-3xl overflow-hidden shadow-2xl border ${theme === "dark" ? "border-white/10 bg-gray-900/50" : "border-indigo-100 bg-indigo-50/30"} backdrop-blur-sm`}
                        >
                            {/* Abstract Visual Placeholder since video might distract */}
                            <div className="aspect-[4/5] md:aspect-video lg:aspect-[4/5] relative overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${theme === "dark" ? "from-indigo-900 via-black to-purple-900" : "from-indigo-100 via-white to-purple-100"}`} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className={`w-64 h-64 ${theme === "dark" ? "bg-indigo-500/20" : "bg-indigo-300/30"} rounded-full blur-[80px] animate-pulse`} />
                                </div>

                                {/* Floating Cards Visual */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-center gap-6">
                                     <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="p-4 rounded-xl bg-card/80 border border-border backdrop-blur-md self-end w-3/4 shadow-xl"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400"><Shield className="w-4 h-4" /></div>
                                            <div className="text-xs font-mono text-emerald-400">AUDIT_PASSED</div>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full mb-2" />
                                        <div className="h-2 w-2/3 bg-muted rounded-full" />
                                    </motion.div>

                                     <motion.div
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                        className="p-4 rounded-xl bg-card/80 border border-border backdrop-blur-md self-start w-3/4 shadow-xl"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400"><FileText className="w-4 h-4" /></div>
                                            <div className="text-xs font-mono text-indigo-400">SCHEDULE_GENERATED</div>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full mb-2" />
                                        <div className="h-2 w-1/2 bg-muted rounded-full" />
                                    </motion.div>

                                     <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                        className="p-4 rounded-xl bg-card/80 border border-border backdrop-blur-md self-center w-3/4 shadow-xl"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400"><Zap className="w-4 h-4" /></div>
                                            <div className="text-xs font-mono text-purple-400">Speed: 45ms</div>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full mb-2" />
                                        <div className="h-2 w-3/4 bg-muted rounded-full" />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className={`text-center p-4 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-white border-indigo-100"} rounded-xl border backdrop-blur-sm shadow-sm`}>
                                <div className={`text-2xl font-bold ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>20k+</div>
                                <div className={`${theme === "dark" ? "text-gray-500" : "text-gray-500"} text-xs mt-1 font-medium`}>Estimates</div>
                            </div>
                            <div className={`text-center p-4 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-white border-indigo-100"} rounded-xl border backdrop-blur-sm shadow-sm`}>
                                <div className={`text-2xl font-bold ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>99.9%</div>
                                <div className={`${theme === "dark" ? "text-gray-500" : "text-gray-500"} text-xs mt-1 font-medium`}>Uptime</div>
                            </div>
                            <div className={`text-center p-4 ${theme === "dark" ? "bg-white/5 border-white/10" : "bg-white border-indigo-100"} rounded-xl border backdrop-blur-sm shadow-sm`}>
                                <div className={`text-2xl font-bold ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`}>24/7</div>
                                <div className={`${theme === "dark" ? "text-gray-500" : "text-gray-500"} text-xs mt-1 font-medium`}>Monitoring</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Faq;
