import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { DESIGNATIONS } from "@/lib/contact-config";

const API_BASE = "/contacts";

export interface Contact {
    _id: string;
    companyId: string;
    name: string;
    email?: string;
    phone?: string;
    designation: string;
    company?: string;
    activeJobs?: number;
    totalJobs?: number;
    revenue?: number;
    lastActivity?: string;
    avatar?: string;
    [key: string]: any; // For category specific fields
}

export const useContacts = (designationLabel?: string, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc') => {
    const queryClient = useQueryClient();

    const contactsQuery = useQuery({
        queryKey: ["contacts", designationLabel, search, sortBy, sortOrder],
        queryFn: async () => {
            const apiValue = DESIGNATIONS.find(d => d.label === designationLabel)?.apiValue || "All";
            const res = await api.get(API_BASE, {
                params: { 
                    designation: apiValue, 
                    search,
                    sortBy,
                    sortOrder
                }
            });
            return Array.isArray(res.data) ? res.data : [];
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
    });

    const createMutation = useMutation({
        mutationFn: async (newContact: Partial<Contact>) => {
            const res = await api.post(API_BASE, newContact);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Contact> }) => {
            const res = await api.put(`${API_BASE}/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.delete(`${API_BASE}/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        }
    });

    const bulkUploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            const res = await api.post(`${API_BASE}/bulk`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        }
    });

    const bulkDeleteMutation = useMutation({
        mutationFn: async (ids: string[]) => {
            const res = await api.post(`${API_BASE}/bulk-delete`, { ids });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        }
    });

    return {
        contacts: Array.isArray(contactsQuery.data) ? contactsQuery.data : [],
        isLoading: contactsQuery.isLoading,
        isFetching: contactsQuery.isFetching,
        isError: contactsQuery.isError,
        createContact: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateContact: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteContact: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        bulkUpload: bulkUploadMutation.mutateAsync,
        isBulkUploading: bulkUploadMutation.isPending,
        bulkDelete: bulkDeleteMutation.mutateAsync,
        isBulkDeleting: bulkDeleteMutation.isPending
    };
};
