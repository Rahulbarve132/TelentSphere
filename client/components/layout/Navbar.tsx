"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, Briefcase, FileText, UserPlus, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const routes = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Jobs" },
    { href: "/freelance", label: "Freelance" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 bg-background/80 backdrop-blur-xl shadow-sm transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-primary/25 transition-all">
                T
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-tight">
                TalentSphere
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
            <div className="flex items-center space-x-1 bg-muted/40 p-1 rounded-full border border-border/40 backdrop-blur-sm">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    pathname === route.href
                      ? "bg-white dark:bg-black text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border/50 hover:bg-muted/50 transition-colors">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">{user?.firstName?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">Dashboard</Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Log in
                  </Button>
                </Link>
                
                <div className="h-6 w-px bg-border/60 mx-1" />

                <Link href="/register?role=recruiter">
                  <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all gap-1.5 text-[11px]">
                    <Briefcase className="w-3 h-3" />
                    <span className="whitespace-nowrap">Post Free Job</span>
                  </Button>
                </Link>
                <Link href="/register?role=client">
                  <Button variant="outline" size="sm" className="border-purple-500/20 hover:bg-purple-500/5 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-500/50 transition-all gap-1.5 text-[11px]">
                     <FileText className="w-3 h-3" />
                    <span className="whitespace-nowrap">Post Free Project</span>
                  </Button>
                </Link>
                <Link href="/register?role=talent">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-all shadow-md shadow-primary/20 gap-1.5 text-[11px]">
                    <UserPlus className="w-3 h-3" />
                    <span className="whitespace-nowrap">Create Talent Account</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Open menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-2xl animate-in slide-in-from-top-2">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "block px-4 py-3 rounded-xl text-base font-medium transition-all",
                  pathname === route.href
                    ? "text-primary bg-primary/10 border border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            
            <div className="h-px bg-border/50 my-4" />

            <div className="space-y-3">
              {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm text-foreground font-medium">
                            {user?.firstName} {user?.lastName}
                        </div>
                    </div>
                     <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start h-12 rounded-xl">Dashboard</Button>
                    </Link>
                     <Button variant="ghost" className="w-full justify-start text-destructive h-12 rounded-xl" onClick={() => { logout(); setIsOpen(false); }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                     </Button>
                  </>
              ) : (
                  <div className="flex flex-col gap-3">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full h-12 rounded-xl justify-start gap-3 text-base">
                          <LogIn className="w-4 h-4" /> Log in
                        </Button>
                      </Link>
                      <Link href="/register?role=recruiter" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full h-12 rounded-xl justify-start gap-3 border-primary/20 text-base">
                             <Briefcase className="w-4 h-4 text-primary" /> Post Free Job
                        </Button>
                      </Link>
                      <Link href="/register?role=client" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full h-12 rounded-xl justify-start gap-3 border-purple-500/20 text-base">
                             <FileText className="w-4 h-4 text-purple-500" /> Post Free Project Requirement
                        </Button>
                      </Link>
                      <Link href="/register?role=talent" onClick={() => setIsOpen(false)}>
                        <Button className="w-full h-12 rounded-xl justify-start gap-3 bg-gradient-to-r from-primary to-blue-600 text-base shadow-lg">
                            <UserPlus className="w-4 h-4" /> Create Free Talent Account
                        </Button>
                      </Link>
                  </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
