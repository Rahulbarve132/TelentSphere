"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Briefcase, 
  Search, 
  Filter, 
  Plus,
  MapPin,
  DollarSign,
  Eye,
  Users,
  Clock,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  Pause,
  Play,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/axios";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Job {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  skillsRequired: string[];
  experienceLevel: string;
  budget: {
    type: string;
    min: number;
    max: number;
    currency: string;
  };
  location: {
    type: string;
    city?: string;
    state?: string;
    country?: string;
  };
  status: 'draft' | 'open' | 'closed' | 'paused' | 'filled';
  visibility: string;
  applicationDeadline?: string;
  applicationsCount: number;
  viewsCount: number;
  isFeatured: boolean;
  requirements: string[];
  benefits: string[];
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Edit },
  open: { label: 'Open', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: CheckCircle2 },
  closed: { label: 'Closed', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle },
  paused: { label: 'Paused', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: Pause },
  filled: { label: 'Filled', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: CheckCircle2 }
};

const jobTypeConfig: Record<string, { label: string; icon: string }> = {
  'full-time': { label: 'Full-time', icon: '💼' },
  'part-time': { label: 'Part-time', icon: '⏰' },
  'contract': { label: 'Contract', icon: '📝' },
  'freelance': { label: 'Freelance', icon: '🚀' },
  'internship': { label: 'Internship', icon: '🎓' }
};

export default function MyJobsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  // Fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/jobs/user/my-jobs");
      if (response.data.success) {
        setJobs(response.data.data.jobs);
        setPagination(response.data.data.pagination);
      }
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast.error(error.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'open').length,
    totalApplications: jobs.reduce((sum, j) => sum + j.applicationsCount, 0),
    totalViews: jobs.reduce((sum, j) => sum + j.viewsCount, 0)
  };

  // Format budget
  const formatBudget = (budget: Job['budget']) => {
    const range = `${budget.currency} ${budget.min.toLocaleString()} - ${budget.max.toLocaleString()}`;
    if (budget.type === 'hourly') return `${range}/hr`;
    if (budget.type === 'monthly') return `${range}/mo`;
    return range;
  };

  // Format location
  const formatLocation = (location: Job['location']) => {
    if (location.type === 'remote') return '🌍 Remote';
    if (location.type === 'hybrid') return `🔄 Hybrid${location.city ? ` • ${location.city}` : ''}`;
    return `🏢 ${location.city || location.country || 'Onsite'}`;
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            My Jobs
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Manage your job postings and track applications
          </p>
        </div>
        <Link href="/dashboard/post-job">
          <Button className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">
            <Plus className="w-4 h-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                <p className="text-3xl font-bold text-primary mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.open}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Applications</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalApplications}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.totalViews}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search jobs by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === "open" ? "default" : "outline"}
                onClick={() => setStatusFilter("open")}
                size="sm"
              >
                Open
              </Button>
              <Button
                variant={statusFilter === "closed" ? "default" : "outline"}
                onClick={() => setStatusFilter("closed")}
                size="sm"
              >
                Closed
              </Button>
              <Button
                variant={statusFilter === "paused" ? "default" : "outline"}
                onClick={() => setStatusFilter("paused")}
                size="sm"
              >
                Paused
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border-border/50">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Get started by posting your first job"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link href="/dashboard/post-job">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Post Your First Job
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const StatusIcon = statusConfig[job.status].icon;
            const typeInfo = jobTypeConfig[job.type] || { label: job.type, icon: '💼' };
            
            return (
              <Card key={job._id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-200 group">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${statusConfig[job.status].color} border font-medium`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[job.status].label}
                        </Badge>
                        {job.isFeatured && (
                          <Badge variant="secondary" className="gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                        {job.title}
                      </CardTitle>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="text-base">{typeInfo.icon}</span>
                          {typeInfo.label}
                        </span>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="flex items-center gap-1">
                          {formatLocation(job.location)}
                        </span>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {formatBudget(job.budget)}
                        </span>
                        <Separator orientation="vertical" className="h-4" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Eye className="w-4 h-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Edit className="w-4 h-4" />
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {job.status === 'open' ? (
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Pause className="w-4 h-4" />
                            Pause Job
                          </DropdownMenuItem>
                        ) : job.status === 'paused' ? (
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Play className="w-4 h-4" />
                            Resume Job
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <XCircle className="w-4 h-4" />
                          Close Job
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                          <Trash2 className="w-4 h-4" />
                          Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground line-clamp-2 mb-4">
                    {job.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skillsRequired.slice(0, 6).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="font-normal">
                        {skill}
                      </Badge>
                    ))}
                    {job.skillsRequired.length > 6 && (
                      <Badge variant="outline" className="font-normal">
                        +{job.skillsRequired.length - 6} more
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-primary mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-2xl font-bold">{job.applicationsCount}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Applications</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-purple-600 mb-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-2xl font-bold">{job.viewsCount}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-lg font-semibold">
                          {job.applicationDeadline 
                            ? new Date(job.applicationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : 'No deadline'
                          }
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-border/50 bg-muted/20">
                  <Link href={`/dashboard/jobs/${job._id}`} className="w-full">
                    <Button variant="ghost" className="w-full gap-2 group/btn">
                      View Applications
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Info */}
      {!loading && filteredJobs.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {filteredJobs.length} of {pagination.total} job{pagination.total !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
