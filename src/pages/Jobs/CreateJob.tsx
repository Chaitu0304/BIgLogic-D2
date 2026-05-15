import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import api from "@/services/api";

const CreateJob = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        jobId: "",
        jobName: "",
        claimNumber: "",
        status: "Lead",
        priority: "Normal",
        yearBuilt: "",
        lossAddress: {
            street: "",
            city: "",
            state: "",
            zip: ""
        },
        primaryContact: {
            name: "",
            email: "",
            phone: ""
        }
    });

    const handleChange = (section: string, field: string, value: string) => {
        if (section === "root") {
            setFormData(prev => ({ ...prev, [field]: value }));
        } else if (section === "lossAddress") {
            setFormData(prev => ({
                ...prev,
                lossAddress: { ...prev.lossAddress, [field]: value }
            }));
        } else if (section === "primaryContact") {
            setFormData(prev => ({
                ...prev,
                primaryContact: { ...prev.primaryContact, [field]: value }
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.jobId || !formData.jobName) {
            toast({
                title: "Missing Required Fields",
                description: "Job ID and Job Name are required.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            // Transform data to match backend schema
            // jobRoutes.js likely expects:
            // { ...body, participants: { primaryContact: { ... } } }
            // and lossAddress as nested object

            const payload = {
                ...formData,
                participants: {
                    primaryContact: formData.primaryContact
                }
            };

            // Remove the root primaryContact as it's now nested
            // (We are casting to any to avoid TS errors for the delete operation)
            const submissionPayload: any = { ...payload };
            delete submissionPayload.primaryContact;

            await api.post("/jobs", submissionPayload);

            toast({
                title: "Job Created",
                description: "New job has been successfully added to the database.",
            });

            navigate("/jobs");

        } catch (error: any) {
            console.error("Failed to create job:", error);
            toast({
                title: "Creation Failed",
                description: error.response?.data?.message || "Could not create job. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-10">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" type="button" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground hover:bg-accent">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create New Job</h1>
                            <p className="text-muted-foreground mt-1">Enter project details, customer info, and location.</p>
                        </div>
                    </div>
                    <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Create Job
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Core Info */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. Job Details Card */}
                        <Card className="bg-card border-border text-foreground shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                                    Job Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="jobName" className="text-muted-foreground">Job Name <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="jobName"
                                        placeholder="e.g. Smith - Water Damage"
                                        className="bg-muted/50 border-border text-foreground focus:border-primary"
                                        value={formData.jobName}
                                        onChange={(e) => handleChange("root", "jobName", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jobId" className="text-muted-foreground">Job Number (ID) <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="jobId"
                                        placeholder="e.g. 24-001"
                                        className="bg-muted/50 border-border text-foreground focus:border-primary"
                                        value={formData.jobId}
                                        onChange={(e) => handleChange("root", "jobId", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="claimNumber" className="text-muted-foreground">Claim Number <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="claimNumber"
                                        placeholder="e.g. CLM-123456789"
                                        className="bg-muted/50 border-border text-foreground focus:border-primary"
                                        value={formData.claimNumber}
                                        onChange={(e) => handleChange("root", "claimNumber", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="yearBuilt" className="text-muted-foreground">Year Built <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="yearBuilt"
                                        type="number"
                                        placeholder="e.g. 1995"
                                        className="bg-muted/50 border-border text-foreground focus:border-primary"
                                        value={formData.yearBuilt}
                                        onChange={(e) => handleChange("root", "yearBuilt", e.target.value)}
                                        required
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Location Card */}
                        <Card className="bg-card border-border text-foreground shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                                    Loss Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="street" className="text-muted-foreground">Street Address <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="street"
                                        placeholder="123 Main St"
                                        className="bg-muted/50 border-border text-foreground focus:border-primary"
                                        value={formData.lossAddress.street}
                                        onChange={(e) => handleChange("lossAddress", "street", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                    <div className="col-span-1 md:col-span-3 space-y-2">
                                        <Label htmlFor="city" className="text-muted-foreground">City <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="city"
                                            placeholder="City"
                                            className="bg-muted/50 border-border text-foreground focus:border-primary"
                                            value={formData.lossAddress.city}
                                            onChange={(e) => handleChange("lossAddress", "city", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-2">
                                        <Label htmlFor="state" className="text-muted-foreground">State <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="state"
                                            placeholder="State"
                                            className="bg-muted/50 border-border text-foreground focus:border-primary"
                                            value={formData.lossAddress.state}
                                            onChange={(e) => handleChange("lossAddress", "state", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-1 space-y-2">
                                        <Label htmlFor="zip" className="text-muted-foreground">Zip <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="zip"
                                            placeholder="Zip"
                                            className="bg-muted/50 border-border text-foreground focus:border-primary"
                                            value={formData.lossAddress.zip}
                                            onChange={(e) => handleChange("lossAddress", "zip", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Settings & Customer */}
                    <div className="space-y-6">

                        {/* 3. Status & Priority */}
                        <Card className="bg-card border-border text-foreground shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                    Workflow Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(val) => handleChange("root", "status", val)}
                                    >
                                        <SelectTrigger className="bg-muted/50 border-border text-foreground">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border text-popover-foreground">
                                            <SelectItem value="Lead">Lead</SelectItem>
                                            <SelectItem value="inspecting">Inspecting</SelectItem>
                                            <SelectItem value="Estimating">Estimating</SelectItem>
                                            <SelectItem value="Approved">Approved</SelectItem>
                                            <SelectItem value="Production">Production</SelectItem>
                                            <SelectItem value="Billing">Billing</SelectItem>
                                            <SelectItem value="Paid">Paid</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Priority</Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(val) => handleChange("root", "priority", val)}
                                    >
                                        <SelectTrigger className="bg-muted/50 border-border text-foreground">
                                            <SelectValue placeholder="Select Priority" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover border-border text-popover-foreground">
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Normal">Normal</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Critical">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 4. Primary Contact */}
                        <Card className="bg-card border-border text-foreground shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                                    Primary Contact
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contactName" className="text-muted-foreground">Full Name</Label>
                                    <Input
                                        id="contactName"
                                        placeholder="e.g. John Doe"
                                        className="bg-muted/50 border-border text-foreground focus:border-primary"
                                        value={formData.primaryContact.name}
                                        onChange={(e) => handleChange("primaryContact", "name", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail" className="text-muted-foreground">Email</Label>
                                    <Input
                                        id="contactEmail"
                                        type="email"
                                        placeholder="john@example.com"
                                        className="bg-muted/50 border-border text-foreground focus:border-primary"
                                        value={formData.primaryContact.email}
                                        onChange={(e) => handleChange("primaryContact", "email", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactPhone" className="text-muted-foreground">Phone</Label>
                                    <Input
                                        id="contactPhone"
                                        placeholder="(555) 555-5555"
                                        className="bg-muted/50 border-border text-foreground focus:border-primary"
                                        value={formData.primaryContact.phone}
                                        onChange={(e) => handleChange("primaryContact", "phone", e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
};

export default CreateJob;
