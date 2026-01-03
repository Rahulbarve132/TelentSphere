"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock, DollarSign, Calendar, Globe, Briefcase, CheckCircle2, Loader2, Send, AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data as fallback
const MOCK_JOB_DETAILS = {
  _id: "1",
  title: "Job Position Not Found",
  companyName: "Demo Company",
  type: "full-time",
  category: "other",
  experienceLevel: "entry",
  location: { type: "remote", country: "USA" },
  budget: { min: 0, max: 0, currency: "USD", type: "annual" },
  skillsRequired: [],
  description: "<p>The job details could not be loaded or the job does not exist.</p>",
  postedBy: {
    _id: "u1",
    email: "demo@example.com",
    profile: {
        firstName: "Demo",
        lastName: "User"
    }
  },
  createdAt: new Date().toISOString(),
};

interface ApplicationForm {
    coverLetter: string;
    proposedRate: string;
    rateType: 'hourly' | 'fixed' | 'monthly';
    currency: string;
    startDate: string;
    hoursPerWeek: string;
}

export default function JobDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useAuth();
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<ApplicationForm>({
      coverLetter: "",
      proposedRate: "",
      rateType: "hourly",
      currency: "USD",
      startDate: "",
      hoursPerWeek: "40"
  });

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching job details for id: ${id}`);
        const response = await api.get(`/jobs/${id}`);
        console.log("Job response:", response.data);
        
        if (response.data.success && response.data.data) {
           // Handle structure variations if necessary
           const jobData = response.data.data.job || response.data.data;
           setJob(jobData);
        } else {
           throw new Error("Job data not found in response");
        }
      } catch (err: any) {
        console.error("Failed to fetch job:", err);
        setError(err.message || "Failed to load job details");
        // Don't set mock data automatically on error to avoid confusion, 
        // unless it's a specific 'not found' that we want to handle gracefully.
        // For now, let's show the error state.
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchJob();
    }
  }, [id]);

  const handleApplyClick = () => {
      if (!user) {
          toast.error("You must be logged in to apply");
          // Use window.location.pathname to get current path for redirect
          router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
          return;
      }
      if (user.role !== 'developer') {
          toast.error("Only developers can apply for jobs");
          return;
      }
      setIsApplyOpen(true);
  };

  const handleSubmitApplication = async () => {
      if (!formData.coverLetter || !formData.proposedRate || !formData.startDate) {
          toast.error("Please fill in all required fields");
          return;
      }

      setIsSubmitting(true);
      try {
          const payload = {
              jobId: id,
              coverLetter: formData.coverLetter,
              proposedRate: {
                  amount: Number(formData.proposedRate),
                  type: formData.rateType,
                  currency: formData.currency
              },
              availability: {
                  startDate: formData.startDate,
                  hoursPerWeek: Number(formData.hoursPerWeek)
              }
          };
          
          const response = await api.post('/applications', payload);
          if (response.data.success) {
              toast.success("Application submitted successfully!");
              setIsApplyOpen(false);
              setFormData({
                coverLetter: "",
                proposedRate: "",
                rateType: "hourly",
                currency: "USD",
                startDate: "",
                hoursPerWeek: "40"
              });
          }
      } catch (error: any) {
          console.error("Application error:", error);
          toast.error(error.response?.data?.message || "Failed to submit application");
      } finally {
          setIsSubmitting(false);
      }
  };

  if (loading) {
    return (
        <div className="container max-w-5xl mx-auto px-4 py-8 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                     <Skeleton className="h-64 w-full" />
                </div>
                <div className="space-y-4">
                     <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    )
  }

  if (error || !job) {
      return (
          <div className="container max-w-xl mx-auto px-4 py-20 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold">Job Not Found</h1>
              <p className="text-muted-foreground">{error || "The job you are looking for does not exist or has been removed."}</p>
              <Button onClick={() => router.push('/jobs')} variant="outline">Browse Jobs</Button>
          </div>
      );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Link href="/jobs" className="text-sm text-muted-foreground hover:text-primary mb-4 block">
                &larr; Back to Jobs
            </Link>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{job.title || "Untitled Job"}</h1>
                    <div className="flex items-center text-muted-foreground space-x-4">
                        <span className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1"/> 
                            {job.companyName || "Confidential"}
                        </span>
                        {job.location && (
                             <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1"/> 
                                {job.location.type}
                             </span>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
                 {job.type && <Badge variant="secondary" className="px-3 py-1">{job.type}</Badge>}
                 {job.experienceLevel && <Badge variant="secondary" className="px-3 py-1">{job.experienceLevel}</Badge>}
                 {job.category && <Badge variant="outline" className="px-3 py-1 text-primary border-primary/30">{job.category}</Badge>}
            </div>
          </div>

          {/* Description */}
          <Card className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
                <div 
                    className="prose dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: job.description || "No description provided." }} 
                />
            </CardContent>
          </Card>

          {/* Requirements/Skills */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <Card className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-border/50">
                <CardHeader>
                    <CardTitle>Skills & Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {job.skillsRequired.map((skill: string) => (
                            <div key={skill} className="flex items-center bg-background/50 px-3 py-2 rounded-lg border border-border">
                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                <span>{skill}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
            <Card className="sticky top-24 border-primary/20 bg-primary/5 dark:bg-primary/10 overflow-hidden">
                <div className="absolute top-0 right-0 p-20 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <CardHeader>
                    <CardTitle className="text-xl">Job Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                    {job.budget && (
                        <div className="flex items-start">
                            <DollarSign className="w-5 h-5 mr-3 text-primary mt-0.5" />
                            <div>
                                <p className="font-medium">Budget / Salary</p>
                                <p className="text-sm text-muted-foreground">
                                    {job.budget.currency || "$"} {job.budget.min?.toLocaleString() || 0} - {job.budget.max?.toLocaleString() || 0}
                                    {job.budget.type && <span className="text-xs ml-1 capitalize">({job.budget.type})</span>}
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {job.createdAt && (
                        <div className="flex items-start">
                            <Calendar className="w-5 h-5 mr-3 text-primary mt-0.5" />
                            <div>
                                <p className="font-medium">Date Posted</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    )}

                    {job.location && (
                        <div className="flex items-start">
                            <Globe className="w-5 h-5 mr-3 text-primary mt-0.5" />
                            <div>
                                <p className="font-medium">Location</p>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {job.location.type} {job.location.country && `- ${job.location.country}`}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <Button 
                            className="w-full text-lg h-12 shadow-lg shadow-primary/20 group"
                            onClick={handleApplyClick}
                        >
                            <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                            Apply Now
                        </Button>
                        {!user ? (
                            <p className="text-xs text-center text-muted-foreground mt-3">
                                Please login as a Developer to apply
                            </p>
                        ) : user.role !== 'developer' && (
                             <p className="text-xs text-center text-destructive/80 mt-3">
                                Account type: {user.role}. Only developers can apply.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/30 dark:bg-black/20 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-base">About the Recruiter</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarFallback>{job.postedBy?.profile?.firstName?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="font-medium truncate">
                            {job.postedBy?.profile?.firstName || "Unknown"} {job.postedBy?.profile?.lastName || ""}
                        </p>
                        <p className="text-xs text-muted-foreground">Recruiter at {job.companyName || "Company"}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Application Modal */}
      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Submit your proposal and let the recruiter know why you're a good fit.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
              <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Textarea
                     id="coverLetter"
                     placeholder="Introduce yourself and explain why you're perfect for this role..."
                     className="min-h-[150px]"
                     value={formData.coverLetter}
                     onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                       <Label>Proposed Rate</Label>
                       <div className="flex gap-2">
                           <Input 
                               type="number" 
                               placeholder="Amount" 
                               value={formData.proposedRate}
                               onChange={(e) => setFormData({...formData, proposedRate: e.target.value})}
                           />
                           <Select 
                                value={formData.currency} 
                                onValueChange={(val) => setFormData({...formData, currency: val})}
                           >
                               <SelectTrigger className="w-[100px]">
                                   <SelectValue placeholder="Currency" />
                               </SelectTrigger>
                               <SelectContent>
                                   <SelectItem value="USD">USD</SelectItem>
                                   <SelectItem value="EUR">EUR</SelectItem>
                                   <SelectItem value="GBP">GBP</SelectItem>
                                   <SelectItem value="INR">INR</SelectItem>
                               </SelectContent>
                           </Select>
                       </div>
                  </div>

                  <div className="space-y-2">
                      <Label>Rate Type</Label>
                      <Select 
                            value={formData.rateType} 
                            onValueChange={(val: any) => setFormData({...formData, rateType: val})}
                       >
                           <SelectTrigger>
                               <SelectValue placeholder="Select type" />
                           </SelectTrigger>
                           <SelectContent>
                               <SelectItem value="hourly">Hourly Rate</SelectItem>
                               <SelectItem value="fixed">Fixed Price</SelectItem>
                               <SelectItem value="monthly">Monthly Salary</SelectItem>
                           </SelectContent>
                       </Select>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="startDate">Ability to Start</Label>
                      <Input 
                          id="startDate" 
                          type="date" 
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="hours">Available Hours / Week</Label>
                      <Input 
                          id="hours" 
                          type="number" 
                          value={formData.hoursPerWeek}
                          onChange={(e) => setFormData({...formData, hoursPerWeek: e.target.value})}
                      />
                  </div>
              </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplyOpen(false)} disabled={isSubmitting}>
                Cancel
            </Button>
            <Button onClick={handleSubmitApplication} disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Application
                    </>
                )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
