import api from "@/lib/axios";
import { APIResponse } from "@/types/api";
import { User } from "@/types/user";

export interface BroadcastData {
    title: string;
    message: string;
    role?: 'client' | 'talent' | 'recruiter' | 'all';
    link?: string;
}

export interface BroadcastHistoryItem {
    title: string;
    sentAt: string;
    recipients: number;
}

export interface BroadcastStats {
    totalBroadcasts: number;
    totalRecipients: number;
    history: BroadcastHistoryItem[];
}

export interface UsersPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface UsersResponse {
    users: User[];
    pagination: UsersPagination;
}

export interface UsersFilters {
    role?: 'talent' | 'client' | 'recruiter' | 'admin';
    isActive?: boolean;
    isVerified?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}

export const adminService = {
    sendBroadcast: async (data: BroadcastData) => {
        // If role is 'all', we omit it from the payload as per API spec
        const payload = { ...data };
        if (payload.role === 'all') {
            delete payload.role;
        }

        const response = await api.post<APIResponse<any>>('/admin/broadcast', payload);
        return response.data;
    },

    getBroadcastStats: async () => {
        const response = await api.get<APIResponse<BroadcastStats>>('/admin/broadcast/stats');
        return response.data;
    },

    getUsers: async (filters?: UsersFilters) => {
        const params = new URLSearchParams();

        if (filters?.role) params.append('role', filters.role);
        if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
        if (filters?.isVerified !== undefined) params.append('isVerified', String(filters.isVerified));
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        const url = queryString ? `/admin/users?${queryString}` : '/admin/users';

        const response = await api.get<APIResponse<UsersResponse>>(url);
        return response.data;
    },

    verifyUser: async (userId: string, isVerified: boolean) => {
        const response = await api.put<APIResponse<{ user: User }>>(`/admin/users/${userId}/verify`, {
            isVerified
        });
        return response.data;
    }
};
