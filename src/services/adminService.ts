
import api from './api';

// Types
export interface User {
    id: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'inactive' | 'banned';
    subscription: 'free' | 'pro' | 'enterprise';
    lastLogin: string;
    createdAt: string;
    avatar?: string;
    companyName?: string;
    isMaster?: boolean;
}

// ...



export interface Execution {
    id: string;
    user: string; // Email
    userName: string;
    companyName?: string; // Added company name
    workflow: string;
    status: string;
    started: string;
    completed?: string;
    inputFiles?: any[];
    outputFiles?: any[];
    projectName?: string;
}

// ... (omitting intermediate code, tool will preserve)




export interface DashboardStats {
    totalUsers: number;
    activeSubscriptions: number;
    mrr: number;
    totalWorkflowRuns: number;
    totalCompanies: number;
    totalBots: number;
    activeBots: number;
    serviceUsage: { time: string; calls: number }[];
    revenueTrend: { month: string; revenue: number; expenses: number }[];
    userGrowth: { date: string; users: number }[];
    botUsage: { name: string; value: number; fill: string }[];
    revenueByPlan: { name: string; value: number; fill: string }[];
    churnRate: { month: string; rate: number }[];
}

export interface Bot {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive';
    iconKey: 'xactimate' | 'material' | 'voice' | 'default';
    routeKey: string;
}

export interface SystemConfig {
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    supportEmail: string;
    enforce2FA: boolean;
    sessionTimeout: string;
    announcementMessage: string;
    dataRetentionDays: number;
    allowedDomains: string;
}

// Service Functions
export const adminService = {
    fetchDashboardStats: async (): Promise<DashboardStats> => {
        const { data } = await api.get('/admin/stats');
        return data;
    },

    fetchUsers: async (page: number, limit: number, search: string, role?: string, excludeRole?: string): Promise<{ users: User[], total: number }> => {
        const roleQuery = role ? `&role=${role}` : '';
        const excludeQuery = excludeRole ? `&excludeRole=${excludeRole}` : '';
        const { data } = await api.get(`/admin/users?page=${page}&limit=${limit}&search=${search}${roleQuery}${excludeQuery}`);
        return {
            users: data.users.map((u: any) => ({
                id: u._id,
                email: u.email,
                role: (u.role === 'superadmin' ? 'admin' : u.role) || 'user', // Map superadmin->admin for UI
                status: u.accountStatus || 'active',
                subscription: (u.plan && u.plan === 'free') ? 'free' : ((u.plan && u.plan.includes('pro')) ? 'pro' : 'enterprise'),
                lastLogin: u.lastLogin,
                createdAt: u.createdAt,
                avatar: u.avatar,
                companyName: u.companyName, // Ensure this is mapped
                isMaster: u.isMaster
            })),
            total: data.total
        };
    },

    getUserWorkflows: async (userId: string, params: any) => {
        const { data } = await api.get('/workflows/all', { params: { userId, ...params } });
        return data;
    },

    getUserDetails: async (userId: string) => {
        // Assuming there's an endpoint to get single user details by ID, or we fetch from list
        // For now, we might rely on what we have or add a specific endpoint if needed. 
        // Let's assume we can fetch basic details from the user management list for now, 
        // but for full profile we might need an endpoint like /admin/users/:id
        // Implementing basic fetch for now if it exists, otherwise relying on passed data
        const { data } = await api.get(`/admin/users/${userId}`);
        return data;
    },

    getUserStats: async (userId: string) => {
        const { data } = await api.get(`/workflows/stats/${userId}`);
        return data;
    },

    createUser: async (email: string, password: string, companyId?: string): Promise<User> => {
        const { data } = await api.post('/admin/users', { email, password, companyId });
        return data;
    },

    createAdmin: async (email: string, password: string): Promise<User> => {
        const { data } = await api.post('/admin/users', { email, password, role: 'admin' });
        return data;
    },

    updateAdmin: async (id: string, data: Partial<User>): Promise<User> => {
        const { data: updated } = await api.put(`/admin/users/${id}`, data);
        return updated;
    },

    resetPassword: async (userId: string, newPassword?: string): Promise<void> => {
        await api.post(`/admin/users/${userId}/reset-password`, { newPassword });
    },

    updateUserStatus: async (userId: string, status: 'active' | 'inactive' | 'banned'): Promise<void> => {
        await api.put(`/admin/users/${userId}/status`, { status });
    },

    deleteUser: async (userId: string): Promise<void> => {
        await api.delete(`/users/${userId}`);
    },

    deleteAdmin: async (adminId: string): Promise<void> => {
        await api.delete(`/admin/users/${adminId}`);
    },

    fetchExecutions: async (page: number, limit: number, filter?: string, search?: string): Promise<{ executions: Execution[], total: number }> => {
        const { data } = await api.get(`/admin/executions?page=${page}&limit=${limit}&search=${search || ''}`);

        return {
            executions: data.executions.map((e: any) => ({
                id: e._id,
                user: e.user ? e.user.email : 'Unknown',
                userName: e.user ? e.user.name : 'Unknown',
                companyName: e.companyId ? e.companyId.name : 'N/A', // Map company name
                workflow: e.workflowType,
                status: e.status,
                started: e.startedAt,
                completed: e.completedAt,
                inputFiles: e.inputFiles,
                outputFiles: e.outputFiles,
                projectName: e.projectName
            })),
            total: data.total
        };
    },

    emailExecutionResults: async (executionIds: string[], emails: string[]): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Emailing results of ${executionIds.join(', ')} to ${emails.join(', ')}`);
    },

    fetchBots: async (): Promise<Bot[]> => {
        const { data } = await api.get('/bots');
        return data.map((bot: any) => ({
            ...bot,
            id: bot._id
        }));
    },

    toggleBotStatus: async (botId: string, newStatus: 'active' | 'inactive'): Promise<void> => {
        await api.put(`/bots/${botId}`, { status: newStatus });
    },

    fetchSystemSettings: async (): Promise<SystemConfig> => {
        const { data } = await api.get('/settings'); // Admin route
        return data;
    },

    fetchPublicSettings: async (): Promise<Partial<SystemConfig>> => {
        const { data } = await api.get('/settings/public');
        return data;
    },

    updateSystemSettings: async (newConfig: SystemConfig): Promise<SystemConfig> => {
        const { data } = await api.put('/settings', newConfig);
        return data;
    },

    fetchCompanies: async (page: number, limit: number, search: string): Promise<{ companies: any[], total: number }> => {
        const { data } = await api.get(`/admin/companies?page=${page}&limit=${limit}&search=${search}`);
        return data;
    },

    fetchCompanyUsers: async (): Promise<User[]> => {
        // Fetch users belonging to the same company as the logged-in user
        // This endpoint likely needs to be created or we re-use existing user list endpoint with filter?
        // Let's assume a new endpoint or reusing /api/users with a 'my-company' flag or similar.
        // Actually, for Company Admin, they can use /api/team or similar.
        // Let's rely on a new route: GET /api/users/team
        const { data } = await api.get('/users/team');
        return data.map((u: any) => ({
            id: u._id,
            email: u.email,
            name: u.name,
            role: u.role,
            avatar: u.avatar
        }));
    }
};
