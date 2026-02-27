import api from '@/lib/axios';

export interface CompanyData {
    name?: string;
    website?: string;
    size?: string;
    industry?: string;
    description?: string;
    city?: string;
    contactEmail?: string;
    isIndependentPractitioner?: boolean;
    verificationMethod?: 'none' | 'website' | 'social_media' | 'document';
    verifiedWebsite?: string;
    verifiedSocialMedia?: {
        platform?: string;
        url?: string;
        followers?: number;
    };
}

export interface CompanyResponse {
    success: boolean;
    message?: string;
    data: {
        company: CompanyData & {
            _id?: string;
            logo?: string;
            verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
            createdAt?: string;
            updatedAt?: string;
        };
    };
}

export const companyService = {
    /**
     * POST /api/company/onboard
     * Onboard a new company for the authenticated recruiter.
     */
    onboard: async (data: CompanyData): Promise<CompanyResponse> => {
        const response = await api.post<CompanyResponse>('/company/onboard', data);
        return response.data;
    },

    /**
     * GET /api/company/me
     * Get the authenticated recruiter's company details.
     */
    getMyCompany: async (): Promise<CompanyResponse> => {
        const response = await api.get<CompanyResponse>('/company/me');
        return response.data;
    },

    /**
     * PUT /api/company/me
     * Update the authenticated recruiter's company details.
     */
    updateMyCompany: async (data: CompanyData): Promise<CompanyResponse> => {
        const response = await api.put<CompanyResponse>('/company/me', data);
        return response.data;
    },

    /**
     * POST /api/company/me/logo
     * Upload company logo (multipart/form-data, field: logo).
     */
    uploadLogo: async (file: File): Promise<CompanyResponse> => {
        const formData = new FormData();
        formData.append('logo', file);
        const response = await api.post<CompanyResponse>('/company/me/logo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * DELETE /api/company/me/logo
     * Delete company logo.
     */
    deleteLogo: async (): Promise<{ success: boolean; message?: string }> => {
        const response = await api.delete<{ success: boolean; message?: string }>('/company/me/logo');
        return response.data;
    },
};
