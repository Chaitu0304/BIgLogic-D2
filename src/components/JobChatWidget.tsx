import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { toast } from 'sonner';

interface Message {
    id: string;
    text: string | React.ReactNode;
    sender: 'user' | 'bot';
    timestamp: Date;
}

// Simple Markdown Parser for the Chat Widget
const parseMarkdown = (text: string) => {
    if (typeof text !== 'string') return text;

    return text.split('\n').map((line, i) => {
        // Handle bold text like **bold**
        const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
            }
            return part;
        });

        // Handle list items starting with '* '
        if (line.trim().startsWith('* ')) {
            return (
                <li key={i} className="ml-4 mt-1 list-disc marker:text-indigo-400">
                    {parts.map((p, j) => typeof p === 'string' ? p.replace(/^\*\s/, '') : p)}
                </li>
            );
        }

        return <p key={i} className="mb-2 last:mb-0 leading-relaxed">{parts}</p>;
    });
};

interface JobChatWidgetProps {
    jobId: string;
    adminJobId: string;
    jobName: string;
    metrics?: {
        bottleneck?: string;
        cycle_time?: string;
        documents_needed?: string;
    };
}

const JobChatWidget: React.FC<JobChatWidgetProps> = ({ jobId, adminJobId, jobName, metrics }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Hello! I'm your BIGlogic Assistant for job ${adminJobId} (${jobName}). I have access to the job status, team details, and performance metrics. How can I help you today?`,
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isLoading, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post(`/jobs/${jobId}/chat`, {
                message: input,
                ...metrics
            });

            // Extract response text - n8n AI agent usually returns { output: "..." }
            const responseData = res.data;
            let botReply = "I've processed your request but couldn't generate a text response.";

            if (typeof responseData === 'string') {
                botReply = responseData;
            } else if (responseData.output) {
                botReply = responseData.output;
            } else if (responseData.text) {
                botReply = responseData.text;
            } else if (responseData.message) {
                botReply = responseData.message;
            } else if (res.data && Object.keys(res.data).length > 0) {
                // Fallback for unexpected structured response
                botReply = JSON.stringify(res.data);
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: parseMarkdown(botReply),
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error: any) {
            console.error("Chat error:", error);
            toast.error("Assistant is unavailable right now.");
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                text: "Sorry, I encountered an error connecting to my brain. Please try again in a moment.",
                sender: 'bot',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-2 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <Card className={`mb-4 flex flex-col shadow-2xl border-white/10 bg-[#121212] overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'w-[500px] h-[700px]' : 'w-[380px] h-[550px]'}`}>
                    {/* Header */}
                    <CardHeader className="p-4 bg-indigo-600 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                                <Sparkles className="h-5 w-5 text-white animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm leading-none">Job Assistant</h3>
                                <p className="text-indigo-100 text-[10px] mt-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    Online • {jobName}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white hover:bg-white/10"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white hover:bg-white/10"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    {/* Messages Area */}
                    <CardContent className="flex-1 overflow-hidden p-0 bg-[#0A0A0A]">
                        <ScrollArea className="h-full p-4">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <Avatar className="h-8 w-8 border border-white/5">
                                                {msg.sender === 'bot' ? (
                                                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-full w-full flex items-center justify-center">
                                                        <Sparkles className="h-4 w-4 text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="bg-gray-700 h-full w-full flex items-center justify-center">
                                                        <User className="h-4 w-4 text-white" />
                                                    </div>
                                                )}
                                            </Avatar>
                                            <div className={`rounded-2xl p-3 text-sm ${msg.sender === 'user'
                                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                                : 'bg-[#1E1E1E] text-slate-300 border border-white/5 rounded-tl-none pr-6 shadow-md'
                                                }`}>
                                                <div className="break-words space-y-1">
                                                    {msg.text}
                                                </div>
                                                <div className={`text-[10px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex gap-2 items-center bg-white/5 border border-white/10 rounded-2xl p-3">
                                            <Loader2 className="h-3 w-3 text-indigo-400 animate-spin" />
                                            <span className="text-xs text-gray-400 italic">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>

                    {/* Footer / Input */}
                    <CardFooter className="p-4 bg-[#121212] border-t border-white/10">
                        <div className="flex w-full gap-2">
                            <Input
                                placeholder="Ask about team, status, or bottlenecks..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="bg-white/5 border-white/10 text-white text-sm"
                            />
                            <Button
                                onClick={handleSend}
                                size="icon"
                                className="bg-indigo-600 hover:bg-indigo-700 shrink-0"
                                disabled={isLoading || !input.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}

            {/* Launcher Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 shadow-xl shadow-indigo-500/30 flex items-center justify-center group transition-all duration-300 hover:scale-110 border-0"
                >
                    <Sparkles className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
                    <Badge className="absolute -top-1 -right-1 bg-green-500 text-[10px] h-5 w-5 flex items-center justify-center p-0 border-2 border-[#121212]">
                        AI
                    </Badge>
                </Button>
            )}
        </div>
    );
};

export default JobChatWidget;
