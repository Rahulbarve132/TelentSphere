"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, FileText, Eye, TrendingUp, ArrowRight, Activity, Users, PlusCircle } from "lucide-react";
import Link from "next/link";
import { JobCard } from "@/components/jobs/JobCard"; // Assuming we reuse JobCard

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]); // For client
  const [jobs, setJobs] = useState<any[]>([]); // For client

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (user?.role === 'admin') {
           const response = await api.get('/admin/analytics');
           if (response.data.success) {
             const data = response.data.data;
             setStats([
                {
                  title: "Total Users",
                  value: String(data.last30Days.newUsers),
                  icon: Users,
                  trend: "+" + data.last30Days.newUsers + " this month",
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                },
                {
                  title: "New Jobs (30d)",
                  value: String(data.last30Days.newJobs),
                  icon: Briefcase,
                  trend: "Active this month",
                  color: "text-green-500",
                  bg: "bg-green-500/10",
                },
                {
                  title: "Applications (30d)",
                  value: String(data.last30Days.applications),
                  icon: FileText,
                  trend: "Processed this month",
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                },
                 {
                  title: "Job Categories",
                  value: String(data.jobsByCategory.length),
                  icon: Activity,
                  trend: "Active sectors",
                  color: "text-purple-500",
                  bg: "bg-purple-500/10",
                },
             ]);
             // Pass partial data for the chart if needed
             setActivities(data.jobsByCategory || []); 
           }
        } 
        else if (user?.role === 'developer') {
            // Fetch developer stats (User Applications)
            const appsResponse = await api.get('/applications/my-applications');
            const myApps = appsResponse.data.data?.applications || [];
            
            setStats([
                { title: "Applications Sent", value: String(myApps.length), icon: FileText, trend: "Total applied", color: "text-blue-500", bg: "bg-blue-500/10" },
                { title: "Profile Views", value: "0", icon: Eye, trend: "Coming soon", color: "text-purple-500", bg: "bg-purple-500/10" }, // Placeholder api
                { title: "Saved Jobs", value: "0", icon: Briefcase, trend: "Coming soon", color: "text-orange-500", bg: "bg-orange-500/10" },
                { title: "Interviews", value: myApps.filter((a: any) => a.status === 'interview').length.toString(), icon: TrendingUp, trend: "Scheduled", color: "text-green-500", bg: "bg-green-500/10" },
            ]);
            // Use recent applications as 'activity'
            setActivities(myApps.slice(0, 5));
        }
        else if (user?.role === 'client' || user?.role === 'recruiter') {
             // Fetch client stats (My Jobs)
             const jobsResponse = await api.get('/jobs/user/my-jobs');
             const myJobs = jobsResponse.data.data || [];
             setJobs(myJobs);

             const activeJobsCount = myJobs.filter((job: any) => job.status === 'active').length;
             const totalApplications = myJobs.reduce((acc: number, job: any) => acc + (job.applicants?.length || job.applicationCount || 0), 0);

             setStats([
                { title: "Active Jobs", value: String(activeJobsCount), icon: Briefcase, trend: "Posted jobs", color: "text-blue-500", bg: "bg-blue-500/10" },
                { title: "Total Applications", value: String(totalApplications), icon: FileText, trend: "Received", color: "text-green-500", bg: "bg-green-500/10" },
                { title: "Unread Messages", value: "0", icon: Users, trend: "Inbox", color: "text-orange-500", bg: "bg-orange-500/10" },
                { title: "Views", value: "0", icon: Activity, trend: "Total views", color: "text-purple-500", bg: "bg-purple-500/10" },
             ]);
        }
      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchDashboardData();
  }, [user]);



  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName || "User"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
             {user?.role === 'developer' 
                ? "Here's what's happening with your job search today." 
                : "Overview of your hiring pipeline and job performance."}
          </p>
        </div>
        {user?.role === 'developer' ? (
           <Link href="/jobs">
              <Button className="rounded-full shadow-lg shadow-primary/20">
              Find New Jobs <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
          </Link>
        ) : user?.role === 'admin' ? null : (
           <Link href="/dashboard/jobs/new">
              <Button className="rounded-full shadow-lg shadow-primary/20">
              Post a Job <PlusCircle className="ml-2 w-4 h-4" />
              </Button>
           </Link>
        )}
      </div>

      {/* Stats Grid - Using fetched 'stats' state */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.length > 0 ? stats.map((stat, index) => (
          <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        )) : (
            // Skeleton / Empty state for stats
            Array(4).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse border-border/50 bg-card/50">
                    <CardHeader className="pb-2"><div className="h-4 bg-muted rounded w-1/2"></div></CardHeader>
                    <CardContent><div className="h-8 bg-muted rounded w-full mb-2"></div><div className="h-3 bg-muted rounded w-1/3"></div></CardContent>
                </Card>
            ))
        )}
      </div>

      {/* Role-Specific Content */}
      <div className="grid md:grid-cols-7 gap-8">
        
        {/* DEVELOPER DASHBOARD CONTENT */}
        {user?.role === 'developer' && (
            <>
                {/* Recent Activity (using 'activities' state) */}
                <Card className="md:col-span-4 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                    {activities.length > 0 ? activities.map((app, i) => (
                        <div key={i} className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-full bg-blue-500/10 text-blue-500`}>
                            <FileText className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium leading-none">
                            Applied to {app.job?.title || "a job"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                             Status: {app.status}
                            </p>
                        </div>
                        </div>
                    )) : (
                        <p className="text-muted-foreground text-sm">No recent activity found. Start applying!</p>
                    )}
                    </div>
                </CardContent>
                </Card>

                {/* Profile Snapshot / Quick View */}
                <Card className="md:col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Profile Overview</CardTitle>
                    <Link href="/dashboard/profile">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary h-8 px-2">Edit</Button>
                    </Link>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                         <Avatar className="w-20 h-20 border-2 border-primary/20">
                            <AvatarImage src={user?.avatar || "/candidate_male.png"} />
                            <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-lg">{user?.firstName} {user?.lastName}</h3>
                            <p className="text-sm text-muted-foreground">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</p>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Email</span>
                            <span className="font-medium">{user?.email}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Location</span>
                            <span className="font-medium">Not set</span>
                        </div>
                    </div>
                </CardContent>
                </Card>

                {/* Profile Completion */}
                <Card className="md:col-span-4 border-border/50 bg-gradient-to-br from-primary/5 via-card/50 to-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Complete Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                        <span className="font-medium">Profile Strength</span>
                        <span className="text-primary">75%</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-3/4 rounded-full" />
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <p className="text-sm text-muted-foreground">Recommended actions:</p>
                        {[
                            { text: "Add your resume", done: true },
                            { text: "Add skills (at least 5)", done: false },
                            { text: "Complete bio section", done: false },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${item.done ? "bg-primary text-secondary-foreground border-primary" : "border-muted-foreground text-transparent"}`}>
                                    {item.done && <span className="text-[10px]">✓</span>}
                                </div>
                                <span className={`text-sm ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    <Link href="/dashboard/profile" className="block pt-4">
                        <Button variant="outline" className="w-full">
                            Update Profile
                        </Button>
                    </Link>
                    </div>
                </CardContent>
                </Card>
            </>
        )}

        {/* CLIENT / RECRUITER CONTENT */}
        {(user?.role === 'client' || user?.role === 'recruiter') && (
            <>
                 <Card className="md:col-span-4 border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Recent Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                            {applications.length > 0 ? applications.slice(0, 3).map((app, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border/50 relative group">
                                    <div className="flex gap-4 items-center">
                                       <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                         A 
                                       </div>
                                       <div>
                                           {/* Placeholder until we have populated fields */}
                                           <p className="font-semibold text-sm">Applicant Name</p> 
                                           <p className="text-xs text-muted-foreground">Applied for Job Name</p>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-medium px-2 py-1 rounded bg-secondary/10 text-secondary-foreground">{app.status}</span>
                                    </div>
                                    <ArrowRight className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 text-primary" />
                                </div>
                            )) : (
                                <p className="text-sm text-muted-foreground py-4 text-center">No recent applications.</p>
                            )}
                              <Button variant="ghost" className="w-full mt-2 text-primary hover:text-primary">
                                View All
                            </Button>
                        </div>
                    </CardContent>
                 </Card>

                 <Card className="md:col-span-3 border-border/50 bg-card/50 backdrop-blur-sm">
                     <CardHeader>
                         <CardTitle>Active Listings</CardTitle>
                     </CardHeader>
                     <CardContent>
                         <div className="space-y-4">
                             {/* Display recent jobs or placeholder if empty */}
                             {jobs.length > 0 ? jobs.slice(0, 3).map((job, i) => (
                                 <div key={i} className="p-3 rounded-lg border border-border/40 bg-background/50">
                                     <div className="flex justify-between items-start mb-2">
                                         <h4 className="font-semibold text-sm">{job.title}</h4>
                                         <span className={`text-[10px] px-1.5 py-0.5 rounded border border-green-500/20 text-green-600 bg-green-50`}>
                                             {job.status}
                                         </span>
                                     </div>
                                     <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                         <span>0 Views</span>
                                         <span>0 Applications</span>
                                     </div>
                                 </div>
                             )) : (
                                 <p className="text-sm text-muted-foreground text-center py-4">No active jobs found.</p>
                             )}
                             <Link href="/dashboard/jobs">
                                <Button variant="outline" className="w-full mt-2">Manage Jobs</Button>
                             </Link>
                         </div>
                     </CardContent>
                 </Card>
            </>
        )}

        {/* ADMIN CONTENT */}
        {user?.role === 'admin' && activities.length > 0 && (
            <Card className="md:col-span-4 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Jobs by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {activities.map((category: any, index: number) => {
                             // Assuming activities state holds job categories for Admin
                             const maxCount = Math.max(...activities.map((c: any) => c.count));
                             const percentage = (category.count / maxCount) * 100;

                             return (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium capitalize">{category._id.replace('-', ' ')}</span>
                                        <span className="text-muted-foreground">{category.count} jobs</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary/10 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary rounded-full transition-all duration-500" 
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
