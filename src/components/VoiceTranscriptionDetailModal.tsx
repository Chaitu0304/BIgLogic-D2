import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    FileText, ListTodo, MessageSquare, CheckCircle, Clock, User,
    AlertTriangle, HelpCircle, ArrowRightLeft, ChevronDown, ChevronUp
} from "lucide-react";

interface VoiceTranscriptionDetailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workflow: any;
}

type TabKey = "summary" | "actions" | "transcript";

const PRIORITY_COLORS: Record<string, string> = {
    high: "text-red-400 bg-red-500/10 border-red-500/20",
    medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    low: "text-gray-400 bg-gray-500/10 border-gray-500/20",
};

const STATUS_COLORS: Record<string, string> = {
    done: "text-emerald-400 bg-emerald-500/10",
    completed: "text-emerald-400 bg-emerald-500/10",
    in_progress: "text-amber-400 bg-amber-500/10",
    open: "text-blue-400 bg-blue-500/10",
    blocked: "text-red-400 bg-red-500/10",
};

const VoiceTranscriptionDetailModal = ({
    open,
    onOpenChange,
    workflow,
}: VoiceTranscriptionDetailModalProps) => {
    const [activeTab, setActiveTab] = useState<TabKey>("summary");
    const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
    const voiceData = workflow?.voiceData;

    if (!voiceData) return null;

    const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
        { key: "summary", label: "Summary", icon: <FileText size={16} /> },
        { key: "actions", label: "Action Items", icon: <ListTodo size={16} /> },
        { key: "transcript", label: "Transcript", icon: <MessageSquare size={16} /> },
    ];

    // Parse summary into bullet points
    const summaryBullets = (() => {
        const raw = voiceData.summary;
        if (!raw) return [];
        if (typeof raw === "string") {
            // Split by newlines, filter empty
            return raw.split("\n").map((s: string) => s.replace(/^[\-\u2022\*]\s*/, "").trim()).filter(Boolean);
        }
        if (Array.isArray(raw)) return raw.map((b: any) => typeof b === "string" ? b : b.text);
        return [];
    })();

    // Quality data - check multiple paths
    const quality = voiceData.quality || voiceData.qualityScoring || null;
    const qualityMetrics = quality ? [
        { label: "Transcription", value: quality.transcriptionConfidence ?? quality.overallAccuracy ?? null, color: "text-emerald-400" },
        { label: "Speaker ID", value: quality.speakerRecognitionConfidence ?? quality.speakerIdentification ?? null, color: "text-indigo-400" },
        { label: "Actions", value: quality.actionExtractionConfidence ?? quality.actionItemExtraction ?? null, color: "text-purple-400" },
    ].filter(m => m.value != null) : [];

    // Issues, Questions, Change Orders
    const issues = voiceData.issues || [];
    const questions = voiceData.questions || [];
    const changeOrders = voiceData.changeOrders || [];

    const toggleTask = (idx: number) => {
        setExpandedTasks(prev => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            return next;
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-3xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                            <FileText size={20} />
                        </div>
                        <div>
                            <span className="text-lg font-bold">{workflow.projectName}</span>
                            <p className="text-xs text-gray-500 font-normal mt-0.5">
                                {voiceData.meetingType} • {new Date(workflow.startedAt).toLocaleDateString()} • {voiceData.participants?.length || 0} participants
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {/* Tab Navigation */}
                <div className="flex gap-1 bg-white/5 rounded-xl p-1 mt-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab.key
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-4" style={{ maxHeight: '60vh' }}>
                    {/* ═══════════ Summary Tab ═══════════ */}
                    {activeTab === "summary" && (
                        <div className="space-y-4">
                            {/* Executive Summary — bullet points */}
                            {summaryBullets.length > 0 ? (
                                <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl">
                                    <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-3">
                                        Executive Summary
                                    </h3>
                                    <ul className="space-y-2">
                                        {summaryBullets.map((bullet: string, i: number) => (
                                            <li key={i} className="flex gap-2.5 items-start text-sm text-gray-300 leading-relaxed">
                                                <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="text-center py-12 opacity-50">
                                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                                    <p className="text-gray-500">No summary available yet</p>
                                    <p className="text-gray-600 text-xs mt-1">Summary will appear once processing is complete</p>
                                </div>
                            )}

                            {/* Issues */}
                            {issues.length > 0 && (
                                <div className="bg-amber-500/5 border border-amber-500/15 p-4 rounded-2xl">
                                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <AlertTriangle size={14} />
                                        Issues ({issues.length})
                                    </h4>
                                    <ul className="space-y-2">
                                        {issues.map((issue: any, i: number) => (
                                            <li key={i} className="flex gap-2.5 items-start text-sm text-gray-300">
                                                <span className="text-amber-400 mt-0.5 shrink-0">⚠</span>
                                                <span>{typeof issue === 'string' ? issue : issue.text || issue.title || JSON.stringify(issue)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Questions */}
                            {questions.length > 0 && (
                                <div className="bg-blue-500/5 border border-blue-500/15 p-4 rounded-2xl">
                                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <HelpCircle size={14} />
                                        Questions ({questions.length})
                                    </h4>
                                    <ul className="space-y-2">
                                        {questions.map((q: any, i: number) => (
                                            <li key={i} className="flex gap-2.5 items-start text-sm text-gray-300">
                                                <span className="text-blue-400 mt-0.5 shrink-0">?</span>
                                                <span>{typeof q === 'string' ? q : q.text || q.question || JSON.stringify(q)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Change Orders */}
                            {changeOrders.length > 0 && (
                                <div className="bg-purple-500/5 border border-purple-500/15 p-4 rounded-2xl">
                                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <ArrowRightLeft size={14} />
                                        Change Orders ({changeOrders.length})
                                    </h4>
                                    <ul className="space-y-2">
                                        {changeOrders.map((co: any, i: number) => (
                                            <li key={i} className="flex gap-2.5 items-start text-sm text-gray-300">
                                                <span className="text-purple-400 mt-0.5 shrink-0">↔</span>
                                                <span>{typeof co === 'string' ? co : co.text || co.description || JSON.stringify(co)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Participants */}
                            {voiceData.participants?.length > 0 && (
                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Participants</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {voiceData.participants.map((p: any, i: number) => (
                                            <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                                                <User size={14} className="text-indigo-400" />
                                                <span className="text-sm text-white font-medium">{p.name}</span>
                                                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">{p.role}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quality Metrics */}
                            {qualityMetrics.length > 0 && (
                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quality Metrics</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {qualityMetrics.map((m, i) => (
                                            <div key={i} className="text-center">
                                                <div className={`text-2xl font-bold ${m.color}`}>
                                                    {typeof m.value === 'number' && m.value <= 1
                                                        ? `${Math.round(m.value * 100)}%`
                                                        : typeof m.value === 'number'
                                                        ? `${Math.round(m.value)}%`
                                                        : m.value}
                                                </div>
                                                <p className="text-xs text-gray-500">{m.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══════════ Action Items Tab ═══════════ */}
                    {activeTab === "actions" && (
                        <div className="space-y-3">
                            {voiceData.actionItems?.all?.length > 0 ? (
                                voiceData.actionItems.all.map((item: any, idx: number) => {
                                    const isExpanded = expandedTasks.has(idx);
                                    const safeStatus = (item.status || "open").toLowerCase();
                                    const safePriority = (item.priority || "medium").toLowerCase();
                                    const statusClass = STATUS_COLORS[safeStatus] || STATUS_COLORS.open;
                                    const priorityClass = PRIORITY_COLORS[safePriority] || PRIORITY_COLORS.medium;

                                    return (
                                        <div key={idx}
                                            className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden hover:bg-white/[0.05] transition-colors"
                                        >
                                            {/* Task header — always visible */}
                                            <button
                                                onClick={() => toggleTask(idx)}
                                                className="w-full flex items-center gap-3 p-3.5 text-left"
                                            >
                                                <CheckCircle className={`w-5 h-5 shrink-0 ${
                                                    safeStatus === 'done' || safeStatus === 'completed'
                                                        ? 'text-emerald-500' : 'text-gray-500'
                                                }`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium text-gray-200 ${
                                                        safeStatus === 'done' ? 'line-through opacity-60' : ''
                                                    }`}>
                                                        {item.title}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold border ${priorityClass}`}>
                                                        {safePriority}
                                                    </span>
                                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${statusClass}`}>
                                                        {safeStatus.replace(/_/g, " ")}
                                                    </span>
                                                    {isExpanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
                                                </div>
                                            </button>

                                            {/* Expanded details */}
                                            {isExpanded && (
                                                <div className="px-4 pb-4 pt-0 border-t border-white/5 space-y-2">
                                                    {item.description && (
                                                        <p className="text-xs text-gray-400 leading-relaxed mt-2">{item.description}</p>
                                                    )}
                                                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                                        {item.assignee && (
                                                            <span className="flex items-center gap-1">
                                                                <User size={11} /> {item.assignee}
                                                            </span>
                                                        )}
                                                        {item.confidence != null && (
                                                            <span className={`px-2 py-0.5 rounded-full ${
                                                                item.confidence >= 0.8 ? 'bg-emerald-500/10 text-emerald-400' :
                                                                item.confidence >= 0.5 ? 'bg-amber-500/10 text-amber-400' :
                                                                'bg-red-500/10 text-red-400'
                                                            }`}>
                                                                {Math.round((item.confidence || 0) * 100)}% confidence
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 opacity-50">
                                    <ListTodo className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                                    <p className="text-gray-500">No action items available</p>
                                    <p className="text-gray-600 text-xs mt-1">Action items will appear once processing is complete</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══════════ Transcript Tab ═══════════ */}
                    {activeTab === "transcript" && (
                        <div className="space-y-3">
                            {voiceData.segments?.length > 0 ? (
                                voiceData.segments.map((seg: any, i: number) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                                            i % 2 === 0 ? "bg-indigo-600 text-white" : "bg-purple-600 text-white"
                                        }`}>
                                            {(seg.speaker || "?").charAt(0).toUpperCase()}
                                        </div>
                                        <div className={`flex-1 rounded-2xl p-3 text-sm ${
                                            i % 2 === 0 ? "bg-white/5 rounded-tl-none" : "bg-indigo-500/10 rounded-tl-none"
                                        }`}>
                                            <p className="font-medium text-xs text-gray-500 mb-1">
                                                {seg.speaker || seg.speakerName || "Unknown"}
                                                {seg.startTime != null && ` • ${Math.floor(seg.startTime / 60)}:${String(Math.floor(seg.startTime % 60)).padStart(2, '0')}`}
                                            </p>
                                            <p className="text-gray-200">{seg.text}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 opacity-50">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                                    <p className="text-gray-500">No transcript available</p>
                                    <p className="text-gray-600 text-xs mt-1">Transcript will appear once processing is complete</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VoiceTranscriptionDetailModal;
