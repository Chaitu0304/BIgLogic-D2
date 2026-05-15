import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShieldAlert, TrendingUp, AlertTriangle, FileWarning, Clock, ArrowUpRight, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

interface Escalation {
    _id: string;
    escalationId: string;
    project: string;
    riskLevel: string;
    sensitivity: string;
    trigger: string;
    pm: string;
    status: string;
    createdAt: string;
}

const RiskDashboard = () => {
    // Authorization check could go here if not handled natively by the router constraints
    // e.g. if (user.role !== 'company_admin') return <Navigate to="/dashboard" />

    const { data: responseData, isLoading, isError, refetch } = useQuery({
        queryKey: ['escalations'],
        queryFn: async () => {
            const res = await api.get('/escalations');
            return res.data;
        },
        refetchInterval: 30000 // Poll every 30s to simulate live guardian updates
    });

    const handleResolve = async (id: string) => {
        try {
            await api.put(`/escalations/${id}`);
            refetch();
        } catch (err) {
            console.error('Failed to resolve escalation', err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this escalation?')) return;
        try {
            await api.delete(`/escalations/${id}`);
            refetch();
        } catch (err) {
            console.error('Failed to delete escalation', err);
        }
    };

    const escalations: Escalation[] = responseData?.data || [];
    const totalAnalyzed = responseData?.totalAnalyzed || 0;
    
    // Quick summary counts
    const activeCount = escalations.filter(e => e.status !== 'Resolved').length;
    const criticalCount = escalations.filter(e => e.riskLevel === 'Critical' && e.status !== 'Resolved').length;

    const getRiskBadge = (level: string) => {
        switch (level) {
            case 'Critical': return <Badge variant="destructive" className="bg-destructive/10 text-destructive border border-destructive/50 hover:bg-destructive/20 shadow-[0_0_10px_rgba(var(--destructive),0.2)]">CRITICAL</Badge>;
            case 'High': return <Badge variant="destructive" className="bg-orange-500/10 text-orange-400 border border-orange-500/50 hover:bg-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]">HIGH</Badge>;
            case 'Moderate': return <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/50 hover:bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]">MODERATE</Badge>;
            default: return <Badge className="bg-muted text-muted-foreground border border-border">LOW</Badge>;
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-2">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                    <Card className="border-l-4 border-l-orange-500 border-border bg-card/60 backdrop-blur-md shadow-lg overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
                        <CardHeader className="py-4">
                            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                                Active Escalations
                                <AlertTriangle className="w-4 h-4 text-orange-400 group-hover:scale-125 transition-transform" />
                            </CardDescription>
                            <CardTitle className="text-4xl text-foreground font-light">{activeCount}</CardTitle>
                        </CardHeader>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                    <Card className="border-l-4 border-l-red-500 border-border bg-card/60 backdrop-blur-md shadow-lg overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
                        <CardHeader className="py-4">
                            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                                Critical Exposure
                                <FileWarning className="w-4 h-4 text-red-400 group-hover:scale-125 transition-transform" />
                            </CardDescription>
                            <CardTitle className="text-4xl text-foreground font-light">{criticalCount}</CardTitle>
                        </CardHeader>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="md:col-span-2">
                    <Card className="border-l-4 border-l-primary border-border bg-card/60 backdrop-blur-md shadow-lg overflow-hidden relative group h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                        <CardHeader className="py-4">
                            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                                Total Field Notes Analyzed
                                <TrendingUp className="w-4 h-4 text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </CardDescription>
                            <CardTitle className="text-4xl text-foreground font-light">{totalAnalyzed}</CardTitle>
                        </CardHeader>
                    </Card>
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="text-xl font-bold mb-4 text-foreground">Recent Automated Escalations</h2>
                <Card className="border-border bg-card/60 backdrop-blur-md shadow-lg overflow-hidden">
                    <CardContent className="p-0">
                        <div className="rounded-md">
                            <div className="grid grid-cols-12 gap-4 p-4 font-medium text-xs uppercase tracking-wider border-b border-border bg-muted/30 text-muted-foreground">
                                <div className="col-span-2">Escalation ID</div>
                                <div className="col-span-2">Risk Level</div>
                                <div className="col-span-5">Trigger Event</div>
                                <div className="col-span-3 text-right">Action</div>
                            </div>

                            <ScrollArea className="h-[400px]">
                                {isLoading ? (
                                    <div className="p-8 text-center text-muted-foreground animate-pulse">Scanning Guardian Database...</div>
                                ) : isError ? (
                                    <div className="p-8 text-center text-destructive">Failed to load active escalations.</div>
                                ) : (
                                    <>
                                        {escalations.map((esc) => (
                                            <div key={esc._id} className={`grid grid-cols-12 gap-4 p-4 text-sm border-b border-border items-center hover:bg-accent/50 transition-colors group ${esc.status === 'Resolved' ? 'opacity-50' : ''}`}>
                                                <div className="col-span-2">
                                                    <div className="font-mono text-xs text-muted-foreground">{esc.escalationId}</div>
                                                    <div className="text-[10px] text-muted-foreground/80 flex items-center gap-1 mt-1 font-medium">
                                                        <Clock className="w-3 h-3 text-primary/70" /> {new Date(esc.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    {getRiskBadge(esc.riskLevel)}
                                                    {esc.status === 'Resolved' && (
                                                        <Badge className="ml-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">RESOLVED</Badge>
                                                    )}
                                                </div>
                                                <div className="col-span-5 text-muted-foreground text-xs leading-relaxed group-hover:text-foreground transition-colors">
                                                    {esc.trigger}
                                                </div>
                                                <div className="col-span-3 flex items-center justify-end gap-2">
                                                    {esc.status !== 'Resolved' && (
                                                        <Button onClick={() => handleResolve(esc._id)} variant="outline" size="sm" className="h-9 bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/20 transition-all font-medium px-2" title="Mark as Done">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button onClick={() => handleDelete(esc._id)} variant="outline" size="sm" className="h-9 bg-destructive/10 border-destructive/20 text-destructive hover:text-destructive/80 hover:bg-destructive/20 transition-all font-medium px-2" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-9 bg-muted/50 border-border text-foreground hover:bg-accent transition-all font-medium">
                                                        Brief <ArrowUpRight className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}

                                        {escalations.length === 0 && (
                                            <div className="p-16 flex flex-col items-center justify-center text-center">
                                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                                                    <ShieldAlert className="w-8 h-8 text-emerald-500 opacity-50" />
                                                </div>
                                                <h3 className="text-lg font-medium text-foreground mb-2">All Clear</h3>
                                                <p className="text-muted-foreground max-w-sm">No active escalations detected by the Guardian protocol. All field operations are within normal parameters.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

export default RiskDashboard;
