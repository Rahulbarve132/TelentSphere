"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Settings,
  Briefcase,
  FileText,
  MessageSquare,
  PlusCircle,
  Menu,
  LogOut,
  Megaphone,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useState } from "react";

const developerItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Applications",
    href: "/dashboard/applications",
    icon: FileText,
  },
  {
    title: "Find Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const clientItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Post a Job",
    href: "/dashboard/post-job",
    icon: PlusCircle,
  },
  {
    title: "My Jobs",
    href: "/dashboard/jobs",
    icon: Briefcase,
  },
  {
    title: "Company Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const adminItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Broadcast",
    href: "/dashboard/admin/broadcast",
    icon: Megaphone,
  },
  {
    title: "Jobs Management",
    href: "/dashboard/jobs",
    icon: Briefcase,
  },
   {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

function SidebarContent({ mobile = false, setOpen }: { mobile?: boolean, setOpen?: (open: boolean) => void }) {
    const pathname = usePathname();
    const { logout, user } = useAuth();
    
    let sidebarItems = clientItems;
    if (user?.role === 'developer') {
        sidebarItems = developerItems;
    } else if (user?.role === 'admin') {
        sidebarItems = adminItems;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-6">
                <Link href="/" className="block">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    TalentSphere
                    </h2>
                </Link>
                <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                         {user?.role === 'developer' ? 'Dashboard' : (user?.role === 'admin' ? 'Admin Panel' : 'Business')}
                    </span>
                    {/* Role Badge if needed */}
                </div>
            </div>
            
            <div className="flex-1 px-4 space-y-2 overflow-y-auto">
                {sidebarItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => mobile && setOpen?.(false)}>
                    <span
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        pathname === item.href
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    >
                    <item.icon className="w-5 h-5" />
                    {item.title}
                    </span>
                </Link>
                ))}
            </div>

            <div className="p-4 border-t border-border/40 mt-auto">
                <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-3"
                onClick={() => {
                    logout();
                    if (mobile) setOpen?.(false);
                }}
                >
                <LogOut className="w-5 h-5" />
                Logout
                </Button>
            </div>
        </div>
    );
}

export function DashboardSidebar() {
  return (
    <div className="hidden lg:flex flex-col w-64 border-r border-border/40 bg-card/30 backdrop-blur-sm h-screen sticky top-0">
       <SidebarContent />
    </div>
  );
}

export function MobileDashboardSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
                <SheetTitle className="sr-only">Dashboard Menu</SheetTitle>
                <SheetDescription className="sr-only">Navigation for dashboard</SheetDescription>
                <SidebarContent mobile setOpen={setOpen} />
            </SheetContent>
        </Sheet>
    );
}
