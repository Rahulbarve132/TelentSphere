export interface JobLocation {
    type: 'remote' | 'onsite' | 'hybrid';
    country?: string;
    city?: string;
    state?: string;
}

export interface JobBudget {
    min: number;
    max: number;
    currency: string;
    type: 'hourly' | 'fixed' | 'monthly' | 'yearly';
}

export interface JobPostedBy {
    _id: string;
    email: string;
    name?: string;
}

export interface Job {
    _id: string;
    title: string;
    description: string;
    companyName?: string;
    type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
    category: string;
    experienceLevel: 'entry' | 'intermediate' | 'expert';
    location: JobLocation;
    budget: JobBudget;
    skillsRequired: string[];
    responsibilities?: string[];
    requirements?: string[];
    benefits?: string[];
    status: 'open' | 'closed' | 'paused';
    visibility: 'public' | 'private';
    isFeatured?: boolean;
    postedBy?: string | JobPostedBy;
    createdAt: string;
    updatedAt?: string;
    deadline?: string;
    applicationDeadline?: string;
    applicationsCount?: number;
    viewsCount?: number;
}

export interface JobsPagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface JobsResponse {
    jobs: Job[];
    pagination: JobsPagination;
}

export interface JobFormData {
    title: string;
    description: string;
    companyName?: string;
    type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
    category: string;
    experienceLevel: 'entry' | 'intermediate' | 'expert';
    location: JobLocation;
    budget: JobBudget;
    skillsRequired: string[];
    responsibilities?: string[];
    requirements?: string[];
    benefits?: string[];
    visibility?: 'public' | 'private';
    deadline?: string;
}
