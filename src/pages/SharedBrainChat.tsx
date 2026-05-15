import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brain, Lock, ArrowLeft, Sparkles, ShieldAlert } from 'lucide-react';
import { companyBrainService } from '@/services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';

const SharedBrainChat = () => {
    const { token } = useParams<{ token: string }>();
    const [messages, setMessages] = useState<any[]>([]);
    const [conversation, setConversation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [needsLogin, setNeedsLogin] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSharedChat = async () => {
            if (!token) return;
            try {
                const res = await companyBrainService.getSharedConversation(token);
                setMessages(res.data.data);
                setConversation(res.data.conversation);
            } catch (err: any) {
                if (err.response?.status === 401 || err.response?.data?.needsLogin) {
                    setNeedsLogin(true);
                } else {
                    setError(err.response?.data?.message || 'Could not load shared conversation');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSharedChat();
    }, [token]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-4 animate-pulse">
                    <Brain className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-muted-foreground animate-pulse text-sm">Accessing shared memory...</p>
            </div>
        );
    }

    if (needsLogin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
                <div className="max-w-md w-full text-center space-y-6 bg-card p-8 rounded-3xl border border-border shadow-2xl">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
                        <Lock className="w-10 h-10 text-amber-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Encrypted & Restricted</h2>
                        <p className="text-muted-foreground text-sm">
                            This conversation is restricted to specific BIGlogic members. Please log in to verify your identity.
                        </p>
                    </div>
                    <div className="pt-4 flex flex-col gap-3">
                        <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 text-white shadow-lg">
                            <Link to="/login">Log In to BIGlogic</Link>
                        </Button>
                        <Button variant="ghost" asChild className="w-full h-11">
                            <Link to="/">Back Home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
                <div className="max-w-md w-full text-center space-y-6 bg-card p-8 rounded-3xl border border-border shadow-2xl">
                    <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-rose-500/20">
                        <ShieldAlert className="w-10 h-10 text-rose-500" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Access Revoked</h2>
                        <p className="text-muted-foreground text-sm">{error}</p>
                    </div>
                    <Button variant="ghost" asChild className="w-full h-11">
                        <Link to="/">Go Back</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 lg:p-10 font-sans selection:bg-indigo-500 selection:text-white">
            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-none::-webkit-scrollbar { display: none !important; }
                .scrollbar-none { -ms-overflow-style: none !important; scrollbar-width: none !important; }
            `}} />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl shadow-indigo-500/5 shadow-inner">
                        <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{conversation?.title}</h1>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-indigo-400" /> Shared from BigLogic AI Brain</span>
                            <span className="opacity-30">•</span>
                            <span>Read-only Mode</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" asChild className="rounded-xl border-border h-10 bg-card hover:bg-muted font-medium transition-all shadow-sm">
                        <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Link>
                    </Button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-5xl flex-1 flex flex-col min-h-0 relative"
            >
                <Card className="flex-1 flex flex-col border-border bg-card/40 backdrop-blur-xl shadow-2xl rounded-[32px] overflow-hidden border">
                    <CardContent className="flex-1 p-0 flex flex-col min-h-0 relative">
                        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background/20 to-transparent pointer-events-none z-10" />

                        <ScrollArea className="flex-1 px-4 py-10 min-h-0" ref={scrollAreaRef}>
                            <div className="max-w-4xl mx-auto flex flex-col gap-10 pb-10">
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={msg._id || idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + (idx * 0.05) }}
                                        className={`flex gap-4 lg:gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex-shrink-0 flex items-center justify-center border border-indigo-500/20 shadow-lg mt-1 group-hover:scale-110 transition-transform">
                                                <Brain className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                        <div className={`max-w-[85%] rounded-[28px] px-6 py-4 text-[15px] leading-relaxed relative ${msg.role === 'user'
                                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/10 rounded-tr-none border border-indigo-400/20'
                                                : 'bg-background/80 dark:bg-zinc-900/80 text-foreground border border-border shadow-lg rounded-tl-none backdrop-blur-sm'
                                            }`}>
                                            <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert text-white' : 'dark:prose-invert text-foreground'} prose-p:my-1 prose-headings:my-2 prose-ul:my-2 prose-li:my-0.5`}>
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                            {msg.role === 'user' && (
                                                <div className="absolute top-0 right-0 -translate-y-full mb-1 opacity-20 text-[10px] font-bold tracking-tighter uppercase pr-2">
                                                    User
                                                </div>
                                            )}
                                        </div>
                                        {msg.role === 'user' && (
                                            <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-indigo-500/20 shadow-lg mt-1">
                                                <AvatarFallback className="bg-indigo-600/10 text-indigo-400 text-xs font-black">
                                                    US
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <div className="mt-8 text-center text-muted-foreground/30 text-[10px] items-center flex flex-col uppercase tracking-[0.2em] font-black">
                    <div className="h-[1px] w-24 bg-current/20 mb-4" />
                    SECURED END-TO-END VIA BIGLOGIC ENCRYPTION
                </div>
            </motion.div>
        </div>
    );
};

export default SharedBrainChat;
