import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Search, Download, FileText, Loader2, PlayCircle, CheckCircle, XCircle, Clock, ArrowUpRight, Building2 } from 'lucide-react';
import { adminService, Execution } from '../../services/adminService';
import io from 'socket.io-client';
import api from '../../services/api';

const SOCKET_URL = import.meta.env.PROD ? 'https://server.biglogic.ai' : 'http://localhost:5000';

const WorkflowExecutionHistory = () => {
    const [activeTab, setActiveTab] = useState('live');

    // Live Monitor State
    const [liveExecutions, setLiveExecutions] = useState<Execution[]>([]);

    // History State
    const [historyExecutions, setHistoryExecutions] = useState<Execution[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 15;
    const [isGroupByCompany, setIsGroupByCompany] = useState(false);

    // Initialize Socket
    useEffect(() => {
        console.log("Initializing Socket connection to:", SOCKET_URL);
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('Connected to WebSocket with ID:', socket.id);
        });

        socket.on('connect_error', (err) => {
            console.error('WebSocket Connection Error:', err);
        });

        socket.on('workflow_update', (newExecution: any) => {
            console.log("Received workflow_update event:", newExecution);
            // Map backend object to frontend Execution interface
            const mappedExecution: Execution = {
                id: newExecution._id,
                user: newExecution.user ? newExecution.user.email : 'Unknown',
                userName: newExecution.user ? newExecution.user.name : 'Unknown',
                workflow: newExecution.workflowType,
                status: newExecution.status,
                started: newExecution.startedAt,
                completed: newExecution.completedAt,
                inputFiles: newExecution.inputFiles,
                outputFiles: newExecution.outputFiles
            };

            setLiveExecutions(prev => {
                // Determine if we update existing or add new
                const existingIndex = prev.findIndex(e => e.id === mappedExecution.id);
                if (existingIndex > -1) {
                    const updated = [...prev];
                    updated[existingIndex] = mappedExecution;
                    return updated;
                }
                return [mappedExecution, ...prev];
            });

            // Also refresh history if we are on that tab
            if (activeTab === 'history') {
                fetchHistory();
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [activeTab]);

    // Fetch History
    const fetchHistory = async () => {
        setLoading(true);
        try {
            const { executions, total } = await adminService.fetchExecutions(page, limit, undefined, search);
            setHistoryExecutions(executions);
            setTotalPages(Math.ceil(total / limit));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'history') {
            const timeoutId = setTimeout(() => {
                fetchHistory();
            }, 500); // Debounce search
            return () => clearTimeout(timeoutId);
        }
    }, [page, search, activeTab]);


    const handleDownload = async (fileKey: string, fileName: string) => {
        try {
            const { data } = await api.get(`/files/download?key=${encodeURIComponent(fileKey)}`);
            window.open(data.url, '_blank');
        } catch (error) {
            console.error("Download failed", error);
            // alert("Failed to download file"); // Removed alert
        }
    };

    // Helper for Status Badge
    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'Completed': return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">Completed</Badge>;
            case 'Processing': return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing</Badge>;
            case 'Waiting for Selection': return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">User Input: Selection</Badge>;
            case 'Waiting for Schedule': return <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20">Ready for Schedule</Badge>;
            case 'Failed': return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Failed</Badge>;
            default: return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">{status}</Badge>;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Workflow Executions</h1>
                    <p className="text-muted-foreground">Monitor real-time activity and review past execution logs.</p>
                </div>

                <Tabs defaultValue="live" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-accent border border-border p-1">
                        <TabsTrigger value="live" className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground">
                            <PlayCircle className="w-4 h-4 mr-2 text-green-500" />
                            Live Monitor
                        </TabsTrigger>
                        <TabsTrigger value="history" className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground">
                            <Clock className="w-4 h-4 mr-2 text-blue-500" />
                            Execution History
                        </TabsTrigger>
                    </TabsList>

                    {/* LIVE MONITOR TAB */}
                    <TabsContent value="live" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {liveExecutions.length === 0 && (
                                <div className="col-span-full text-center py-20 bg-accent/50 border border-dashed border-border rounded-lg">
                                    <p className="text-muted-foreground">No active workflows detected right now.</p>
                                    <p className="text-xs text-muted-foreground/60 mt-2">New executions will appear here instantly.</p>
                                </div>
                            )}
                            {liveExecutions.map((exec) => (
                                <Card key={exec.id} className="bg-card border-border animate-in fade-in slide-in-from-top-4">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-foreground text-lg">{exec.workflow}</CardTitle>
                                                <CardDescription className="text-muted-foreground">{exec.userName} ({exec.user})</CardDescription>
                                            </div>
                                            <StatusBadge status={exec.status} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Started:</span>
                                                <span className="text-foreground/80">{new Date(exec.started).toLocaleTimeString()}</span>
                                            </div>

                                            {/* Show Completion Time if exists */}
                                            {exec.completed && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Ended:</span>
                                                    <span className="text-foreground/80">{new Date(exec.completed).toLocaleTimeString()}</span>
                                                </div>
                                            )}

                                            {/* Input Files */}
                                            {exec.inputFiles && exec.inputFiles.length > 0 && (
                                                <button
                                                    onClick={() => handleDownload(exec.inputFiles![0].path, exec.inputFiles![0].originalName)}
                                                    className="p-2 bg-white/5 rounded border border-white/5 text-xs text-blue-400 hover:bg-white/10 flex items-center w-full text-left transition-colors"
                                                >
                                                    <FileText className="w-3 h-3 mr-2 shrink-0" />
                                                    <span className="truncate">Input: {exec.inputFiles[0].originalName}</span>
                                                </button>
                                            )}

                                            {/* Output Files */}
                                            {exec.outputFiles && exec.outputFiles.length > 0 && (
                                                <button
                                                    onClick={() => handleDownload(exec.outputFiles![0].path, exec.outputFiles![0].originalName)}
                                                    className="p-2 bg-emerald-500/5 rounded border border-emerald-500/10 text-xs text-emerald-400 hover:bg-emerald-500/10 flex items-center w-full text-left transition-colors"
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-2 shrink-0" />
                                                    <span className="truncate">Output: {exec.outputFiles[0].originalName}</span>
                                                </button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* HISTORY TAB */}
                    <TabsContent value="history" className="mt-6">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <CardTitle className="text-foreground">Execution Logs</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant={isGroupByCompany ? "secondary" : "outline"}
                                            size="sm"
                                            onClick={() => setIsGroupByCompany(!isGroupByCompany)}
                                            className={isGroupByCompany ? "bg-indigo-600 hover:bg-indigo-500 text-white border-transparent" : "bg-white border-white/10 text-gray-900 "}
                                        >
                                            <Building2 className="w-4 h-4 mr-2" />
                                            Group by Company
                                        </Button>
                                        <div className="relative w-full md:w-72">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search by User, Email, or Company..."
                                                className="pl-9 bg-accent/50 border-border text-foreground focus:ring-red-500/50"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border border-border">
                                    <Table>
                                        <TableHeader className="bg-accent/50 border-border">
                                            <TableRow className="border-border hover:bg-transparent">
                                                <TableHead className="text-muted-foreground">User Details</TableHead>
                                                <TableHead className="text-muted-foreground">Company</TableHead>
                                                <TableHead className="text-muted-foreground">Workflow</TableHead>
                                                <TableHead className="text-muted-foreground">Status</TableHead>
                                                <TableHead className="text-muted-foreground">Date</TableHead>
                                                <TableHead className="text-muted-foreground">Files</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {loading ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8">
                                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-red-500" />
                                                    </TableCell>
                                                </TableRow>
                                            ) : historyExecutions.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                        No execution records found.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                isGroupByCompany ? (
                                                    Object.entries(
                                                        historyExecutions.reduce((acc, exec) => {
                                                            const key = exec.companyName || 'No Company';
                                                            if (!acc[key]) acc[key] = [];
                                                            acc[key].push(exec);
                                                            return acc;
                                                        }, {} as Record<string, Execution[]>)
                                                    ).map(([company, executions]) => (
                                                        <React.Fragment key={company}>
                                                            <TableRow className="bg-white/5 hover:bg-white/5">
                                                                <TableCell colSpan={6} className="font-semibold text-indigo-400 py-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <Building2 className="w-4 h-4" />
                                                                        {company} ({executions.length})
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                            {executions.map((exec) => (
                                                                <TableRow key={exec.id} className="border-border hover:bg-accent/50 transition-colors">
                                                                    <TableCell>
                                                                        <div className="flex flex-col ml-4">
                                                                            <div className="font-medium text-foreground flex items-center gap-2">
                                                                                {exec.projectName || exec.inputFiles?.[0]?.originalName || `Run #${exec.id.slice(-6)}`}
                                                                                <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                                                            </div>
                                                                            <span className="text-xs text-muted-foreground">{exec.userName} ({exec.user})</span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-muted-foreground">{exec.companyName}</TableCell>
                                                                    <TableCell className="text-foreground/80">{exec.workflow}</TableCell>
                                                                    <TableCell><StatusBadge status={exec.status} /></TableCell>
                                                                    <TableCell className="text-muted-foreground text-sm">
                                                                        {new Date(exec.started).toLocaleDateString()} <br />
                                                                        <span className="text-xs text-muted-foreground/60">{new Date(exec.started).toLocaleTimeString()}</span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex items-center space-x-2">
                                                                            {exec.inputFiles?.map((file, idx) => (
                                                                                <Button
                                                                                    key={idx}
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                                                                    title={`Download Input: ${file.originalName}`}
                                                                                    onClick={() => handleDownload(file.path, file.originalName)}
                                                                                >
                                                                                    <Download className="w-4 h-4" />
                                                                                </Button>
                                                                            ))}
                                                                            {exec.outputFiles?.map((file, idx) => (
                                                                                <Button
                                                                                    key={idx}
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                                                                                    title={`Download Output: ${file.originalName}`}
                                                                                    onClick={() => handleDownload(file.path, file.originalName)}
                                                                                >
                                                                                    <CheckCircle className="w-4 h-4" />
                                                                                </Button>
                                                                            ))}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    historyExecutions.map((exec) => (
                                                        <TableRow key={exec.id} className="border-border hover:bg-accent/50 transition-colors">
                                                            <TableCell>
                                                                <div className="flex flex-col">
                                                                    <div className="font-medium text-foreground flex items-center gap-2">
                                                                        {exec.projectName || exec.inputFiles?.[0]?.originalName || `Run #${exec.id.slice(-6)}`}
                                                                        <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                                                                    </div>
                                                                    <span className="text-xs text-muted-foreground">{exec.userName} ({exec.user})</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground">{exec.companyName || 'N/A'}</TableCell>
                                                            <TableCell className="text-foreground/80">{exec.workflow}</TableCell>
                                                            <TableCell><StatusBadge status={exec.status} /></TableCell>
                                                            <TableCell className="text-muted-foreground text-sm">
                                                                {new Date(exec.started).toLocaleDateString()} <br />
                                                                <span className="text-xs text-muted-foreground/60">{new Date(exec.started).toLocaleTimeString()}</span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    {exec.inputFiles?.map((file, idx) => (
                                                                        <Button
                                                                            key={idx}
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                                                                            title={`Download Input: ${file.originalName}`}
                                                                            onClick={() => handleDownload(file.path, file.originalName)}
                                                                        >
                                                                            <Download className="w-4 h-4" />
                                                                        </Button>
                                                                    ))}
                                                                    {exec.outputFiles?.map((file, idx) => (
                                                                        <Button
                                                                            key={idx}
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                                                                            title={`Download Output: ${file.originalName}`}
                                                                            onClick={() => handleDownload(file.path, file.originalName)}
                                                                        >
                                                                            <CheckCircle className="w-4 h-4" />
                                                                        </Button>
                                                                    ))}
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="flex items-center justify-end space-x-2 py-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1 || loading}
                                        className="bg-transparent border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages || loading}
                                        className="bg-transparent border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
};

export default WorkflowExecutionHistory;
