import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Send, User as UserIcon, Lock, Globe, Mail, Clock, Download, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { jwtDecode } from "jwt-decode";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import api from "@/services/api";
import { useTheme } from "@/components/ThemeProvider";

const NotesTab = () => {
    const { theme } = useTheme();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [noteContent, setNoteContent] = useState("");
    const [visibility, setVisibility] = useState("Private");
    const [category, setCategory] = useState("General");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

    // Fetch Job Data (including notes and participants for email list)
    const { data: jobData, isLoading } = useQuery({
        queryKey: ["job", id],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await api.get(`/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!id
    });

    const job = jobData?.job;
    const notes = jobData?.notes || [];

    const token = localStorage.getItem("token");
    let currentUserId = "";
    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            currentUserId = decoded.id;
        } catch (e) {
            console.error("Failed to decode token", e);
        }
    }

    // Extract potential email recipients from job participants
    const recipients = [
        ...(job?.participants?.internal?.map((p: any) => ({ name: p.user?.name || p.name, email: p.user?.email || p.email, role: p.role })) || []),
        ...(job?.participants?.external?.primaryAdjuster?.email ? [{ name: job.participants.external.primaryAdjuster.name, email: job.participants.external.primaryAdjuster.email, role: "Primary Adjuster" }] : []),
        ...(job?.participants?.primaryContact?.email ? [{ name: job.participants.primaryContact.name, email: job.participants.primaryContact.email, role: "Homeowner" }] : [])
    ].filter(r => r.email);

    // Add Note Mutation
    const addNoteMutation = useMutation({
        mutationFn: async (newNote: any) => {
            const token = localStorage.getItem("token");
            return await api.post(`/jobs/${id}/notes`, newNote, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["job", id] });
            toast.success("Note added and notifications sent");
            setNoteContent("");
            setSelectedEmails([]);
            setIsSubmitting(false);
        },
        onError: () => {
            toast.error("Failed to add note");
            setIsSubmitting(false);
        }
    });

    const handleSubmit = () => {
        if (!noteContent.trim()) return;
        setIsSubmitting(true);
        addNoteMutation.mutate({
            content: noteContent,
            visibility,
            category,
            emailDistribution: selectedEmails
        });
    };

    const handleExport = () => {
        // Simple CSV Export logic
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Date,Author,Category,Visibility,Content\n"
            + notes.map((n: any) => `"${new Date(n.createdAt).toLocaleString()}","${n.author?.name || 'Unknown'}","${n.category}","${n.visibility}","${n.content.replace(/"/g, '""')}"`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `job_${id}_notes.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) return <Skeleton className="w-full h-[600px]" />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Project Notes & Activity</h2>
                    <p className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Track all communications, updates, and site visits.</p>
                </div>
                <Button variant="outline" onClick={handleExport} className={`rounded-xl px-4 font-medium ${theme === 'dark' ? 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10' : 'border-slate-200 text-indigo-600 hover:bg-slate-50 shadow-sm'}`}>
                    <Download className="mr-2 h-4 w-4" /> Export Notes
                </Button>
            </div>

            {/* Note Input */}
            <Card className={`border-0 ring-1 ${theme === 'dark' ? 'bg-card/40 border-white/5 ring-white/5 shadow-2xl' : 'bg-white ring-gray-200 shadow-xl'} rounded-2xl overflow-hidden`}>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-6">
                        <Textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Type a new note..."
                            className={`rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-slate-50 ring-slate-200 text-slate-900 focus:ring-indigo-500 shadow-inner'} min-h-[120px] p-4 text-base transition-all`}
                        />

                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex flex-wrap gap-4 items-center">
                                {/* Visibility Selector */}
                                 <Select value={visibility} onValueChange={setVisibility}>
                                    <SelectTrigger className={`w-[180px] rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-white ring-slate-200 text-slate-900 shadow-sm'} h-10`}>
                                        <div className="flex items-center gap-2">
                                            {visibility === 'Private' ? <Lock className="h-4 w-4 text-amber-500" /> : <Globe className="h-4 w-4 text-indigo-400" />}
                                            <span className="font-semibold text-sm">{visibility === 'Private' ? 'Private' : 'Public'}</span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className={`${theme === 'dark' ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-white border-gray-100 text-indigo-950 shadow-2xl'} rounded-2xl p-2`}>
                                        <SelectItem value="Private" className="rounded-xl py-3 cursor-pointer focus:bg-indigo-500/10">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-amber-500/10 p-2 rounded-xl">
                                                    <Lock className="h-4 w-4 text-amber-500" />
                                                </div>
                                                 <div className="flex flex-col text-left">
                                                    <span className="font-semibold text-white">Private</span>
                                                    <span className={`text-[10px] font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Only visible to you</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Public" className="rounded-xl py-3 cursor-pointer focus:bg-indigo-500/10">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-indigo-500/10 p-2 rounded-xl">
                                                    <Globe className="h-4 w-4 text-indigo-400" />
                                                </div>
                                                 <div className="flex flex-col text-left">
                                                    <span className="font-semibold text-white">Public</span>
                                                    <span className={`text-[10px] font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Visible to the team</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Category Selector */}
                                 <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className={`w-[140px] rounded-xl border-0 ring-1 ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white' : 'bg-white ring-slate-200 text-slate-900 shadow-sm'} h-10`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                     <SelectContent className={`${theme === 'dark' ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-white border-gray-100 text-slate-900 shadow-2xl'} rounded-2xl`}>
                                        {['General', 'Update', 'Call Log', 'Site Visit', 'Issue', 'Activity'].map(c => (
                                            <SelectItem key={c} value={c} className="rounded-xl py-2 font-medium">{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Email Distribution Popover */}
                                 <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={`h-10 rounded-xl font-medium px-4 border-0 ring-1 ${selectedEmails.length > 0 
                                            ? 'bg-indigo-600 text-white ring-indigo-600 shadow-lg shadow-indigo-500/20' 
                                            : theme === 'dark' ? 'bg-white/5 ring-white/10 text-gray-400' : 'bg-white ring-slate-200 text-indigo-600 shadow-sm'}`}>
                                            <Mail className="mr-2 h-4 w-4" />
                                            {selectedEmails.length > 0 ? `${selectedEmails.length} Notified` : "Notify Team"}
                                        </Button>
                                    </PopoverTrigger>
                                     <PopoverContent className={`w-80 border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-slate-200 text-slate-900 shadow-2xl'} rounded-2xl p-0`} align="start">
                                        <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-50'} font-bold text-xs uppercase tracking-widest`}>Select Recipients</div>
                                        <div className="p-3 max-h-[300px] overflow-y-auto space-y-2">
                                            {recipients.length === 0 ? (
                                                <div className="text-sm text-gray-500 p-4 text-center italic">No contacts found for this job.</div>
                                            ) : (
                                                <>
                                                    <div className={`flex items-center space-x-3 p-3 rounded-xl border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-50'} mb-2`}>
                                                         <Checkbox
                                                            id="select-all"
                                                            checked={selectedEmails.length > 0 && selectedEmails.length === new Set(recipients.map((r: any) => r.email)).size}
                                                            onCheckedChange={(checked) => {
                                                                if (checked) {
                                                                    const uniqueEmails = Array.from(new Set(recipients.map((r: any) => r.email))) as string[];
                                                                    setSelectedEmails(uniqueEmails);
                                                                } else {
                                                                    setSelectedEmails([]);
                                                                }
                                                            }}
                                                            className="border-slate-400 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded-md"
                                                        />
                                                        <label htmlFor="select-all" className="text-sm font-bold text-indigo-600 cursor-pointer">Notify All Members</label>
                                                    </div>
                                                    {recipients.map((recipient: any) => (
                                                        <div key={recipient.email} className={`flex items-center space-x-3 p-3 rounded-xl ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-indigo-50'} transition-all group`}>
                                                            <Checkbox
                                                                id={recipient.email}
                                                                checked={selectedEmails.includes(recipient.email)}
                                                                onCheckedChange={(checked) => {
                                                                    if (checked) setSelectedEmails([...selectedEmails, recipient.email]);
                                                                    else setSelectedEmails(selectedEmails.filter(e => e !== recipient.email));
                                                                }}
                                                                className="border-gray-400 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded-md"
                                                            />
                                                            <div className="grid gap-0.5 leading-none">
                                                                 <label htmlFor={recipient.email} className={`text-sm font-semibold leading-none cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                                                    {recipient.name}
                                                                </label>
                                                                <p className={`text-[10px] font-normal uppercase tracking-wider ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>
                                                                    {recipient.role}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                             <Button onClick={handleSubmit} disabled={isSubmitting || !noteContent.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-10 px-8 shadow-lg shadow-indigo-500/20">
                                <Send className="mr-2 h-4 w-4" /> Post Note
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notes List */}
            <div className="space-y-4">
                {notes.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No activity recorded yet.
                    </div>
                ) : (
                    notes.map((note: any) => (
                        <NoteItem key={note._id} note={note} jobId={id!} currentUserId={currentUserId} />
                    ))
                )}
            </div>
        </div>
    );
};

const NoteItem = ({ note, jobId, currentUserId }: { note: any, jobId: string, currentUserId: string }) => {
    const { theme } = useTheme();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(note.content);

    // Update Note Mutation
    const updateNoteMutation = useMutation({
        mutationFn: async (newContent: string) => {
            const token = localStorage.getItem("token");
            return await api.put(`/jobs/${jobId}/notes/${note._id}`, { content: newContent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["job", jobId] });
            toast.success("Note updated");
            setIsEditing(false);
        },
        onError: () => {
            toast.error("Failed to update note");
        }
    });

    // Delete Note Mutation
    const deleteNoteMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("token");
            return await api.delete(`/jobs/${jobId}/notes/${note._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["job", jobId] });
            toast.success("Note deleted");
        },
        onError: () => {
            toast.error("Failed to delete note");
        }
    });

    const handleUpdate = () => {
        if (!editContent.trim()) return;
        updateNoteMutation.mutate(editContent);
    };

     return (
        <div className={`flex gap-4 p-4 rounded-xl transition-all group relative border ${
            theme === 'dark' 
                ? 'bg-[#0A0A0A] border-white/10 hover:border-white/20' 
                : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'
        }`}>
            {/* Thread Line (Visual only) */}
            <div className="absolute left-[31px] top-[50px] bottom-[-20px] w-0.5 bg-white/5 group-last:hidden"></div>

            <Avatar className="h-10 w-10 border border-white/10 z-10">
                <AvatarImage src={note.author?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white font-medium">
                    {note.author?.name?.charAt(0) || "U"}
                </AvatarFallback>
            </Avatar>

             <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{note.author?.name || "Unknown User"}</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {new Date(note.createdAt).toLocaleString()}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`border-0 ${note.category === 'Issue' ? 'bg-red-500/20 text-red-500' :
                            note.category === 'Call Log' ? 'bg-blue-500/20 text-blue-500' :
                                'bg-white/5 text-gray-400'
                            }`}>
                            {note.category}
                        </Badge>
                        {note.visibility === 'Private' && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-xs border border-amber-500/20">
                                <Lock className="h-3 w-3" /> Private
                            </div>
                        )}

                        {/* Action Buttons */}
                        {note.author?._id === currentUserId && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="h-6 w-6 p-0 text-gray-400 hover:text-white"><FileText className="h-3 w-3" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => deleteNoteMutation.mutate()} className="h-6 w-6 p-0 text-red-500 hover:text-red-400"><span className="sr-only">Delete</span>×</Button>
                            </div>
                        )}
                    </div>
                </div>

                {isEditing ? (
                    <div className="space-y-2">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="bg-white/5 border-white/10 text-white min-h-[80px]"
                        />
                        <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button size="sm" onClick={handleUpdate} className="bg-indigo-600 hover:bg-indigo-700">Save Update</Button>
                        </div>
                    </div>
                 ) : (
                    <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-slate-700'} whitespace-pre-wrap text-sm leading-relaxed`}>
                        {note.content}
                    </div>
                )}

                {/* Email Distribution Status */}
                {note.emailDistribution && note.emailDistribution.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-2">
                        {note.emailDistribution.map((dist: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-1 text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                                <Mail className="h-3 w-3 text-indigo-400" />
                                <span className={dist.status === 'Sent' ? "text-gray-400" : "text-red-400"}>{dist.email}</span>
                                {dist.status === 'Sent' && <Check className="h-3 w-3 text-green-500" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesTab;
