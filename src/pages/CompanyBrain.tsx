import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Brain, Send, ShieldAlert, Cpu, UploadCloud, Mic, FileText, MicOff, MessageSquarePlus, Info, User, Sparkles, Maximize2, Minimize2, Copy, Check, Shield, RefreshCw, ThumbsUp, ThumbsDown, FilePlus, Trash2, ExternalLink, Search, Filter, Calendar, ChevronLeft, ChevronRight, Edit3, FolderOpen, Headphones, Waves, AudioLines, Volume2, MessageCircle, Upload, History, Mail, Smartphone, Share2, Lock as LockIcon, Clock, X, FileWarning, MessageSquareQuote, Activity, Settings, Menu, LogOut } from 'lucide-react';
import api, { companyBrainService, API_URL } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import RiskDashboard from './RiskDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useVoiceMode } from '@/hooks/useVoiceMode';
import VoiceModeOverlay from '@/components/VoiceModeOverlay';
import { useBrainChatStore, Message } from '@/store/useBrainChatStore';
import { SidebarClose, SidebarOpen, MessageSquare, Plus, Square, ArrowLeft } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";



const DOCUMENT_LABELS = [
    "Contracts & Legal Documents",
    "Approved Language / Legal Templates",
    "Industry Standards / Codes",
    "Internal SOPs / Processes",
    "Financial / Accounting Guidance",
    "HR / Employee Policies",
    "Disputes / Legal History",
    "Project Documentation",
    "Lessons Learned / Historical Case Data",
    "Voice Notes / Transcripts"
];

const MASTER_FOLDERS = [
    "Contracts",
    "Standards",
    "SOPs",
    "Financial",
    "HR",
    "Disputes",
    "Projects"
];

const AUTHORITY_TIERS = [
    { label: "Tier 1 — Highest Authority", value: "Tier 1" },
    { label: "Tier 2", value: "Tier 2" },
    { label: "Tier 3", value: "Tier 3" }
];

const CompanyBrain = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('brain');
    const [historySearch, setHistorySearch] = useState('');
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');

    // Helper to extract People Also Asked questions from markdown
    const extractPeopleAlsoAsked = (content: string) => {
        if (!content) return [];

        // Match various possible headers: # People Also Asked, ## Options for Next Steps, etc.
        const headerRegex = /(?:#+)\s*(?:People Also Asked|Options for Next Steps|Follow-up Questions|Next Steps):([\s\S]*)/i;
        const match = content.match(headerRegex);
        if (!match) return [];

        const questionsList = match[1]
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.startsWith('*') || line.startsWith('-') || /^\d+\./.test(line))
            .map(line => {
                // Strip the list marker (bullet or number)
                let cleaned = line.replace(/^[*-\d.]\s*/, '').trim();
                // Strip common markdown formatting like **bold**, *italic*, _italic_
                cleaned = cleaned.replace(/[*_~`]/g, '');
                // Also strip leading # characters in case it's formatted as a header
                cleaned = cleaned.replace(/^#+\s*/, '');
                return cleaned;
            })
            .filter(q => q.length > 0)
            .slice(0, 3); // Limit to top 3 questions

        return questionsList;
    };

    // Helper to strip the People Also Asked section from main content for clean rendering
    const cleanContent = (content: string) => {
        if (!content) return '';
        // Split by the first occurrence of any follow-up header
        const parts = content.split(/(?:#+)\s*(?:People Also Asked|Options for Next Steps|Follow-up Questions|Next Steps):/i);
        return parts[0].trim();
    };

    const hideScrollbarStyle = (
        <style dangerouslySetInnerHTML={{
            __html: `
            .scrollbar-none::-webkit-scrollbar {
                display: none !important;
            }
            .scrollbar-none {
                -ms-overflow-style: none !important;
                scrollbar-width: none !important;
            }
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
            .animate-cursor-blink {
                animation: blink 0.8s step-end infinite;
            }
            .streaming-message > *:last-child::after {
                content: "";
                display: inline-block;
                width: 6px;
                height: 15px;
                background-color: hsl(var(--primary));
                margin-left: 4px;
                vertical-align: middle;
                animation: blink 0.8s step-end infinite;
            }
            /* Response Bubble Styling Fixes */
            .prose h1, .prose h2, .prose h3, .prose h4 {
                font-size: 0.8rem !important;
                font-weight: 800 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.08em !important;
                margin-top: 1.25rem !important;
                margin-bottom: 0.5rem !important;
                color: hsl(var(--foreground)) !important;
                opacity: 0.8;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-family: inherit !important;
            }
            .prose h1::before, .prose h2::before, .prose h3::before {
                content: "";
                display: block;
                width: 4px;
                height: 4px;
                background-color: #6366f1; /* Indigo-500 */
                border-radius: 9999px;
            }
            .prose p {
                line-height: 1.6 !important;
                font-size: 0.875rem !important;
                margin-bottom: 0.75rem !important;
                color: inherit !important;
            }
            .prose ul, .prose ol {
                margin-top: 0.25rem !important;
                margin-bottom: 0.75rem !important;
            }
            .prose li {
                margin-top: 0.15rem !important;
                margin-bottom: 0.15rem !important;
                font-size: 0.875rem !important;
            }
        `}} />
    );
    const [isDragging, setIsDragging] = useState(false);
    const [query, setQuery] = useState('');

    const {
        conversations,
        activeConversationId,
        setActiveConversation,
        addMessage,
        updateMessage,
        createConversation,
        deleteConversation,
        setConversations,
        replaceId,
        upsertConversation,
        deleteMessagesFrom
    } = useBrainChatStore();

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const messages = activeConversation?.messages || [];

    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [copyId, setCopyId] = useState<string | null>(null);

    // Monitoring & Persistence (Admin features)
    const [adminConversations, setAdminConversations] = useState<any[]>([]);
    const [isConversationsLoading, setIsConversationsLoading] = useState(false);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [ingestions, setIngestions] = useState<any[]>([]);
    const [isIngestionsLoading, setIsIngestionsLoading] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [ingestionToDelete, setIngestionToDelete] = useState<string | null>(null);
    const [isChatDeleteConfirmOpen, setIsChatDeleteConfirmOpen] = useState(false);
    const [chatToDeleteId, setChatToDeleteId] = useState<string | null>(null);

    // Sharing States
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [isSharingLoading, setIsSharingLoading] = useState(false);
    const [shareMode, setShareMode] = useState<'public' | 'restricted'>('restricted');
    const [shareEmails, setShareEmails] = useState<string>('');
    const [isShared, setIsCurrentShared] = useState(false);
    const [shareToken, setShareToken] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);

    // Ingestion Hub Filter/Pagination States
    const [ingestionSearch, setIngestionSearch] = useState('');
    const [ingestionType, setIngestionType] = useState('All');
    const [ingestionStartDate, setIngestionStartDate] = useState('');
    const [ingestionEndDate, setIngestionEndDate] = useState('');
    const [ingestionPage, setIngestionPage] = useState(1);
    const [totalIngestionPages, setTotalIngestionPages] = useState(1);
    const [isEditMetadataOpen, setIsEditMetadataOpen] = useState(false);
    const [editingIngestion, setEditingIngestion] = useState<any>(null);
    const [editMetadataData, setEditMetadataData] = useState({
        label: '',
        tier: '',
        folder: ''
    });

    // Monitor Hub Filter/Pagination States
    const [monitorSearch, setMonitorSearch] = useState('');
    const [monitorStartDate, setMonitorStartDate] = useState('');
    const [monitorEndDate, setMonitorEndDate] = useState('');
    const [monitorPage, setMonitorPage] = useState(1);
    const [totalMonitorPages, setTotalMonitorPages] = useState(1);
    const [selectedMonitorChats, setSelectedMonitorChats] = useState<string[]>([]);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

    // Feedback States
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackFile, setFeedbackFile] = useState<File | null>(null);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [isRecordingFeedback, setIsRecordingFeedback] = useState(false);
    const feedbackFileInputRef = useRef<HTMLInputElement>(null);

    // Auth check
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isCompanyAdmin = user?.role === 'company_admin' || user?.role === 'superadmin';
    const isMaster = user?.isMaster === true; // Added Master check
    const hasPermission = user?.permissions?.companyBrain === true;

    if (!isCompanyAdmin && !hasPermission) {
        return (
            <div className="flex h-screen w-full bg-background items-center justify-center relative">
                <div className="absolute top-4 left-4">
                    <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
                        <ChevronLeft size={16} /> Back to Dashboard
                    </Button>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                        <Brain className="w-8 h-8 text-destructive" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
                    <p className="text-muted-foreground">You do not have permission to access the Company Brain module.</p>
                </div>
            </div>
        );
    }

    // Modal states
    const [isFieldNoteOpen, setIsFieldNoteOpen] = useState(false);
    const [fieldNoteContent, setFieldNoteContent] = useState('');
    const [isSubmittingNote, setIsSubmittingNote] = useState(false);

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [knowledgeFile, setKnowledgeFile] = useState<File | null>(null);
    const [isUploadingDocument, setIsUploadingDocument] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Q&A Modal states
    const [isQAOpen, setIsQAOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };
    const [qaQuestion, setQaQuestion] = useState('');
    const [qaAnswer, setQaAnswer] = useState('');
    const [isSubmittingQA, setIsSubmittingQA] = useState(false);

    // Knowledge/QA Classification States
    const [knowledgeLabel, setKnowledgeLabel] = useState('Contracts & Legal Documents');
    const [knowledgeTier, setKnowledgeTier] = useState('Tier 1');
    const [knowledgeFolder, setKnowledgeFolder] = useState('Contracts');

    const [qaLabel, setQaLabel] = useState('Internal SOPs / Processes');
    const [qaTier, setQaTier] = useState('Tier 3');
    const [qaFolder, setQaFolder] = useState('SOPs');

    // Custom Ingestion Names
    const [fieldNoteName, setFieldNoteName] = useState('');
    const [knowledgeName, setKnowledgeName] = useState('');
    const [qaName, setQaName] = useState('');

    // Voice recording states
    const [isRecordingNote, setIsRecordingNote] = useState(false);
    const [isRecordingQuestion, setIsRecordingQuestion] = useState(false);
    const [isRecordingAnswer, setIsRecordingAnswer] = useState(false);
    const [isRecordingEditQuestion, setIsRecordingEditQuestion] = useState(false);
    const [isRecordingEditAnswer, setIsRecordingEditAnswer] = useState(false);
    const [isRecordingQuery, setIsRecordingQuery] = useState(false);
    const [isChatExpanded, setIsChatExpanded] = useState(true);
    const activeRecognitionRef = useRef<any>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    // Selection Tagging State
    const [selectionData, setSelectionData] = useState<{
        text: string;
        x: number;
        y: number;
        visible: boolean;
    }>({ text: '', x: 0, y: 0, visible: false });

    // Docs Hub Redesign States
    const [isViewDocumentOpen, setIsViewDocumentOpen] = useState(false);
    const [viewingDocument, setViewingDocument] = useState<any>(null);
    const [ingestionSortBy, setIngestionSortBy] = useState('createdAt');
    const [ingestionSortOrder, setIngestionSortOrder] = useState<'asc' | 'desc'>('desc');
    const [qaSubTab, setQaSubTab] = useState<'verified' | 'pending'>('verified');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Edit Question States
    const [isEditMsgDialogOpen, setIsEditMsgDialogOpen] = useState(false);
    const [editMsgText, setEditMsgText] = useState('');
    const [editMsgId, setEditMsgId] = useState<string | null>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
        }
    }, [query]);

    const handleScroll = (e: Event) => {
        const target = e.currentTarget as HTMLElement;
        if (!target) return;

        // Distance from bottom check
        const distanceFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
        const isNearBottom = distanceFromBottom < 100;

        if (isAtBottom !== isNearBottom) {
            setIsAtBottom(isNearBottom);
        }
    };

    useEffect(() => {
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.addEventListener('scroll', handleScroll);
            return () => viewport.removeEventListener('scroll', handleScroll);
        }
    }, [scrollAreaRef.current]);

    // Stop recording when note modal closes
    useEffect(() => {
        if (!isFieldNoteOpen && isRecordingNote) {
            if (activeRecognitionRef.current) activeRecognitionRef.current.stop();
            setIsRecordingNote(false);
        }
    }, [isFieldNoteOpen, isRecordingNote]);

    // Stop recording when QA modal closes
    useEffect(() => {
        if (!isQAOpen) {
            if (activeRecognitionRef.current) activeRecognitionRef.current.stop();
            setIsRecordingQuestion(false);
            setIsRecordingAnswer(false);
        }
    }, [isQAOpen]);

    // Stop recording when Edit Metadata modal closes
    useEffect(() => {
        if (!isEditMetadataOpen) {
            if (activeRecognitionRef.current) activeRecognitionRef.current.stop();
            setIsRecordingEditQuestion(false);
            setIsRecordingEditAnswer(false);
        }
    }, [isEditMetadataOpen]);

    // Stop recording when Feedback modal closes
    useEffect(() => {
        if (!isFeedbackOpen) {
            if (activeRecognitionRef.current) activeRecognitionRef.current.stop();
            setIsRecordingFeedback(false);
        }
    }, [isFeedbackOpen]);

    const fetchConversations = async () => {
        setIsConversationsLoading(true);
        try {
            const params = {
                page: monitorPage,
                limit: 20,
                search: monitorSearch,
                startDate: monitorStartDate,
                endDate: monitorEndDate
            };
            const res = await companyBrainService.getConversations(params);
            const fetched = res.data.data;
            setAdminConversations(fetched || []);
            setTotalMonitorPages(res.data.pages || 1);

            // Also sync/prune the main chat store for the sidebar
            if (fetched && !monitorSearch && !monitorStartDate && !monitorEndDate) {
                const fetchedIds = new Set((fetched as any[]).map(bc => bc._id));
                const currentLocalConversations = useBrainChatStore.getState().conversations;

                currentLocalConversations.forEach(conv => {
                    const isMongoId = /^[0-9a-fA-F]{24}$/.test(conv.id);
                    if (isMongoId && !fetchedIds.has(conv.id)) {
                        deleteConversation(conv.id);
                    }
                });

                for (const bc of fetched) {
                    upsertConversation(bc._id, bc.title, [], new Date(bc.updatedAt).getTime());
                }
            }
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setIsConversationsLoading(false);
        }
    };

    // Re-fetch monitor conversations when filters change
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (activeTab === 'monitor') fetchConversations();
        }, 300);
        return () => clearTimeout(timeout);
    }, [monitorPage, monitorSearch, monitorStartDate, monitorEndDate, activeTab]);

    const handleBulkDeleteConversations = () => {
        if (selectedMonitorChats.length === 0) return;
        setIsBulkDeleteConfirmOpen(true);
    };

    const confirmBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            await companyBrainService.deleteConversationsBulk(selectedMonitorChats);
            toast({
                title: "Bulk Delete Successful",
                description: `${selectedMonitorChats.length} conversations have been removed.`
            });
            setSelectedMonitorChats([]);
            setIsBulkDeleteConfirmOpen(false);
            fetchConversations();
        } catch (error) {
            toast({
                title: "Bulk Delete Failed",
                description: "There was an error deleting some conversations.",
                variant: "destructive"
            });
        } finally {
            setIsBulkDeleting(false);
        }
    };

    const toggleChatSelection = (id: string) => {
        setSelectedMonitorChats(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAllChats = () => {
        if (selectedMonitorChats.length === adminConversations.length) {
            setSelectedMonitorChats([]);
        } else {
            setSelectedMonitorChats(adminConversations.map(c => c._id));
        }
    };

    const fetchIngestions = async () => {
        setIsIngestionsLoading(true);
        try {
            const params = {
                page: ingestionPage,
                limit: 10,
                search: ingestionSearch,
                type: ingestionType,
                startDate: ingestionStartDate,
                endDate: ingestionEndDate,
                sortBy: ingestionSortBy,
                sortOrder: ingestionSortOrder
            };
            const res = await companyBrainService.getIngestions(params);
            setIngestions(res.data.data);
            setTotalIngestionPages(res.data.pages || 1);
        } catch (error) {
            console.error('Failed to fetch ingestions:', error);
        } finally {
            setIsIngestionsLoading(false);
        }
    };

    // Re-fetch when filters change
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchIngestions();
        }, 300); // Debounce search
        return () => clearTimeout(timeout);
    }, [ingestionPage, ingestionSearch, ingestionType, ingestionStartDate, ingestionEndDate, ingestionSortBy, ingestionSortOrder]);

    const handleEditMetadata = (item: any) => {
        setEditingIngestion(item);
        setEditMetadataData({
            label: item.label || 'Uncategorized',
            tier: item.tier || 'Tier 3',
            folder: item.folder || 'General',
            name: item.name || '',
            // @ts-ignore
            question: item.question || '',
            // @ts-ignore
            answer: item.answer || ''
        });
        setIsEditMetadataOpen(true);
    };

    const handleUpdateMetadata = async (targetStatus?: string) => {
        if (!editingIngestion) return;

        try {
            const dataToUpdate = {
                ...editMetadataData,
                status: targetStatus || editingIngestion.status
            };
            await companyBrainService.updateIngestion(editingIngestion._id, dataToUpdate);
            toast({
                title: targetStatus === 'Synchronized' ? "Knowledge Verified" : "Metadata Updated",
                description: targetStatus === 'Synchronized' ? "The record has been verified and synced to the brain." : "The document classification has been updated.",
            });
            setIsEditMetadataOpen(false);
            fetchIngestions();
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "Could not update document metadata.",
                variant: "destructive"
            });
        }
    };

    const handleRemoveIngestion = (id: string | null) => {
        if (!id) return;
        setIngestionToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleViewContent = async (item: any) => {
        // If it's a Knowledge Document with a file, we need a secure signed URL
        if (item.type === 'Knowledge Document' && item.fileUrl) {
            try {
                // Fetch a temporary signed URL from the backend
                const response = await api.get(`/company-brain/ingestions/${item._id}/view-url`);
                if (response.data.success && response.data.url) {
                    window.open(response.data.url, '_blank');
                    return; // Opened in new tab, no need to open modal
                }
            } catch (error) {
                console.error('Error fetching secure view URL:', error);
                toast({
                    title: "Access Denied",
                    description: "Could not generate a secure link for this document. It may have been removed or access is restricted.",
                    variant: "destructive"
                });
            }
        }

        // Fallback or Q&A: Open the preview modal
        setViewingDocument(item);
        setIsViewDocumentOpen(true);
    };

    const confirmDeleteIngestion = async () => {
        if (!ingestionToDelete) return;

        try {
            await companyBrainService.removeIngestion(ingestionToDelete);
            toast({
                title: "Removed",
                description: "The record has been removed from the knowledge tracking.",
            });
            fetchIngestions();
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not remove the ingestion record.",
                variant: "destructive"
            });
        } finally {
            setIsDeleteConfirmOpen(false);
            setIngestionToDelete(null);
        }
    };

    const loadConversation = async (id: string) => {
        setIsLoading(true);
        setIsMonitoring(true);
        setActiveTab('brain');
        try {
            const res = await companyBrainService.getConversationHistory(id);
            const { data: messages, conversation } = res.data;

            // Map backend messages to store format
            const mappedMessages: Message[] = messages.map((m: any) => ({
                id: m._id,
                role: m.role,
                content: m.content,
                assistantMessageId: m.role === 'assistant' ? m._id : undefined,
                rating: m.rating,
                feedbackText: m.feedbackText
            }));

            // Sync into the store so it's visible in the UI
            upsertConversation(id, conversation.title, mappedMessages, new Date(conversation.updatedAt).getTime());
            setActiveConversation(id);

            // Load sharing info
            setIsCurrentShared(conversation.isShared || false);
            setShareMode(conversation.sharingMode || 'restricted');
            setShareEmails(conversation.allowedEmails?.join(', ') || '');
            setShareToken(conversation.shareToken || null);
        } catch (error) {
            toast({ title: 'Load Failed', description: 'Could not retrieve chat history.', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    // Global sync on mount for the logged in user
    useEffect(() => {
        const syncHistory = async () => {
            if (!user) return;
            // Initially just use fetchConversations to hydrate the list
            fetchConversations();
        };
        syncHistory();
    }, []);

    const startNewChat = () => {
        const newId = createConversation();
        setActiveConversation(newId);
        setIsMonitoring(false);
        setActiveTab('brain');
    };

    // Monitoring Effects
    useEffect(() => {
        if (isCompanyAdmin) {
            fetchConversations();
            fetchIngestions();
        }
    }, [isCompanyAdmin]);

    const handleRateMessage = async (msgId: string | undefined, rating: 'up' | 'down') => {
        if (!msgId) return;

        // Optimistic update
        // Optimistic update via store
        if (activeConversationId) {
            updateMessage(activeConversationId, msgId, (m) => m.assistantMessageId === msgId ? { ...m, rating } : m);
        }

        try {
            await companyBrainService.rateMessage(msgId, { rating });
            toast({ title: "Feedback Saved", description: rating === 'up' ? "Glad it helped!" : "We'll work on improving this answer." });

            if (rating === 'down') {
                setSelectedMessageId(msgId);
                setIsFeedbackOpen(true);
            }
        } catch (error) {
            toast({ title: "Error", description: "Could not save rating.", variant: "destructive" });
        }
    };

    const handleShare = async () => {
        if (!activeConversationId) return;
        setIsSharingLoading(true);

        try {
            const emails = shareEmails.split(',').map(e => e.trim()).filter(e => e !== '');
            const res = await companyBrainService.shareConversation(activeConversationId, {
                isShared: true, // Always set to true when using the share dialog's "Save" or "Enable"
                sharingMode: shareMode,
                allowedEmails: emails
            });

            const updated = res.data.data;
            setIsCurrentShared(true);
            setShareToken(updated.shareToken);

            let desc = "";
            if (shareMode === 'public') {
                desc = "Anyone with the link can view.";
            } else if (emails.length === 0) {
                desc = "Visible to all BIGlogic users.";
            } else {
                desc = `Restricted to ${emails.length} specific email(s).`;
            }

            toast({
                title: "Sharing Updated",
                description: desc,
            });
        } catch (error) {
            toast({
                title: "Share Failed",
                description: "Could not update sharing settings.",
                variant: "destructive"
            });
        } finally {
            setIsSharingLoading(false);
        }
    };

    const toggleSharingVisibility = async (val: boolean) => {
        if (!activeConversationId) return;
        try {
            const res = await companyBrainService.shareConversation(activeConversationId, { isShared: val });
            const updated = res.data.data;
            setIsCurrentShared(val);
            if (updated.shareToken) setShareToken(updated.shareToken);

            toast({
                title: val ? "Sharing Enabled" : "Sharing Disabled",
                description: val ? "The link is now active." : "The link is now inactive.",
            });
        } catch (err) {
            toast({ title: "Error", description: "Could not toggle sharing.", variant: "destructive" });
        }
    };

    const handleSubmitFeedback = async () => {
        if (!selectedMessageId) return;
        setIsSubmittingFeedback(true);

        try {
            await companyBrainService.rateMessage(selectedMessageId, {
                feedbackText,
                feedbackFile: feedbackFile || undefined
            });

            if (activeConversationId) {
                updateMessage(activeConversationId, selectedMessageId, (m) =>
                    m.assistantMessageId === selectedMessageId ? { ...m, feedbackText } : m
                );
            }

            toast({ title: "Knowledge Captured", description: "The brain will learn from your feedback." });
            setIsFeedbackOpen(false);
            setFeedbackText('');
            setFeedbackFile(null);
        } catch (error) {
            toast({ title: "Error", description: "Failed to submit feedback.", variant: "destructive" });
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const toggleVoiceRecording = (
        isRecording: boolean,
        setRecordingState: React.Dispatch<React.SetStateAction<boolean>>,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        if (isRecording && activeRecognitionRef.current) {
            activeRecognitionRef.current.stop();
            setRecordingState(false);
            return;
        }

        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast({ title: "Not Supported", description: "Your browser doesn't support speech recognition.", variant: "destructive" });
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => setRecordingState(true);
        recognition.onresult = (event: any) => {
            let transcript = '';
            for (let i = 0; i < event.results.length; ++i) {
                transcript += event.results[i][0].transcript;
            }
            setter(transcript);
        };
        recognition.onerror = () => setRecordingState(false);
        recognition.onend = () => setRecordingState(false);

        recognition.start();
        activeRecognitionRef.current = recognition;
    };

    const handleSubmitQA = async (status: 'Pending' | 'Synchronized' = 'Synchronized') => {
        if (!qaQuestion.trim()) return;
        setIsSubmittingQA(true);

        try {
            await companyBrainService.qaIngest({
                question: qaQuestion,
                answer: qaAnswer,
                label: qaLabel,
                tier: qaTier,
                folder: qaFolder,
                name: qaQuestion.substring(0, 50),
                status: status
            });
            toast({
                title: status === 'Pending' ? "Question Saved" : "Q&A Saved",
                description: status === 'Pending' ? "An admin can provide an answer later." : "The brain has ingested this knowledge."
            });
            setQaQuestion('');
            setQaAnswer('');
            setIsQAOpen(false);
            fetchIngestions();
        } catch (error) {
            toast({ title: "Upload Failed", description: "Could not ingest Q&A pair.", variant: "destructive" });
        } finally {
            setIsSubmittingQA(false);
        }
    };

    const processKnowledgeFile = (file: File) => {
        setKnowledgeFile(file);

        // Auto-classification logic based on Project Requirements
        const fileName = file.name.toLowerCase();
        if (fileName.includes('contract') || fileName.includes('disclosure') || fileName.includes('hic_recon')) {
            setKnowledgeLabel('Contracts & Legal Documents');
            setKnowledgeTier('Tier 1');
            setKnowledgeFolder('Contracts');
        } else if (fileName.includes('standard') || fileName.includes('iicrc') || fileName.includes('ansi')) {
            setKnowledgeLabel('Industry Standards / Codes');
            setKnowledgeTier('Tier 2');
            setKnowledgeFolder('Standards');
        } else if (fileName.includes('sop') || fileName.includes('process') || fileName.includes('requirement')) {
            setKnowledgeLabel('Internal SOPs / Processes');
            setKnowledgeTier('Tier 3');
            setKnowledgeFolder('SOPs');
        } else if (fileName.includes('draw') || fileName.includes('financial') || fileName.includes('billing')) {
            setKnowledgeLabel('Financial / Accounting Guidance');
            setKnowledgeTier('Tier 3');
            setKnowledgeFolder('Financial');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processKnowledgeFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processKnowledgeFile(file);
        }
    };

    const { toast } = useToast();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastScrollHeightRef = useRef<number>(0);

    // Stable Scroll to Bottom Helper
    const scrollToBottom = (behavior: 'auto' | 'smooth' = 'auto') => {
        const viewport = scrollAreaRef.current;
        if (!viewport) return;

        if (behavior === 'auto') {
            viewport.scrollTop = viewport.scrollHeight;
        } else {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
        lastScrollHeightRef.current = viewport.scrollHeight;
    };

    // 1. Auto-scroll on new messages
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (isAtBottom || lastMessage?.role === 'user') {
            const behavior = (isLoading && lastMessage?.role === 'assistant') ? 'auto' : 'smooth';
            requestAnimationFrame(() => scrollToBottom(behavior));
        }
    }, [messages, isLoading]);

    // 2. Snap to bottom on container resize (e.g., textarea expanding)
    useEffect(() => {
        const viewport = scrollAreaRef.current;
        if (!viewport) return;

        const resizeObserver = new ResizeObserver(() => {
            if (isAtBottom) {
                // If we were at bottom, stay at bottom during resize
                viewport.scrollTop = viewport.scrollHeight;
            }
        });

        resizeObserver.observe(viewport);
        // Also observe the inner content to catch message changes
        const content = viewport.firstElementChild;
        if (content && content instanceof Element) resizeObserver.observe(content);

        return () => resizeObserver.disconnect();
    }, [isAtBottom]);


    // Voice Mode Integration
    const handleVoiceQuery = async (text: string) => {
        let currentConvId = activeConversationId;
        if (!currentConvId) {
            currentConvId = createConversation('New Chat');
        }

        const userMessageId = Date.now().toString();
        addMessage(currentConvId, {
            id: userMessageId,
            role: 'user',
            content: text,
        });

        setIsLoading(true);

        const assistantMessageId = (Date.now() + 1).toString();
        addMessage(currentConvId, {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            assistantMessageId: assistantMessageId // Initialize with local ID for UI visibility
        });

        try {
            const userStr = localStorage.getItem('user');
            const token = userStr ? JSON.parse(userStr).token : null;
            const response = await fetch(
                `${API_URL}/company-brain/query`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        query: text,
                        conversationId: currentConvId || undefined,
                        mode: 'Jobsite Guidance',
                        stream: true
                    })
                }
            );

            if (!response.ok) throw new Error('Network response was not ok');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') continue;
                            try {
                                const parsed = JSON.parse(data);

                                // Sync Real ID from Mongo if provided in stream
                                if (parsed.assistantMessageId) {
                                    updateMessage(currentConvId, assistantMessageId, (msg) => ({ ...msg, assistantMessageId: parsed.assistantMessageId }));
                                }

                                if (parsed.token) {
                                    fullText += parsed.token;
                                    updateMessage(currentConvId, assistantMessageId, (msg) => ({ ...msg, content: fullText }));
                                }
                            } catch (e) {
                                console.error('Error parsing SSE data:', e);
                            }
                        }
                    }
                }
            }

            // Intercept fallback message
            const fallbackSearch = "I could not find information about this in the company knowledge base.";
            const fallbackReplacement = "I could not find information about this in the company knowledge base. Please contact your manager about this question.";

            if (fullText.includes(fallbackSearch) && !fullText.includes("Please contact your manager")) {
                fullText = fullText.replace(fallbackSearch, fallbackReplacement);
                updateMessage(currentConvId, assistantMessageId, (msg) => ({ ...msg, content: fullText }));
            }

            // Speak the final response
            voiceMode.speak(fullText || "I processed your query based on our company knowledge base.");
        } catch (error: any) {
            console.error(error);
            toast({
                title: 'Brain Connection Error',
                description: error.message || 'There was a problem reaching the integrating AI model.',
                variant: 'destructive',
            });
            updateMessage(currentConvId, assistantMessageId, (msg) => ({
                ...msg,
                content: 'System Error: Cannot connect to n8n webhook routing.'
            }));
            voiceMode.speak("I encountered a connection error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const voiceMode = useVoiceMode({
        onQueryReady: handleVoiceQuery,
        silenceTimeoutMs: 5000 // Reduced to 5 seconds for better responsiveness
    });

    const handleSendQuery = async (e?: React.FormEvent, customQuery?: string, context?: string) => {
        if (e) e.preventDefault();
        const questionToUse = customQuery || query;
        if (!questionToUse.trim()) return;

        // Reset/Create AbortController for this request
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        // Combine context if provided for the backend, but keep only the question for local history
        const queryToUse = context
            ? `Above Response: ${context}\n\nQuestion: ${questionToUse}`
            : questionToUse;

        let currentConvId = activeConversationId;
        if (!currentConvId) {
            currentConvId = createConversation('New Chat');
        }

        let userMessageId = Date.now().toString();
        addMessage(currentConvId, {
            id: userMessageId,
            role: 'user',
            content: customQuery || queryToUse, // Display only the user's intended question
        });

        if (!customQuery) {
            setQuery('');
        }
        setIsLoading(true);

        // Placeholder for assistant message
        let assistantMessageId = (Date.now() + 1).toString();
        addMessage(currentConvId, {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            assistantMessageId: assistantMessageId // Initialize with local ID
        });

        try {
            const response = await companyBrainService.queryStream(queryToUse, currentConvId || undefined, undefined, abortControllerRef.current.signal);

            if (!response.ok) throw new Error('Network response was not ok');

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = '';
            let metadataReceived = false;

            if (reader) {
                let buffer = '';
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    // SSE messages are separated by double newlines
                    const parts = buffer.split('\n\n');

                    // The last part might be incomplete, keep it in the buffer
                    buffer = parts.pop() || '';

                    for (const part of parts) {
                        const lines = part.split('\n');
                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                if (data === '[DONE]') continue;
                                try {
                                    const parsed = JSON.parse(data);

                                    // Handle metadata (conversationId)
                                    if (parsed.conversationId && !metadataReceived) {
                                        metadataReceived = true;
                                        // If we were on a temporary ID, replace it with the Mongo ID
                                        if (currentConvId !== parsed.conversationId) {
                                            replaceId(currentConvId, parsed.conversationId);
                                            currentConvId = parsed.conversationId;
                                        }
                                    }

                                    // Sync Real Assistant Message ID from Mongo
                                    if (parsed.assistantMessageId && assistantMessageId !== parsed.assistantMessageId) {
                                        updateMessage(currentConvId, assistantMessageId, (msg) => ({ ...msg, assistantMessageId: parsed.assistantMessageId, id: parsed.assistantMessageId }));
                                        assistantMessageId = parsed.assistantMessageId;
                                    }

                                    // Sync Real User Message ID from Mongo
                                    if (parsed.userMessageId && userMessageId !== parsed.userMessageId) {
                                        updateMessage(currentConvId, userMessageId, (msg) => ({ ...msg, id: parsed.userMessageId }));
                                        userMessageId = parsed.userMessageId;
                                    }

                                    if (parsed.token !== undefined) {
                                        fullText += parsed.token;
                                        console.log('Token received:', parsed.token, 'Full text length:', fullText.length, 'Msg ID:', assistantMessageId);
                                        updateMessage(currentConvId, assistantMessageId, (msg) => ({ ...msg, content: fullText }));
                                    }
                                } catch (e) {
                                    console.error('Error parsing SSE data:', e);
                                }
                            }
                        }
                    }
                }
            }

            // Intercept fallback message
            const fallbackSearch = "I could not find information about this in the company knowledge base.";
            const fallbackReplacement = "I could not find information about this in the company knowledge base. Please contact your manager about this question.";

            if (fullText.includes(fallbackSearch) && !fullText.includes("Please contact your manager")) {
                fullText = fullText.replace(fallbackSearch, fallbackReplacement);
                updateMessage(currentConvId, assistantMessageId, (msg) => ({ ...msg, content: fullText }));
            }

            // Sync ID if it was a temporary local ID
            if (metadataReceived && activeConversationId !== currentConvId) {
                // This shouldn't normally happen if we update currentConvId inside the loop
            }

            // Sync the final accumulated text just in case stream updates were batched/lost
            if (fullText.trim()) {
                updateMessage(currentConvId || '', assistantMessageId, (msg) => ({ ...msg, content: fullText }));
            }

            // Refresh conversation list for user & admin side
            fetchConversations();
            if (isCompanyAdmin) fetchConversations();
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Stream aborted');
                return;
            }
            console.error(error);
            toast({
                title: 'Brain Connection Error',
                description: error.message || 'There was a problem reaching the integrating AI model.',
                variant: 'destructive',
            });
            updateMessage(currentConvId, assistantMessageId, (msg) => ({
                ...msg,
                content: `System Error: ${error.message || 'Cannot connect to integration.'}`
            }));
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsLoading(false);
        }
    };

    const handleEditSubmit = async () => {
        if (!editMsgId || !activeConversationId || !editMsgText.trim()) {
            setIsEditMsgDialogOpen(false);
            return;
        }

        try {
            // 1. Delete messages from backend
            await companyBrainService.deleteMessagesFrom(editMsgId);

            // 2. Truncate local messages in the store
            deleteMessagesFrom(activeConversationId, editMsgId);

            // 3. Resend the edited query
            setIsEditMsgDialogOpen(false);
            setEditMsgId(null);
            handleSendQuery(undefined, editMsgText);
            setEditMsgText('');
        } catch (error) {
            console.error('Failed to edit message:', error);
            toast({
                title: "Error editing message",
                description: "There was a problem updating the chat history.",
                variant: "destructive"
            });
        }
    };

    const handleSubmitFieldNote = async () => {
        if (!fieldNoteContent.trim()) return;
        setIsSubmittingNote(true);

        try {
            await companyBrainService.fieldNoteIngest(
                { field_note_text: fieldNoteContent, project_id: 'GLOBAL', name: fieldNoteName }
            );
            toast({
                title: "Field Note Saved",
                description: "Sent to the Brain. Guardian protocol is analyzing for risk.",
            });
            setFieldNoteContent('');
            setFieldNoteName('');
            setIsFieldNoteOpen(false);
        } catch (error) {
            toast({
                title: "Upload Failed",
                description: "Could not push note to the Company Brain.",
                variant: "destructive"
            });
        } finally {
            setIsSubmittingNote(false);
        }
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopyId(id);
        setTimeout(() => setCopyId(null), 2000);
        toast({
            title: "Copied to clipboard",
            description: "Message content has been copied.",
        });
    };

    const handleCopyQA = async (msg: any, idx: number) => {
        // Find the question (the message preceding this assistant message)
        const questionMsg = messages[idx - 1];
        const question = questionMsg?.role === 'user' ? questionMsg.content : "Shared Q&A Pair";
        const answer = cleanContent(msg.content);

        const plainText = `❓ Question: ${question}\n\n✅ AI Answer: ${answer}\n\n---\nShared from BigLogic AI Brain`;

        const html = `
            <div style="font-family: sans-serif; color: #333; line-height: 1.5;">
                <p style="color: #4f46e5; font-size: 1.1em; margin-bottom: 4px;"><strong>❓ Question</strong></p>
                <p style="margin-top: 0; margin-bottom: 20px;">${question}</p>
                <p style="color: #4f46e5; font-size: 1.1em; margin-bottom: 4px;"><strong>✅ AI Answer</strong></p>
                <div style="margin-top: 0; margin-bottom: 20px;">${answer.replace(/\n/g, '<br/>')}</div>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 0.8em; color: #64748b;"><em>Shared from BigLogic AI Brain</em></p>
            </div>
        `;

        try {
            // Attempt Rich Text copying
            const blobPlain = new Blob([plainText], { type: 'text/plain' });
            const blobHtml = new Blob([html], { type: 'text/html' });
            const data = [new ClipboardItem({ 'text/plain': blobPlain, 'text/html': blobHtml })];
            await navigator.clipboard.write(data);

            setCopyId(msg.id);
            setTimeout(() => setCopyId(null), 2000);
            toast({
                title: "Copied Q&A Pair",
                description: "Formatted with rich text for sharing."
            });
        } catch (err) {
            // Fallback for browsers without ClipboardItem support
            navigator.clipboard.writeText(plainText);
            setCopyId(msg.id);
            setTimeout(() => setCopyId(null), 2000);
            toast({
                title: "Copied Pair",
                description: "Copied as plain text."
            });
        }
    };

    const handleShareQA = async (msg: any, idx: number) => {
        const questionMsg = messages[idx - 1];
        const question = questionMsg?.role === 'user' ? questionMsg.content : "Shared Q&A Pair";
        const answer = cleanContent(msg.content);

        const shareText = `❓ Question: ${question}\n\n✅ AI Answer: ${answer}\n\nShared from BigLogic AI Brain`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'BIGlogic AI Brain Q&A',
                    text: shareText,
                });
            } catch (err) {
                // Ignore AbortError (user cancelled)
                if ((err as Error).name !== 'AbortError') {
                    handleCopyQA(msg, idx);
                }
            }
        } else {
            handleCopyQA(msg, idx);
        }
    };

    const handleKnowledgeUpload = async () => {
        if (!knowledgeFile) return;
        setIsUploadingDocument(true);

        const formData = new FormData();
        formData.append('document', knowledgeFile);
        formData.append('label', knowledgeLabel);
        formData.append('tier', knowledgeTier);
        formData.append('folder', knowledgeFolder);
        if (knowledgeName) {
            formData.append('name', knowledgeName);
        }

        try {
            await companyBrainService.uploadKnowledge(formData);
            toast({
                title: "Document Ingested",
                description: "The file was successfully parsed with classification metadata.",
            });
            setKnowledgeFile(null);
            setKnowledgeName('');
            setIsUploadOpen(false);
        } catch (error: any) {
            toast({
                title: "Upload Failed",
                description: error.response?.data?.message || "Could not process the document for ingestion.",
                variant: "destructive"
            });
        } finally {
            setIsUploadingDocument(false);
        }
    };

    const handleDeleteChat = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Stop from clicking the chat
        setChatToDeleteId(id);
        setIsChatDeleteConfirmOpen(true);
    };

    const confirmDeleteChat = async () => {
        if (!chatToDeleteId) return;

        try {
            // Only call backend if it looks like a Mongo ID (24-char hex)
            const isMongoId = /^[0-9a-fA-F]{24}$/.test(chatToDeleteId);

            if (isMongoId) {
                await companyBrainService.deleteConversation(chatToDeleteId);
            }

            deleteConversation(chatToDeleteId);

            toast({
                title: isMongoId ? "Conversation Deleted" : "Local Chat Removed",
                description: "The chat history has been permanently removed.",
            });

            // If we deleted the active chat, reset it
            if (activeConversationId === chatToDeleteId) {
                const newId = createConversation('New Chat');
                setActiveConversation(newId);
                setQuery('');
            }

            // Refresh all lists (Monitor, etc)
            fetchConversations();
        } catch (error: any) {
            toast({
                title: "Deletion Failed",
                description: "Could not remove the conversation from the server.",
                variant: "destructive"
            });
        } finally {
            setIsChatDeleteConfirmOpen(false);
            setChatToDeleteId(null);
        }
    };

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Filter to only show if selection is within an assistant message
            // (Heuristic: check if any parent has 'prose' and 'assistant' content context)
            const container = selection.anchorNode?.parentElement;
            const isInsideAssistantMsg = container?.closest('.prose-zinc');

            if (isInsideAssistantMsg) {
                setSelectionData({
                    text: selection.toString().trim(),
                    x: rect.left + (rect.width / 2),
                    y: rect.top - 45, // Position above the text
                    visible: true
                });
            } else {
                setSelectionData(prev => ({ ...prev, visible: false }));
            }
        } else {
            setSelectionData(prev => ({ ...prev, visible: false }));
        }
    };

    const handleTagAndAsk = () => {
        if (!selectionData.text) return;
        const tagText = `Can you explain more about this part from the response: "${selectionData.text.length > 100 ? selectionData.text.substring(0, 100) + '...' : selectionData.text}"?`;
        setQuery(tagText);
        setSelectionData(prev => ({ ...prev, visible: false }));

        // Clear selection
        window.getSelection()?.removeAllRanges();

        toast({
            title: "Text Tagged",
            description: "Follow-up question pre-filled in the chat box.",
        });
    };

    return (
        <div className="flex w-full bg-background h-screen overflow-hidden">
            <VoiceModeOverlay
                isActive={voiceMode.isActive}
                isListening={voiceMode.isListening}
                isThinking={voiceMode.isThinking}
                isSpeaking={voiceMode.isSpeaking}
                isMicActive={voiceMode.isMicActive}
                transcript={voiceMode.transcript}
                onClose={() => voiceMode.toggleVoiceMode()}
                onManualSubmit={() => voiceMode.manualSubmit()}
            />
            {hideScrollbarStyle}

            <div className="flex-1 flex min-w-0 min-h-0 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex w-full min-h-0 bg-white dark:bg-[#020617] overflow-hidden">
                    <AnimatePresence initial={false}>
                        {isSidebarOpen && (
                            <motion.aside
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 320, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="h-full border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0b] flex flex-col flex-shrink-0 z-50 overflow-hidden shadow-2xl transition-colors duration-300"
                            >
                                <div className="p-4" /> {/* Spacer to maintain top margin */}

                                <div className="px-4 mb-6 space-y-4">
                                    <div onClick={() => navigate("/dashboard")} className="cursor-pointer flex items-center gap-3 hover:opacity-80 transition-opacity">
                                        <img src="/logo.png" className="h-14 w-auto dark:block hidden" alt="BigLogic Logo" />
                                        <img src="/logo-light-theme.png" className="h-14 w-auto dark:hidden block" alt="BigLogic Logo" />
                                    </div>
                                    <Button
                                        onClick={startNewChat}
                                        className="w-full bg-indigo-600 dark:bg-white/10 hover:bg-indigo-700 dark:hover:bg-white/20 rounded-xl shadow-sm dark:shadow-lg dark:shadow-black/20 py-6 text-white dark:text-white/90 font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Chat
                                    </Button>

                                    <div className="relative group">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-white/40 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
                                        <Input
                                            placeholder="Search chats..."
                                            value={historySearch}
                                            onChange={(e) => setHistorySearch(e.target.value)}
                                            className="h-9 pl-9 bg-gray-100 dark:bg-white/5 border-none text-gray-900 dark:text-white/70 placeholder:text-gray-400 dark:placeholder:text-white/20 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none rounded-xl transition-all"
                                        />
                                    </div>
                                </div>

                                <ScrollArea className="flex-1 px-3">
                                    <div className="space-y-6 pb-6">
                                        {/* Navigation Sections */}
                                        <div className="space-y-4">
                                            {!isMaster && isCompanyAdmin && (
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest px-4 mb-2 flex items-center gap-2">
                                                        <Brain className="w-3 h-3" />
                                                        Intelligence
                                                    </div>
                                                    <TabsList className="flex flex-col h-auto bg-transparent border-none p-0 gap-1">
                                                        <TabsTrigger
                                                            value="brain"
                                                            className="w-full justify-start text-[13px] font-semibold px-4 py-2.5 data-[state=active]:bg-indigo-600 dark:data-[state=active]:bg-[#1F3760] data-[state=active]:text-white rounded-xl transition-all flex items-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 group border-none shadow-none"
                                                        >
                                                            <MessageSquare className="w-4 h-4 mr-3 opacity-70 group-data-[state=active]:opacity-100 transition-opacity" />
                                                            Knowledge AI
                                                        </TabsTrigger>
                                                        <TabsTrigger
                                                            value="trained-qa"
                                                            className="w-full justify-start text-[13px] font-semibold px-4 py-2.5 data-[state=active]:bg-indigo-600 dark:data-[state=active]:bg-[#1F3760] data-[state=active]:text-white rounded-xl transition-all flex items-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 group border-none shadow-none"
                                                        >
                                                            <Sparkles className="w-4 h-4 mr-3 opacity-70 group-data-[state=active]:opacity-100 transition-opacity" />
                                                            Brain Training – Q&A
                                                        </TabsTrigger>
                                                    </TabsList>
                                                </div>
                                            )}

                                            {!isMaster && isCompanyAdmin && (
                                                <div className="space-y-1 pt-2">
                                                    <div className="text-[10px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest px-4 mb-2 flex items-center gap-2">
                                                        <Settings className="w-3 h-3" />
                                                        Management
                                                    </div>
                                                    <TabsList className="flex flex-col h-auto bg-transparent border-none p-0 gap-1">
                                                        <TabsTrigger
                                                            value="ingest"
                                                            className="w-full justify-start text-[13px] font-semibold px-4 py-2.5 data-[state=active]:bg-indigo-600 dark:data-[state=active]:bg-[#1F3760] data-[state=active]:text-white rounded-xl transition-all flex items-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 group border-none shadow-none"
                                                        >
                                                            <FolderOpen className="w-4 h-4 mr-3 opacity-70 group-data-[state=active]:opacity-100 transition-opacity" />
                                                            Documents
                                                        </TabsTrigger>
                                                        <TabsTrigger
                                                            value="monitor"
                                                            className="w-full justify-start text-[13px] font-semibold px-4 py-2.5 data-[state=active]:bg-indigo-600 dark:data-[state=active]:bg-[#1F3760] data-[state=active]:text-white rounded-xl transition-all flex items-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 group border-none shadow-none"
                                                        >
                                                            <Activity className="w-4 h-4 mr-3 opacity-70 group-data-[state=active]:opacity-100 transition-opacity" />
                                                            Monitor
                                                        </TabsTrigger>
                                                    </TabsList>
                                                </div>
                                            )}
                                        </div>

                                        {/* History Section */}
                                        <div className="space-y-2 ">
                                            <div className="text-[10px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest px-4 mb-3 flex items-center gap-2">
                                                <History className="w-3 h-3" />
                                                Chats
                                            </div>
                                            <div className="flex flex-col gap-1 px-1 h-[500px] overflow-y-auto scrollbar-hide">
                                                {conversations.filter(c => (c.messages?.length > 0 || /^[0-9a-fA-F]{24}$/.test(c.id)) && c.title.toLowerCase().includes(historySearch.toLowerCase())).length === 0 ? (
                                                    <div className="px-4 py-2 text-[11px] text-gray-400 dark:text-white/40 italic">
                                                        {historySearch ? 'No matches found' : 'No recent chats'}
                                                    </div>
                                                ) : (
                                                    conversations
                                                        .filter(c => (c.messages?.length > 0 || /^[0-9a-fA-F]{24}$/.test(c.id)) && c.title.toLowerCase().includes(historySearch.toLowerCase()))
                                                        .map(conv => (
                                                            <div
                                                                key={conv.id}
                                                                onClick={() => {
                                                                    if (editingChatId === conv.id) return; // Prevent navigation while editing
                                                                    if (conv.messages?.length > 0 || !conv.id.includes('-')) {
                                                                        loadConversation(conv.id);
                                                                        setActiveTab('brain');
                                                                    } else {
                                                                        setActiveConversation(conv.id);
                                                                        setActiveTab('brain');
                                                                    }
                                                                }}
                                                                className={`cursor-pointer group relative flex items-center px-3 py-2 rounded-xl transition-all ${activeConversationId === conv.id && activeTab === 'brain'
                                                                    ? 'bg-indigo-50 dark:bg-white/10 text-indigo-700 dark:text-white shadow-sm border-none'
                                                                    : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
                                                                    }`}
                                                            >
                                                                {editingChatId === conv.id ? (
                                                                    <Input
                                                                        autoFocus
                                                                        value={editingTitle}
                                                                        onChange={(e) => setEditingTitle(e.target.value)}
                                                                        onKeyDown={async (e) => {
                                                                            if (e.key === 'Enter') {
                                                                                if (editingTitle.trim()) {
                                                                                    // Optimistic update
                                                                                    upsertConversation(conv.id, editingTitle, conv.messages);
                                                                                    try {
                                                                                        // Check if it's a real chat in DB
                                                                                        if (/^[0-9a-fA-F]{24}$/.test(conv.id)) {
                                                                                            // We need a rename endpoint in service, adding it now
                                                                                            // @ts-ignore
                                                                                            await companyBrainService.updateConversationTitle(conv.id, editingTitle);
                                                                                        }
                                                                                    } catch (err) {
                                                                                        toast({ title: 'Error', description: 'Failed to rename chat.', variant: 'destructive' });
                                                                                    }
                                                                                }
                                                                                setEditingChatId(null);
                                                                            } else if (e.key === 'Escape') {
                                                                                setEditingChatId(null);
                                                                            }
                                                                        }}
                                                                        onBlur={() => setEditingChatId(null)}
                                                                        className="h-6 py-0 px-2 text-xs bg-gray-100 dark:bg-slate-700 border-0 focus:ring-0 focus-visible:ring-0 text-gray-900 dark:text-white rounded-lg flex-1 ring-0 outline-none"
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        <span className="text-xs font-medium truncate flex-1 leading-tight mr-2 text-gray-800 dark:text-white" title={conv.title}>
                                                                            {conv.title.length > 30 ? conv.title.substring(0, 30) + "..." : conv.title}
                                                                        </span>
                                                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all gap-0.5">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-6 text-gray-500 dark:text-white/60 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg shrink-0"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setEditingChatId(conv.id);
                                                                                    setEditingTitle(conv.title);
                                                                                }}
                                                                                title="Rename"
                                                                            >
                                                                                <Edit3 className="w-3 h-3" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className={`h-6 w-6 text-gray-500 dark:text-white/60 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg shrink-0`}
                                                                                onClick={(e) => handleDeleteChat(e, conv.id)}
                                                                                title="Delete"
                                                                            >
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </Button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>


                            </motion.aside>
                        )}
                    </AnimatePresence>


                    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white dark:bg-[#020617] relative overflow-hidden">

                        <header className="h-20 border-b border-gray-200 dark:border-none bg-white dark:bg-[#020617] flex items-center justify-between px-8 sticky top-0 z-50 flex-shrink-0 shadow-sm dark:shadow-2xl dark:shadow-black/20 relative">
                            {/* Left Controls */}
                            <div className="flex items-center gap-4 min-w-[200px]">

                                {/* <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1" /> */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate('/dashboard')}
                                    className="text-gray-500 dark:text-white/60 hover:text-indigo-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all h-10 w-10 border border-gray-200 dark:border-white/5"
                                    title="Back to Dashboard"
                                >
                                    <ArrowLeft size={20} />
                                </Button>
                                {/* <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1" /> */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className="text-gray-500 dark:text-muted-foreground hover:text-indigo-600 dark:hover:text-foreground hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all h-10 w-10 border border-gray-200 dark:border-white/5"
                                    title={isSidebarOpen ? "Close Sidebar " : "Open Sidebar"}
                                >
                                    {isSidebarOpen ? <SidebarClose size={22} /> : <SidebarOpen size={22} />}
                                </Button>
                            </div>

                            {/* Centered Navigation - Absolutely Centered */}
                            {isMaster && (
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 pointer-events-none">
                                    <div className="pointer-events-auto">
                                        <TabsList className="bg-gray-100 dark:bg-white/5 rounded-2xl p-1 h-12 border border-gray-200 dark:border-white/5 backdrop-blur-md">
                                            <TabsTrigger
                                                value="brain"
                                                className="rounded-xl px-6 h-10 text-xs font-bold transition-all flex items-center gap-2 text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-white data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20"
                                            >
                                                <Brain className="w-4 h-4" />
                                                Knowledge AI
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="trained-qa"
                                                className="rounded-xl px-6 h-10 text-xs font-bold transition-all flex items-center gap-2 text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-white data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20"
                                            >
                                                <Sparkles className="w-4 h-4" />
                                                Brain Training
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="ingest"
                                                className="rounded-xl px-6 h-10 text-xs font-bold transition-all flex items-center gap-2 text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-white data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20"
                                            >
                                                <UploadCloud className="w-4 h-4" />
                                                Documents
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="monitor"
                                                className="rounded-xl px-6 h-10 text-xs font-bold transition-all flex items-center gap-2 text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-white data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20"
                                            >
                                                <Activity className="w-4 h-4" />
                                                Monitor
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>
                                </div>
                            )}

                            {/* Right Controls */}
                            <div className="flex items-center gap-6 min-w-[200px] justify-end">
                                <ThemeToggle />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-4 group outline-none">
                                            <div className="text-right hidden sm:block">
                                                <p className={`text-sm font-bold ${useTheme().theme === "dark" ? "text-white" : "text-gray-900"} group-hover:text-indigo-600 transition-colors tracking-tight`}>{user?.name || "User"}</p>
                                                <p className="text-[10px] text-gray-500 dark:text-white/40 font-bold uppercase tracking-wider">{user?.role === 'company_admin' ? 'Company Admin' : 'Team member'}</p>
                                            </div>
                                            <Avatar className={`h-10 w-10 border-2 ${useTheme().theme === "dark" ? "border-white/10" : "border-indigo-100 shadow-sm"} ring-2 ring-transparent group-hover:ring-indigo-500/50 transition-all cursor-pointer shadow-lg`}>
                                                <AvatarImage src={user?.avatar} className="object-cover" />
                                                <AvatarFallback className="bg-indigo-600 text-white font-bold text-sm">
                                                    {user?.name?.slice(0, 2).toUpperCase() || "US"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-[#0f172a] border-gray-200 dark:border-white/10 text-gray-800 dark:text-white/90">
                                        <DropdownMenuLabel className="text-xs text-gray-500 dark:text-white/60 font-bold uppercase tracking-widest">My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-gray-100 dark:bg-white/5" />
                                        <DropdownMenuItem className="focus:bg-indigo-50 dark:focus:bg-white/5 focus:text-indigo-700 dark:focus:text-white cursor-pointer py-2.5 rounded-lg" onClick={() => navigate("/profile")}>
                                            <Settings className="mr-3 h-4 w-4 text-gray-500 dark:text-white/60" />
                                            <span className="text-sm font-medium">Profile Settings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-gray-100 dark:bg-white/5" />
                                        <DropdownMenuItem className="text-rose-600 dark:text-rose-400 focus:text-rose-700 dark:focus:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-500/10 cursor-pointer py-2.5 rounded-lg" onClick={handleLogout}>
                                            <LogOut className="mr-3 h-4 w-4" />
                                            <span className="text-sm font-bold">Sign Out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </header>

                        <main className="flex-1 relative flex flex-col justify-start overflow-hidden bg-gray-50 dark:bg-[#020617]">

                            {activeTab === 'brain' && isChatExpanded && isMaster && (
                                <div className="flex items-center justify-center gap-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsFieldNoteOpen(true)}
                                        className="flex-1 max-w-[240px] h-12 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-900 border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all rounded-xl shadow-sm"
                                    >
                                        <Mic className="w-4 h-4 mr-2 text-indigo-600" />
                                        Upload voice note
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => setIsUploadOpen(true)}
                                        className="flex-1 max-w-[240px] h-12 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-900 border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all rounded-xl shadow-sm"
                                    >
                                        <UploadCloud className="w-4 h-4 mr-2 text-indigo-600" />
                                        Upload Knowledge
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => setIsQAOpen(true)}
                                        className="flex-1 max-w-[240px] h-12 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-900 border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all rounded-xl shadow-sm"
                                    >
                                        <MessageSquarePlus className="w-4 h-4 mr-2 text-indigo-600" />
                                        Train Q&A (Admin)
                                    </Button>
                                </div>
                            )}
                            {activeTab === 'brain' && (
                                <TabsContent value="brain" className="flex-1 mt-0 outline-none flex flex-col md:flex-row h-full overflow-hidden">


                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 }}
                                        className="flex-1 flex flex-col h-full relative transition-all duration-500 overflow-hidden"
                                    >

                                        <Card className="flex-1 flex flex-col border-none bg-transparent shadow-none min-h-0">
                                            <CardContent className="flex-1 p-0 flex flex-col min-h-0 bg-white dark:bg-[#020617] border-none shadow-xl overflow-hidden relative">
                                                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-100 dark:from-muted/20 to-transparent pointer-events-none z-10" />

                                                <div
                                                    className="flex-1 px-4 py-8 min-h-0 overflow-y-auto scrollbar-hide"
                                                    ref={scrollAreaRef}
                                                    onMouseUp={handleTextSelection}
                                                >
                                                    <div className="max-w-5xl mx-auto flex flex-col gap-8">
                                                        <div className="w-full max-w-4xl mx-auto py-6 flex flex-col items-center">
                                                            <motion.div
                                                                initial={{ scale: 0.8, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                className="bg-indigo-100 dark:bg-indigo-500/15 p-5 rounded-3xl mb-6 border-none shadow-[0_0_40px_rgba(79,70,229,0.1)]"
                                                            >
                                                                <Brain className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                                                            </motion.div>
                                                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Company Brain</h2>
                                                            <p className="text-gray-500 dark:text-white/60 text-lg mb-12">Your company's knowledge, always within reach</p>

                                                            {(!isMaster && !isCompanyAdmin) && (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12 text-left">
                                                                    <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-none rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                                                        <div className="flex items-center gap-3 mb-4">
                                                                            <div className="p-2 bg-blue-50/10 text-blue-500 rounded-lg">
                                                                                <Info className="w-5 h-5" />
                                                                            </div>
                                                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">How it works</h3>
                                                                        </div>
                                                                        <p className="text-gray-600 dark:text-white/60 leading-relaxed">
                                                                            Company Brain lets you ask questions about any construction-related topic — from job site procedures to materials, codes, and processes. It responds based on the knowledge and experience your company has built up over the years, so you always have a reliable reference at your fingertips.
                                                                        </p>
                                                                    </div>

                                                                    <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-none rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                                                        <div className="flex items-center gap-3 mb-6">
                                                                            <div className="p-2 bg-emerald-50/10 text-emerald-500 rounded-lg">
                                                                                <Sparkles className="w-5 h-5" />
                                                                            </div>
                                                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">You can ask about</h3>
                                                                        </div>
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                                                                            {[
                                                                                "Job site procedures",
                                                                                "Materials & specs",
                                                                                "Building codes",
                                                                                "Safety protocols",
                                                                                "Project processes",
                                                                                "Customer communication",
                                                                                "Subcontractor coordination",
                                                                                "Inspections & permits"
                                                                            ].map((item, i) => (
                                                                                <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-white/70">
                                                                                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                                                    <span>{item}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {(!isMaster && !isCompanyAdmin) && (
                                                                <div className="w-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-none rounded-xl p-5 flex items-start gap-4 text-left">
                                                                    <FileWarning className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                                                                    <p className="text-amber-800 dark:text-amber-200/90 text-sm leading-relaxed">
                                                                        <strong>Not sure about an answer?</strong> Always check with your manager before acting on anything critical. Company Brain is a guide — your manager has the final word.
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {messages.map((msg, idx) => (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                key={msg.id}
                                                                className={`flex gap-4 group ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                            >
                                                                {msg.role === 'assistant' && (
                                                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center border-none shadow-sm mt-1">
                                                                        <Brain className="w-5 h-5 text-white" />
                                                                    </div>
                                                                )}
                                                                <div
                                                                    className={`max-w-[85%] rounded-3xl px-5 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                                                        ? 'bg-indigo-600 text-white shadow-md rounded-tr-sm'
                                                                        : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white border border-gray-200 dark:border-none shadow-sm rounded-tl-sm'
                                                                        }`}
                                                                >
                                                                    <div className={`prose prose-sm ${msg.role === 'assistant' ? 'prose-gray dark:prose-invert' : 'prose-invert prose-indigo'} max-w-none ${msg.role === 'assistant' ? 'text-gray-800 dark:text-white' : 'text-white'} prose-p:my-0.5 prose-headings:my-1.5 prose-ul:my-1 prose-li:my-0`}>
                                                                        {msg.role === 'assistant' && !msg.content && isLoading ? (
                                                                            <div className="flex gap-1.5 items-center py-2">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                                                                            </div>
                                                                        ) : (
                                                                            <div className={`${isLoading && msg.role === 'assistant' && msg.id === messages[messages.length - 1]?.id ? 'streaming-message' : ''}`}>
                                                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                                    {cleanContent(msg.content)}
                                                                                </ReactMarkdown>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* User Message Tools (Inside bubble at bottom) */}
                                                                    {msg.role === 'user' && (
                                                                        <div className="mt-2 flex items-center justify-end gap-2 transition-all">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-6 rounded-md bg-white/20 hover:bg-white/30 text-white/90 hover:text-white shadow-sm border-none"
                                                                                onClick={() => {
                                                                                    setEditMsgText(msg.content);
                                                                                    setEditMsgId(msg.id);
                                                                                    setIsEditMsgDialogOpen(true);
                                                                                }}
                                                                                title="Edit Question"
                                                                            >
                                                                                <Edit3 className="w-3 h-3" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-6 rounded-md bg-white/20 hover:bg-white/30 text-white/90 hover:text-white shadow-sm border-none"
                                                                                onClick={() => handleCopy(msg.content, msg.id)}
                                                                                title="Copy Question"
                                                                            >
                                                                                {copyId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                                                            </Button>
                                                                        </div>
                                                                    )}

                                                                    {msg.role === 'assistant' && msg.content && !isLoading && (
                                                                        <div className="mt-3 flex items-center gap-3 transition-all">
                                                                            <div className="flex items-center gap-1 bg-gray-200 dark:bg-white/5 p-1 rounded-lg border-none">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-7 w-7 rounded-md hover:bg-gray-300 dark:hover:bg-white/20 text-gray-600 dark:text-white/60 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-colors"
                                                                                    onClick={() => handleCopyQA(msg, idx)}
                                                                                    title="Copy Q&A Pair"
                                                                                >
                                                                                    {copyId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                                                </Button>
                                                                            </div>

                                                                            <div className="flex items-center gap-1.5">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-7 w-7 rounded-md hover:bg-gray-300 dark:hover:bg-white/20 text-gray-600 dark:text-white/60 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-colors"
                                                                                    onClick={() => handleShareQA(msg, idx)}
                                                                                    title="Share Q&A Pair"
                                                                                >
                                                                                    <Share2 className="w-3.5 h-3.5" />
                                                                                </Button>
                                                                            </div>

                                                                            {(isMaster || isCompanyAdmin) && msg.assistantMessageId && (
                                                                                <div className="flex items-center gap-1 ml-auto">
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        className={`h-7 w-7 rounded-md transition-all ${msg.rating === 'up' ? 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/10' : 'text-gray-500 dark:text-white/60 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/5'}`}
                                                                                        onClick={() => handleRateMessage(msg.assistantMessageId, 'up')}
                                                                                    >
                                                                                        <ThumbsUp className="w-3.5 h-3.5" />
                                                                                    </Button>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        className={`h-7 w-7 rounded-md transition-all ${msg.rating === 'down' ? 'text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-500/10' : 'text-gray-500 dark:text-white/60 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/5'}`}
                                                                                        onClick={() => handleRateMessage(msg.assistantMessageId, 'down')}
                                                                                    >
                                                                                        <ThumbsDown className="w-3.5 h-3.5" />
                                                                                    </Button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                </div>
                                                                {msg.role === 'user' && (
                                                                    <Avatar className="h-8 w-8 flex-shrink-0 border border-gray-200 dark:border-none shadow-sm mt-1">
                                                                        <AvatarImage src={user?.avatar} className="object-cover" />
                                                                        <AvatarFallback className="bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/60 text-[10px] font-bold">
                                                                            {user?.name?.slice(0, 2).toUpperCase() || "US"}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                )}
                                                            </motion.div>
                                                        ))}
                                                        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                                                            <div className="flex gap-4 justify-start">
                                                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center border-none shadow-sm mt-1 animate-pulse">
                                                                    <Sparkles className="w-4 h-4 text-white" />
                                                                </div>
                                                                <div className="bg-transparent p-4 flex gap-1.5 items-center">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.5 }}
                                                                className="ml-12 mt-4 space-y-3"
                                                            >
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                                                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-white/60">People also asked</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {(() => {
                                                                        const dynamicQs = extractPeopleAlsoAsked(messages[messages.length - 1].content);
                                                                        const displayQs = dynamicQs.length > 0 ? dynamicQs : [
                                                                            "Can you summarize this for a client?",
                                                                            "What are the key risks mentioned?",
                                                                            "Are there any missing details?"
                                                                        ];

                                                                        return displayQs.map((q, i) => (
                                                                            <button
                                                                                key={i}
                                                                                onClick={() => {
                                                                                    const lastResponse = messages[messages.length - 1]?.content;
                                                                                    handleSendQuery(undefined, q, lastResponse);
                                                                                }}
                                                                                className="text-xs px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-none text-gray-700 dark:text-white/70 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 hover:text-indigo-800 dark:hover:text-white transition-all text-left shadow-sm active:scale-95"
                                                                            >
                                                                                {q}
                                                                            </button>
                                                                        ));
                                                                    })()}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                        <div ref={messagesEndRef} />
                                                    </div>
                                                </div>

                                                <div className="p-6 bg-white dark:bg-[#020617] sticky bottom-0 z-20 opacity-100">
                                                    <div className="max-w-4xl mx-auto relative">
                                                        <form onSubmit={handleSendQuery} className="relative group">
                                                            <div className="absolute -inset-0.5 bg-indigo-500/30 dark:bg-primary/10 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                                                            <div className="relative flex items-end gap-2 bg-white dark:bg-[#0f172a] border border-gray-300 dark:border-white/5 rounded-2xl p-2 pl-4 transition-all focus-within:bg-gray-50 dark:focus-within:bg-[#131c31] shadow-xl">
                                                                <Textarea
                                                                    ref={inputRef}
                                                                    placeholder={isRecordingQuery ? "Listening..." : "Message the Brain..."}
                                                                    value={query}
                                                                    onChange={(e) => setQuery(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                                            e.preventDefault();
                                                                            handleSendQuery(e as any);
                                                                        }
                                                                    }}
                                                                    disabled={isLoading || isRecordingQuery}
                                                                    rows={1}
                                                                    className={`flex-1 min-h-[44px] max-h-48 resize-none py-3 bg-transparent border-none text-gray-900 dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 dark:placeholder:text-slate-500 text-sm scrollbar-hide`}
                                                                />
                                                                <div className="flex items-center gap-1.5 pb-1 pr-1">
                                                                    <div className="relative flex items-center justify-center">
                                                                        <AnimatePresence>
                                                                            {isRecordingQuery && (
                                                                                <>
                                                                                    {/* Primary Glowing Halo */}
                                                                                    <motion.div
                                                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                                                        className="absolute inset-x-0 inset-y-0 bg-rose-500/20 rounded-full blur-md"
                                                                                    />
                                                                                    {/* Outer Ripple 1 */}
                                                                                    <motion.div
                                                                                        initial={{ scale: 1, opacity: 0.6 }}
                                                                                        animate={{ scale: 1.8, opacity: 0 }}
                                                                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                                                                        className="absolute inset-0 bg-rose-500/40 rounded-full"
                                                                                    />
                                                                                    {/* Outer Ripple 2 */}
                                                                                    <motion.div
                                                                                        initial={{ scale: 1, opacity: 0.4 }}
                                                                                        animate={{ scale: 2.2, opacity: 0 }}
                                                                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                                                                                        className="absolute inset-0 bg-rose-500/20 rounded-full"
                                                                                    />
                                                                                </>
                                                                            )}
                                                                        </AnimatePresence>
                                                                        <Button
                                                                            type="button"
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            onClick={() => toggleVoiceRecording(isRecordingQuery, setIsRecordingQuery, setQuery)}
                                                                            className={`h-9 w-9 text-gray-500 dark:text-white/60 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl transition-all relative z-10 ${isRecordingQuery ? 'text-rose-600 bg-rose-100 dark:text-rose-500 dark:bg-rose-500/20' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                                                            title="Dictation Mode"
                                                                        >
                                                                            {isRecordingQuery ? <Mic className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
                                                                        </Button>
                                                                    </div>
                                                                    {isLoading ? (
                                                                        <Button
                                                                            type="button"
                                                                            size="icon"
                                                                            onClick={handleStopGeneration}
                                                                            className="h-9 w-9 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all shadow-lg shadow-rose-500/20"
                                                                            title="Stop Generating"
                                                                        >
                                                                            <Square className="w-4 h-4 fill-current" />
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            type="submit"
                                                                            size="icon"
                                                                            disabled={!query.trim()}
                                                                            className={`h-9 w-9 rounded-xl transition-all ${query.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20' : 'bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-white/40 cursor-not-allowed'}`}
                                                                        >
                                                                            <Send className="w-4 h-4" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </form>
                                                        <p className="text-[10px] text-center text-gray-500 dark:text-white/40 mt-3">
                                                            The Brain can make mistakes. Verify important info.
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Floating Tag & Ask Menu */}
                                        <AnimatePresence>
                                            {selectionData.visible && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    style={{
                                                        position: 'fixed',
                                                        left: selectionData.x,
                                                        top: selectionData.y,
                                                        transform: 'translateX(-50%)',
                                                        zIndex: 1000,
                                                    }}
                                                    className="flex items-center gap-1 p-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-none rounded-lg shadow-2xl"
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={handleTagAndAsk}
                                                        className="h-8 px-3 text-[11px] font-bold text-gray-800 dark:text-white hover:bg-indigo-100 dark:hover:bg-indigo-600 transition-colors flex items-center gap-1.5"
                                                    >
                                                        <Sparkles className="w-3 h-3" />
                                                        Tag & Ask
                                                    </Button>
                                                    <div className="w-[1px] h-4 bg-gray-200 dark:bg-zinc-700 mx-0.5" />
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(selectionData.text);
                                                            setSelectionData(prev => ({ ...prev, visible: false }));
                                                            window.getSelection()?.removeAllRanges();
                                                            toast({ title: "Copied", description: "Selected text copied to clipboard." });
                                                        }}
                                                        className="h-8 w-8 p-0 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                                                    >
                                                        <Copy className="w-3.5 h-3.5" />
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {!isChatExpanded && (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-96 flex-shrink-0 flex flex-col gap-6 h-full overflow-y-auto scrollbar-hide pr-2"
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.2 }}
                                            >
                                                <Card className="border border-gray-200 dark:border-none shadow-lg bg-white dark:bg-white/5 backdrop-blur-md relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                                                    <CardHeader className="pb-3 border-b border-gray-100 dark:border-none bg-white/5">
                                                        <CardTitle className="text-base flex items-center gap-2 text-gray-900 dark:text-white">
                                                            <ShieldAlert className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                                                            Risk Guardian
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="pt-5 flex flex-col gap-4">
                                                        <p className="text-gray-600 dark:text-white/60 leading-relaxed text-xs">
                                                            Guardian is analyzing active field notes, transcripts, and job interactions for hidden risk exposure based on historical precedence.
                                                        </p>
                                                        <div className="space-y-3 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-none text-xs">
                                                            <div className="flex items-center justify-between group/indicator">
                                                                <span className="text-gray-600 dark:text-white/60 flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover/indicator:scale-125 transition-transform" />
                                                                    Dispute Indicators
                                                                </span>
                                                                <span className="font-medium text-emerald-600 dark:text-emerald-500">Clear</span>
                                                            </div>
                                                            <div className="flex items-center justify-between group/indicator">
                                                                <span className="text-gray-600 dark:text-white/60 flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover/indicator:scale-125 transition-transform" />
                                                                    Legal Exposure
                                                                </span>
                                                                <span className="font-medium text-emerald-600 dark:text-emerald-500">Clear</span>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            onClick={() => setActiveTab('guardian')}
                                                            variant="outline"
                                                            className="w-full text-xs h-10 mt-2 bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-none hover:bg-orange-200 dark:hover:bg-orange-500/20 hover:text-orange-800 dark:hover:text-orange-300 transition-all font-medium"
                                                        >
                                                            View Escalation Dashboard
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: 0.3 }}
                                            >
                                                <Card className="border border-gray-200 dark:border-none bg-white dark:bg-white/5 backdrop-blur-md shadow-lg">
                                                    <CardHeader className="pb-4 border-b border-gray-100 dark:border-none bg-white/5">
                                                        <CardTitle className="text-base text-gray-900 dark:text-white">Memory Ingestion</CardTitle>
                                                        <CardDescription className="text-gray-500 dark:text-white/60 text-xs">Push context to the brain.</CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="flex flex-col gap-3 pt-5">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setIsFieldNoteOpen(true)}
                                                            className="w-full justify-start h-12 text-gray-800 dark:text-white bg-white dark:bg-white/5 border border-gray-300 dark:border-none hover:bg-gray-50 dark:hover:bg-white/10 transition-all rounded-xl"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mr-3 border border-indigo-200 dark:border-none">
                                                                <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                            </div>
                                                            <span className="font-medium">Upload voice note</span>
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setIsUploadOpen(true)}
                                                            className="w-full justify-start h-12 text-gray-800 dark:text-white bg-white dark:bg-white/5 border border-gray-300 dark:border-none hover:bg-gray-50 dark:hover:bg-white/10 transition-all rounded-xl mt-1 group"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mr-3 border border-emerald-200 dark:border-none group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/30 transition-colors">
                                                                <UploadCloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                            </div>
                                                            <span className="font-medium">Upload Knowledge</span>
                                                        </Button>

                                                        {isCompanyAdmin && (
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => setIsQAOpen(true)}
                                                                className="w-full justify-start h-12 text-gray-800 dark:text-white bg-white dark:bg-white/5 border border-gray-300 dark:border-none hover:bg-gray-50 dark:hover:bg-white/10 transition-all rounded-xl mt-1 group"
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mr-3 border border-purple-200 dark:border-none group-hover:bg-purple-200 dark:group-hover:bg-purple-500/30 transition-colors">
                                                                    <MessageSquarePlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                                </div>
                                                                <span className="font-medium">Train Q&A (Admin)</span>
                                                            </Button>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </TabsContent>
                            )}



                            {isMaster && (
                                <TabsContent value="ingest" className="border-none p-0 outline-none px-2 h-full overflow-y-auto">
                                    <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-none shadow-xl backdrop-blur-sm">
                                        <CardHeader className="border-none py-4 px-6 text-gray-900 dark:text-white">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg">
                                                            <UploadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />
                                                        </div>
                                                        Documents
                                                    </CardTitle>
                                                    <CardDescription className="text-gray-500 dark:text-white/60">Advanced document management and knowledge sync.</CardDescription>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <div className="relative group min-w-[300px]">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/40 group-focus-within:text-indigo-500 transition-colors" />
                                                        <Input
                                                            placeholder="Search documentation, SOPs, or field notes..."
                                                            className="pl-10 h-10 text-sm bg-gray-50 dark:bg-white/5 border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none text-gray-900 dark:text-white transition-all rounded-xl"
                                                            value={ingestionSearch}
                                                            onChange={(e) => {
                                                                setIngestionSearch(e.target.value);
                                                                setIngestionPage(1);
                                                            }}
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={fetchIngestions}
                                                        disabled={isIngestionsLoading}
                                                        className="h-10 px-4 border-gray-300 dark:border-none bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 text-gray-800 dark:text-white rounded-xl"
                                                    >
                                                        <RefreshCw className={`w-4 h-4 mr-2 ${isIngestionsLoading ? 'animate-spin' : ''}`} />
                                                        Sync
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="px-3">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-gray-700 dark:text-white/70">
                                                    <thead>
                                                        <tr className="bg-gray-100 dark:bg-white/5 border-b border-gray-200 dark:border-none">
                                                            <th
                                                                className="p-4 text-left font-semibold cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                                                                onClick={() => {
                                                                    const newOrder = ingestionSortBy === 'name' && ingestionSortOrder === 'asc' ? 'desc' : 'asc';
                                                                    setIngestionSortBy('name');
                                                                    setIngestionSortOrder(newOrder);
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-1">
                                                                    Document
                                                                    <Filter className={`w-3 h-3 ${ingestionSortBy === 'name' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-white/40 opacity-0 group-hover:opacity-100'}`} />
                                                                </div>
                                                            </th>
                                                            <th
                                                                className="text-left p-4 font-semibold cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                                                                onClick={() => {
                                                                    const newOrder = ingestionSortBy === 'label' && ingestionSortOrder === 'asc' ? 'desc' : 'asc';
                                                                    setIngestionSortBy('label');
                                                                    setIngestionSortOrder(newOrder);
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-1">
                                                                    Category
                                                                    <Filter className={`w-3 h-3 ${ingestionSortBy === 'label' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-white/40 opacity-0 group-hover:opacity-100'}`} />
                                                                </div>
                                                            </th>
                                                            <th
                                                                className="text-left p-4 font-semibold cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group whitespace-nowrap"
                                                                onClick={() => {
                                                                    const newOrder = ingestionSortBy === 'createdAt' && ingestionSortOrder === 'desc' ? 'asc' : 'desc';
                                                                    setIngestionSortBy('createdAt');
                                                                    setIngestionSortOrder(newOrder);
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-1">
                                                                    Date
                                                                    <Calendar className={`w-3 h-3 ${ingestionSortBy === 'createdAt' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-white/40 opacity-0 group-hover:opacity-100'}`} />
                                                                </div>
                                                            </th>
                                                            <th className="text-right p-4 font-semibold">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-none">
                                                        {ingestions.filter(item => item.status !== 'Pending').length === 0 ? (
                                                            <tr>
                                                                <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-white/40 italic">
                                                                    {isIngestionsLoading ? 'Loading history...' : 'No verified knowledge found.'}
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            ingestions.filter(item => item.status !== 'Pending').map((item) => (
                                                                <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                                    <td className="p-4">
                                                                        <div className="flex flex-col">
                                                                            <div className="max-w-[300px] truncate font-semibold text-gray-900 dark:text-white" title={item.name}>
                                                                                {item.name || (item.type === 'Field Note' ? 'Voice Note' : 'Unnamed Document')}
                                                                            </div>
                                                                            <div className="text-[11px] text-gray-500 dark:text-white/60 mt-0.5 flex items-center gap-1.5">
                                                                                <span className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded border border-gray-200 dark:border-none font-medium">
                                                                                    {item.type === 'Knowledge Document' ? 'Knowledge document' : item.type === 'Field Note' ? 'Field note' : 'Q&A'}
                                                                                </span>
                                                                                <span>by {item.user?.name || 'IKON Builders'}</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-none font-bold uppercase tracking-wider">{item.tier || 'T3'}</span>
                                                                            <span className="text-xs font-medium text-gray-800 dark:text-white/80">{item.label || 'General Knowledge'}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 text-xs text-gray-500 dark:text-white/60 whitespace-nowrap font-medium">
                                                                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                    </td>
                                                                    <td className="p-4 text-right">
                                                                        <div className="flex justify-end gap-1.5">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-9 w-9 text-gray-500 dark:text-white/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-gray-100 dark:bg-white/5 rounded-lg"
                                                                                onClick={() => handleViewContent(item)}
                                                                                title="View Content"
                                                                            >
                                                                                <FileText className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-9 w-9 text-gray-500 dark:text-white/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-gray-100 dark:bg-white/5 rounded-lg"
                                                                                onClick={() => handleEditMetadata(item)}
                                                                                title="Edit Name & Data"
                                                                            >
                                                                                <Edit3 className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-9 w-9 text-gray-500 dark:text-white/60 hover:text-rose-600 dark:hover:text-rose-400 transition-colors bg-gray-100 dark:bg-white/5 rounded-lg"
                                                                                onClick={() => handleRemoveIngestion(item._id)}
                                                                                title="Remove from Brain"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="p-4 border-t border-gray-200 dark:border-none flex items-center justify-between bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-white">
                                                <div className="text-xs text-gray-500 dark:text-white/60">
                                                    Page <span className="font-bold text-gray-900 dark:text-white">{ingestionPage}</span> of <span className="font-bold text-gray-900 dark:text-white">{totalIngestionPages}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 bg-white dark:bg-white/5 border-gray-300 dark:border-none"
                                                        disabled={ingestionPage <= 1}
                                                        onClick={() => setIngestionPage(prev => Math.max(1, prev - 1))}
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 bg-white dark:bg-white/5 border-gray-300 dark:border-none"
                                                        disabled={ingestionPage >= totalIngestionPages}
                                                        onClick={() => setIngestionPage(prev => prev + 1)}
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            )}

                            {isMaster && (
                                <TabsContent value="monitor" className="border-none p-0 outline-none h-full overflow-y-auto">
                                    <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-none shadow-xl backdrop-blur-sm">
                                        <CardHeader className="border-none py-4 px-6 text-gray-900 dark:text-white">
                                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg">
                                                            <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />
                                                        </div>
                                                        Conversation Monitor
                                                    </CardTitle>
                                                    <CardDescription className="text-gray-500 dark:text-white/60 text-sm">
                                                        Review and refine AI-human interactions across the company.
                                                    </CardDescription>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <div className="relative group w-full md:w-72">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/40 group-focus-within:text-indigo-500 transition-colors" />
                                                        <Input
                                                            placeholder="Search user, company, or title..."
                                                            className="pl-10 h-11 text-sm bg-gray-50 dark:bg-white/5 border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none text-gray-900 dark:text-white transition-all rounded-xl"
                                                            value={monitorSearch}
                                                            onChange={(e) => {
                                                                setMonitorSearch(e.target.value);
                                                                setMonitorPage(1);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex items-center bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-1 gap-1">
                                                        <div className="flex items-center px-3 py-1 gap-2 border-r border-gray-200 dark:border-white/10">
                                                            <Calendar className="w-3.5 h-3.5 text-gray-500 dark:text-white/40" />
                                                            <Input
                                                                type="date"
                                                                className="bg-transparent border-none h-8 p-0 text-xs text-gray-900 dark:text-white focus-visible:ring-0 w-28 [color-scheme:light dark]"
                                                                value={monitorStartDate}
                                                                onChange={(e) => setMonitorStartDate(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="flex items-center px-3 py-1 gap-2">
                                                            <span className="text-[9px] text-gray-500 dark:text-white/40 font-bold uppercase tracking-wider">To</span>
                                                            <Input
                                                                type="date"
                                                                className="bg-transparent border-none h-8 p-0 text-xs text-gray-900 dark:text-white focus-visible:ring-0 w-28 [color-scheme:light dark]"
                                                                value={monitorEndDate}
                                                                onChange={(e) => setMonitorEndDate(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={fetchConversations}
                                                            disabled={isConversationsLoading}
                                                            className="h-11 w-11 border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-white rounded-xl transition-all"
                                                        >
                                                            <RefreshCw className={`w-4 h-4 ${isConversationsLoading ? 'animate-spin' : ''}`} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="px-4">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-gray-700 dark:text-white/70">
                                                    <thead>
                                                        <tr className="bg-gray-100 dark:bg-white/5 border-b border-gray-200 dark:border-none">
                                                            <th className="p-4 w-10">
                                                                <Checkbox
                                                                    checked={selectedMonitorChats.length === adminConversations.length && adminConversations.length > 0}
                                                                    onCheckedChange={toggleAllChats}
                                                                    className="border-gray-300 dark:border-white/20 data-[state=checked]:bg-indigo-600"
                                                                />
                                                            </th>
                                                            <th className="text-left p-4 font-semibold">Title</th>
                                                            <th className="text-left p-4 font-semibold">User / Company</th>
                                                            <th className="text-left p-4 font-semibold">Date</th>
                                                            <th className="text-right p-4 font-semibold">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-none">
                                                        {adminConversations.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-white/40 italic">
                                                                    {isConversationsLoading ? 'Loading conversations...' : 'No conversations found.'}
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            adminConversations.map((conv) => (
                                                                <tr key={conv._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                                                    <td className="p-4">
                                                                        <Checkbox
                                                                            checked={selectedMonitorChats.includes(conv._id)}
                                                                            onCheckedChange={() => toggleChatSelection(conv._id)}
                                                                            className="border-gray-300 dark:border-white/20 data-[state=checked]:bg-indigo-600"
                                                                        />
                                                                    </td>
                                                                    <td className="p-4 font-medium text-gray-900 dark:text-white max-w-[200px] truncate">{conv.title}</td>
                                                                    <td className="p-4">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-400">
                                                                                {conv.user?.name?.charAt(0) || 'U'}
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-xs font-semibold text-gray-900 dark:text-white">{conv.user?.name}</div>
                                                                                <div className="text-[10px] text-gray-500 dark:text-white/40">
                                                                                    {conv.companyId?.name || 'BIGlogic.ai'}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 text-xs text-gray-500 dark:text-white/60">
                                                                        {new Date(conv.updatedAt).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="p-4 text-right">
                                                                        <div className="flex justify-end gap-2">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="h-8 text-xs text-gray-700 dark:text-white hover:bg-indigo-100 dark:hover:bg-indigo-600 hover:text-indigo-700 dark:hover:text-white"
                                                                                onClick={() => loadConversation(conv._id)}
                                                                            >
                                                                                Open View
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8 text-gray-500 dark:text-white/60 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                                                                onClick={(e) => handleDeleteChat(e, conv._id)}
                                                                                title="Delete Conversation"
                                                                            >
                                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                            </Button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/* Monitor Pagination */}
                                            <div className="p-4 border-t border-gray-200 dark:border-none flex items-center justify-between bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-white">
                                                <div className="text-xs text-gray-500 dark:text-white/60">
                                                    Page <span className="font-bold text-gray-900 dark:text-white">{monitorPage}</span> of <span className="font-bold text-gray-900 dark:text-white">{totalMonitorPages}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 bg-white dark:bg-white/5 border-gray-300 dark:border-none"
                                                        disabled={monitorPage <= 1}
                                                        onClick={() => setMonitorPage(prev => Math.max(1, prev - 1))}
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 bg-white dark:bg-white/5 border-gray-300 dark:border-none"
                                                        disabled={monitorPage >= totalMonitorPages}
                                                        onClick={() => setMonitorPage(prev => prev + 1)}
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Floating Bulk Action Bar */}
                                    <AnimatePresence>
                                        {selectedMonitorChats.length > 0 && (
                                            <motion.div
                                                initial={{ y: 100, opacity: 0, x: '-50%' }}
                                                animate={{ y: 0, opacity: 1, x: '-50%' }}
                                                exit={{ y: 100, opacity: 0, x: '-50%' }}
                                                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center bg-white dark:bg-[#13131a] border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 shadow-2xl shadow-black/50 gap-8 min-w-[500px]"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-500 uppercase tracking-[0.2em]">Selection Mode</span>
                                                    <span className="text-base font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                                        {selectedMonitorChats.length} {selectedMonitorChats.length === 1 ? 'Conversation' : 'Conversations'} Selected
                                                    </span>
                                                </div>

                                                <div className="w-px h-10 bg-gray-200 dark:bg-white/10" />

                                                <button
                                                    className="text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white font-black text-[11px] uppercase tracking-[0.2em] transition-colors"
                                                    onClick={() => setSelectedMonitorChats([])}
                                                >
                                                    Deselect
                                                </button>

                                                <Button
                                                    variant="destructive"
                                                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-6 h-12 flex items-center gap-3 font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                                                    onClick={handleBulkDeleteConversations}
                                                    disabled={isBulkDeleting}
                                                >
                                                    {isBulkDeleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    Delete Selected
                                                </Button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Bulk Delete Confirmation Dialog */}
                                    <Dialog open={isBulkDeleteConfirmOpen} onOpenChange={setIsBulkDeleteConfirmOpen}>
                                        <DialogContent className="bg-white dark:bg-[#1e1e2d] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white max-w-md rounded-2xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                                    <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-500" />
                                                    Confirm Bulk Deletion
                                                </DialogTitle>
                                                <DialogDescription className="text-gray-500 dark:text-white/60 py-3">
                                                    You are about to permanently delete <span className="text-gray-900 dark:text-white font-bold">{selectedMonitorChats.length}</span> conversations and all their associated message history. This action cannot be reversed.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="gap-2 sm:gap-0 mt-2">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setIsBulkDeleteConfirmOpen(false)}
                                                    className="hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white rounded-xl"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={confirmBulkDelete}
                                                    disabled={isBulkDeleting}
                                                    className="bg-rose-600 hover:bg-rose-700 rounded-xl px-6 min-w-[140px]"
                                                >
                                                    {isBulkDeleting ? (
                                                        <>
                                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                            Deleting...
                                                        </>
                                                    ) : (
                                                        'Delete Permanently'
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </TabsContent>
                            )}

                            {isMaster && (
                                <TabsContent value="trained-qa" className="border-none outline-none px-2 h-full overflow-y-auto">
                                    <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-none shadow-xl backdrop-blur-sm">
                                        <CardHeader className="border-none py-4 px-6 text-gray-900 dark:text-white">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <CardTitle className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg">
                                                            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />
                                                        </div>
                                                        Brain Training – Q&A
                                                    </CardTitle>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <button
                                                            onClick={() => setQaSubTab('verified')}
                                                            className={`text-xs font-bold pb-1 transition-all ${qaSubTab === 'verified' ? 'text-indigo-600 dark:text-indigo-500 border-b-2 border-indigo-600 dark:border-indigo-500' : 'text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground'}`}
                                                        >
                                                            Verified Repository
                                                        </button>
                                                        <button
                                                            onClick={() => setQaSubTab('pending')}
                                                            className={`text-xs font-bold pb-1 transition-all flex items-center gap-1.5 ${qaSubTab === 'pending' ? 'text-indigo-600 dark:text-indigo-500 border-b-2 border-indigo-600 dark:border-indigo-500' : 'text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground'}`}
                                                        >
                                                            Pending Questions
                                                            {ingestions.filter(i => i.type === 'Q&A Document' && i.status === 'Pending').length > 0 && (
                                                                <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                                                                    {ingestions.filter(i => i.type === 'Q&A Document' && i.status === 'Pending').length}
                                                                </span>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="relative group min-w-[300px]">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-muted-foreground" />
                                                        <Input
                                                            placeholder={qaSubTab === 'verified' ? "Search verified questions..." : "Search pending questions..."}
                                                            className="pl-9 h-9 text-xs bg-gray-50 dark:bg-muted/20 border-gray-200 dark:border-none"
                                                            value={ingestionSearch}
                                                            onChange={(e) => setIngestionSearch(e.target.value)}
                                                        />
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            setQaQuestion('');
                                                            setQaAnswer('');
                                                            setIsQAOpen(true);
                                                        }}
                                                        className="h-9 px-4 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Add
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="px-3">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="bg-gray-100 dark:bg-muted/20 border-b border-gray-200 dark:border-none">
                                                            <th className="text-left p-4 font-semibold w-1/2 text-gray-900 dark:text-current">Q&A Topic</th>
                                                            <th className="text-left p-4 font-semibold whitespace-nowrap text-gray-900 dark:text-current">Category</th>
                                                            <th className="text-left p-4 font-semibold whitespace-nowrap text-gray-900 dark:text-current">Date</th>
                                                            <th className="text-right p-4 font-semibold text-gray-900 dark:text-current">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100 dark:divide-none">
                                                        {ingestions.filter(item => item.type === 'Q&A Document' && (qaSubTab === 'pending' ? item.status === 'Pending' : item.status !== 'Pending')).length === 0 ? (
                                                            <tr>
                                                                <td colSpan={5} className="p-12 text-center text-gray-500 dark:text-muted-foreground italic">
                                                                    <div className="flex flex-col items-center gap-3">
                                                                        <MessageSquare className="w-10 h-10 opacity-20" />
                                                                        {isIngestionsLoading ? 'Loading...' : (qaSubTab === 'pending' ? 'No pending questions found.' : 'No trained Q&A pairs found.')}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            ingestions.filter(item => item.type === 'Q&A Document' && (qaSubTab === 'pending' ? item.status === 'Pending' : item.status !== 'Pending')).map((item) => (
                                                                <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-muted/10 transition-colors">
                                                                    <td className="p-4">
                                                                        <div className="flex flex-col gap-1">
                                                                            <div className="text-sm font-medium text-gray-900 dark:text-foreground line-clamp-2" title={item.question || item.name}>
                                                                                {item.question || item.name}
                                                                            </div>
                                                                            {qaSubTab === 'pending' && (
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setEditingIngestion(item);
                                                                                        setEditMetadataData({
                                                                                            label: item.label || 'Internal SOPs / Processes',
                                                                                            tier: item.tier || 'Tier 3',
                                                                                            folder: item.folder || 'General',
                                                                                            // @ts-ignore
                                                                                            question: item.question,
                                                                                            // @ts-ignore
                                                                                            answer: ''
                                                                                        });
                                                                                        setIsEditMetadataOpen(true);
                                                                                    }}
                                                                                    className="flex items-center gap-2 text-amber-700 dark:text-amber-600 bg-amber-50 dark:bg-amber-500/5 px-2 py-1 rounded-md border border-amber-200 dark:border-none max-w-fit hover:bg-amber-100 dark:hover:bg-amber-500/10 transition-colors mt-1"
                                                                                >
                                                                                    <Clock className="w-3.5 h-3.5" />
                                                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Awaiting Response</span>
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 whitespace-nowrap">
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="text-[11px] font-medium text-gray-700 dark:text-foreground/70">
                                                                                {item.label || 'SOPs'}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 text-xs text-gray-500 dark:text-muted-foreground whitespace-nowrap font-medium">
                                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="p-4 text-right">
                                                                        <div className="flex justify-end gap-1.5">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-9 w-9 text-gray-500 dark:text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-500 transition-colors bg-gray-100 dark:bg-muted/30 rounded-lg"
                                                                                onClick={() => {
                                                                                    setEditingIngestion(item);
                                                                                    setEditMetadataData({
                                                                                        label: item.label || 'Internal SOPs / Processes',
                                                                                        tier: item.tier || 'Tier 3',
                                                                                        folder: item.folder || 'General',
                                                                                        // @ts-ignore
                                                                                        question: item.question,
                                                                                        // @ts-ignore
                                                                                        answer: item.answer
                                                                                    });
                                                                                    setIsEditMetadataOpen(true);
                                                                                }}
                                                                                title="Edit Q&A Pair"
                                                                            >
                                                                                <Edit3 className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-9 w-9 text-gray-500 dark:text-muted-foreground hover:text-rose-600 dark:hover:text-destructive transition-colors bg-gray-100 dark:bg-muted/30 rounded-lg"
                                                                                onClick={() => handleRemoveIngestion(item._id)}
                                                                                title="Remove"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="p-4 border-t border-gray-200 dark:border-border/50 flex items-center justify-between bg-gray-50 dark:bg-muted/10">
                                                <div className="text-xs text-gray-500 dark:text-muted-foreground">
                                                    Manage your company's interaction logic manually.
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={fetchIngestions}
                                                    className="text-xs h-8 text-gray-700 dark:text-current"
                                                >
                                                    <RefreshCw className="w-3 h-3 mr-2" />
                                                    Sync Repo
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            )}

                            {isMaster && (
                                <TabsContent value="guardian" className="border-none p-0 outline-none">
                                    <RiskDashboard />
                                </TabsContent>
                            )}
                        </main>
                    </div>
                </Tabs>
            </div>

            {/* Improvement Feedback Dialog */}
            <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                <DialogContent className="bg-white dark:bg-card border-gray-200 dark:border-none text-gray-900 dark:text-foreground sm:max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ThumbsDown className="w-4 h-4 text-rose-600 dark:text-destructive" />
                            Help Improve the Brain
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-muted-foreground">
                            Provide the correct information so the system can learn and improve.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-medium">Correction / Better Answer</Label>
                                <Button
                                    type="button"
                                    onClick={() => toggleVoiceRecording(isRecordingFeedback, setIsRecordingFeedback, setFeedbackText)}
                                    variant={isRecordingFeedback ? "destructive" : "ghost"}
                                    size="sm"
                                    className="h-7 px-2 border-gray-200 dark:border-none bg-gray-100 dark:bg-muted/30 text-gray-800 dark:text-foreground hover:bg-gray-200 dark:hover:bg-muted shadow-sm"
                                >
                                    {isRecordingFeedback ? <MicOff className="w-3 h-3 mr-1" /> : <Mic className="w-3 h-3 mr-1 text-indigo-600 dark:text-primary" />}
                                    {isRecordingFeedback ? 'Stop' : 'Record'}
                                </Button>
                            </div>
                            <Textarea
                                placeholder="Type the correct answer or a better explanation here..."
                                className="min-h-[100px] bg-gray-50 dark:bg-muted/20 border-gray-200 dark:border-none text-gray-900 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground focus-visible:ring-indigo-500 rounded-lg text-sm"
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Attach Supporting Document (Optional)</Label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    ref={feedbackFileInputRef}
                                    onChange={(e) => setFeedbackFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start text-xs border-gray-300 dark:border-none py-6 h-auto flex-col hover:bg-indigo-50 dark:hover:bg-primary/5 transition-all"
                                    onClick={() => feedbackFileInputRef.current?.click()}
                                >
                                    <FilePlus className="w-5 h-5 mb-1 text-gray-500 dark:text-muted-foreground" />
                                    {feedbackFile ? (
                                        <span className="text-indigo-600 dark:text-primary font-medium">{feedbackFile.name}</span>
                                    ) : (
                                        <span>Click to upload PDF, DOCX or TXT</span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex flex-row items-center justify-between gap-2 border-t border-gray-200 dark:border-none pt-4 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-600 border-indigo-200 dark:border-none hover:bg-indigo-100 dark:hover:bg-indigo-500/20 h-9 rounded-xl text-[11px] px-3 shrink-0"
                            onClick={() => {
                                setIsFeedbackOpen(false);

                                // Find the original user question for this message
                                if (activeConversationId && selectedMessageId) {
                                    const conv = conversations.find(c => c.id === activeConversationId);
                                    if (conv) {
                                        const msgIndex = conv.messages.findIndex(m => m.assistantMessageId === selectedMessageId);
                                        if (msgIndex > 0) {
                                            const userMsg = conv.messages[msgIndex - 1];
                                            if (userMsg.role === 'user') {
                                                setQaQuestion(userMsg.content);
                                            }
                                        }
                                    }
                                }

                                // Open QA training dialog
                                setQaAnswer(feedbackText); // Use current feedback text as draft answer
                                setIsQAOpen(true);
                            }}
                        >
                            <Sparkles className="w-3 h-3 mr-1.5" />
                            Move to pending
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSubmitFeedback}
                            disabled={isSubmittingFeedback || (!feedbackText.trim() && !feedbackFile)}
                            className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-600 border-indigo-200 dark:border-none hover:bg-indigo-100 dark:hover:bg-indigo-500/20 h-9 rounded-xl text-[11px] px-3 shrink-0"
                        >
                            {isSubmittingFeedback ? 'Teaching...' : 'Submit'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* Edit Metadata Dialog */}
            <Dialog open={isEditMetadataOpen} onOpenChange={setIsEditMetadataOpen}>
                <DialogContent className="bg-white dark:bg-card border-gray-200 dark:border-border text-gray-900 dark:text-foreground sm:max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit3 className="w-5 h-5 text-indigo-600 dark:text-primary" />
                            Edit Q&A
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-muted-foreground font-bold">Q&A Topic</Label>
                            <Input
                                placeholder="Edit document name"
                                className="bg-gray-50 dark:bg-muted/30 border-gray-200 dark:border-none text-xs h-9 rounded-lg"
                                // @ts-ignore
                                value={editMetadataData.name || ''}
                                // @ts-ignore
                                onChange={(e) => setEditMetadataData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-muted-foreground font-bold">Category</Label>
                            <Select
                                value={editMetadataData.label}
                                onValueChange={(val) => setEditMetadataData(prev => ({ ...prev, label: val }))}
                            >
                                <SelectTrigger className="bg-gray-50 dark:bg-muted/30 border-gray-200 dark:border-none text-xs h-9 rounded-lg">
                                    <SelectValue placeholder="Select Label" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-card border-gray-200 dark:border-none text-gray-900 dark:text-foreground">
                                    {DOCUMENT_LABELS.map(label => (
                                        <SelectItem key={label} value={label} className="text-xs">{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>


                        {editingIngestion?.type === 'Q&A Document' && (
                            <>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-muted-foreground font-bold">Edit Question</Label>
                                        <Button
                                            onClick={() => toggleVoiceRecording(isRecordingEditQuestion, setIsRecordingEditQuestion, (val: any) => {
                                                setEditMetadataData(prev => {
                                                    // @ts-ignore
                                                    const current = prev.question || '';
                                                    const updated = typeof val === 'function' ? val(current) : val;
                                                    return { ...prev, question: updated };
                                                });
                                            })}
                                            variant={isRecordingEditQuestion ? "destructive" : "ghost"}
                                            size="sm"
                                            className="h-7 px-2 border-gray-200 dark:border-none bg-gray-100 dark:bg-muted/30 text-gray-800 dark:text-foreground hover:bg-gray-200 dark:hover:bg-muted shadow-sm"
                                        >
                                            {isRecordingEditQuestion ? <MicOff className="w-3 h-3 mr-1" /> : <Mic className="w-3 h-3 mr-1 text-indigo-600 dark:text-primary" />}
                                            {isRecordingEditQuestion ? 'Stop' : 'Record'}
                                        </Button>
                                    </div>
                                    <Textarea
                                        className="bg-gray-50 dark:bg-muted/20 border-gray-200 dark:border-none text-gray-900 dark:text-foreground text-xs min-h-[60px]"
                                        // @ts-ignore
                                        value={editMetadataData.question || ''}
                                        // @ts-ignore
                                        onChange={(e) => setEditMetadataData(prev => ({ ...prev, question: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-muted-foreground font-bold">Edit Answer</Label>
                                        <Button
                                            onClick={() => toggleVoiceRecording(isRecordingEditAnswer, setIsRecordingEditAnswer, (val: any) => {
                                                setEditMetadataData(prev => {
                                                    // @ts-ignore
                                                    const current = prev.answer || '';
                                                    const updated = typeof val === 'function' ? val(current) : val;
                                                    return { ...prev, answer: updated };
                                                });
                                            })}
                                            variant={isRecordingEditAnswer ? "destructive" : "ghost"}
                                            size="sm"
                                            className="h-7 px-2 border-gray-200 dark:border-none bg-gray-100 dark:bg-muted/30 text-gray-800 dark:text-foreground hover:bg-gray-200 dark:hover:bg-muted shadow-sm"
                                        >
                                            {isRecordingEditAnswer ? <MicOff className="w-3 h-3 mr-1" /> : <Mic className="w-3 h-3 mr-1 text-indigo-600 dark:text-primary" />}
                                            {isRecordingEditAnswer ? 'Stop' : 'Record'}
                                        </Button>
                                    </div>
                                    <Textarea
                                        className="bg-gray-50 dark:bg-muted/20 border-gray-200 dark:border-none text-gray-900 dark:text-foreground text-xs min-h-[80px]"
                                        // @ts-ignore
                                        value={editMetadataData.answer || ''}
                                        // @ts-ignore
                                        onChange={(e) => setEditMetadataData(prev => ({ ...prev, answer: e.target.value }))}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter className="flex flex-row items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-none">
                        <Button
                            variant="ghost"
                            className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground h-9 text-xs"
                            onClick={() => setIsEditMetadataOpen(false)}
                        >
                            Cancel
                        </Button>
                        {editingIngestion?.status === 'Pending' && (
                            <Button
                                size="sm"
                                onClick={() => {
                                    setEditMetadataData(prev => ({ ...prev, tier: 'Tier 1' })); // Ensure Tier 1
                                    handleUpdateMetadata('Synchronized');
                                }}
                                // @ts-ignore
                                disabled={!editMetadataData.answer || !editMetadataData.answer.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 px-4 rounded-xl text-[11px] font-bold shadow-md shadow-indigo-600/10 flex items-center gap-2"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Verify and Sync
                            </Button>
                        )}
                        <Button
                            size="sm"
                            onClick={() => handleUpdateMetadata()}
                            className="bg-gray-800 hover:bg-gray-900 dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-primary-foreground shadow-[0_4px_10px_rgba(0,0,0,0.1)] h-9 px-3 rounded-xl text-[11px] font-bold"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Centralized Dialogs moved to end */}

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="bg-white dark:bg-card border-gray-200 dark:border-border text-gray-900 dark:text-foreground sm:max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-destructive" />
                            Confirm Removal
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-muted-foreground">
                            This action will remove the record from your company's knowledge tracking. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-100 dark:hover:bg-muted"
                            onClick={() => setIsDeleteConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteIngestion}
                            className="bg-rose-600 hover:bg-rose-700 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]"
                        >
                            Confirm Removal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Chat Delete Confirmation Dialog */}
            <Dialog open={isChatDeleteConfirmOpen} onOpenChange={setIsChatDeleteConfirmOpen}>
                <DialogContent className="bg-white dark:bg-card border-gray-200 dark:border-border text-gray-900 dark:text-foreground sm:max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-destructive" />
                            Confirm Chat Deletion
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-muted-foreground">
                            This will permanently delete this conversation and all messages within it. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-100 dark:hover:bg-muted"
                            onClick={() => setIsChatDeleteConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDeleteChat}
                            className="bg-rose-600 hover:bg-rose-700 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]"
                        >
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Share Dialog */}
            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                <DialogContent className="bg-white dark:bg-card border-gray-200 dark:border-border text-gray-900 dark:text-foreground sm:max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />
                            Share Context Link
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-muted-foreground">
                            Create a public link for this specific brain state.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="space-y-4">
                            <Button
                                onClick={handleShare}
                                disabled={isSharingLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl"
                            >
                                {isSharingLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <ExternalLink className="w-4 h-4 mr-2" />}
                                {shareToken ? "Refresh Token" : "Generate Public Link"}
                            </Button>

                            {shareToken && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                                    <Label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-muted-foreground">Share Link</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            readOnly
                                            value={`${window.location.origin}/share/brain/${shareToken}`}
                                            className="bg-gray-50 dark:bg-background text-xs h-9 border-gray-200 dark:border-none focus-visible:ring-indigo-500"
                                        />
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="h-9 w-9 flex-shrink-0"
                                            onClick={() => {
                                                if (shareToken) {
                                                    navigator.clipboard.writeText(`${window.location.origin}/share/brain/${shareToken}`);
                                                    toast({ title: "Link Copied", description: "Share it with your team." });
                                                }
                                            }}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="w-full bg-gray-100 dark:bg-muted/50 border-gray-300 dark:border-border" onClick={() => setIsShareDialogOpen(false)}>Close Settings</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Centralized Dialogs for Memory Ingestion moved to end */}
            <Dialog open={isFieldNoteOpen} onOpenChange={setIsFieldNoteOpen}>
                <DialogContent className="bg-white dark:bg-card border-gray-200 dark:border-border text-gray-900 dark:text-foreground sm:max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Push to Active Memory</DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-muted-foreground">
                            Simulate capturing a field note or observation. Guardian will parse this for risks automatically.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="flex justify-between items-center bg-gray-50 dark:bg-muted/20 p-3 rounded-xl border border-gray-200 dark:border-none">
                            <span className="text-sm text-gray-700 dark:text-muted-foreground font-medium">Record Voice Note</span>
                            <Button
                                type="button"
                                onClick={() => toggleVoiceRecording(isRecordingNote, setIsRecordingNote, setFieldNoteContent)}
                                variant={isRecordingNote ? "destructive" : "secondary"}
                                size="sm"
                                className={isRecordingNote ? "animate-pulse" : "bg-white dark:bg-card border-gray-300 dark:border-none hover:bg-gray-100 dark:hover:bg-muted text-gray-800 dark:text-foreground"}
                            >
                                {isRecordingNote ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2 text-indigo-600 dark:text-primary" />}
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Name (Optional)</Label>
                            <Input
                                placeholder="Give this note a name (e.g. Job Walkthrough)"
                                className="bg-gray-50 dark:bg-muted/20 border-gray-200 dark:border-border text-gray-900 dark:text-foreground rounded-xl"
                                value={fieldNoteName}
                                onChange={(e) => setFieldNoteName(e.target.value)}
                            />
                        </div>
                        <Textarea
                            placeholder="e.g. Homeowner called today to complain about delays..."
                            className="min-h-[120px] bg-gray-50 dark:bg-muted/20 border-gray-200 dark:border-none text-gray-900 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground focus-visible:ring-indigo-500 rounded-xl"
                            value={fieldNoteContent}
                            onChange={(e) => setFieldNoteContent(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-100 dark:hover:bg-muted" onClick={() => setIsFieldNoteOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmitFieldNote} disabled={isSubmittingNote} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                            {isSubmittingNote ? 'Processing...' : 'Submit to Brain'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="bg-white dark:bg-card border-gray-200 dark:border-border text-gray-900 dark:text-foreground shadow-2xl">
                    <DialogHeader>
                        <DialogTitle>Upload Document / Transcript</DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-muted-foreground">
                            The brain will parse this document, apply version control logic, and embed it.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Name (Optional)</Label>
                            <Input
                                placeholder="Custom document name"
                                className="bg-gray-50 dark:bg-muted/20 border-gray-200 dark:border-border text-gray-900 dark:text-foreground rounded-xl"
                                value={knowledgeName}
                                onChange={(e) => setKnowledgeName(e.target.value)}
                            />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                            accept=".pdf,.docx,.txt"
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed ${isDragging ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' : knowledgeFile ? 'border-indigo-500 bg-indigo-50 dark:bg-primary/10' : 'border-gray-300 dark:border-none bg-gray-50 dark:bg-muted/20'} rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 dark:text-muted-foreground cursor-pointer hover:bg-gray-100 dark:hover:bg-muted/30 hover:border-indigo-500 transition-all`}
                        >
                            <div className="w-12 h-12 bg-gray-100 dark:bg-muted/50 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                <FileText className={`w-6 h-6 ${knowledgeFile || isDragging ? 'text-indigo-600 dark:text-primary opacity-100' : 'text-indigo-500 dark:text-primary opacity-80'}`} />
                            </div>
                            <p className={`text-sm font-medium ${knowledgeFile || isDragging ? 'text-indigo-700 dark:text-primary' : 'text-gray-600 dark:text-muted-foreground'}`}>
                                {isDragging ? 'Drop file to upload' : knowledgeFile ? knowledgeFile.name : 'Click or drag dropping to select files'}
                            </p>
                            {!knowledgeFile && !isDragging && <p className="text-xs mt-1">PDF, DOCX, TXT max 10MB</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-muted-foreground font-bold">Category</Label>
                                <Select value={knowledgeLabel} onValueChange={setKnowledgeLabel}>
                                    <SelectTrigger className="bg-gray-50 dark:bg-muted/30 border-gray-200 dark:border-border text-xs h-10 rounded-lg">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-card border-gray-200 dark:border-border text-gray-900 dark:text-foreground">
                                        {DOCUMENT_LABELS.map(label => (
                                            <SelectItem key={label} value={label} className="text-xs">{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button variant="ghost" className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-100 dark:hover:bg-muted" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleKnowledgeUpload}
                            disabled={isUploadingDocument || !knowledgeFile}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:shadow-none"
                        >
                            {isUploadingDocument ? 'Ingesting...' : 'Ingest Document'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Question Dialog */}
            <Dialog open={isEditMsgDialogOpen} onOpenChange={setIsEditMsgDialogOpen}>
                <DialogContent className="bg-white dark:bg-card border-gray-200 dark:border-border text-gray-900 dark:text-foreground sm:max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Edit Question</DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-muted-foreground">
                            Refine your inquiry and send it back to the brain.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Edit your question here..."
                            className="min-h-[120px] bg-gray-50 dark:bg-muted/20 border-gray-200 dark:border-none text-gray-900 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground focus-visible:ring-indigo-500 rounded-xl resize-none"
                            value={editMsgText}
                            onChange={(e) => setEditMsgText(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-100 dark:hover:bg-muted" onClick={() => { setIsEditMsgDialogOpen(false); setEditMsgId(null); }}>Cancel</Button>
                        <Button
                            onClick={handleEditSubmit}
                            disabled={!editMsgText.trim() || isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Send to Brain
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isQAOpen} onOpenChange={setIsQAOpen}>
                <DialogContent className="bg-white dark:bg-card border-gray-200 dark:border-border text-gray-900 dark:text-foreground sm:max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle>Train Company Brain</DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-muted-foreground">
                            Record a question and answer pair for the brain to learn from.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Q&A Topic</Label>
                            <Input
                                placeholder="e.g. Change Order Process"
                                className="bg-gray-50 dark:bg-muted/20 border-gray-200 dark:border-none text-gray-900 dark:text-foreground rounded-lg h-9 text-sm"
                                value={qaName}
                                onChange={(e) => setQaName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Question</label>
                                <Button
                                    type="button"
                                    onClick={() => toggleVoiceRecording(isRecordingQuestion, setIsRecordingQuestion, setQaQuestion)}
                                    variant={isRecordingQuestion ? "destructive" : "ghost"}
                                    size="sm"
                                    className="h-7 px-2 border-gray-200 dark:border-border bg-gray-100 dark:bg-muted/30 text-gray-800 dark:text-foreground hover:bg-gray-200 dark:hover:bg-muted shadow-sm"
                                >
                                    {isRecordingQuestion ? <MicOff className="w-3 h-3 mr-1" /> : <Mic className="w-3 h-3 mr-1 text-indigo-600 dark:text-primary" />}
                                    {isRecordingQuestion ? 'Stop' : 'Record'}
                                </Button>
                            </div>
                            <Textarea
                                placeholder="e.g. How do we handle change orders?"
                                className="min-h-[60px] bg-gray-50 dark:bg-muted/20 border-gray-200 dark:border-none text-gray-900 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground focus-visible:ring-indigo-500 rounded-lg text-sm"
                                value={qaQuestion}
                                onChange={(e) => setQaQuestion(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Answer</label>
                                <Button
                                    type="button"
                                    onClick={() => toggleVoiceRecording(isRecordingAnswer, setIsRecordingAnswer, setQaAnswer)}
                                    variant={isRecordingAnswer ? "destructive" : "ghost"}
                                    size="sm"
                                    className="h-7 px-2 border-gray-200 dark:border-border bg-gray-100 dark:bg-muted/30 text-gray-800 dark:text-foreground shadow-sm hover:bg-gray-200 dark:hover:bg-muted"
                                >
                                    {isRecordingAnswer ? <MicOff className="w-3 h-3 mr-1" /> : <Mic className="w-3 h-3 mr-1 text-indigo-600 dark:text-primary" />}
                                    {isRecordingAnswer ? 'Stop' : 'Record'}
                                </Button>
                            </div>
                            <Textarea
                                placeholder="e.g. Change orders must be signed before work begins."
                                className="min-h-[80px] bg-gray-50 dark:bg-muted/20 border-gray-200 dark:border-none text-gray-900 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground focus-visible:ring-indigo-500 rounded-lg text-sm"
                                value={qaAnswer}
                                onChange={(e) => setQaAnswer(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-muted-foreground font-bold">Category</Label>
                                <Select value={qaLabel} onValueChange={setQaLabel}>
                                    <SelectTrigger className="bg-gray-50 dark:bg-muted/30 border-gray-200 dark:border-border text-xs h-9 rounded-lg">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-card border-gray-200 dark:border-border text-gray-900 dark:text-foreground">
                                        {DOCUMENT_LABELS.map(label => (
                                            <SelectItem key={label} value={label} className="text-xs">{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                    </div>
                    <DialogFooter className="flex flex-row items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-none">
                        <Button variant="ghost" className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground h-9 text-xs" onClick={() => setIsQAOpen(false)}>Cancel</Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSubmitQA('Pending')}
                            disabled={isSubmittingQA || !qaQuestion.trim()}
                            className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-600 border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 h-9 rounded-xl text-[11px] px-3 shrink-0"
                        >
                            <History className="w-3 h-3 mr-1.5" />
                            Move to Pending
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                setQaTier('Tier 1'); // Internal default
                                handleSubmitQA('Synchronized');
                            }}
                            disabled={isSubmittingQA || !qaQuestion.trim() || !qaAnswer.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_4px_10px_rgba(79,70,229,0.2)] h-9 px-4 rounded-xl text-[11px] font-bold shrink-0 flex items-center gap-2"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            {isSubmittingQA ? 'Processing...' : 'Verify & Sync'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Document Dialog */}
            <Dialog open={isViewDocumentOpen} onOpenChange={setIsViewDocumentOpen}>
                <DialogContent className="bg-white dark:bg-card border-gray-200 dark:border-none text-gray-900 dark:text-foreground sm:max-w-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col rounded-2xl">
                    <DialogHeader className="border-b border-gray-200 dark:border-none pb-4 mb-2">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                {viewingDocument?.type === 'Field Note' && <Mic className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />}
                                {viewingDocument?.type === 'Knowledge Document' && <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />}
                                {viewingDocument?.type === 'Q&A Document' && <MessageSquareQuote className="w-5 h-5 text-indigo-600 dark:text-indigo-500" />}
                                {viewingDocument?.name || (viewingDocument?.type === 'Field Note' ? 'Voice Note' : 'Knowledge Entry')}
                            </DialogTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsViewDocumentOpen(false)}
                                className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-muted text-gray-500 dark:text-muted-foreground"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <DialogDescription className="flex items-center gap-3 text-[11px] mt-1">
                            <span className="bg-gray-100 dark:bg-muted px-1.5 py-0.5 rounded border border-gray-200 dark:border-none uppercase font-bold tracking-wider">{viewingDocument?.type?.replace(' Document', '')}</span>
                            <span>Added on {new Date(viewingDocument?.createdAt).toLocaleDateString()}</span>
                            <span className="text-[10px] text-gray-500 dark:text-muted-foreground ml-auto">Ingest ID: {viewingDocument?._id?.substring(0, 8)}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="py-4 text-sm leading-relaxed text-gray-800 dark:text-foreground whitespace-pre-wrap font-sans">
                            {viewingDocument?.type === 'Q&A Document' ? (
                                <div className="space-y-6">
                                    <div className="bg-gray-50 dark:bg-muted/30 p-5 rounded-2xl border border-gray-200 dark:border-none">
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-muted-foreground mb-3 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-muted-foreground/40" />
                                            Question
                                        </h4>
                                        <p className="text-base font-medium leading-relaxed">{viewingDocument.question}</p>
                                    </div>
                                    <div className="bg-indigo-50 dark:bg-indigo-500/5 p-5 rounded-2xl border border-indigo-100 dark:border-none">
                                        <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-indigo-700 dark:text-indigo-500 mb-3 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-500" />
                                            Verified Answer
                                        </h4>
                                        <p className="text-base leading-relaxed whitespace-pre-wrap">{viewingDocument.answer}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-2 px-1">
                                    {viewingDocument?.content || (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-muted-foreground italic">
                                            <FileWarning className="w-12 h-12 mb-3 opacity-20" />
                                            No content preview available for this entry.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="border-t border-gray-200 dark:border-none pt-4 mt-2">
                        <Button
                            onClick={() => setIsViewDocumentOpen(false)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px] rounded-xl"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CompanyBrain;
