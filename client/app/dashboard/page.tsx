"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Briefcase, FileText, Eye, TrendingUp, ArrowRight, Activity, Users, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Developer/Client specific state
  const [activities, setActivities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]); 
  const [jobs, setJobs] = useState<any[]>([]); 

  // Admin specific state
  const [adminData, setAdminData] = useState<{
    stats: { totalUsers: number; totalJobs: number; totalApplications: number };
    usersByRole: { _id: string; count: number }[];
    applicationsByStatus: { _id: string; count: number }[];
    jobsByStatus: { _id: string; count: number }[];
    recentUsers: any[];
    recentJobs: any[];
  } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (user?.role === 'admin') {
           // Updated endpoint for admin dashboard
           const response = await api.get('/admin/dashboard');
           if (response.data.success) {
             const data = response.data.data;
             setAdminData(data); // Store the full data object

             // Map the stats for the top cards
             setStats([
                {
                  title: "Total Users",
                  value: String(data.stats.totalUsers),
                  icon: Users,
                  trend: "Registered users",
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                },
                {
                  title: "Total Jobs",
                  value: String(data.stats.totalJobs),
                  icon: Briefcase,
                  trend: "Posted jobs",
                  color: "text-green-500",
                  bg: "bg-green-500/10",
                },
                {
                  title: "Total Applications",
                  value: String(data.stats.totalApplications),
                  icon: FileText,
                  trend: "Submitted applications",
                  color: "text-orange-500",
                  bg: "bg-orange-500/10",
                },
             ]);
           }
        } 
        else if (user?.role === 'talent') {
            // Fetch talent stats (User Applications)
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
             const myJobs = Array.isArray(jobsResponse.data.data) ? jobsResponse.data.data : [];
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8 p-1">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName || "User"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
             {user?.role === 'talent' 
                ? "Here's what's happening with your job search today." 
                : user?.role === 'admin' 
                ? "Here is the system overview and latest statistics."
                : "Overview of your hiring pipeline and job performance."}
          </p>
        </div>
        {user?.role === 'talent' ? (
           <Link href="/jobs">
              <Button className="rounded-full shadow-lg shadow-primary/20">
              Find New Jobs <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
           </Link>
        ) : user?.role === 'admin' ? null : (
           <Link href="/dashboard/post-job">
              <Button className="rounded-full shadow-lg shadow-primary/20">
              Post a Job <PlusCircle className="ml-2 w-4 h-4" />
              </Button>
           </Link>
        )}
      </div>

      {/* Stats Grid */}
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
            Array(loading ? (user?.role === 'admin' ? 3 : 4) : 0).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse border-border/50 bg-card/50">
                    <CardHeader className="pb-2"><div className="h-4 bg-muted rounded w-1/2"></div></CardHeader>
                    <CardContent><div className="h-8 bg-muted rounded w-full mb-2"></div><div className="h-3 bg-muted rounded w-1/3"></div></CardContent>
                </Card>
            ))
        )}
      </div>

      {/* ADMIN DASHBOARD CONTENT */}
      {user?.role === 'admin' && adminData && (
        <div className="space-y-8">
            
            {/* Breakdowns Row */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Users by Role</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {adminData.usersByRole.map((role) => (
                           <div key={role._id} className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                   <div className={`p-1.5 rounded-md ${
                                       role._id === 'talent' ? 'bg-blue-500/10 text-blue-500' :
                                       role._id === 'client' ? 'bg-purple-500/10 text-purple-500' :
                                       'bg-orange-500/10 text-orange-500' // admin/other
                                   }`}>
                                       {role._id === 'talent' ? <Code2Icon /> : 
                                        role._id === 'client' ? <BriefcaseIcon /> : <ShieldCheckIcon />}
                                   </div>
                                   <span className="capitalize font-medium">{role._id}</span>
                               </div>
                               <span className="font-bold">{role.count}</span>
                           </div>
                       ))}
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Job Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {adminData.jobsByStatus.map((status) => (
                           <div key={status._id} className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 rounded-full bg-primary" />
                                   <span className="capitalize text-muted-foreground">{status._id}</span>
                               </div>
                               <Badge variant="secondary">{status.count}</Badge>
                           </div>
                       ))}
                       {adminData.jobsByStatus.length === 0 && <p className="text-sm text-muted-foreground">No jobs found.</p>}
                    </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Applications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {adminData.applicationsByStatus.map((status) => (
                           <div key={status._id} className="flex items-center justify-between">
                               <span className="capitalize text-sm font-medium">{status._id}</span>
                               <span className="font-bold">{status.count}</span>
                           </div>
                       ))}
                         {adminData.applicationsByStatus.length === 0 && <p className="text-sm text-muted-foreground">No applications found.</p>}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Users & Jobs */}
            <div className="grid gap-8 md:grid-cols-2">
                
                {/* Recent Users */}
                <Card className="border-border/50 bg-card/50">
                    <CardHeader >
                        <CardTitle>Recent Users</CardTitle>
                        <CardDescription>Newest users registered on the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                           {adminData.recentUsers.map((u) => (
                               <div key={u._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                   <div className="flex items-center gap-3">
                                       <Avatar className="h-9 w-9">
                                           <AvatarFallback>{u.email[0].toUpperCase()}</AvatarFallback>
                                       </Avatar>
                                       <div className="grid gap-0.5">
                                           <p className="text-sm font-medium leading-none">{u.email}</p>
                                           <p className="text-xs text-muted-foreground capitalize">{u.role}</p>
                                       </div>
                                   </div>
                                   <div className="text-right">
                                       <p className="text-xs text-muted-foreground">{formatDate(u.createdAt)}</p>
                                   </div>
                               </div>
                           ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Jobs */}
                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle>Recent Jobs</CardTitle>
                        <CardDescription>Latest jobs posted by clients</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                           {adminData.recentJobs.map((job) => (
                               <div key={job._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                   <div className="grid gap-1">
                                       <p className="text-sm font-medium leading-none line-clamp-1">{job.title}</p>
                                       <div className="flex items-center gap-2">
                                           <Badge variant="outline" className="text-[10px] py-0 h-5 lowercase">{job.type}</Badge>
                                           <span className="text-xs text-muted-foreground">
                                                {job.budget?.type === 'fixed' 
                                                    ? `${job.budget.currency} ${job.budget.min}` 
                                                    : `${job.budget.currency} ${job.budget.min}-${job.budget.max}`}
                                           </span>
                                       </div>
                                   </div>
                                   <div className="flex flex-col items-end gap-1">
                                        <Badge variant={job.status === 'open' ? 'default' : 'secondary'} className="text-[10px] h-5 capitalize">
                                            {job.status}
                                        </Badge>
                                        <span className="text-[10px] text-muted-foreground">{formatDate(job.createdAt)}</span>
                                   </div>
                               </div>
                           ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
      )}


      {/* ROLE-SPECIFIC CONTENT (Developer/Client) - Same as before but wrapped to hide if Admin */}
      {user?.role !== 'admin' && (
      <div className="grid md:grid-cols-7 gap-8">
        
        {/* TALENT DASHBOARD CONTENT */}
        {user?.role === 'talent' && (
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
      </div>
      )}
    </div>
  );
}

// Icon components helper for inline usage if simple
const Code2Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
)

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
)

const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
)
