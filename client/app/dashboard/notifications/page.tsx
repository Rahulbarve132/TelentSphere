"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Bell, Check, CheckCheck, Trash2, Inbox, Loader2, RefreshCw, ChevronLeft, ChevronRight, MailOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { notificationService, Notification, NotificationResponse } from "@/services/notificationService";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<NotificationResponse | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // isRead filter: 'unread' tab -> false, 'all' tab -> undefined
      const isRead = activeTab === "unread" ? false : undefined;
      const response = await notificationService.getAll(page, 10, isRead);
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [activeTab, page]);

  const handleMarkAsRead = async (id: string) => {
    setProcessingId(id);
    try {
      const response = await notificationService.markAsRead(id);
      if (response.success) {
        toast.success("Notification marked as read");
        // Update local state to reflect change without full refetch if possible, 
        // or just refetch. Refetching is safer for pagination consistency.
        fetchNotifications();
        // Also could update global unread count if we had a context for it
      }
    } catch (error) {
      toast.error("Failed to mark as read");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setProcessingId(id);
    try {
      const response = await notificationService.delete(id);
      if (response.success) {
        toast.success("Notification deleted");
        fetchNotifications();
      }
    } catch (error) {
      toast.error("Failed to delete notification");
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    setProcessingId("all");
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        toast.success("All notifications marked as read");
        fetchNotifications();
      }
    } catch (error) {
      toast.error("Failed to mark all as read");
    } finally {
      setProcessingId(null);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'application_status_changed':
        return <Inbox className="w-5 h-5 text-blue-500" />;
      case 'job_alert':
        return <Bell className="w-5 h-5 text-yellow-500" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="w-8 h-8 text-primary" />
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Stay updated with your latest activities and system alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
             <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMarkAllRead}
                disabled={processingId === "all" || !data?.unreadCount}
                className="hidden md:flex"
            >
                {processingId === "all" ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <CheckCheck className="w-4 h-4 mr-2" />
                )}
                Mark all as read
            </Button>
            <Button variant="ghost" size="icon" onClick={() => fetchNotifications()} disabled={loading}>
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={(val) => { setActiveTab(val); setPage(1); }} className="w-full">
        <div className="flex items-center justify-between">
            <TabsList>
                <TabsTrigger value="all" className="relative">
                    All
                </TabsTrigger>
                <TabsTrigger value="unread" className="relative">
                    Unread
                    {data?.unreadCount && data.unreadCount > 0 ? (
                         <Badge variant="destructive" className="ml-2 h-5 min-w-[1.25rem] px-1 text-[10px] leading-none">
                            {data.unreadCount}
                         </Badge>
                    ) : null}
                </TabsTrigger>
            </TabsList>
            
            <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMarkAllRead}
                disabled={processingId === "all" || !data?.unreadCount}
                className="md:hidden"
            >
                <CheckCheck className="w-4 h-4" />
            </Button>
        </div>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
            {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-card/50">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                ))
            ) : data?.notifications?.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 border rounded-lg border-dashed bg-muted/20">
                    <div className="p-4 rounded-full bg-muted">
                        <Inbox className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-lg">No notifications found</h3>
                        <p className="text-muted-foreground">
                            {activeTab === 'unread' 
                                ? "You're all caught up! No unread notifications." 
                                : "You haven't received any notifications yet."}
                        </p>
                    </div>
                    {activeTab === 'unread' && (
                        <Button variant="link" onClick={() => setActiveTab('all')}>
                            View all notifications
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid gap-3">
                    {data?.notifications.map((notification) => (
                        <Card 
                            key={notification._id} 
                            className={cn(
                                "transition-all duration-200 hover:bg-accent/50 group",
                                !notification.isRead ? "bg-primary/5 border-primary/20" : "bg-card/50"
                            )}
                        >
                            <CardContent className="p-4 flex gap-4 items-start">
                                <div className={cn(
                                    "p-2 rounded-full shrink-0",
                                    !notification.isRead ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                )}>
                                    {getIconForType(notification.type)}
                                </div>
                                
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className={cn("text-base font-medium leading-none truncate pr-4", !notification.isRead && "font-semibold text-primary")}>
                                            {notification.title}
                                        </p>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                                            {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {notification.message}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-1 items-end shrink-0 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
                                    {!notification.isRead && (
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-8 w-8 text-muted-foreground hover:text-primary" 
                                            title="Mark as read"
                                            onClick={() => handleMarkAsRead(notification._id)}
                                            disabled={processingId === notification._id}
                                        >
                                            <Check className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive" 
                                        title="Delete"
                                        onClick={() => handleDelete(notification._id)}
                                        disabled={processingId === notification._id}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {data?.pagination && data.pagination.pages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                        Page {page} of {data.pagination.pages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page <= 1 || loading}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                            disabled={page >= data.pagination.pages || loading}
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
