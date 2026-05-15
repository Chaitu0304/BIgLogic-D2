import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Phone, MapPin, Save, Edit2, Camera, Shield, CreditCard, Bell, Building2, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "@/services/api";

const Profile = () => {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        company: "",
        role: "",
        registerNumber: "", // Added registerNumber
        quickbooksClientId: "",
        quickbooksClientSecret: ""
    });
    const [hasQuickBooksKeys, setHasQuickBooksKeys] = useState(false);
    const [twoFactorData, setTwoFactorData] = useState<{ secret: string; qrCode: string } | null>(null);
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
    const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
    const [otp, setOtp] = useState("");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const permissions = user.permissions || {};
        const isCompanyAdmin = user.role === 'company_admin' || user.role === 'superadmin';

        if (!isCompanyAdmin && permissions.profile === false) {
            toast({
                title: "Access Denied",
                description: "You do not have permission to view this page.",
                variant: "destructive"
            });
            // Redirect after a short delay or immediately
            setTimeout(() => window.location.href = "/dashboard", 1000);
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await authService.getMe();
                const user = res.data;
                // ... split name ...
                const [first, ...rest] = (user.name || "").split(" ");
                const last = rest.join(" ");

                setFormData({
                    firstName: first || "",
                    lastName: last || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    location: user.location || "",
                    company: user.companyName || user.company || "", // Prioritize companyName
                    role: user.role === 'superadmin' ? 'Administrator' : 'User',
                    registerNumber: user.registerNumber || "", // Added registerNumber
                    quickbooksClientId: user.quickbooksClientId || "",
                    quickbooksClientSecret: "" // Never populate secret
                });
                setHasQuickBooksKeys(user.hasQuickBooksKeys || false);
                setAvatarPreview(user.avatar || null);
                setIsTwoFactorEnabled(user.isTwoFactorEnabled || false);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast({
                    title: "Error",
                    description: "Failed to load profile data",
                    variant: "destructive"
                });
            }
        };
        fetchProfile();
    }, [toast]);

    const handleEnableTwoFactor = async () => {
        try {
            const res = await authService.enableTwoFactor();
            setTwoFactorData(res.data);
            setShowTwoFactorSetup(true);
        } catch (error) {
            toast({ title: "Error", description: "Failed to generate 2FA QR Code", variant: "destructive" });
        }
    };

    const handleVerifyTwoFactor = async () => {
        try {
            await authService.verifyTwoFactor(otp);
            setIsTwoFactorEnabled(true);
            setShowTwoFactorSetup(false);
            setTwoFactorData(null);
            setOtp("");
            toast({ title: "Success", description: "2FA Enabled Successfully", className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" });
        } catch (error) {
            toast({ title: "Error", description: "Invalid Code", variant: "destructive" });
        }
    };

    const handleDisableTwoFactor = async () => {
        try {
            await authService.disableTwoFactor();
            setIsTwoFactorEnabled(false);
            setShowTwoFactorSetup(false);
            setTwoFactorData(null);
            toast({ title: "Success", description: "2FA Disabled Successfully", variant: "default" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to disable 2FA", variant: "destructive" });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setAvatarPreview(imageUrl); // Optimistic update

            const formData = new FormData();
            formData.append('avatar', file);

            try {
                // Upload immediately
                const response = await authService.uploadAvatar(formData);
                const newAvatarUrl = response.data.avatar;

                // Update Local Storage
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                user.avatar = newAvatarUrl;
                localStorage.setItem("user", JSON.stringify(user));

                // Update State
                setAvatarPreview(newAvatarUrl);

                toast({
                    title: "Success",
                    description: "Profile picture updated successfully",
                });
            } catch (error) {
                console.error("Failed to upload avatar", error);
                toast({
                    title: "Error",
                    description: "Failed to upload profile picture",
                    variant: "destructive"
                });
            }
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            const updateData = {
                name: fullName,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                company: formData.company,
                registerNumber: formData.registerNumber, // Added registerNumber
                quickbooksClientId: formData.quickbooksClientId,
            } as any;

            if (formData.quickbooksClientSecret) {
                updateData.quickbooksClientSecret = formData.quickbooksClientSecret;
            }

            await authService.updateProfile(updateData);

            // Re-fetch to update hasQuickBooksKeys state if it was newly added
            if (formData.quickbooksClientSecret) {
                setHasQuickBooksKeys(true);
                setFormData(prev => ({ ...prev, quickbooksClientSecret: "" })); // Clear from state for security
            }

            setIsEditing(false);
            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully.",
            });
        } catch (error) {
            console.error("Failed to update profile", error);
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({ title: "Error", description: "New passwords do not match", variant: "destructive" });
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            await authService.updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast({ title: "Success", description: "Password updated successfully." });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            toast({ title: "Error", description: error.response?.data?.message || "Failed to update password", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* ... existing header ... */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information and account settings</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* ... Left Column (Avatar) ... */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-1 space-y-6"
                    >
                        <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-6 flex flex-col items-center text-center">
                            {/* ... Avatar code ... */}
                            <div className="relative mb-6 group">
                                <div className="w-36 h-36 rounded-sm bg-muted flex items-center justify-center text-4xl font-bold text-foreground shadow-xl shadow-primary/20 border-4 border-border/50 overflow-hidden">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Profile"
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                console.error("Image load failed:", avatarPreview);
                                                e.currentTarget.style.display = 'none'; // Hide broken image so alt text doesn't show in ugly way
                                                setAvatarPreview(null); // Revert to initials
                                            }}
                                        />
                                    ) : (
                                        <>{formData.firstName?.[0]}{formData.lastName?.[0]}</>
                                    )}
                                </div>
                                {isEditing && (
                                    <>
                                        <input
                                            type="file"
                                            id="avatar-upload"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                        <label
                                            htmlFor="avatar-upload"
                                            className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors cursor-pointer"
                                        >
                                            <Camera size={18} />
                                        </label>
                                    </>
                                )}
                            </div>

                            <h2 className="text-xl font-bold text-foreground mb-1">
                                {JSON.parse(localStorage.getItem("user") || "{}").role === 'company_admin'
                                    ? formData.company
                                    : `${formData.firstName} ${formData.lastName}`}
                            </h2>
                            <p className="text-primary text-sm font-medium mb-4">{formData.role}</p>


                            <div className="w-full pt-6 border-t border-border flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Shield size={16} className="text-emerald-600 dark:text-emerald-400" />
                                    <span>Account Verified</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <CreditCard size={16} className="text-purple-600 dark:text-purple-400" />
                                    <span>Pro Plan Active</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2 space-y-8"
                    >
                        {/* Personal Info Code ... */}
                        <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-8">
                            {/* ... Header ... */}
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
                                {!isEditing ? (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        variant="ghost"
                                        className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                    >
                                        <Edit2 size={16} className="mr-2" /> Edit Profile
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setIsEditing(false)}
                                            className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                                            disabled={loading}
                                        >
                                            {loading ? "Saving..." : <><Save size={16} className="mr-2" /> Save Changes</>}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* ... Form Fields ... */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Company - Moved to Top - Disabled */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-muted-foreground">Company</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            disabled={true} // Always disabled
                                            className="pl-10 bg-muted/50 border-border text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Email - Second - Disabled */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-muted-foreground">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={true} // Always disabled
                                            className="pl-10 bg-muted/50 border-border text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Name Fields */}
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">First Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="pl-10 bg-muted/50 border-border text-foreground disabled:opacity-70 disabled:cursor-not-allowed focus:border-primary focus:bg-background transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Last Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="pl-10 bg-muted/50 border-border text-foreground disabled:opacity-70 disabled:cursor-not-allowed focus:border-primary focus:bg-background transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="pl-10 bg-muted/50 border-border text-foreground disabled:opacity-70 disabled:cursor-not-allowed focus:border-primary focus:bg-background transition-all"
                                        />
                                    </div>
                                </div>
                                {/* Location */}
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Location</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="pl-10 bg-muted/50 border-border text-foreground disabled:opacity-70 disabled:cursor-not-allowed focus:border-primary focus:bg-background transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Register Number - Only for Company Admins */}
                                {JSON.parse(localStorage.getItem("user") || "{}").role === 'company_admin' && (
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Register Number</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                name="registerNumber"
                                                value={formData.registerNumber} // Ensure this is in state
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                placeholder="Enter Registration Number"
                                                className="pl-10 bg-muted/50 border-border text-foreground disabled:opacity-70 disabled:cursor-not-allowed focus:border-primary focus:bg-background transition-all"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Change Password Card */}
                        <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-8">
                            <h3 className="text-xl font-semibold text-foreground mb-6">Change Password</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Current Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            placeholder="Enter current password"
                                            className="pl-10 bg-muted/50 border-border text-foreground"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            placeholder="Enter new password"
                                            className="pl-10 bg-muted/50 border-border text-foreground"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Confirm New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            placeholder="Confirm new password"
                                            className="pl-10 bg-muted/50 border-border text-foreground"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button
                                        onClick={handlePasswordChange}
                                        disabled={loading || !passwordData.currentPassword || !passwordData.newPassword}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                                    >
                                        {loading ? "Updating..." : "Update Password"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Preferences Card */}
                        <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-8">
                            <h3 className="text-xl font-semibold text-foreground mb-6">Preferences & Security</h3>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Bell size={18} className="text-muted-foreground" />
                                            <span className="font-medium text-foreground">Push Notifications</span>
                                        </div>
                                        <p className="text-sm text-gray-500 pl-7">Receive updates about your workflow status</p>
                                    </div>
                                    <Switch />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Shield size={18} className="text-emerald-600 dark:text-emerald-400" />
                                            <span className="font-medium text-foreground">Two-Factor Authentication (2FA)</span>
                                        </div>
                                        <p className="text-sm text-gray-500 pl-7">Secure your account with Authenticator App</p>
                                    </div>
                                    <Switch
                                        checked={isTwoFactorEnabled}
                                        onCheckedChange={() => isTwoFactorEnabled ? handleDisableTwoFactor() : handleEnableTwoFactor()}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>

                                {showTwoFactorSetup && twoFactorData && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="p-6 rounded-xl bg-primary/10 border border-primary/20 space-y-4"
                                    >
                                        <h4 className="font-semibold text-primary">Setup Authenticator</h4>
                                        <div className="flex flex-col md:flex-row gap-6 items-center">
                                            <div className="bg-white p-2 rounded-lg border border-border">
                                                <img src={twoFactorData.qrCode} alt="2FA QR Code" className="w-32 h-32" />
                                            </div>
                                            <div className="space-y-3 flex-1">
                                                <p className="text-sm text-muted-foreground">
                                                    1. Install Google Authenticator or Microsoft Authenticator.<br />
                                                    2. Scan the QR code.<br />
                                                    3. Enter the 6-digit code below to verify.
                                                </p>
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        placeholder="Enter 6-digit code"
                                                        className="bg-muted/50 border-border text-foreground w-40"
                                                    />
                                                    <Button onClick={handleVerifyTwoFactor} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Verify</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border opacity-50 cursor-not-allowed">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-primary" />
                                            <span className="font-medium text-foreground">Theme Enforcement</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground pl-7">Theme is managed via the top navigation toggle</p>
                                    </div>
                                    <Switch checked disabled className="data-[state=checked]:bg-primary" />
                                </div>
                            </div>
                        </div>

                        {/* API Integrations Card - Only for Company Admins */}
                        {JSON.parse(localStorage.getItem("user") || "{}").role === 'company_admin' && (
                            <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-8">
                                <h3 className="text-xl font-semibold text-foreground mb-2">API Integrations</h3>
                                <p className="text-muted-foreground text-sm mb-6">Manage external integrations for your company.</p>

                                <div className="space-y-6">
                                    <div className="p-5 rounded-xl bg-muted/50 border border-border space-y-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <CreditCard size={16} className="text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">QuickBooks Online</h4>
                                                <p className="text-xs text-muted-foreground">Connect to sync invoices and financial metrics</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-2">
                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground">Client ID</Label>
                                                <Input
                                                    name="quickbooksClientId"
                                                    value={formData.quickbooksClientId}
                                                    onChange={handleChange}
                                                    placeholder="Enter QuickBooks Client ID"
                                                    disabled={!isEditing}
                                                    className="bg-muted/50 border-border text-foreground disabled:opacity-70 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground">Client Secret</Label>
                                                <Input
                                                    name="quickbooksClientSecret"
                                                    type="password"
                                                    value={formData.quickbooksClientSecret}
                                                    onChange={handleChange}
                                                    placeholder={hasQuickBooksKeys && !isEditing ? "•••••••••••••••• (Encrypted)" : "Enter QuickBooks Client Secret"}
                                                    disabled={!isEditing}
                                                    className="bg-muted/50 border-border text-foreground disabled:opacity-70 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                            <p className="text-xs text-emerald-400/80 italic">
                                                <Shield size={12} className="inline mr-1 mb-0.5" />
                                                Biglogic.ai stores these keys securely using AES-256 encryption.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div >
        </DashboardLayout >
    );
};

export default Profile;
