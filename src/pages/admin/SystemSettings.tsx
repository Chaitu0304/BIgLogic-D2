
import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { adminService, SystemConfig } from "@/services/adminService";
import { Loader2, Save, Shield, Server, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SystemSettings = () => {
    const { toast } = useToast();
    const [config, setConfig] = useState<SystemConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await adminService.fetchSystemSettings();
                setConfig(data);
            } catch (error) {
                console.error("Failed to fetch settings", error);
                toast({
                    title: "Error",
                    description: "Failed to load system settings.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        if (!config) return;
        setSubmitting(true);
        try {
            // Sanitize payload: remove _id, createdAt, updatedAt to prevent modification errors
            const { _id, createdAt, updatedAt, __v, ...payload } = config as any;
            await adminService.updateSystemSettings(payload);
            toast({
                title: "Settings Saved",
                description: "System configuration has been updated successfully.",
                style: { backgroundColor: '#064e3b', borderColor: '#10b981', color: 'white' }
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save settings.",
                variant: "destructive"
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-[60vh]">
                    <Loader2 className="w-10 h-10 animate-spin text-red-500" />
                </div>
            </AdminLayout>
        );
    }

    if (!config) return null;

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">System Settings</h1>
                    <p className="text-muted-foreground">Configure global parameters, security policies, and platform behavior.</p>
                </div>

                <Tabs defaultValue="general" className="space-y-6">
                    <TabsList className="bg-muted/40 border border-border p-1">
                        <TabsTrigger value="general" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                            <Settings2 className="w-4 h-4 mr-2" /> General
                        </TabsTrigger>
                        <TabsTrigger value="security" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                            <Shield className="w-4 h-4 mr-2" /> Security & Access
                        </TabsTrigger>
                    </TabsList>

                    {/* General Settings */}
                    <TabsContent value="general">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">General Configuration</CardTitle>
                                <CardDescription className="text-muted-foreground">Manage basic system behaviors and contact info.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg border border-border">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-foreground">Maintenance Mode</Label>
                                        <p className="text-sm text-muted-foreground">Temporarily disable access for non-admin users.</p>
                                    </div>
                                    <Switch
                                        checked={config.maintenanceMode}
                                        onCheckedChange={(checked) => setConfig({ ...config, maintenanceMode: checked })}
                                        className="data-[state=checked]:bg-red-600"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-foreground">Support Email</Label>
                                    <Input
                                        id="email"
                                        value={config.supportEmail}
                                        onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                                        className="bg-background border-border text-foreground"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="announcement" className="text-foreground">Global Announcement Banner</Label>
                                    <Input
                                        id="announcement"
                                        placeholder="e.g., Scheduled maintenance at 10 PM UTC"
                                        value={config.announcementMessage}
                                        onChange={(e) => setConfig({ ...config, announcementMessage: e.target.value })}
                                        className="bg-background border-border text-foreground"
                                    />
                                    <p className="text-xs text-muted-foreground">Message will be displayed at the top of the user dashboard.</p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="retention" className="text-foreground">Data Retention (Days)</Label>
                                    <Input
                                        id="retention"
                                        type="number"
                                        value={config.dataRetentionDays}
                                        onChange={(e) => setConfig({ ...config, dataRetentionDays: parseInt(e.target.value) || 30 })}
                                        className="bg-background border-border text-foreground"
                                    />
                                    <p className="text-xs text-muted-foreground">Period to retain workflow files before deletion policy applies.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security */}
                    <TabsContent value="security">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">Security & Access Control</CardTitle>
                                <CardDescription className="text-muted-foreground">Enforce security standards and restrict access.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg border border-border">
                                    <div className="space-y-0.5">
                                        <Label className="text-base text-foreground">User Registration</Label>
                                        <p className="text-sm text-muted-foreground">Allow new users to sign up via the public page.</p>
                                    </div>
                                    <Switch
                                        checked={config.registrationEnabled}
                                        onCheckedChange={(checked) => setConfig({ ...config, registrationEnabled: checked })}
                                        className="data-[state=checked]:bg-green-600"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-foreground">Session Timeout</Label>
                                    <Select
                                        value={config.sessionTimeout}
                                        onValueChange={(val) => setConfig({ ...config, sessionTimeout: val })}
                                    >
                                        <SelectTrigger className="bg-background border-border text-foreground">
                                            <SelectValue placeholder="Select timeout" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border text-foreground">
                                            <SelectItem value="15m">15 Minutes</SelectItem>
                                            <SelectItem value="30m">30 Minutes</SelectItem>
                                            <SelectItem value="1h">1 Hour</SelectItem>
                                            <SelectItem value="4h">4 Hours</SelectItem>
                                            <SelectItem value="24h">24 Hours</SelectItem>
                                            <SelectItem value="15d">15 Days</SelectItem>
                                            <SelectItem value="30d">30 Days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={submitting}
                        className="bg-red-600 hover:bg-red-700 text-white px-8"
                    >
                        {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default SystemSettings;
