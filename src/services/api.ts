import axios from 'axios';

const API_URL = import.meta.env.PROD ? 'https://server.biglogic.ai/api' : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 900000, // 15 minutes timeout
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('user');
        if (user) {
            const { token } = JSON.parse(user);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 and 403 errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Global Error Handling
        if (error.response) {
            if (error.response.status === 401) {
                // Check if it's not a login endpoint
                if (error.config && error.config.url && !error.config.url.includes('/auth/login')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('email');
                    localStorage.removeItem('isAdmin');
                    window.location.href = '/login?expired=true';
                }
            } else if (error.response.status === 403) {
                // Handle Access Denied (Enterprise Permission Revocation)
                // console.warn(message);
                window.location.href = '/dashboard?error=access_denied';
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    register: (userData: any) => api.post('/auth/register', userData),
    login: (userData: any) => api.post('/auth/login', userData),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data: any) => api.put('/auth/profile', data),
    updatePassword: (data: any) => api.put('/auth/update-password', data),
    enableTwoFactor: () => api.post('/auth/2fa/enable'),
    verifyTwoFactor: (otp: string) => api.post('/auth/2fa/verify', { otp }),
    disableTwoFactor: () => api.post('/auth/2fa/disable'),
    registerAdmin: (userData: any) => api.post('/auth/admin/register', userData),
    uploadAvatar: (formData: FormData) => api.post('/auth/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    googleLogin: (token: string) => api.post('/auth/google', { googleToken: token }),
};

export const notificationService = {
    getNotifications: () => api.get('/notifications'),
    markRead: (id: string) => api.put(`/notifications/${id}/read`),
    markAllRead: () => api.put('/notifications/read-all'),
    deleteAll: () => api.delete('/notifications'),
};

export const billingService = {
    createCheckoutSession: (priceId: string, planName: string) => api.post('/payments/create-checkout-session', { priceId, planName }),
    createPortalSession: () => api.post('/payments/create-portal-session'),
    getInvoices: () => api.get('/payments/invoices'),
};

export const userService = {
    getAllUsers: () => api.get('/users'),
    createUser: (userData: any) => api.post('/users', userData),
    updateUser: (id: string, userData: any) => api.put(`/users/${id}`, userData),
    deleteUser: (id: string) => api.delete(`/users/${id}`),
};

export const workflowService = {
    createWorkflow: (formData: FormData) => api.post('/workflows', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    getMyWorkflows: (params?: any) => api.get('/workflows', { params }),
    getAllWorkflows: (params?: any) => api.get('/workflows/all', { params }),
    getWorkflowFilters: () => api.get('/workflows/filters'),
};

export const adminService = {
    getStats: () => api.get('/admin/stats'),
    getBots: () => api.get('/bots'),
    createBot: (botData: any) => api.post('/bots', botData),
    updateBot: (id: string, botData: any) => api.put(`/bots/${id}`, botData),
    deleteBot: (id: string) => api.delete(`/bots/${id}`),
    getSettings: () => api.get('/settings'),
    updateSetting: (settingData: any) => api.post('/settings', settingData),
};

export const companyService = {
    getUsers: () => api.get('/company/users'),
    addUser: (userData: any) => api.post('/company/users', userData),
    updateUser: (id: string, data: any) => api.put(`/company/users/${id}`, data),
    deleteUser: (id: string) => api.delete(`/company/users/${id}`),
};

export const companyAnalyticsService = {
    getRoleRates: () => api.get('/company/analytics/role-rates'),
    createRoleRate: (data: any) => api.post('/company/analytics/role-rates', data),
    updateRoleRate: (id: string, data: any) => api.put(`/company/analytics/role-rates/${id}`, data),
    deleteRoleRate: (id: string) => api.delete(`/company/analytics/role-rates/${id}`),
    getAnalytics: () => api.get('/company/analytics/analytics'),
};

// ── FieldNotesAI — User-facing ──────────────────────────────────────────────
export const fieldNotesService = {
    // Projects
    getProjects: () => api.get('/fieldnotesai/projects'),
    getProject: (id: string) => api.get(`/fieldnotesai/projects/${id}`),
    createProject: (data: any) => api.post('/fieldnotesai/projects', data),
    updateProject: (id: string, data: any) => api.put(`/fieldnotesai/projects/${id}`, data),
    deleteProject: (id: string) => api.delete(`/fieldnotesai/projects/${id}`),

    // Sessions
    getSessions: (params?: any) => api.get('/fieldnotesai/sessions', { params }),
    getSession: (id: string) => api.get(`/fieldnotesai/sessions/${id}`),
    createSession: (data: any) => api.post('/fieldnotesai/sessions', data),
    endSession: (id: string) => api.put(`/fieldnotesai/sessions/${id}/end`),
    deleteSession: (id: string) => api.delete(`/fieldnotesai/sessions/${id}`),

    // S3 Storage
    getUploadUrl: (data: any) => api.post('/fieldnotesai/storage/upload-url', data),
    confirmUpload: (data: any) => api.post('/fieldnotesai/storage/confirm-upload', data),

    // AI Processing
    triggerWebhook: (sessionId: string) => api.post('/fieldnotesai/sync/trigger-webhook', { sessionId }),
    storeResult: (sessionId: string, result: any) => api.post(`/fieldnotesai/sessions/${sessionId}/store-result`, result),
    getSyncStatus: () => api.get('/fieldnotesai/sync/status'),

    // Admin-only
    getDashboardStats: () => api.get('/fieldnotesai/admin/dashboard'),
    adminDeleteProject: (id: string) => api.delete(`/fieldnotesai/admin/projects/${id}`),
};

export const fileService = {
    getDownloadUrl: (key: string) => api.get(`/files/download?key=${encodeURIComponent(key)}`),
};

export const companyBrainService = {
    queryStream: async (query: string, conversationId?: string, mode: string = 'Jobsite Guidance', signal?: AbortSignal) => {
        const userStr = localStorage.getItem('user');
        const token = userStr ? JSON.parse(userStr).token : null;
        
        const response = await fetch(`${API_URL}/company-brain/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query, conversationId, mode, stream: true }),
            signal
        });

        if (!response.ok) {
            if (response.status === 403) {
                window.location.href = '/dashboard?error=brain_denied';
            }
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.message) errorMessage = errorData.message;
                if (errorData.details) errorMessage += ` - ${JSON.stringify(errorData.details)}`;
            } catch (e) {
                // Ignore json parse error
            }
            throw new Error(errorMessage);
        }

        return response;
    },
    qaIngest: (data: any) => api.post('/company-brain/qa-ingest', data),
    fieldNoteIngest: (data: any) => api.post('/company-brain/field-note', data),
    uploadKnowledge: (formData: FormData) => api.post('/company-brain/upload-knowledge', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
    // --- Admin Monitoring & Feedback ---
    getConversations: (params?: any) => api.get('/company-brain/conversations', { params }),
    getConversationHistory: (id: string) => api.get(`/company-brain/conversations/${id}`),
    rateMessage: (id: string, data: { rating?: 'up' | 'down', feedbackText?: string, feedbackFile?: File }) => {
        const formData = new FormData();
        if (data.rating) formData.append('rating', data.rating);
        if (data.feedbackText) formData.append('feedbackText', data.feedbackText);
        if (data.feedbackFile) formData.append('feedbackFile', data.feedbackFile);
        
        return api.patch(`/company-brain/messages/${id}/rate`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    getIngestions: (params?: any) => api.get('/company-brain/ingestions', { params }),
    updateIngestion: (id: string, data: any) => api.patch(`/company-brain/ingestions/${id}`, data),
    removeIngestion: (id: string) => api.delete(`/company-brain/ingestions/${id}`),
    shareConversation: (id: string, data: { isShared?: boolean, sharingMode?: 'public' | 'restricted', allowedEmails?: string[] }) => 
        api.patch(`/company-brain/conversations/${id}/share`, data),
    getSharedConversation: (token: string) => api.get(`/company-brain/conversations/shared/${token}`),
    deleteConversation: (id: string) => api.delete(`/company-brain/conversations/${id}`),
    updateConversationTitle: (id: string, title: string) => api.patch(`/company-brain/conversations/${id}/title`, { title }),
    deleteMessagesFrom: (id: string) => api.delete(`/company-brain/messages/from/${id}`),
    deleteConversationsBulk: (ids: string[]) => api.delete('/company-brain/conversations/bulk', { data: { ids } }),
};

export { API_URL };
export default api;
