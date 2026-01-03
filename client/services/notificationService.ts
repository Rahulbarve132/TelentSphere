import api from "@/lib/axios";

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface NotificationResponse {
    notifications: Notification[];
    unreadCount: number;
    pagination: Pagination;
}

export interface UnreadCountResponse {
    unreadCount: number;
}

// Helper generic response type
interface APIResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export const notificationService = {
    getAll: async (page = 1, limit = 20, isRead?: boolean) => {
        const params: any = { page, limit };
        if (isRead !== undefined) {
            params.isRead = isRead;
        }
        const response = await api.get<APIResponse<NotificationResponse>>('/notifications', { params });
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await api.get<APIResponse<UnreadCountResponse>>('/notifications/unread-count');
        return response.data;
    },

    markAsRead: async (id: string) => {
        const response = await api.put<APIResponse<{ message: string }>>(`/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.put<APIResponse<{ message: string }>>('/notifications/read-all');
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<APIResponse<{ message: string }>>(`/notifications/${id}`);
        return response.data;
    }
};
