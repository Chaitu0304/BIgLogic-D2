import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic, Upload, ArrowLeft, CheckCircle, Square, Loader2,
    FileAudio, Users, FileText, ListTodo, Plus, Trash2,
    ChevronRight, AlertCircle, Clock, Play, FolderOpen,
    MessageSquare, Zap, Eye, RotateCcw, X
} from "lucide-react";
import { fieldNotesService } from "@/services/api";
import axios from "axios";

// ─── Types ───────────────────────────────────────────────────────────────────
type WizardStep = "project" | "meeting" | "capture" | "results";
type Mode = "voice_only" | "upload_audio" | "upload_transcript";
type ConsentMethod = "verbal" | "written" | "contract";

interface Participant { name: string; role: string; }

interface ProjectForm {
    name: string; jobId: string;
    mode: Mode; consentMethod: ConsentMethod; consentGiven: boolean;
}

interface SessionInfo { projectId: string; sessionId: string; }

const DEFAULT_MEETING_TYPES = ["Scope", "Schedule", "Material", "Vendor", "Internal"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

const StepIndicator = ({ step }: { step: WizardStep }) => {
    const steps = [
        { id: "project", n: 1, label: "Project" },
        { id: "meeting", n: 2, label: "Participants" },
        { id: "capture", n: 3, label: "Record/Upload" },
        { id: "results", n: 4, label: "Results" },
    ];
    const idx = steps.findIndex(s => s.id === step);
    return (
        <div className="flex items-center gap-2 py-6">
            {steps.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-colors ${i < idx ? "bg-emerald-500 text-white" : i === idx ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground"}`}>
                        {i < idx ? <CheckCircle size={18} /> : s.n}
                    </div>
                    <span className={`ml-2 text-sm font-medium hidden sm:block ${i === idx ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                    {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < idx ? "bg-emerald-500/50" : "bg-border"}`} />}
                </div>
            ))}
        </div>
    );
};

// ─── Step 1: Project Setup ────────────────────────────────────────────────────
const ProjectStep = ({ onNext }: { onNext: (form: ProjectForm) => void }) => {
    const [form, setForm] = useState<ProjectForm>({
        name: "", jobId: "",
        mode: "voice_only", consentMethod: "verbal", consentGiven: false,
    });

    const modes: { value: Mode; icon: any; title: string; desc: string }[] = [
        { value: "voice_only", icon: Mic, title: "Record Audio", desc: "Record live conversation with browser mic" },
        { value: "upload_audio", icon: FileAudio, title: "Upload Audio", desc: "Upload existing MP3, WAV, M4A file" },
        { value: "upload_transcript", icon: FileText, title: "Upload Transcript", desc: "Upload PDF, DOC, or TXT transcript" },
    ];

    const valid = form.name.trim() && form.jobId.trim() && form.consentGiven;

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-2">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <FolderOpen size={26} className="text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Create Project</h2>
                <p className="text-muted-foreground text-sm mt-1">Set up your field notes project</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-sm">Project Name <span className="text-red-500">*</span></Label>
                    <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Smith Property Walkthrough" className="bg-background border-border text-foreground placeholder:text-muted-foreground/50" />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-sm">Job ID <span className="text-red-500">*</span></Label>
                    <Input value={form.jobId} onChange={e => setForm(f => ({ ...f, jobId: e.target.value }))}
                        placeholder="e.g. JOB-2024-001" className="bg-background border-border text-foreground placeholder:text-muted-foreground/50" />
                </div>
            </div>

            {/* Mode selector */}
            <div>
                <Label className="text-muted-foreground text-sm mb-2 block">Recording Mode</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {modes.map(m => {
                        const Icon = m.icon;
                        const active = form.mode === m.value;
                        return (
                            <button key={m.value} onClick={() => setForm(f => ({ ...f, mode: m.value }))}
                                className={`p-4 rounded-xl border text-left transition-all ${active ? "border-primary bg-primary/10" : "border-border bg-card/50 hover:border-border/80"}`}>
                                <Icon size={20} className={active ? "text-primary mb-2" : "text-muted-foreground mb-2"} />
                                <p className={`text-sm font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{m.title}</p>
                                <p className="text-[11px] text-muted-foreground/70 mt-0.5">{m.desc}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Consent */}
            <div className="rounded-xl border border-border bg-card/50 p-4 space-y-3">
                <div>
                    <Label className="text-muted-foreground text-sm mb-2 block">Consent Method</Label>
                    <div className="flex gap-2">
                        {(["verbal", "written", "contract"] as ConsentMethod[]).map(c => (
                            <button key={c} onClick={() => setForm(f => ({ ...f, consentMethod: c }))}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${form.consentMethod === c ? "border-emerald-500 bg-emerald-500/10 text-emerald-600" : "border-border text-muted-foreground hover:border-border/80"}`}>
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div onClick={() => setForm(f => ({ ...f, consentGiven: !f.consentGiven }))}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.consentGiven ? "border-emerald-500 bg-emerald-500" : "border-border hover:border-border/80"}`}>
                        {form.consentGiven && <CheckCircle size={12} className="text-white" />}
                    </div>
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        All participants have given consent to be recorded
                    </span>
                </label>
            </div>

            <Button onClick={() => onNext(form)} disabled={!valid}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 h-11">
                Continue <ChevronRight size={16} className="ml-2" />
            </Button>
        </div>
    );
};

// ─── Step 2: Meeting / Participants Setup ─────────────────────────────────────
const MeetingStep = ({
    onNext, onBack, loading
}: {
    onNext: (data: { meetingTypes: string[]; participants: Participant[] }) => void;
    onBack: () => void;
    loading: boolean;
}) => {
    const [meetingTypes, setMeetingTypes] = useState<string[]>([]);
    const [customType, setCustomType] = useState("");
    const [participants, setParticipants] = useState<Participant[]>([{ name: "", role: "" }]);

    const toggleMeetingType = (t: string) =>
        setMeetingTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

    const addCustomType = () => {
        const trimmed = customType.trim();
        if (trimmed && !meetingTypes.includes(trimmed)) {
            setMeetingTypes(prev => [...prev, trimmed]);
            setCustomType("");
        }
    };

    const addParticipant = () => setParticipants(p => [...p, { name: "", role: "" }]);
    const removeParticipant = (i: number) => setParticipants(p => p.filter((_, idx) => idx !== i));
    const updateParticipant = (i: number, field: keyof Participant, val: string) =>
        setParticipants(p => p.map((pt, idx) => idx === i ? { ...pt, [field]: val } : pt));

    const valid = meetingTypes.length > 0;

    return (
        <div className="space-y-5 max-w-2xl mx-auto">
            <div className="text-center mb-2">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Users size={26} className="text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Meeting Setup</h2>
                <p className="text-muted-foreground text-sm mt-1">Select meeting type and add participants</p>
            </div>

            {/* Meeting Type — multi-select + custom add */}
            <div>
                <Label className="text-muted-foreground text-sm mb-2 block">Meeting Type <span className="text-red-500">*</span></Label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {DEFAULT_MEETING_TYPES.map(t => (
                        <button key={t} onClick={() => toggleMeetingType(t)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${meetingTypes.includes(t) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`}>
                            {t}
                        </button>
                    ))}
                    {/* Custom types that aren't in defaults */}
                    {meetingTypes.filter(t => !DEFAULT_MEETING_TYPES.includes(t)).map(t => (
                        <button key={t} onClick={() => toggleMeetingType(t)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-primary/50 bg-primary/10 text-primary flex items-center gap-1">
                            {t} <X size={12} />
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input value={customType} onChange={e => setCustomType(e.target.value)}
                        placeholder="Add custom type..." className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 text-sm"
                        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustomType(); } }} />
                    <Button size="sm" variant="outline" onClick={addCustomType} disabled={!customType.trim()}
                        className="border-border text-muted-foreground hover:bg-accent shrink-0">
                        <Plus size={14} />
                    </Button>
                </div>
            </div>

            {/* Participants — name + role only */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <Label className="text-muted-foreground text-sm">Participants</Label>
                    <button onClick={addParticipant}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                        <Plus size={14} /> Add
                    </button>
                </div>
                <div className="space-y-2">
                    {participants.map((p, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <Input value={p.name} onChange={e => updateParticipant(i, "name", e.target.value)}
                                placeholder="Name" className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 text-sm" />
                            <Input value={p.role} onChange={e => updateParticipant(i, "role", e.target.value)}
                                placeholder="Role (PM, Client...)" className="bg-background border-border text-foreground placeholder:text-muted-foreground/50 text-sm" />
                            {participants.length > 1 && (
                                <button onClick={() => removeParticipant(i)} className="text-destructive hover:text-destructive/80 shrink-0">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack}
                    className="border-border text-muted-foreground hover:bg-accent hover:text-foreground">
                    <ArrowLeft size={16} className="mr-2" /> Back
                </Button>
                <Button onClick={() => onNext({ meetingTypes, participants })}
                    disabled={!valid || loading}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                    {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> Creating Session...</> : <>Continue <ChevronRight size={16} className="ml-2" /></>}
                </Button>
            </div>
        </div>
    );
};

// ─── Step 3: Record / Upload ──────────────────────────────────────────────────
const CaptureStep = ({
    mode, sessionInfo, onResults, onBack
}: {
    mode: Mode;
    sessionInfo: SessionInfo;
    onResults: (data: any) => void;
    onBack: () => void;
}) => {
    const { toast } = useToast();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [processingMsg, setProcessingMsg] = useState("Uploading audio...");
    const [progress, setProgress] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); if (timerRef.current) clearInterval(timerRef.current); }, [audioUrl]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mr = new MediaRecorder(stream);
            const chunks: BlobPart[] = [];
            mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
            mr.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/webm" });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach(t => t.stop());
            };
            mr.start();
            mediaRecorderRef.current = mr;
            setIsRecording(true);
            const start = Date.now();
            timerRef.current = setInterval(() => setRecordingTime(Math.floor((Date.now() - start) / 1000)), 1000);
        } catch {
            toast({ title: "Microphone Denied", description: "Allow microphone access to record.", variant: "destructive" });
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        if (mode === "upload_audio") {
            setAudioBlob(f);
            setAudioUrl(URL.createObjectURL(f));
        }
    };

    const handleProcess = async () => {
        if (!audioBlob && !file) return;
        setUploading(true);
        setProcessing(true);
        setProgress(10);

        try {
            if (mode === "upload_transcript" && file) {
                // ── Transcript upload: send file directly to n8n transcript webhook ──
                // This is the SAME pattern as mobile's uploadTranscriptFile.
                // n8n responds synchronously with the AI result.
                setProcessingMsg("Uploading transcript to AI...");
                setProgress(30);

                const n8nTranscriptUrl = import.meta.env.VITE_FN_TRANSCRIPT_WEBHOOK_URL
                    || "https://n8n.srv1234562.hstgr.cloud/webhook/transcript-upload-a1b2c3d4";

                const fd = new FormData();
                fd.append("file", file, file.name);
                fd.append("metadata", JSON.stringify({
                    sessionId: sessionInfo.sessionId,
                    projectId: sessionInfo.projectId,
                }));

                setProgress(50);
                setProcessingMsg("AI is analyzing your transcript...");

                // Send to n8n (synchronous — n8n returns the result directly)
                const n8nRes = await axios.post(n8nTranscriptUrl, fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                    timeout: 600000, // 10 min timeout for AI processing
                });

                setProgress(80);
                setProcessingMsg("Storing results...");

                // Unwrap n8n array response
                let n8nResult = n8nRes.data;
                if (Array.isArray(n8nResult)) n8nResult = n8nResult[0];

                console.log("[AI Field Notes] Transcript n8n result keys:", Object.keys(n8nResult || {}));

                // Forward result to BigLogic server (same pattern as mobile)
                try {
                    await fieldNotesService.storeResult(sessionInfo.sessionId, n8nResult);
                    console.log("[AI Field Notes] Result stored on BigLogic server");
                } catch (storeErr: any) {
                    // Fallback: try the webhook endpoint
                    console.warn("[AI Field Notes] store-result failed, trying webhook:", storeErr?.message);
                    try {
                        await axios.post(
                            `${import.meta.env.PROD ? 'https://server.biglogic.ai' : 'http://localhost:5000'}/api/fieldnotesai/webhook/n8n-callback`,
                            {
                                sessionId: sessionInfo.sessionId,
                                projectId: sessionInfo.projectId,
                                ...n8nResult,
                            }
                        );
                    } catch (webhookErr: any) {
                        console.warn("[AI Field Notes] webhook fallback also failed:", webhookErr?.message);
                    }
                }

                setProgress(90);
                setProcessingMsg("Loading results...");

                // Fetch the completed session with all data
                try {
                    const sessionRes = await fieldNotesService.getSession(sessionInfo.sessionId);
                    setProgress(100);
                    setProcessing(false);
                    onResults(sessionRes.data);
                } catch {
                    // Even if getSession fails, we still have n8nResult
                    setProgress(100);
                    setProcessing(false);
                    onResults({
                        session: { _id: sessionInfo.sessionId, webhookStatus: "received", summary: "", webhookResult: n8nResult },
                        transcriptSegments: n8nResult.transcriptSegments || [],
                        tasks: n8nResult.tasks || [],
                    });
                }

            } else if (audioBlob) {
                // ── Audio upload path (voice_only + upload_audio) ────────────
                setProcessingMsg("Getting upload URL...");
                setProgress(15);

                const urlRes = await fieldNotesService.getUploadUrl({
                    sessionId: sessionInfo.sessionId,
                    fileType: "audio",
                    contentType: audioBlob.type || "audio/webm",
                    fileName: file?.name || "recording.webm",
                });

                const { uploadUrl, s3Key } = urlRes.data;
                setProcessingMsg("Uploading audio to cloud...");
                setProgress(35);

                await axios.put(uploadUrl, audioBlob, {
                    headers: { "Content-Type": audioBlob.type || "audio/webm" },
                    onUploadProgress: e => {
                        const pct = Math.round((e.loaded / (e.total || 1)) * 40);
                        setProgress(35 + pct);
                    },
                });

                await fieldNotesService.confirmUpload({
                    sessionId: sessionInfo.sessionId,
                    s3Key,
                    fileType: "audio",
                    fileName: file?.name || "recording.webm",
                    fileSize: audioBlob.size,
                });

                setProgress(80);
                setProcessingMsg("Triggering AI analysis...");

                await fieldNotesService.triggerWebhook(sessionInfo.sessionId);
                setProgress(90);
                setProcessingMsg("AI is analyzing your recording...");

                await pollSessionResult();
            }
        } catch (err: any) {
            console.error("[AI Field Notes] Process error:", err);
            toast({
                title: "Processing Failed",
                description: err?.response?.data?.message || err?.message || "Could not process. Please try again.",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const pollSessionResult = async () => {
        const maxAttempts = 40;
        for (let i = 0; i < maxAttempts; i++) {
            await new Promise(r => setTimeout(r, 3000));
            try {
                const res = await fieldNotesService.getSession(sessionInfo.sessionId);
                const s = res.data.session;
                if (s.webhookStatus === "received" || s.status === "completed") {
                    setProgress(100);
                    setProcessing(false);
                    onResults(res.data);
                    return;
                }
                if (s.webhookStatus === "failed" || s.status === "failed") {
                    throw new Error("AI processing failed. Please try again.");
                }
                setProcessingMsg(`AI processing... (${Math.round(((i + 1) / maxAttempts) * 100)}%)`);
                setProgress(90 + Math.min(8, i * 0.2));
            } catch (pollErr: any) {
                if (pollErr.message?.includes("failed")) throw pollErr;
            }
        }
        throw new Error("Processing timed out. Please check 'My Sessions' to view results when ready.");
    };

    if (processing) {
        return (
            <div className="text-center py-16 max-w-md mx-auto space-y-6">
                <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin" />
                    <Zap size={28} className="absolute inset-0 m-auto text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">{processingMsg}</h3>
                    <p className="text-muted-foreground text-sm mt-1">Gemini AI is processing your recording. This may take 1–2 minutes.</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground/50">You can leave this page — results will be saved and visible in My Sessions.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                    {mode === "voice_only" ? <Mic size={26} className="text-emerald-600" /> :
                        mode === "upload_audio" ? <FileAudio size={26} className="text-emerald-600" /> :
                            <FileText size={26} className="text-emerald-600" />}
                </div>
                <h2 className="text-xl font-bold text-foreground">
                    {mode === "voice_only" ? "Record Audio" : mode === "upload_audio" ? "Upload Audio File" : "Upload Transcript"}
                </h2>
            </div>

            {/* Voice Recording */}
            {mode === "voice_only" && (
                <div className="flex flex-col items-center gap-6 py-6 bg-muted/30 rounded-2xl border border-border">
                    <div className={`relative w-36 h-36 rounded-full border-4 flex items-center justify-center transition-all ${isRecording ? "border-destructive/60 bg-destructive/10" : "border-border bg-accent/50"}`}>
                        {isRecording && <div className="absolute inset-0 rounded-full animate-ping bg-destructive/10" />}
                        <span className="text-4xl font-mono text-foreground relative z-10">{formatTime(recordingTime)}</span>
                    </div>
                    <div className="flex gap-4">
                        {!isRecording ? (
                            <Button size="lg" onClick={startRecording}
                                className="rounded-full bg-destructive hover:bg-destructive/90 w-16 h-16 p-0 shadow-lg shadow-destructive/20">
                                <Mic size={24} />
                            </Button>
                        ) : (
                            <Button size="lg" onClick={stopRecording}
                                className="rounded-full bg-secondary hover:bg-secondary/80 w-16 h-16 p-0">
                                <Square size={22} fill="currentColor" />
                            </Button>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">{isRecording ? "Recording in progress — click Stop when done" : "Click the mic to begin recording"}</p>
                </div>
            )}

            {/* File Upload */}
            {(mode === "upload_audio" || mode === "upload_transcript") && (
                <label className="block border-2 border-dashed border-border rounded-2xl p-10 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group text-center">
                    <input type="file"
                        accept={mode === "upload_audio" ? "audio/*" : ".pdf,.doc,.docx,.txt"}
                        onChange={handleFileSelect} className="hidden" />
                    <Upload size={36} className="mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    {file ? (
                        <>
                            <p className="text-foreground font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </>
                    ) : (
                        <>
                            <p className="text-muted-foreground font-medium">Click to select file</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                                {mode === "upload_audio" ? "MP3, WAV, M4A, WebM" : "PDF, DOC, DOCX, TXT"}
                            </p>
                        </>
                    )}
                </label>
            )}

            {/* Audio Preview */}
            {audioUrl && !isRecording && (
                <div className="bg-card/50 border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <FileAudio className="text-primary" size={18} />
                        <span className="text-sm text-foreground font-medium">{file?.name || "Recorded Audio"}</span>
                    </div>
                    <audio src={audioUrl} controls className="w-full" />
                </div>
            )}

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} disabled={uploading}
                    className="border-border text-muted-foreground hover:bg-accent hover:text-foreground">
                    <ArrowLeft size={16} className="mr-2" /> Back
                </Button>
                <Button onClick={handleProcess}
                    disabled={(!audioBlob && !file) || uploading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                    {uploading ? <><Loader2 size={16} className="mr-2 animate-spin" /> Processing...</> : <><Zap size={16} className="mr-2" /> Analyze with AI</>}
                </Button>
            </div>
        </div>
    );
};

// ─── Step 4: Results ──────────────────────────────────────────────────────────
const ResultsStep = ({ data, onNewSession }: { data: any; onNewSession: () => void }) => {
    const session = data.session || data;
    const segments: any[] = data.transcriptSegments || [];
    const tasks: any[] = data.tasks || [];
    const issues: any[] = session.issues || [];
    const summary = session.summary || session.webhookResult?.summary || "";

    const priorityColor = (p: string) => {
        if (p === "high") return "text-red-400 bg-red-500/10 border-red-500/20";
        if (p === "medium") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    };

    const speakers = [...new Set(segments.map(s => s.speaker))];
    const speakerColors = ["bg-indigo-600", "bg-purple-600", "bg-emerald-600", "bg-amber-600"];

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle size={26} className="text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-foreground">AI Analysis Complete</h2>
                <p className="text-muted-foreground text-sm">Your field note has been processed</p>
            </div>

            {/* Summary */}
            {summary && (
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText size={16} className="text-primary" />
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Summary</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{summary}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Transcript */}
                {segments.length > 0 && (
                    <div className="bg-card/50 border border-border rounded-2xl overflow-hidden flex flex-col max-h-[400px]">
                        <div className="p-4 border-b border-border bg-accent/30 flex items-center gap-2">
                            <MessageSquare size={16} className="text-primary" />
                            <h3 className="font-bold text-foreground text-sm">Transcript ({segments.length} lines)</h3>
                        </div>
                        <div className="overflow-y-auto p-4 space-y-3 flex-1">
                            {segments.map((seg, i) => {
                                const spIdx = speakers.indexOf(seg.speaker);
                                return (
                                    <div key={i} className={`flex gap-2.5 ${spIdx % 2 === 1 ? "flex-row-reverse" : ""}`}>
                                        <div className={`w-7 h-7 rounded-full ${speakerColors[spIdx % speakerColors.length]} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm`}>
                                            {(seg.speaker || "?").charAt(0).toUpperCase()}
                                        </div>
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${spIdx % 2 === 0 ? "bg-accent/50 rounded-tl-none text-foreground" : "bg-primary/10 rounded-tr-none text-foreground border border-primary/10"}`}>
                                            <p className={`text-[10px] mb-0.5 ${spIdx % 2 === 0 ? "text-muted-foreground" : "text-primary/70"}`}>{seg.speaker} {seg.time ? `• ${seg.time}` : ""}</p>
                                            <p>{seg.text}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Tasks */}
                    {tasks.length > 0 && (
                        <div className="bg-card/50 border border-border rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-border bg-accent/30 flex items-center gap-2">
                                <ListTodo size={16} className="text-emerald-600" />
                                <h3 className="font-bold text-foreground text-sm">Action Items ({tasks.length})</h3>
                            </div>
                            <div className="p-4 space-y-2 max-h-[200px] overflow-y-auto">
                                {tasks.map((t, i) => (
                                    <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-accent/30 border border-border/50">
                                        <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-foreground font-medium truncate">{t.title}</p>
                                            {t.description && <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{t.description}</p>}
                                            {t.suggestedAssignee && <p className="text-[10px] text-muted-foreground/70 mt-0.5">→ {t.suggestedAssignee}</p>}
                                        </div>
                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0 ${priorityColor(t.priority || "medium")}`}>
                                            {t.priority || "medium"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Issues */}
                    {issues.length > 0 && (
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl overflow-hidden">
                            <div className="p-4 border-b border-amber-500/10 flex items-center gap-2">
                                <AlertCircle size={16} className="text-amber-600" />
                                <h3 className="font-bold text-amber-700 text-sm">Issues Flagged ({issues.length})</h3>
                            </div>
                            <div className="p-4 space-y-2 max-h-[160px] overflow-y-auto">
                                {issues.map((issue, i) => (
                                    <div key={i} className="text-sm">
                                        <p className="text-foreground font-medium">{issue.title}</p>
                                        {issue.description && <p className="text-muted-foreground text-xs mt-0.5">{issue.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!tasks.length && !issues.length && segments.length === 0 && (
                        <div className="text-center py-6 text-muted-foreground text-sm bg-accent/30 rounded-xl border border-border">
                            <CheckCircle className="mx-auto mb-2 text-emerald-500" size={28} />
                            Session saved. Results will appear here once AI processing is complete.
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-3">
                <Button onClick={onNewSession} variant="outline"
                    className="flex-1 border-border text-muted-foreground hover:bg-accent hover:text-foreground">
                    <RotateCcw size={16} className="mr-2" /> New Session
                </Button>
            </div>
        </div>
    );
};

// ─── My Sessions Panel ────────────────────────────────────────────────────────
const SessionsPanel = () => {
    const { toast } = useToast();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<any>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fieldNotesService.getProjects()
            .then(r => setProjects(r.data.projects || []))
            .catch(() => setProjects([]))
            .finally(() => setLoading(false));
    }, []);

    const loadDetail = async (proj: any) => {
        setLoadingDetail(true);
        try {
            const latestSessionId = proj.latestSession?._id;
            if (latestSessionId) {
                const res = await fieldNotesService.getSession(latestSessionId);
                setSelected(res.data);
            } else {
                setSelected({ session: proj, transcriptSegments: [], tasks: [] });
            }
        } catch {
            toast({ title: "Failed to load", description: "Could not load session details.", variant: "destructive" });
        } finally {
            setLoadingDetail(false);
        }
    };

    const deleteProj = async (id: string) => {
        if (!confirm("Delete this project and all its data?")) return;
        setDeleting(id);
        try {
            await fieldNotesService.deleteProject(id);
            setProjects(p => p.filter(x => x._id !== id));
            if (selected?.session?.projectId === id || selected?.session?._id === id) setSelected(null);
        } catch {
            toast({ title: "Delete failed", variant: "destructive" });
        } finally {
            setDeleting(null);
        }
    };

    const statusColor = (s: string) => {
        if (s === "received" || s === "completed") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
        if (s === "sent" || s === "processing") return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
        if (s === "failed") return "text-red-400 bg-red-500/10 border-red-500/20";
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="text-primary animate-spin" />
        </div>
    );

    if (projects.length === 0) return (
        <div className="text-center py-20 text-muted-foreground">
            <FolderOpen size={40} className="mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm">No sessions yet. Create your first project above.</p>
        </div>
    );

    return (
        <div className="flex gap-5">
            {/* List */}
            <div className="flex-1 space-y-2 max-h-[560px] overflow-y-auto pr-1">
                {projects.map((p, i) => {
                    const ws = p.latestSession?.webhookStatus || p.webhookStatus || "pending";
                    return (
                        <motion.div key={p._id}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                            className={`rounded-xl border p-4 cursor-pointer transition-all ${selected?.session?._id === p._id || selected?.session?.projectId === p._id ? "border-primary/60 bg-primary/5 shadow-sm" : "border-border bg-card/30 hover:border-border/80"}`}
                            onClick={() => loadDetail(p)}>
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-foreground font-medium text-sm truncate">{p.name}</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">Job: {p.jobId} • {new Date(p.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusColor(ws)}`}>
                                        {ws === "received" ? "done" : ws}
                                    </span>
                                    <button onClick={e => { e.stopPropagation(); deleteProj(p._id); }}
                                        disabled={deleting === p._id}
                                        className="p-1 text-red-400/60 hover:text-red-400 transition-colors">
                                        {deleting === p._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                                    </button>
                                </div>
                            </div>
                            {p.taskCount > 0 && (
                                <p className="text-[11px] text-emerald-400 mt-1.5">{p.taskCount} tasks • {p.openTaskCount} open</p>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Detail Panel */}
            {selected && (
                <div className="w-[420px] shrink-0 bg-white/3 border border-white/10 rounded-2xl overflow-hidden flex flex-col max-h-[560px]">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white">Session Detail</h3>
                        <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white"><X size={16} /></button>
                    </div>
                    {loadingDetail ? (
                        <div className="flex items-center justify-center flex-1"><Loader2 size={24} className="text-indigo-400 animate-spin" /></div>
                    ) : (
                        <div className="overflow-y-auto p-4 space-y-4 flex-1">
                            <ResultsStep data={selected} onNewSession={() => setSelected(null)} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const VoiceTranscriptionWorkflow = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState<"new" | "sessions">("new");
    const [step, setStep] = useState<WizardStep>("project");
    const [projectForm, setProjectForm] = useState<ProjectForm | null>(null);
    const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
    const [results, setResults] = useState<any>(null);
    const [creatingSession, setCreatingSession] = useState(false);

    const resetWizard = () => {
        setStep("project");
        setProjectForm(null);
        setSessionInfo(null);
        setResults(null);
    };

    const handleProjectNext = (form: ProjectForm) => {
        setProjectForm(form);
        setStep("meeting");
    };

    const handleMeetingNext = async (meetingData: { meetingTypes: string[]; participants: Participant[] }) => {
        if (!projectForm) return;
        setCreatingSession(true);
        try {
            // areaType = meeting types joined (server requires areaType)
            const areaTypeValue = meetingData.meetingTypes.join(", ").toLowerCase().replace(/\s+/g, "_") || "general";

            // 1. Create project
            const projRes = await fieldNotesService.createProject({
                name: projectForm.name,
                jobId: projectForm.jobId,
                mode: projectForm.mode,
                scopes: meetingData.meetingTypes,
                participants: meetingData.participants.filter(p => p.name.trim()),
                consentMethod: projectForm.consentMethod,
                consentGiven: projectForm.consentGiven,
            });
            const projectId = projRes.data.project._id;

            // 2. Create session — always "meeting" type
            const sessionPayload: any = {
                projectId,
                areaType: areaTypeValue,
                mode: projectForm.mode,
                sessionType: "meeting",
                meetingMetadata: {
                    meetingType: meetingData.meetingTypes[0]?.toLowerCase() || "internal",
                    participants: meetingData.participants.filter(p => p.name.trim()),
                    consentGiven: projectForm.consentGiven,
                    consentMethod: projectForm.consentMethod,
                },
            };
            const sessRes = await fieldNotesService.createSession(sessionPayload);
            const sessionId = sessRes.data.session._id;

            setSessionInfo({ projectId, sessionId });
            setStep("capture");
        } catch (err: any) {
            toast({
                title: "Setup Failed",
                description: err?.response?.data?.message || "Could not create project/session.",
                variant: "destructive",
            });
        } finally {
            setCreatingSession(false);
        }
    };

    const handleResults = (data: any) => {
        setResults(data);
        setStep("results");
        setActiveTab("new");
    };

    return (
        <DashboardLayout>
            <div className="w-[90%] mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/services")}
                        className="text-gray-400 hover:text-white hover:bg-white/10">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Field Notes</h1>
                        <p className="text-gray-400">Record site meetings · AI transcription · Auto-extracted tasks</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
                    <button onClick={() => setActiveTab("new")}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "new" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-white"}`}>
                        <Plus size={14} className="inline mr-1.5" />New Session
                    </button>
                    <button onClick={() => setActiveTab("sessions")}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "sessions" ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-white"}`}>
                        <FolderOpen size={14} className="inline mr-1.5" />My Sessions
                    </button>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {activeTab === "new" ? (
                        <motion.div key="new"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">

                            {step !== "results" && <StepIndicator step={step} />}

                            <AnimatePresence mode="wait">
                                {step === "project" && (
                                    <motion.div key="project" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <ProjectStep onNext={handleProjectNext} />
                                    </motion.div>
                                )}
                                {step === "meeting" && (
                                    <motion.div key="meeting" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <MeetingStep
                                            onNext={handleMeetingNext}
                                            onBack={() => setStep("project")}
                                            loading={creatingSession}
                                        />
                                    </motion.div>
                                )}
                                {step === "capture" && sessionInfo && (
                                    <motion.div key="capture" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <CaptureStep
                                            mode={projectForm?.mode || "voice_only"}
                                            sessionInfo={sessionInfo}
                                            onResults={handleResults}
                                            onBack={() => setStep("meeting")}
                                        />
                                    </motion.div>
                                )}
                                {step === "results" && results && (
                                    <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                        <ResultsStep data={results} onNewSession={() => { resetWizard(); }} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div key="sessions"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
                            <SessionsPanel />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default VoiceTranscriptionWorkflow;
