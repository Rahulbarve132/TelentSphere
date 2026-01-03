"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Mail, 
  MessageSquare, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  Briefcase,
  MapPin,
  FileText,
  Calendar,
  Search,
  Filter,
  Building
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

// Interfaces based on user request
interface Experience {
  _id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

interface ApplicantProfile {
  firstName: string;
  lastName: string;
  headline: string;
  avatar?: string;
  skills: string[];
  bio?: string;
  location?: string;
  experience?: Experience[];
}

interface Applicant {
  _id: string;
  email: string;
  profile: ApplicantProfile;
}

interface Application {
  _id: string;
  job: string;
  applicant: Applicant;
  applicantProfile: ApplicantProfile;
  coverLetter: string;
  proposedRate: {
    amount: number;
    type: string;
    currency: string;
  };
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
}

interface JobDetails {
  _id: string;
  title: string;
  status: string;
  applicationsCount: number;
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  reviewing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  shortlisted: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  interview: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  accepted: "bg-green-500/10 text-green-600 border-green-500/20",
  withdrawn: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

export default function JobApplicationsPage({ params }: { params: Promise<{ jobId: string }> }) {
  // Unwrap params using React.use()
  const { jobId } = use(params);
  
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch Applications
      const appsResponse = await api.get(`/applications/job/${jobId}`);
      if (appsResponse.data.success) {
        console.log('API Response:', appsResponse.data.data.applications);
        console.log('First Application:', appsResponse.data.data.applications[0].applicantProfile);
        console.log('First Applicant:', appsResponse.data.data.applications[0]?.applicant);
        setApplications(appsResponse.data.data.applications);
      }

      // 🔍 Optimistic: Try to fetch job details for context if endpoint exists
      // If not, we fall back to just showing ID or simple header
      try {
         const jobResponse = await api.get(`/jobs/${jobId}`);
         if (jobResponse.data.success) {
           setJob(jobResponse.data.data);
         }
      } catch (err) {
        // Silent fail if specific job endpoint has different structure or doesn't exist
        console.log("Could not fetch full job details");
      }

    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(error.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [jobId]);

  // Derived state for stats
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const filteredApplications = applications.filter(app => {
    const profile = app.applicantProfile;
    const name = profile ? `${profile.firstName} ${profile.lastName}`.toLowerCase() : "unknown candidate";
    const email = app.applicant?.email?.toLowerCase() || "";
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      // Optimistic update
      setApplications(prev => prev.map(app => 
         app._id === applicationId ? { ...app, status: newStatus as any } : app
      ));
      
      await api.put(`/applications/${applicationId}`, { status: newStatus });
      toast.success(`Application marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
      fetchData(); // Revert on error
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/dashboard/jobs" className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to My Jobs
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {job?.title || "Job Applications"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Managing candidates for Job ID: <span className="font-mono text-xs bg-muted px-1 rounded">{jobId}</span>
            </p>
          </div>
          
          <div className="flex gap-3">
             <Button variant="outline" onClick={() => router.push(`/jobs/${jobId}`)}>
               View Job Post
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-primary/5 border-primary/20">
             <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
                  <p className="text-2xl font-bold text-primary">{stats.total}</p>
                </div>
                <UsersIcon className="w-8 h-8 text-primary/40" />
             </CardContent>
          </Card>
          <Card className="bg-yellow-500/5 border-yellow-500/20">
             <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600/40" />
             </CardContent>
          </Card>
          <Card className="bg-purple-500/5 border-purple-500/20">
             <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shortlisted</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.shortlisted}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-purple-600/40" />
             </CardContent>
          </Card>
          <Card className="bg-red-500/5 border-red-500/20">
             <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600/40" />
             </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Main Content Area */}
      <div className="space-y-6">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card/50 p-4 rounded-lg border backdrop-blur-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter} className="w-full md:w-auto">
            <TabsList className="bg-background border">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Applicants List */}
        {loading ? (
           <div className="space-y-4">
             {[1,2,3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
           </div>
        ) : filteredApplications.length === 0 ? (
           <div className="text-center py-20 border rounded-xl bg-card/50 border-dashed">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No applications found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search filters." : "This job hasn't received any applications yet."}
              </p>
           </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
             {filteredApplications.map((app) => (
                <Card key={app._id} className="overflow-hidden border-border/50 transition-all hover:shadow-md hover:border-primary/20 group">
                   <div className="flex flex-col md:flex-row">
                      {/* Left: Applicant Preview */}
                      <div className="p-6 md:w-[350px] bg-muted/10 border-r border-border/50 flex flex-col gap-4">
                          <div className="flex items-start gap-4">
                             <Avatar className="w-14 h-14 border-2 border-background shadow-sm">
                                <AvatarImage src={app.applicantProfile?.avatar} />
                                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                   {app.applicantProfile?.firstName?.[0] || "?"}{app.applicantProfile?.lastName?.[0] || "?"}
                                </AvatarFallback>
                             </Avatar>
                             <div className="min-w-0">
                                <h3 className="font-bold text-lg truncate">
                                   {app.applicantProfile ? `${app.applicantProfile.firstName} ${app.applicantProfile.lastName}` : "Unknown Candidate"}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                   {app.applicantProfile?.headline || "No headline provided"}
                                </p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                   <MapPin className="w-3 h-3" />
                                   {app.applicantProfile?.location || "Remote"}
                                </div>
                             </div>
                          </div>

                          <div className="space-y-3 pt-2">
                             <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                  <DollarSign className="w-4 h-4" /> Proposed Rate
                                </span>
                                <span className="font-semibold">
                                  {app.proposedRate.amount} {app.proposedRate.currency}
                                  <span className="text-xs font-normal text-muted-foreground">/{app.proposedRate.type}</span>
                                </span>
                             </div>
                             
                             <div className="flex flex-wrap gap-2">
                                {(app.applicantProfile?.skills || []).slice(0, 4).map(skill => (
                                   <Badge key={skill} variant="secondary" className="text-xs font-normal">
                                      {skill}
                                   </Badge>
                                ))}
                                {(app.applicantProfile?.skills?.length || 0) > 4 && (
                                   <span className="text-xs text-muted-foreground self-center">
                                      +{(app.applicantProfile?.skills?.length || 0) - 4} more
                                   </span>
                                )}
                             </div>
                          </div>
                      
                         <div className="mt-auto pt-4 flex gap-2">
                            <Button 
                              className="w-full" 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedApplication(app)}
                            >
                               View Profile
                            </Button>
                            <Button size="icon" variant="outline" className="shrink-0">
                               <MessageSquare className="w-4 h-4" />
                            </Button>
                         </div>
                      </div>

                      {/* Right: Application Content */}
                      <div className="flex-1 p-6 flex flex-col">
                         <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                               <Badge className={`${statusColors[app.status] || "bg-gray-100"} border`}>
                                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                               </Badge>
                               <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Applied {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                               </span>
                            </div>

                            <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                     <MoreVertical className="w-4 h-4" />
                                  </Button>
                               </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                   <DropdownMenuItem onClick={() => handleUpdateStatus(app._id, 'shortlisted')}>
                                      <CheckCircle2 className="w-4 h-4 mr-2 text-purple-500" /> Shortlist
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => handleUpdateStatus(app._id, 'interview')}>
                                      <UsersIcon className="w-4 h-4 mr-2 text-indigo-500" /> Interview
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => handleUpdateStatus(app._id, 'accepted')}>
                                      <Briefcase className="w-4 h-4 mr-2 text-green-500" /> Hire Candidate
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => handleUpdateStatus(app._id, 'rejected')} className="text-red-600">
                                      <XCircle className="w-4 h-4 mr-2" /> Reject
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => handleUpdateStatus(app._id, 'withdrawn')} className="text-muted-foreground">
                                      <XCircle className="w-4 h-4 mr-2" /> Withdrawn
                                   </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                         </div>

                         <div>
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                               <FileText className="w-4 h-4 text-primary" /> Cover Letter
                            </h4>
                            <div className="bg-muted/30 p-4 rounded-lg text-sm text-foreground/80 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                               {app.coverLetter}
                            </div>
                         </div>
                         
                         {/* Action Footer for Mobile / Tablet responsive layout adjustments if needed */}
                         <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border/40">
                             {app.status === 'pending' && (
                               <>
                                 <Button 
                                    variant="outline" 
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                                    onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                 >
                                    Reject
                                 </Button>
                                 <Button 
                                    className="gap-2 bg-gradient-to-r from-primary to-purple-600"
                                    onClick={() => handleUpdateStatus(app._id, 'shortlisted')}
                                 >
                                    <CheckCircle2 className="w-4 h-4" /> Shortlist
                                 </Button>
                               </>
                             )}
                             {app.status === 'shortlisted' && (
                               <>
                                 <Button 
                                    variant="outline" 
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                                    onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                 >
                                    Reject
                                 </Button>
                                 <Button 
                                    className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                                    onClick={() => handleUpdateStatus(app._id, 'interview')}
                                 >
                                    <UsersIcon className="w-4 h-4" /> Interview
                                 </Button>
                               </>
                             )}
                             {app.status === 'interview' && (
                               <>
                                 <Button 
                                    variant="outline" 
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                                    onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                 >
                                    Reject
                                 </Button>
                                 <Button 
                                    className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleUpdateStatus(app._id, 'accepted')}
                                 >
                                    <Briefcase className="w-4 h-4" /> Accept
                                 </Button>
                               </>
                             )}
                         </div>

                      </div>
                   </div>
                </Card>
             ))}
          </div>
        )}
      </div>

      {/* Applicant Profile Modal */}
      <Dialog open={!!selectedApplication} onOpenChange={(open) => !open && setSelectedApplication(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Applicant Profile</DialogTitle>
            <DialogDescription>
              Detailed information about the candidate
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6 pt-4">
              {/* Profile Header */}
              <div className="flex items-start gap-6 pb-6 border-b">
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                  <AvatarImage src={selectedApplication.applicantProfile?.avatar} />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {selectedApplication.applicantProfile?.firstName?.[0] || "?"}{selectedApplication.applicantProfile?.lastName?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {selectedApplication.applicantProfile ? 
                        `${selectedApplication.applicantProfile.firstName} ${selectedApplication.applicantProfile.lastName}` 
                        : "Unknown Candidate"}
                    </h3>
                    <p className="text-muted-foreground text-lg mt-1">
                      {selectedApplication.applicantProfile?.headline || "No headline provided"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {selectedApplication.applicant?.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedApplication.applicantProfile?.location || "Remote"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              {selectedApplication.applicantProfile?.bio && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    About
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedApplication.applicantProfile.bio}
                  </p>
                </div>
              )}

              {/* Skills Section */}
              {selectedApplication.applicantProfile?.skills && selectedApplication.applicantProfile.skills.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Skills & Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.applicantProfile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {selectedApplication.applicantProfile?.experience && selectedApplication.applicantProfile.experience.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    Work Experience
                  </h4>
                  <div className="space-y-4">
                    {selectedApplication.applicantProfile.experience.map((exp, index) => (
                      <div key={index} className="flex gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="mt-1">
                           <div className="w-10 h-10 rounded bg-background border flex items-center justify-center">
                              <Briefcase className="w-5 h-5 text-muted-foreground" />
                           </div>
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-semibold">{exp.title}</h5>
                          <p className="text-sm text-foreground/80 font-medium">
                            {exp.company} {exp.location && `• ${exp.location}`}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                             <Calendar className="w-3 h-3" />
                             {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - 
                             {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : "Unknown"}
                          </p>
                          {exp.description && (
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Application Details */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Application Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Proposed Rate</p>
                    <p className="font-semibold text-lg">
                      {selectedApplication.proposedRate.amount} {selectedApplication.proposedRate.currency}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{selectedApplication.proposedRate.type}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Application Status</p>
                    <Badge className={`${statusColors[selectedApplication.status]} border text-sm px-3 py-1`}>
                      {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Applied</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDistanceToNow(new Date(selectedApplication.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Cover Letter
                </h4>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {selectedApplication.coverLetter}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => window.location.href = `mailto:${selectedApplication.applicant?.email}`}
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </Button>
                <Button 
                  className="flex-1 gap-2"
                  onClick={() => setSelectedApplication(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Icon helper
function UsersIcon({ className }: { className?: string }) {
   return (
      <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
   );
}
