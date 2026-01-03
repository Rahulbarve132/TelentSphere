import api from "@/lib/axios";
import { APIResponse } from "@/types/api";

export interface BroadcastData {
    title: string;
    message: string;
    role?: 'client' | 'developer' | 'recruiter' | 'all';
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
    }
};
