import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareQuote } from 'lucide-react';
import { useTheme } from "../ThemeProvider";
// Testimonials Column Component
const TestimonialsColumn = ({ testimonials, duration = 15, className = "" }: { testimonials: any[], duration?: number, className?: string }) => {
    return (
        <div className={className}>
            <motion.div
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6"
            >
                {[...new Array(2)].fill(0).map((_, index) => (
                    <React.Fragment key={index}>
                        {testimonials.map(({ text, image, name, role }, i) => (
                            <div
                                className="p-6 sm:p-7 md:p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-lg max-w-[280px] sm:max-w-xs w-full hover:bg-card transition-all duration-300 hover:border-indigo-500/30 group"
                                key={i}
                            >
                                <div className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">{text}</div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img
                                            width={40}
                                            height={40}
                                            src={image}
                                            alt={name}
                                            className="h-10 w-10 rounded-full border border-indigo-500/30 object-cover  transition-all"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center border border-background">
                                            <MessageSquareQuote className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="font-bold tracking-tight leading-5 text-foreground">{name}</div>
                                        <div className="leading-5 text-indigo-400 tracking-tight text-xs font-medium">{role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    );
};

const testimonials = [
    {
        text: "The material extraction accuracy is unmatched. We cut our supplement preparation time by 70% in the first week.",
        image: "https://randomuser.me/api/portraits/women/32.jpg",
        name: "Sarah Mitchell",
        role: "Ops Director, Apex Restoration",
    },
    {
        text: "Finally, an AI that understands Xactimate logic. The draw schedules are audit-proof right out of the box.",
        image: "https://randomuser.me/api/portraits/men/45.jpg",
        name: "Michael Rodriguez",
        role: "Senior Adjuster, Nexus Claims",
    },
    {
        text: "BigLogic's ability to find hidden line items saved us thousands on a single large loss commercial project.",
        image: "https://randomuser.me/api/portraits/women/67.jpg",
        name: "Emma Thompson",
        role: "Estimator, BuildRight Construction",
    },
    {
        text: "We integrated their API into our CRM, and the automated status updates have completely transformed our client communication.",
        image: "https://randomuser.me/api/portraits/men/23.jpg",
        name: "David Chen",
        role: "CTO, Rebuild Pro",
    },
    {
        text: "The peace of mind knowing every draw schedule complies with carrier guidelines is worth every penny.",
        image: "https://randomuser.me/api/portraits/women/54.jpg",
        name: "Lisa Johnson",
        role: "Finance Manager, Elite Roofing",
    },
    {
        text: "I was skeptical about AI in estimating, but the precision here is scary good. It catches things even my senior estimators miss.",
        image: "https://randomuser.me/api/portraits/men/41.jpg",
        name: "Marcus Thorne",
        role: "Owner, Thorne General Contracting",
    },
    {
        text: "Implementation was seamless. We were generating schedules within minutes of connecting our Xactimate account.",
        image: "https://randomuser.me/api/portraits/men/38.jpg",
        name: "James Wilson",
        role: "Project Manager, Swift Restore",
    },
    {
        text: "The clean data export feature allowed us to finally visualize our estimating KPIs in PowerBI. A game changer.",
        image: "https://randomuser.me/api/portraits/women/29.jpg",
        name: "Amanda Foster",
        role: "Analytics Lead, ClaimFlow",
    },
    {
        text: "Professional reports that look like they took hours to format, generated in seconds. My lenders love them.",
        image: "https://randomuser.me/api/portraits/men/52.jpg",
        name: "Ryan Park",
        role: "CFO, Structure Builders",
    },
];


const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const Testimonials = () => {

    const { theme } = useTheme();
    return (
        <section id="testimonials" className="bg-background py-24 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.08),transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.05),transparent_70%)]"></div>

            <div className="container z-10 mx-auto px-4 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-16"
                >
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 ${theme === "dark" ? "text-indigo-400" : "text-indigo-800"} text-sm font-medium mb-6`}>
                        <MessageSquareQuote className="w-4 h-4" />
                        <span>Trusted by Industry Leaders</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center text-foreground">
                        Don't Just Take <br />
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme === "dark" ? "from-indigo-400 to-purple-400" : "from-indigo-800 to-purple-800"}`}>
                            Our Word For It
                        </span>
                    </h2>
                    <p className="text-center mt-6 text-foreground text-lg leading-relaxed">
                        Join hundreds of restoration companies streamlining their workflows with BigLogic.ai.
                    </p>
                </motion.div>

                <div className="flex justify-center gap-4 sm:gap-6 mt-8 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[600px] overflow-hidden">
                    <TestimonialsColumn testimonials={firstColumn} duration={25} />
                    <TestimonialsColumn testimonials={secondColumn} duration={35} className="hidden sm:block" />
                    <TestimonialsColumn testimonials={thirdColumn} duration={30} />
                </div>
            </div>
        </section>
    );
};
