import api from '@/lib/axios';
import { UserProfile, UpdateProfileData, APIResponse } from '@/types/user';

export const profileService = {
    getProfile: async (userId: string) => {
        const response = await api.get<APIResponse<{ profile: UserProfile }>>(`/users/${userId}/profile`);
        return response.data;
    },

    updateProfile: async (userId: string, data: UpdateProfileData) => {
        const response = await api.put<APIResponse<{ profile: UserProfile }>>(`/users/${userId}/profile`, data);
        return response.data;
    },

    addExperience: async (userId: string, experience: any) => {
        // Clean payload: remove empty strings for dates
        const cleanedExperience = { ...experience };
        if (!cleanedExperience.to) delete cleanedExperience.to;
        if (!cleanedExperience.description) delete cleanedExperience.description;
        if (!cleanedExperience.location) delete cleanedExperience.location;

        console.log("Sending Add Experience Payload:", { experience: cleanedExperience });

        const response = await api.post<APIResponse<{ profile: UserProfile }>>(`/users/${userId}/profile/experience`, { experience: cleanedExperience });
        return response.data;
    },

    addEducation: async (userId: string, education: any) => {
        // Clean payload
        const cleanedEducation = { ...education };
        if (!cleanedEducation.to) delete cleanedEducation.to;
        if (!cleanedEducation.description) delete cleanedEducation.description;

        console.log("Sending Add Education Payload:", { education: cleanedEducation });

        const response = await api.post<APIResponse<{ profile: UserProfile }>>(`/users/${userId}/profile/education`, { education: cleanedEducation });
        return response.data;
    },

    deleteExperience: async (userId: string, expId: string) => {
        const response = await api.delete<APIResponse<{ profile: UserProfile }>>(`/users/${userId}/profile/experience/${expId}`);
        return response.data;
    },

    deleteEducation: async (userId: string, eduId: string) => {
        const response = await api.delete<APIResponse<{ profile: UserProfile }>>(`/users/${userId}/profile/education/${eduId}`);
        return response.data;
    },

    deleteAvatar: async (userId: string) => {
        const response = await api.delete<APIResponse<{ profile: UserProfile }>>(`/users/${userId}/avatar`);
        return response.data;
    }
};
