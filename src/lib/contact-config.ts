import {
    Users,
    ShieldCheck,
    UserCircle,
    Briefcase,
    UserCheck,
    FileText,
    Home,
    Building2,
} from "lucide-react";

export type FieldType = 'text' | 'number' | 'currency' | 'percent' | 'date' | 'rating' | 'badge' | 'activity' | 'name' | 'select';

export interface FieldConfig {
    key: string;
    label: string;
    type: FieldType;
    visibleOverall: boolean;
    detailView: boolean;
    sortable: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    mandatory?: boolean;
    calculated?: boolean;
    options?: string[];
    dependsOn?: {
        field: string;
        value: any;
    };
}

export const DESIGNATIONS = [
    // "All Contacts" removed as requested
    { label: "Adjusters", icon: ShieldCheck, apiValue: "Adjuster" },
    { label: "Customers", icon: UserCircle, apiValue: "Customer" },
    { label: "Vendors", icon: Briefcase, apiValue: "Vendor" },
    { label: "Employees", icon: UserCheck, apiValue: "Employee" },
    { label: "TPAs / Clients", icon: FileText, apiValue: "TPA/Client" },
    { label: "HOAs", icon: Home, apiValue: "HOA" },
    { label: "Property Mgmt", icon: Building2, apiValue: "PropertyMgmt" },
];

export const CONTACT_FIELD_CONFIG: Record<string, FieldConfig[]> = {
    "Adjusters": [
        // Table Columns (1-10)
        { key: "name", label: "Adjuster Name", type: "name", visibleOverall: true, detailView: true, sortable: true, width: "minmax(180px,2.2fr)", mandatory: true },
        { key: "company", label: "Carrier / Company", type: "text", visibleOverall: true, detailView: true, sortable: true, width: "minmax(120px,1.5fr)", mandatory: true },
        { key: "received", label: "Received (Jobs)", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "80px", align: "center" },
        { key: "signed", label: "Signed (Jobs)", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "80px", align: "center" },
        { key: "completed", label: "Completed (Jobs)", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "86px", align: "center" },
        { key: "revenue", label: "Revenue (Completed)", type: "currency", visibleOverall: true, detailView: true, sortable: true, width: "110px", align: "right" },
        { key: "convRate", label: "Conversion Rate (%)", type: "percent", visibleOverall: true, detailView: true, sortable: true, width: "minmax(100px,1fr)", calculated: true },
        { key: "tier", label: "Tier", type: "select", visibleOverall: true, detailView: true, sortable: true, width: "90px", align: "center", options: ["Tier 1", "Tier 2", "Tier 3"] },
        { key: "activeJobs", label: "Active Jobs", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "70px", align: "center" },
        { key: "lastActivity", label: "Last Activity", type: "date", visibleOverall: true, detailView: true, sortable: true, width: "100px" },

        // Detail-only Fields (11-21)
        {
            key: "adjusterType",
            label: "Adjuster Type",
            type: "select",
            visibleOverall: false,
            detailView: true,
            sortable: false,
            mandatory: true,
            options: [
                "Large Loss", "Mid Loss", "Mitigation", "Contents", "GA",
                "Supervisor", "Manager", "Team Leader", "Desk Adjuster",
                "Inside Adjuster", "Field Rep", "BCO", "ALE",
                "Reviewer", "Independent", "Public Adjuster", "Primary Adjuster"
            ]
        },
        { key: "phone", label: "Phone", type: "text", visibleOverall: false, detailView: true, sortable: false, mandatory: true },
        { key: "phone2", label: "Phone 2", type: "text", visibleOverall: false, detailView: true, sortable: false },
        { key: "phone3", label: "Phone 3", type: "text", visibleOverall: false, detailView: true, sortable: false },
        { key: "address", label: "Address", type: "text", visibleOverall: false, detailView: true, sortable: false },
        { key: "city", label: "City", type: "text", visibleOverall: false, detailView: true, sortable: false },
        { key: "email1", label: "Email 1", type: "text", visibleOverall: false, detailView: true, sortable: false, mandatory: true },
        { key: "email2", label: "Email 2", type: "text", visibleOverall: false, detailView: true, sortable: false },
        { key: "state", label: "State", type: "text", visibleOverall: false, detailView: true, sortable: false },
        { key: "zip", label: "Zip", type: "text", visibleOverall: false, detailView: true, sortable: false },
        { key: "fax", label: "Fax", type: "text", visibleOverall: false, detailView: true, sortable: false },
    ],
    "Customers": [
        { key: "name", label: "Customer Name", type: "name", visibleOverall: true, detailView: true, sortable: true, mandatory: true, width: "minmax(180px, 2fr)" },
        { key: "phone", label: "Primary Phone", type: "text", visibleOverall: true, detailView: true, sortable: true, mandatory: true, width: "minmax(150px, 1fr)" },
        { key: "email", label: "Primary Email", type: "text", visibleOverall: true, detailView: true, sortable: true, mandatory: true, width: "minmax(260px, 1.5fr)" },
        { key: "activeJobs", label: "Active Jobs", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "90px", align: "center" },
        { key: "totalJobs", label: "Total Jobs", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "90px", align: "center" },
        { key: "revenue", label: "Lifetime Revenue", type: "currency", visibleOverall: true, detailView: true, sortable: true, width: "130px", align: "right" },
        { key: "customerRating", label: "Customer Rating", type: "rating", visibleOverall: true, detailView: true, sortable: true, width: "100px", align: "center" },
        { key: "lastActivity", label: "Last Activity", type: "activity", visibleOverall: true, detailView: true, sortable: true, width: "110px" },
        { key: "notes", label: "Notes / Tags", type: "text", visibleOverall: true, detailView: true, sortable: false, width: "minmax(120px, 1fr)" },

        // Hidden Extended Fields (for database compatibility only)
        { key: "phone2", label: "Phone 2", type: "text", visibleOverall: false, detailView: false, sortable: false },
        { key: "phone3", label: "Phone 3", type: "text", visibleOverall: false, detailView: false, sortable: false },
        { key: "email2", label: "Email 2", type: "text", visibleOverall: false, detailView: false, sortable: false },
        { key: "email3", label: "Email 3", type: "text", visibleOverall: false, detailView: false, sortable: false },
        { key: "address", label: "Address", type: "text", visibleOverall: false, detailView: false, sortable: false, mandatory: true },
        { key: "city", label: "City", type: "text", visibleOverall: false, detailView: false, sortable: false, mandatory: true },
        { key: "state", label: "State", type: "text", visibleOverall: false, detailView: false, sortable: false, mandatory: true },
        { key: "zip", label: "Zip", type: "text", visibleOverall: false, detailView: false, sortable: false, mandatory: true },
        { key: "fax", label: "Fax", type: "text", visibleOverall: false, detailView: false, sortable: false }
    ],
    "Vendors": [
        { key: "name", label: "Vendor Name", type: "name", visibleOverall: true, detailView: true, sortable: true, mandatory: true, width: "minmax(180px, 2fr)" },
        { key: "trades", label: "Trades / Services", type: "text", visibleOverall: true, detailView: true, sortable: true, mandatory: true, width: "minmax(150px, 1.2fr)" },
        { key: "vendorRating", label: "Rating (1-5)", type: "rating", visibleOverall: true, detailView: true, sortable: true, width: "100px", align: "center" },
        { key: "activeJobs", label: "Active Jobs", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "90px", align: "center" },
        { key: "totalJobs", label: "Total Jobs", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "90px", align: "center" },
        { key: "complianceStatus", label: "Compliance Status", type: "select", visibleOverall: true, detailView: true, sortable: true, width: "130px", align: "center", options: ["Compliant", "Non-Compliant", "Pending"] },
        { key: "insuranceExp", label: "Insurance Expiration", type: "date", visibleOverall: true, detailView: true, sortable: true, width: "120px" },
        { key: "avgJobValue", label: "Avg. Job Value", type: "currency", visibleOverall: true, detailView: true, sortable: true, width: "120px", align: "right" },
        { key: "preferredContact", label: "Preferred Contact", type: "text", visibleOverall: true, detailView: true, sortable: true, width: "130px" },
        { key: "lastActivity", label: "Last Activity", type: "activity", visibleOverall: true, detailView: true, sortable: true, width: "110px" },

        // Detail-only / Compliance Fields
        { key: "phone", label: "Phone", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "phone2", label: "Phone 2", type: "text", visibleOverall: false, detailView: true },
        { key: "phone3", label: "Phone 3", type: "text", visibleOverall: false, detailView: true },
        { key: "address", label: "Address", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "city", label: "City", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "email", label: "Email 1", type: "text", visibleOverall: false, detailView: true },
        { key: "email2", label: "Email 2", type: "text", visibleOverall: false, detailView: true },
        { key: "state", label: "State", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "zip", label: "ZIP", type: "text", visibleOverall: false, detailView: true },
        { key: "fax", label: "Fax", type: "text", visibleOverall: false, detailView: true },
        { key: "subTrades", label: "Subcategories of Trades / Services", type: "text", visibleOverall: false, detailView: true },
        { key: "licenseNumber", label: "Licence Number", type: "text", visibleOverall: false, detailView: true, mandatory: true },

        // Workers' Comp Section
        { key: "workersComp", label: "Workers' Compensation", type: "select", options: ["Yes", "No"], visibleOverall: false, detailView: true, mandatory: true },
        { key: "wcCompany", label: "WC: Company Name", type: "text", visibleOverall: false, detailView: true, dependsOn: { field: "workersComp", value: "Yes" } },
        { key: "wcPolicy", label: "WC: Policy Number", type: "text", visibleOverall: false, detailView: true, dependsOn: { field: "workersComp", value: "Yes" } },
        { key: "wcExpDate", label: "WC: Expiration Date", type: "date", visibleOverall: false, detailView: true, dependsOn: { field: "workersComp", value: "Yes" } },

        // Liability Insurance Section
        { key: "liabilityIns", label: "Liability Insurance", type: "select", options: ["Yes", "No"], visibleOverall: false, detailView: true, mandatory: true },
        { key: "liabCompany", label: "Liab: Company Name", type: "text", visibleOverall: false, detailView: true, dependsOn: { field: "liabilityIns", value: "Yes" } },
        { key: "liabPolicy", label: "Liab: Policy Number", type: "text", visibleOverall: false, detailView: true, dependsOn: { field: "liabilityIns", value: "Yes" } },
        { key: "liabExpDate", label: "Liab: Expiration Date", type: "date", visibleOverall: false, detailView: true, dependsOn: { field: "liabilityIns", value: "Yes" } },
        { key: "notes", label: "Internal Notes", type: "text", visibleOverall: false, detailView: true }
    ],
    "Employees": [
        { key: "name", label: "Employee Name", type: "name", visibleOverall: true, detailView: true, sortable: true, mandatory: true, width: "minmax(180px, 2fr)" },
        { key: "role", label: "Role", type: "text", visibleOverall: true, detailView: true, sortable: true, mandatory: true, width: "minmax(140px, 1.2fr)" },
        { key: "department", label: "Department / Team", type: "text", visibleOverall: true, detailView: true, sortable: true, width: "130px" },
        { key: "utilization", label: "Utilization (%)", type: "percent", visibleOverall: true, detailView: true, sortable: true, width: "120px", align: "center" },
        { key: "activeJobs", label: "Active Jobs / Files", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "130px", align: "center" },
        { key: "yearsOfService", label: "Years of Service", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "120px", align: "center" },
        { key: "hireDate", label: "Hire Date", type: "date", visibleOverall: true, detailView: true, sortable: true, width: "110px" },
        { key: "status", label: "Status (Active / Inactive)", type: "select", options: ["Active", "Inactive"], visibleOverall: true, detailView: true, sortable: true, width: "150px", align: "center" },
        { key: "manager", label: "Manager", type: "text", visibleOverall: true, detailView: true, sortable: true, width: "120px" },
        { key: "lastActivity", label: "Last Activity", type: "activity", visibleOverall: true, detailView: true, sortable: true, width: "110px" },

        // Detail-only Fields
        { key: "phone", label: "Phone", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "phone2", label: "Phone 2", type: "text", visibleOverall: false, detailView: true },
        { key: "phone3", label: "Phone 3", type: "text", visibleOverall: false, detailView: true },
        { key: "address", label: "Address", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "city", label: "City", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "email", label: "Email 1", type: "text", visibleOverall: false, detailView: true },
        { key: "email2", label: "Email 2", type: "text", visibleOverall: false, detailView: true },
        { key: "state", label: "State", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "zip", label: "ZIP", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "fax", label: "Fax", type: "text", visibleOverall: false, detailView: true },
        { key: "notes", label: "Internal Notes", type: "text", visibleOverall: false, detailView: true }
    ],
    "TPAs / Clients": [
        { key: "name", label: "Client Name", type: "name", visibleOverall: true, detailView: true, sortable: true, width: "minmax(200px, 2.2fr)", mandatory: true },
        { key: "totalClaims", label: "Total Claims", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "110px", align: "center" },
        { key: "revenue", label: "Lifetime Revenue", type: "currency", visibleOverall: true, detailView: true, sortable: true, width: "140px", align: "right" },
        { key: "activeJobs", label: "Active Jobs", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "100px", align: "center" },
        { key: "primaryContact", label: "Primary Contact", type: "text", visibleOverall: true, detailView: true, sortable: true, width: "140px" },
        { key: "responseTarget", label: "Response Time Target", type: "text", visibleOverall: true, detailView: true, sortable: true, width: "160px" },
        { key: "notes", label: "Notes / Guidelines", type: "text", visibleOverall: true, detailView: true, width: "180px" },
        { key: "clientRating", label: "Client Rating", type: "rating", visibleOverall: true, detailView: true, sortable: true, width: "110px", align: "center" },
        { key: "lastActivity", label: "Last Activity", type: "activity", visibleOverall: true, detailView: true, sortable: true, width: "110px" },

        // Detail-only Fields
        { key: "phone", label: "Phone", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "phone2", label: "Phone 2", type: "text", visibleOverall: false, detailView: true },
        { key: "phone3", label: "Phone 3", type: "text", visibleOverall: false, detailView: true },
        { key: "address", label: "Address", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "city", label: "City", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "email", label: "Email 1", type: "text", visibleOverall: false, detailView: true },
        { key: "email2", label: "Email 2", type: "text", visibleOverall: false, detailView: true },
        { key: "state", label: "State", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "zip", label: "ZIP", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "fax", label: "Fax", type: "text", visibleOverall: false, detailView: true },
        { key: "guidelines", label: "Full Guidelines", type: "text", visibleOverall: false, detailView: true }
    ],
    "HOAs": [
        { key: "name", label: "HOA Name", type: "name", visibleOverall: true, detailView: true, sortable: true, mandatory: true, width: "minmax(200px, 2.2fr)" },
        { key: "primaryContact", label: "Primary Contact", type: "text", visibleOverall: true, detailView: true, sortable: true, width: "140px" },
        { key: "managedUnits", label: "Managed Units", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "110px", align: "center" },
        { key: "activeJobs", label: "Active Jobs", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "100px", align: "center" },
        { key: "avgJobSize", label: "Avg. Job Size", type: "currency", visibleOverall: true, detailView: true, sortable: true, width: "130px", align: "right" },
        { key: "totalJobs", label: "Total Jobs", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "100px", align: "center" },
        { key: "accountStatus", label: "Account Status", type: "select", options: ["Active", "Inactive", "On Hold"], visibleOverall: true, detailView: true, sortable: true, width: "130px", align: "center" },
        { key: "lastActivity", label: "Last Activity", type: "activity", visibleOverall: true, detailView: true, sortable: true, width: "110px" },

        // Detail-only Fields
        { key: "phone", label: "Phone", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "phone2", label: "Phone 2", type: "text", visibleOverall: false, detailView: true },
        { key: "phone3", label: "Phone 3", type: "text", visibleOverall: false, detailView: true },
        { key: "address", label: "Address", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "city", label: "City", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "email", label: "Email 1", type: "text", visibleOverall: false, detailView: true },
        { key: "email2", label: "Email 2", type: "text", visibleOverall: false, detailView: true },
        { key: "state", label: "State", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "zip", label: "ZIP", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "fax", label: "Fax", type: "text", visibleOverall: false, detailView: true },
        { key: "accessNotes", label: "Access Notes / Gate Info", type: "text", visibleOverall: false, detailView: true }
    ],
    "Property Mgmt": [
        { key: "name", label: "Primary Contact", type: "name", visibleOverall: true, detailView: true, sortable: true, mandatory: true, width: "minmax(200px, 2.2fr)" },
        { key: "managedUnits", label: "Managed Units", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "110px", align: "center" },
        { key: "activeJobs", label: "Active Jobs", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "100px", align: "center" },
        { key: "avgJobSize", label: "Avg. Job Size", type: "currency", visibleOverall: true, detailView: true, sortable: true, width: "130px", align: "right" },
        { key: "totalJobs", label: "Total Jobs", type: "number", visibleOverall: true, detailView: true, sortable: true, width: "100px", align: "center" },
        { key: "accountStatus", label: "Account Status", type: "select", options: ["Active", "Inactive", "On Hold"], visibleOverall: true, detailView: true, sortable: true, width: "130px", align: "center" },
        { key: "lastActivity", label: "Last Activity", type: "activity", visibleOverall: true, detailView: true, sortable: true, width: "110px" },

        // Detail-only Fields
        { key: "phone", label: "Phone", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "phone2", label: "Phone 2", type: "text", visibleOverall: false, detailView: true },
        { key: "phone3", label: "Phone 3", type: "text", visibleOverall: false, detailView: true },
        { key: "address", label: "Address", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "city", label: "City", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "email", label: "Email 1", type: "text", visibleOverall: false, detailView: true },
        { key: "email2", label: "Email 2", type: "text", visibleOverall: false, detailView: true },
        { key: "state", label: "State", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "zip", label: "ZIP", type: "text", visibleOverall: false, detailView: true, mandatory: true },
        { key: "fax", label: "Fax", type: "text", visibleOverall: false, detailView: true },
        { key: "propertiesManaged", label: "Properties Managed", type: "text", visibleOverall: false, detailView: true }
    ],
};
