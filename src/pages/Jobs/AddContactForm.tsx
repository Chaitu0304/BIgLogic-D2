import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CONTACT_FIELD_CONFIG, FieldConfig, DESIGNATIONS } from "@/lib/contact-config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddContactFormProps {
    designation: string;
    formData: any;
    setFormData: (data: any) => void;
}

const CurrencyInput = ({ value, onChange, placeholder }: { value: any, onChange: (val: any) => void, placeholder: string }) => {
    const formatValue = (val: any) => {
        if (val === undefined || val === null || val === "") return "";
        const parts = val.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `$ ${parts.join(".")}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value;
        // Strip everything except numbers and a single decimal point
        const rawValue = inputVal.replace(/[^0-9.]/g, "");

        // Handle multiple dots - only keep the first one
        const parts = rawValue.split(".");
        const cleanedValue = parts.length > 2
            ? `${parts[0]}.${parts.slice(1).join("")}`
            : rawValue;

        onChange(cleanedValue);
    };

    return (
        <Input
            type="text"
            placeholder={placeholder}
            value={formatValue(value)}
            onChange={handleChange}
        />
    );
};

export const AddContactForm: React.FC<AddContactFormProps> = ({ designation, formData, setFormData }) => {
    // Local designation state for when adding from "All Contacts"
    const [localDesignation, setLocalDesignation] = React.useState(designation === "All Contacts" ? "Customers" : designation);

    const fields = (CONTACT_FIELD_CONFIG[localDesignation] || CONTACT_FIELD_CONFIG["All Contacts"]).filter(f => !f.calculated);

    const handleChange = (key: string, value: any) => {
        let finalValue = value;
        // Enforce positive numbers for numeric types
        if (typeof value === 'number' && value < 0) {
            finalValue = 0;
        }
        setFormData({ ...formData, [key]: finalValue, designation: localDesignation });
    };

    // Ensure designation is in formData
    React.useEffect(() => {
        if (!formData.designation) {
            setFormData({ ...formData, designation: localDesignation });
        }
    }, []);

    const handleDesignationChange = (val: string) => {
        setLocalDesignation(val);
        setFormData({ ...formData, designation: val });
    };

    const DatePicker = ({ value, onChange, placeholder }: { value: any, onChange: (date: string) => void, placeholder: string }) => {
        const date = value ? new Date(value) : undefined;

        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal h-10 px-3",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {value ? format(new Date(value), "PPP") : <span>{placeholder}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => d && onChange(format(d, "yyyy-MM-dd"))}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        );
    };

    const getSections = () => {
        if (localDesignation === "Adjusters") {
            return [
                { 
                    title: "Primary Information", 
                    fields: fields.filter(f => ["name", "company", "adjusterType"].includes(f.key)) 
                },
                { 
                    title: "Performance Metrics", 
                    fields: fields.filter(f => ["received", "signed", "completed", "revenue", "tier", "activeJobs", "lastActivity"].includes(f.key)) 
                },
                { 
                    title: "Contact Information", 
                    fields: fields.filter(f => ["phone", "phone2", "phone3", "email1", "email2", "fax"].includes(f.key)) 
                },
                { 
                    title: "Location Details", 
                    fields: fields.filter(f => ["address", "city", "state", "zip"].includes(f.key)) 
                },
                {
                    title: "Additional Information",
                    fields: fields.filter(f => f.key === "notes")
                }
            ].filter(s => s.fields.length > 0);
        }

        if (localDesignation === "Vendors") {
            return [
                {
                    title: "Primary Information",
                    fields: fields.filter(f => ["name", "trades", "subTrades", "licenseNumber", "vendorRating"].includes(f.key))
                },
                {
                    title: "Performance & Compliance",
                    fields: fields.filter(f => ["activeJobs", "totalJobs", "avgJobValue", "complianceStatus", "insuranceExp", "preferredContact", "lastActivity"].includes(f.key))
                },
                {
                    title: "Insurance Configuration",
                    fields: fields.filter(f => ["workersComp", "wcCompany", "wcPolicy", "wcExpDate", "liabilityIns", "liabCompany", "liabPolicy", "liabExpDate"].includes(f.key))
                },
                {
                    title: "Contact Information",
                    fields: fields.filter(f => ["phone", "phone2", "phone3", "email", "email2", "fax"].includes(f.key))
                },
                {
                    title: "Location Details",
                    fields: fields.filter(f => ["address", "city", "state", "zip"].includes(f.key))
                },
                {
                    title: "Additional Notes",
                    fields: fields.filter(f => f.key === "notes")
                }
            ].filter(s => s.fields.length > 0);
        }
        
        return [{ title: "Contact Information", fields }];
    };

    const getPlaceholder = (field: FieldConfig) => {
        const { key, label, type } = field;
        const lowKey = key.toLowerCase();
        if (lowKey.includes("name")) return "e.g. John Doe";
        if (lowKey.includes("company") || lowKey.includes("carrier")) return "e.g. State Farm";
        if (lowKey.includes("phone")) return "e.g. 1-000-000-0000";
        if (lowKey.includes("email")) return "e.g. john@example.com";
        if (lowKey.includes("address")) return "e.g. 123 Business Way";
        if (lowKey.includes("city")) return "e.g. Los Angeles";
        if (lowKey.includes("state")) return "e.g. CA";
        if (lowKey.includes("zip")) return "e.g. 90210";
        if (lowKey.includes("fax")) return "e.g. 1-000-000-0000";
        if (lowKey.includes("revenue") || lowKey.includes("value")) return "$ 0.00";
        if (lowKey === "notes") return "Add any additional details or context here...";
        if (lowKey === "trades" || lowKey === "subtrades") return "e.g. Roofing, Plumbing";
        if (lowKey.includes("license")) return "e.g. LIC-123456";
        if (type === "number" || type === "percent") return "0";
        return `Enter ${label.toLowerCase()}...`;
    };

    const renderInput = (field: FieldConfig) => {
        const { key, label, type, options } = field;
        const placeholder = getPlaceholder(field);
        
        switch (type) {
            case "select":
                return (
                    <Select value={String(formData[key] || "")} onValueChange={(v) => handleChange(key, v)}>
                        <SelectTrigger className="h-10 font-medium">
                            <SelectValue placeholder={`Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {options?.map(opt => (
                                <SelectItem key={opt} value={opt} className="font-medium">{opt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case "rating":
                return (
                    <Select value={String(formData[key] || "5")} onValueChange={(v) => handleChange(key, Number(v))}>
                        <SelectTrigger className="h-10 font-medium"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5].map(v => <SelectItem key={v} value={String(v)} className="font-medium">{v} Stars</SelectItem>)}
                        </SelectContent>
                    </Select>
                );
            case "currency":
                return (
                    <CurrencyInput 
                        placeholder="$ 0.00" 
                        value={formData[key]} 
                        onChange={val => handleChange(key, Math.max(0, val))} 
                    />
                );
            case "number":
            case "percent":
                return <Input type="number" min="0" placeholder={placeholder} className="h-10 font-medium" value={formData[key] || ""} onChange={e => handleChange(key, e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))} />;
            case "date":
            case "activity":
                return <DatePicker value={formData[key]} onChange={val => handleChange(key, val)} placeholder={`Select ${label}`} />;
            default:
                return <Input placeholder={placeholder} className="h-10 font-medium" value={formData[key] || ""} onChange={e => handleChange(key, e.target.value)} />;
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange("avatar", reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const getInitials = (name: string) => {
        if (!name) return "??";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <div className="space-y-8 py-4">
            {/* Header & Avatar Section */}
            <div className="flex flex-col items-center gap-6 pb-8 border-b border-white/5">
                {designation === "All Contacts" && (
                    <div className="w-full max-w-sm space-y-2">
                        <Label className="text-[13px] font-bold text-gray-500 text-center block">INITIAL CATEGORY</Label>
                        <Select value={localDesignation} onValueChange={handleDesignationChange}>
                            <SelectTrigger className="h-12 text-sm font-semibold border-white/10 bg-white/5">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {DESIGNATIONS.filter(d => d.label !== "All Contacts").map(d => (
                                    <SelectItem key={d.label} value={d.label} className="font-semibold text-[13px]">{d.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="relative group">
                    <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white/5 shadow-2xl bg-gradient-to-br from-indigo-500/80 to-purple-600/80 flex items-center justify-center text-white text-3xl font-bold">
                        {formData.avatar ? (
                            <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            getInitials(formData.name)
                        )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer rounded-full backdrop-blur-sm">
                        <span className="text-[12px] font-bold uppercase tracking-wider">Upload Photo</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                </div>
            </div>

            <div className="space-y-12">
                {getSections().map((section) => (
                    <div key={section.title} className="space-y-8">
                        <div className="flex items-center gap-4">
                            <h3 className="text-[18px] font-bold tracking-tight text-indigo-500 whitespace-nowrap">{section.title}</h3>
                            <div className="h-px w-full bg-gradient-to-r from-indigo-500/20 to-transparent" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {section.fields.map(field => {
                                // Conditional rendering based on dependencies
                                if (field.dependsOn) {
                                    const parentValue = formData[field.dependsOn.field];
                                    if (parentValue !== field.dependsOn.value) return null;
                                }

                                return (
                                    <div key={field.key} className={cn(
                                        "space-y-2.5",
                                        (field.key === "name" || field.key === "address" || field.key === "notes" || field.key === "guidelines" || field.key === "trades" || field.key === "subTrades") && "md:col-span-2"
                                    )}>
                                        <Label className="text-[13px] font-semibold flex items-center gap-1.5 text-gray-500">
                                            {field.label}
                                            {field.mandatory && <span className="text-rose-500 text-lg leading-none">*</span>}
                                        </Label>
                                        {renderInput(field)}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
