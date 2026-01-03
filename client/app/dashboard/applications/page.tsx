"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  DollarSign,
  Clock,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";

interface Job {
  _id: string;
  title: string;
  type: string;
  category: string;
  status: "open" | "closed" | "draft";
}

interface Application {
  _id: string;
  job: Job;
  status: "pending" | "shortlisted" | "rejected" | "hired" | "withdrawn" | "interview";
  proposedRate: {
    amount: number;
    type: "hourly" | "fixed";
    currency: string;
  };
  availability: {
    startDate: string;
    hoursPerWeek: number;
  };
  coverLetter: string;
  createdAt: string;
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // To check role if needed

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/applications/my-applications");
        if (response.data.success) {
          setApplications(response.data.data.applications);
        } else {
          setError("Failed to fetch applications.");
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load your applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "shortlisted":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "interview":
        return "bg-purple-500/10 text-purple-600 border-purple-200";
      case "hired":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "rejected":
        return "bg-red-500/10 text-red-600 border-red-200";
      case "withdrawn":
        return "bg-gray-500/10 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
       case "hired": return <CheckCircle2 className="w-4 h-4 mr-1" />;
       case "rejected": 
       case "withdrawn": return <XCircle className="w-4 h-4 mr-1" />;
       case "pending": return <Clock className="w-4 h-4 mr-1" />;
       default: return <AlertCircle className="w-4 h-4 mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-6 w-20" />
            </CardHeader>
            <CardContent>
               <Skeleton className="h-4 w-full mb-2" />
               <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (user?.role === 'client' || user?.role === 'recruiter') {
      return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8">
              <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
              <p className="text-muted-foreground max-w-md">
                  We're sorry, this page is only available for job seekers. As a {user?.role}, you can manage your posted jobs in the "My Jobs" section.
              </p>
              <Link href="/dashboard/jobs">
                  <Button className="mt-6">Go to My Jobs</Button>
              </Link>
          </div>
      )
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground mt-1">
          Track the status of your job applications.
        </p>
      </div>

      {error ? (
        <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200">
          {error}
        </div>
      ) : applications.length === 0 ? (
        <Card className="border-dashed border-2 p-12 flex flex-col items-center justify-center text-center bg-muted/20">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold">No applications yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
                You haven't applied to any jobs yet. Start searching for your dream role today!
            </p>
            <Link href="/jobs">
                <Button className="mt-6">Find Jobs</Button>
            </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <Card key={app._id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex flex-col md:flex-row gap-6 p-6">
                
                {/* Main Info */}
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                             <Badge variant="outline" className="mb-2 uppercase text-[10px] tracking-wider">
                                {app.job.type}
                             </Badge>
                             <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                <Link href={`/jobs/${app.job._id}`}>{app.job.title}</Link>
                             </h3>
                        </div>
                        <Badge className={`${getStatusColor(app.status)} px-3 py-1 flex items-center capitalize`}>
                            {getStatusIcon(app.status)} {app.status}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-muted-foreground mt-4">
                         <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1.5 text-primary/70" />
                            <span>
                                {app.proposedRate.currency} {app.proposedRate.amount} / {app.proposedRate.type}
                            </span>
                         </div>
                         <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5 text-primary/70" />
                            <span>Availability: {formatDistanceToNow(new Date(app.availability.startDate), { addSuffix: true })}</span>
                         </div>
                         <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1.5 text-primary/70" />
                            <span>Applied {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</span>
                         </div>
                    </div>
                </div>

                {/* Actions (if any) */}
                <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6">
                     <Link href={`/jobs/${app.job._id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                            View Job
                        </Button>
                     </Link>
                     <Button variant="ghost" size="sm" className="w-full">
                        <MoreHorizontal className="w-4 h-4" />
                     </Button>
                </div>

              </div>
              
              {/* Optional: Show status history or feedback if available */}
             {app.status === 'withdrawn' && (
                 <div className="bg-muted/30 px-6 py-2 border-t border-border/50 text-xs text-muted-foreground flex items-center">
                     <AlertCircle className="w-3 h-3 mr-2" />
                     You withdrew this application.
                 </div>
             )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
