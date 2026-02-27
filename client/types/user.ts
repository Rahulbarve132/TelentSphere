export interface User {
    _id: string;
    email: string;
    role: 'talent' | 'client' | 'recruiter' | 'admin' | 'company';
    avatar?: string;
    isVerified?: boolean;
    isActive?: boolean;
    createdAt: string;
}

export interface Experience {
    _id: string;
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
}

export interface Education {
    _id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    description?: string;
}

export interface SocialLinks {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
}

export interface Location {
    city?: string;
    state?: string;
    country?: string;
}

export interface VerifiedSocialMedia {
    platform?: string;
    url?: string;
    followers?: number;
}

export interface Company {
    name: string;
    website?: string;
    size?: string;
    industry?: string;
    description?: string;
    city?: string;
    logo?: string | null;
    isIndependentPractitioner?: boolean;
    verificationStatus?: 'pending' | 'verified' | 'rejected' | 'unverified';
    verificationMethod?: 'website' | 'social_media' | 'document' | 'none' | null;
    verifiedWebsite?: string;
    verifiedSocialMedia?: VerifiedSocialMedia;
    contactEmail?: string;
}

export interface UserProfile {
    _id: string;
    user: User;
    firstName: string;
    lastName: string;
    headline: string;
    bio: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
    socialLinks: SocialLinks;
    location?: Location;
    phone?: string;
    website?: string;
    hourlyRate?: number;
    availability?: 'available' | 'busy' | 'not-available';
    company?: Company;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

export interface APIResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    headline?: string;
    bio?: string;
    phone?: string;
    website?: string;
    location?: Location;
    skills?: string[];
    hourlyRate?: number;
    availability?: 'available' | 'busy' | 'not-available';
    socialLinks?: SocialLinks;
    company?: Company;
    avatar?: string;
}
