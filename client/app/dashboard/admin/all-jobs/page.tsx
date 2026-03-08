"use client";

import { useEffect, useState } from "react";
import { adminService, JobsFilters } from "@/services/adminService";
import { Job } from "@/types/job";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { Filter, X, Briefcase, MapPin, DollarSign, Eye, Users, Calendar } from "lucide-react";
import Link from "next/link";

export default function AdminAllJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<JobsFilters>({
        page: 1,
        limit: 20
    });
    const [totalJobs, setTotalJobs] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchJobs();
    }, [filters]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllJobs(filters);
            if (response.success && response.data && Array.isArray(response.data.jobs)) {
                setJobs(response.data.jobs);
                setTotalJobs(response.data.pagination.total);
                setTotalPages(response.data.pagination.pages);
            } else {
                console.error("API Error: Expected jobs array but got:", response);
                setJobs([]);
                toast.error("Invalid data format received from server");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while fetching jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: keyof JobsFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({ page: 1, limit: 20 });
    };

    const hasActiveFilters = filters.type || filters.status || filters.visibility;

    const getJobTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            'full-time': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
            'part-time': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
            'contract': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
            'freelance': 'bg-green-500/10 text-green-600 border-green-500/20',
            'internship': 'bg-pink-500/10 text-pink-600 border-pink-500/20',
        };
        return colors[type] || '';
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'open': 'bg-green-500/10 text-green-600 border-green-500/20',
            'closed': 'bg-red-500/10 text-red-600 border-red-500/20',
            'paused': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        };
        return colors[status] || '';
    };

    const formatBudget = (budget: Job['budget']) => {
        const { type, min, max, currency } = budget;
        if (type === 'hourly') {
            return `${currency} ${min}-${max}/hr`;
        } else if (type === 'monthly') {
            return `${currency} ${min.toLocaleString()}-${max.toLocaleString()}/mo`;
        } else {
            return `${currency} ${min.toLocaleString()}-${max.toLocaleString()}`;
        }
    };

    const getPostedByEmail = (postedBy: Job['postedBy']): string => {
        if (!postedBy) return 'Unknown';
        if (typeof postedBy === 'string') return postedBy;
        return postedBy.email;
    };

    const formatLocation = (location: Job['location']) => {
        if (location.type === 'remote') {
            return `Remote${location.country ? ` (${location.country})` : ''}`;
        } else if (location.type === 'onsite') {
            return `${location.city}, ${location.state}, ${location.country}`;
        } else {
            return `Hybrid - ${location.city}, ${location.state}`;
        }
    };

    if (loading && jobs.length === 0) {
        return <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-[400px] w-full" />
        </div>
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Jobs</h1>
                    <p className="text-muted-foreground mt-1">Total Jobs: {totalJobs}</p>
                </div>
            </div>

            {/* Filters Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            <CardTitle>Filters</CardTitle>
                        </div>
                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                                <X className="w-4 h-4" />
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Job Type Filter */}
                        <Select
                            value={filters.type || "all"}
                            onValueChange={(value) => handleFilterChange('type', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="full-time">Full-time</SelectItem>
                                <SelectItem value="part-time">Part-time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="freelance">Freelance</SelectItem>
                                <SelectItem value="internship">Internship</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Status Filter */}
                        <Select
                            value={filters.status || "all"}
                            onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                <SelectItem value="paused">Paused</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Visibility Filter */}
                        <Select
                            value={filters.visibility || "all"}
                            onValueChange={(value) => handleFilterChange('visibility', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by visibility" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Visibility</SelectItem>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 gap-4">
                {jobs.map((job) => (
                    <Card key={job._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                {/* Left Section - Job Details */}
                                <div className="flex-1 space-y-3">
                                    {/* Title and Badges */}
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-3 flex-wrap">
                                            <Briefcase className="w-5 h-5 text-primary mt-1" />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold">{job.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Posted by: {getPostedByEmail(job.postedBy)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline" className={`capitalize ${getJobTypeColor(job.type)}`}>
                                                {job.type}
                                            </Badge>
                                            <Badge variant="outline" className={`capitalize ${getStatusColor(job.status)}`}>
                                                {job.status}
                                            </Badge>
                                            <Badge variant="outline" className="capitalize">
                                                {job.visibility}
                                            </Badge>
                                            <Badge variant="outline" className="capitalize">
                                                {job.experienceLevel}
                                            </Badge>
                                            {job.isFeatured && (
                                                <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                                    Featured
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {job.description}
                                    </p>

                                    {/* Meta Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="w-4 h-4" />
                                            <span>{formatLocation(job.location)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <DollarSign className="w-4 h-4" />
                                            <span>{formatBudget(job.budget)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="w-4 h-4" />
                                            <span>{job.applicationsCount} Applications</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Eye className="w-4 h-4" />
                                            <span>{job.viewsCount} Views</span>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {job.skillsRequired.slice(0, 5).map((skill, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {job.skillsRequired.length > 5 && (
                                            <Badge variant="secondary" className="text-xs">
                                                +{job.skillsRequired.length - 5} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Right Section - Dates and Actions */}
                                <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
                                    <div className="text-right space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            <span>Posted: {format(new Date(job.createdAt), "MMM d, yyyy")}</span>
                                        </div>
                                        {job.applicationDeadline && (
                                            <div className="text-xs text-muted-foreground">
                                                Deadline: {format(new Date(job.applicationDeadline), "MMM d, yyyy")}
                                            </div>
                                        )}
                                        <div className="text-xs text-muted-foreground font-mono">
                                            ID: {job._id.slice(-8)}
                                        </div>
                                    </div>
                                    <Link href={`/jobs/${job._id}`}>
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {jobs.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                {hasActiveFilters ? "No jobs found matching the filters." : "No jobs found."}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Page {filters.page} of {totalPages} • Showing {jobs.length} of {totalJobs} jobs
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
                                    disabled={filters.page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                                    disabled={filters.page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
