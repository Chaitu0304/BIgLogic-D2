import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Image as ImageIcon, Maximize2, Upload, Folder, Video, Download, Edit2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import api from "@/services/api";
import { useTheme } from "@/components/ThemeProvider";

const PhotosTab = () => {
    const { theme } = useTheme();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [viewMode, setViewMode] = useState<"albums" | "detail">("albums");
    const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");

    // Upload State
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [albumName, setAlbumName] = useState("General");
    const [newAlbumName, setNewAlbumName] = useState("");
    const [description, setDescription] = useState("");
    const [uploadMode, setUploadMode] = useState<"existing" | "new">("existing");

    // Edit State
    const [editingPhoto, setEditingPhoto] = useState<any>(null);
    const [editDescription, setEditDescription] = useState("");

    // Fetch Job Data
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

    const photos = jobData?.photos || [];

    // Derived Albums
    const albums = useMemo(() => {
        const groups: Record<string, any[]> = {};
        photos.forEach((p: any) => {
            const name = p.albumName || "General";
            if (!groups[name]) groups[name] = [];
            groups[name].push(p);
        });
        return groups;
    }, [photos]);

    const existingAlbumNames = Object.keys(albums);

    // Upload Mutation
    const uploadMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const token = localStorage.getItem("token");
            return await api.post(`/jobs/${id}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["job", id] });
            toast.success("File uploaded successfully");
            setIsUploadOpen(false);
            resetForm();
        },
        onError: () => {
            toast.error("Failed to upload file");
        }
    });

    // Update Photo Mutation
    const updatePhotoMutation = useMutation({
        mutationFn: async ({ photoId, description }: { photoId: string, description: string }) => {
            const token = localStorage.getItem("token");
            return await api.put(`/jobs/${id}/photos/${photoId}`, { description }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["job", id] });
            toast.success("Description updated");
            setEditingPhoto(null);
        },
        onError: () => {
            toast.error("Failed to update photo");
        }
    });

    const resetForm = () => {
        setSelectedFile(null);
        setDescription("");
        setNewAlbumName("");
        setUploadMode("existing");
        setAlbumName("General");
    };

    const handleUpload = () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', 'photo');
        const finalAlbum = uploadMode === 'new' ? newAlbumName : albumName;
        formData.append('albumName', finalAlbum);
        formData.append('description', description);

        uploadMutation.mutate(formData);
    };

    const openAlbum = (name: string) => {
        setActiveAlbum(name);
        setViewMode("detail");
    };

    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || 'download';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return <Skeleton className="w-full h-[500px]" />;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-5">
                    {viewMode === "detail" && (
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => { setViewMode("albums"); setFilterType("all"); }} 
                            className={`h-12 w-12 rounded-xl border-0 ring-1 transition-all ${theme === 'dark' ? 'bg-white/5 ring-white/10 text-white hover:bg-white/10' : 'bg-white ring-gray-200 text-indigo-950 hover:bg-gray-50'}`}
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    )}
                    <div className="space-y-1">
                        <h2 className={`text-4xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {viewMode === "detail" ? activeAlbum : "Project"} <span className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Media</span>
                        </h2>
                        <p className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                            {viewMode === "detail"
                                ? `Visual documentation for ${activeAlbum} milestone.`
                                : "Field photos and videos organized by job phase."}
                        </p>
                    </div>
                </div>

                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 py-6 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Upload className="mr-2.5 h-5 w-5" /> Upload Media
                        </Button>
                    </DialogTrigger>
                    <DialogContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-gray-200 text-indigo-950 shadow-2xl'} min-w-[550px] rounded-3xl overflow-hidden`}>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Upload New Media</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-6">
                            <div className="space-y-2.5">
                                <Label className={`text-xs font-semibold uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Source File</Label>
                                <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    <Input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white shadow-sm text-indigo-600'}`}>
                                            <ImageIcon className="h-6 w-6" />
                                        </div>
                                        <div className="text-sm font-bold">
                                            {selectedFile ? selectedFile.name : "Choose or drop media..."}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <Label className={`text-xs font-semibold uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Destination Album</Label>
                                <Tabs value={uploadMode} onValueChange={(v: any) => setUploadMode(v)}>
                                    <TabsList className={`w-full p-1 h-12 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                                        <TabsTrigger value="existing" className="flex-1 rounded-lg font-medium data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">Select Existing</TabsTrigger>
                                        <TabsTrigger value="new" className="flex-1 rounded-lg font-medium data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all">Create New</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="existing" className="mt-4">
                                        <Select value={albumName} onValueChange={setAlbumName}>
                                            <SelectTrigger className={`border-0 ring-1 h-12 rounded-xl font-medium px-4 ${theme === 'dark' ? 'bg-white/[0.03] ring-white/10 text-white' : 'bg-slate-50 ring-slate-200 shadow-sm text-slate-900'}`}>
                                                <SelectValue placeholder="Select Album" />
                                            </SelectTrigger>
                                            <SelectContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10' : 'bg-white ring-gray-200 shadow-2xl'} rounded-xl overflow-hidden p-1`}>
                                                {existingAlbumNames.length > 0 ? existingAlbumNames.map(name => (
                                                    <SelectItem key={name} value={name} className="font-medium py-2.5 rounded-lg">{name}</SelectItem>
                                                )) : <SelectItem value="General" className="font-medium py-2.5 rounded-lg">General</SelectItem>}
                                            </SelectContent>
                                        </Select>
                                    </TabsContent>
                                    <TabsContent value="new" className="mt-4">
                                        <Input
                                            placeholder="Enter unique album name..."
                                            value={newAlbumName}
                                            onChange={(e) => setNewAlbumName(e.target.value)}
                                            className={`h-12 border-0 ring-1 rounded-xl font-medium px-4 ${theme === 'dark' ? 'bg-white/[0.03] ring-white/10 text-white' : 'bg-slate-50 ring-slate-200 shadow-sm text-slate-900'}`}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <div className="space-y-2.5">
                                <Label className={`text-xs font-semibold uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Detailed Context</Label>
                                <Input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`h-12 border-0 ring-1 rounded-xl font-medium px-4 ${theme === 'dark' ? 'bg-white/[0.03] ring-white/10 text-white' : 'bg-slate-50 ring-slate-200 shadow-sm text-slate-900'}`}
                                    placeholder="Add notes for this media entry..."
                                />
                            </div>
                        </div>
                        <DialogFooter className="gap-3">
                            <Button variant="outline" onClick={() => setIsUploadOpen(false)} className={`h-12 rounded-xl px-6 font-bold ${theme === 'dark' ? 'border-white/10 text-white' : 'border-gray-200 text-slate-900'}`}>Cancel</Button>
                            <Button onClick={handleUpload} disabled={!selectedFile || uploadMutation.isPending} className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                                {uploadMutation.isPending ? "Syncing..." : "Start Upload"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Albums Grid View */}
            {viewMode === "albums" && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-20">
                    {existingAlbumNames.length === 0 ? (
                        <div className={`col-span-full text-center py-20 border-2 border-dashed rounded-3xl ${theme === 'dark' ? 'border-white/5 bg-white/[0.01]' : 'border-gray-100 bg-gray-50/50'}`}>
                            <div className={`h-16 w-16 mx-auto mb-4 rounded-3xl flex items-center justify-center ${theme === 'dark' ? 'bg-white/5' : 'bg-white shadow-md'}`}>
                                <ImageIcon className={`h-8 w-8 ${theme === 'dark' ? 'text-gray-600' : 'text-slate-200'}`} />
                            </div>
                            <p className={`font-semibold text-sm uppercase tracking-widest ${theme === 'dark' ? 'text-gray-600' : 'text-slate-400'}`}>No media assets uploaded yet.</p>
                        </div>
                    ) : (
                        existingAlbumNames.map(name => (
                            <div
                                key={name}
                                onClick={() => openAlbum(name)}
                                className={`group cursor-pointer border-0 ring-1 rounded-3xl overflow-hidden transition-all hover:scale-[1.02] shadow-xl ${
                                    theme === 'dark' 
                                    ? 'bg-[#0A0A0A] ring-white/5 hover:ring-indigo-500/50 shadow-indigo-500/5' 
                                    : 'bg-white ring-gray-100 hover:ring-indigo-200 shadow-gray-200/50'
                                }`}
                            >
                                {/* Album Preview (First 4 images grid) */}
                                <div className={`aspect-square grid grid-cols-2 gap-0.5 ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
                                    {albums[name]?.slice(0, 4).map((photo: any, i: number) => (
                                        <div key={i} className="relative w-full h-full overflow-hidden">
                                            {photo.type === 'video' ? (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                                    <Video className="h-5 w-5 text-white/30" />
                                                </div>
                                            ) : (
                                                <img src={photo.thumbnailUrl || photo.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            )}
                                        </div>
                                    ))}
                                    {/* Fill empty slots if less than 4 */}
                                    {Array.from({ length: Math.max(0, 4 - albums[name].length) }).map((_, i) => (
                                        <div key={`empty-${i}`} className={theme === 'dark' ? 'bg-white/[0.02]' : 'bg-indigo-50/20'} />
                                    ))}
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`font-bold tracking-tight truncate flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                                            <Folder className={`h-4 w-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} /> {name}
                                        </h3>
                                    </div>
                                    <p className={`text-[10px] font-normal uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>{albums[name].length} assets stored</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Detail View */}
            {viewMode === "detail" && activeAlbum && (
                <div className="space-y-8 pb-20">
                    {/* Media Filters */}
                    <div className={`flex items-center gap-2 p-1 rounded-2xl border-0 ring-1 w-fit ${theme === 'dark' ? 'bg-white/5 ring-white/5' : 'bg-gray-100 ring-gray-200 shadow-inner'}`}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFilterType("all")}
                            className={`rounded-xl px-6 font-semibold text-[10px] uppercase tracking-widest transition-all ${filterType === "all" ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-indigo-600'}`}
                        >
                            All Assets
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFilterType("image")}
                            className={`rounded-xl px-6 font-semibold text-[10px] uppercase tracking-widest transition-all ${filterType === "image" ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-indigo-600'}`}
                        >
                            <ImageIcon className="h-3 w-3 mr-2" /> Photos
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFilterType("video")}
                            className={`rounded-xl px-6 font-semibold text-[10px] uppercase tracking-widest transition-all ${filterType === "video" ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-indigo-600'}`}
                        >
                            <Video className="h-3 w-3 mr-2" /> Videos
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {albums[activeAlbum]
                            ?.filter((photo: any) => filterType === "all" || photo.type === filterType)
                            .map((photo: any) => (
                                <div key={photo._id} className={`group relative border-0 ring-1 rounded-3xl overflow-hidden shadow-xl transition-all duration-500 hover:scale-[1.03] ${
                                    theme === 'dark' ? 'bg-[#1A1A1A] ring-white/5 shadow-black/50' : 'bg-white ring-gray-100 shadow-gray-200/50'
                                }`}>
                                    <Dialog>
                                        <DialogTrigger className="w-full text-left">
                                            <div className="aspect-[4/3] w-full relative overflow-hidden bg-black flex items-center justify-center shadow-inner">
                                                {photo.type === 'video' ? (
                                                    <div className="w-full h-full relative">
                                                        <video src={photo.url} className="absolute inset-0 w-full h-full object-cover opacity-60" muted />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                                <Video className="h-6 w-6 text-white" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={photo.thumbnailUrl || photo.url}
                                                        alt={photo.description}
                                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                        <Maximize2 className="text-white h-5 w-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-6xl bg-black/95 backdrop-blur-2xl border-white/5 p-0 overflow-hidden rounded-3xl">
                                            <div className="relative w-full h-[75vh] flex items-center justify-center bg-transparent group">
                                                {photo.type === 'video' ? (
                                                    <video src={photo.url} controls className="max-w-full max-h-full shadow-2xl" />
                                                ) : (
                                                    <img src={photo.url} className="max-w-full max-h-full object-contain shadow-2xl" />
                                                )}
                                            </div>
                                            <div className={`p-8 border-t ${theme === 'dark' ? 'bg-[#0A0A0A] border-white/5' : 'bg-white border-gray-100'} flex items-center justify-between`}>
                                                <div className="space-y-2">
                                                    <p className={`text-xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{photo.description || "Project Documentation Asset"}</p>
                                                    <div className="flex items-center gap-3">
                                                        <p className={`text-[10px] font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>Captured Phase: {activeAlbum}</p>
                                                        <div className="h-1 w-1 rounded-full bg-gray-500" />
                                                        <p className="text-[10px] font-normal text-gray-500 uppercase tracking-widest">{format(new Date(photo.createdAt), 'EEEE, MMMM do yyyy @ h:mm a')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl px-8 shadow-lg shadow-indigo-500/20" onClick={() => handleDownload(photo.url, `photo-${photo._id}`)}>
                                                        <Download className="h-5 w-5 mr-3" /> Download Source
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Card Footer Actions */}
                                    <div className={`p-5 space-y-4 ${theme === 'dark' ? 'bg-[#0F0F0F]' : 'bg-white'}`}>
                                        <div className="min-h-[2.5rem]">
                                            <p className={`text-xs font-normal leading-relaxed line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>
                                                {photo.description || <span className="opacity-30 italic">No description provided</span>}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
                                            <div className="flex items-center gap-1.5">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-indigo-500/10 hover:text-indigo-400 text-gray-500' : 'hover:bg-indigo-50 hover:text-indigo-600 text-indigo-900/30'}`} onClick={() => {
                                                            setEditingPhoto(photo);
                                                            setEditDescription(photo.description || "");
                                                        }}>
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className={`border-0 ring-1 ${theme === 'dark' ? 'bg-[#1A1A1A] ring-white/10 text-white' : 'bg-white ring-gray-200 text-indigo-950'} rounded-3xl`}>
                                                        <DialogHeader><DialogTitle className="text-xl font-bold">Refine Context</DialogTitle></DialogHeader>
                                                         <div className="py-6 space-y-3">
                                                            <Label className={`text-[10px] font-semibold uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-gray-500' : 'text-slate-400'}`}>Media Description</Label>
                                                            <Textarea
                                                                value={editDescription}
                                                                onChange={(e) => setEditDescription(e.target.value)}
                                                                className={`min-h-[120px] border-0 ring-1 rounded-2xl font-medium p-4 text-base ${theme === 'dark' ? 'bg-white/[0.03] ring-white/10 text-white focus:ring-indigo-500/50' : 'bg-slate-50 ring-slate-100 text-slate-900 focus:ring-indigo-500'}`}
                                                                placeholder="Enter detailed documentation notes..."
                                                            />
                                                        </div>
                                                        <DialogFooter>
                                                            <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20" onClick={() => updatePhotoMutation.mutate({ photoId: editingPhoto._id, description: editDescription })}>
                                                                Sync Changes
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-indigo-50 text-indigo-900/30'}`} onClick={() => handleDownload(photo.url, `photo-${photo._id}`)}>
                                                    <Download className="h-4.5 w-4.5" />
                                                </Button>
                                            </div>
                                            <span className={`text-[9px] font-semibold uppercase tracking-tighter ${theme === 'dark' ? 'text-gray-600' : 'text-slate-300'}`}>
                                                {format(new Date(photo.createdAt), 'MMM dd')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotosTab;
