"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone, Send, Loader2, Link as LinkIcon, Users, ShieldAlert, BarChart3, History, Mail, Calendar } from "lucide-react";
import { adminService, BroadcastData, BroadcastStats } from "@/services/adminService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function BroadcastPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState<BroadcastStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<BroadcastData>({
    defaultValues: {
      role: 'all'
    }
  });

  const fetchStats = async () => {
    try {
        const response = await adminService.getBroadcastStats();
        if (response.success) {
            setStats(response.data);
        }
    } catch (error) {
        console.error("Failed to fetch broadcast stats:", error);
    } finally {
        setLoadingStats(false);
    }
  };

  useEffect(() => {
      if (user?.role === 'admin') {
          fetchStats();
      }
  }, [user]);

  // Redirect if not admin
  if (!authLoading && user?.role !== 'admin') {
     return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <ShieldAlert className="w-16 h-16 text-destructive opacity-50" />
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
            <Button onClick={() => router.push('/dashboard')}>Go Back to Dashboard</Button>
        </div>
     );
  }

  const onSubmit = async (data: BroadcastData) => {
    setIsSubmitting(true);
    try {
        const response = await adminService.sendBroadcast(data);
        if (response.success) {
            toast.success("Broadcast sent successfully!");
            reset();
            fetchStats(); // Refresh stats
        }
    } catch (error: any) {
        console.error("Broadcast error:", error);
        toast.error(error.response?.data?.message || "Failed to send broadcast");
    } finally {
        setIsSubmitting(false);
    }
  };

  const selectedRole = watch("role");

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Megaphone className="w-8 h-8 text-primary" />
            Broadcast Center
        </h1>
        <p className="text-muted-foreground">
            Manage system-wide notifications and view broadcast history.
        </p>
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="stats">Overview & Stats</TabsTrigger>
          <TabsTrigger value="compose">Send Broadcast</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Broadcasts</CardTitle>
                        <Megaphone className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        {loadingStats ? (
                             <Skeleton className="h-8 w-20" />
                        ) : (
                            <div className="text-2xl font-bold">{stats?.totalBroadcasts || 0}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Lifetime total sent</p>
                    </CardContent>
                </Card>
                <Card className="bg-secondary/5 border-secondary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
                        <Users className="h-4 w-4 text-secondary-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loadingStats ? (
                             <Skeleton className="h-8 w-20" />
                        ) : (
                            <div className="text-2xl font-bold">{stats?.totalRecipients?.toLocaleString() || 0}</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Users reached</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Broadcast History</h2>
                </div>
                
                {loadingStats ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-xl" />
                        ))}
                    </div>
                ) : stats?.history?.length === 0 ? (
                    <Card className="p-8 text-center text-muted-foreground border-dashed">
                        No broadcasts sent yet.
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {stats?.history.map((item, index) => (
                            <Card key={index} className="overflow-hidden hover:bg-muted/30 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-lg">{item.title}</h3>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(item.sentAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full w-fit">
                                            <Mail className="w-3 h-3" />
                                            <span className="text-sm font-medium">{item.recipients} Recipients</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </TabsContent>

        <TabsContent value="compose" className="mt-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader>
                <CardTitle>Compose Message</CardTitle>
                <CardDescription>
                    This message will be delivered to users' notification centers instantly.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Notification Title *</Label>
                            <Input 
                                id="title" 
                                placeholder="e.g. System Maintenance Update" 
                                {...register("title", { required: "Title is required" })}
                            />
                            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="role">Target Audience</Label>
                                <Select 
                                    onValueChange={(value) => setValue("role", value as any)} 
                                    defaultValue="all"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select audience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                All Users
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="client">Clients Only</SelectItem>
                                        <SelectItem value="developer">Developers Only</SelectItem>
                                        <SelectItem value="recruiter">Recruiters Only</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    {selectedRole === 'all' 
                                        ? "Message will be sent to every active user on the platform." 
                                        : `Message will only be sent to users with the ${selectedRole} role.`}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="link">Action Link (Optional)</Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="link" 
                                        className="pl-9"
                                        placeholder="/dashboard/jobs" 
                                        {...register("link")}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Where should users go when they click?</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message Content *</Label>
                            <Textarea 
                                id="message" 
                                placeholder="Type your message here..." 
                                className="min-h-[150px] resize-none"
                                {...register("message", { required: "Message content is required" })}
                            />
                            {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto gap-2">
                                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                                Send Broadcast
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
