"use client";

import { useState, useEffect, useCallback } from "react";
// We can reuse the filter component if desired, or simpler version
import { JobFilters, FilterState } from "@/components/jobs/JobFilters";
import { JobCard } from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Loader2 } from "lucide-react";
import api from "@/lib/axios";

// Mock data for initial display if API fails (Development fallback)
// Filtered mainly for freelance where possible, but this is backup
const MOCK_JOBS = [
   {
    _id: "3",
    title: "UI/UX Designer",
    companyName: "Creative Studio",
    type: "freelance",
    category: "ui-ux-design",
    experienceLevel: "senior",
    location: { type: "remote", country: "Global" },
    budget: { min: 2000, max: 5000, currency: "USD", type: "project" },
    skillsRequired: ["Figma", "Adobe XD", "Prototyping"],
    createdAt: "2023-11-14T09:00:00.000Z",
  }
];

export default function FreelanceJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const fetchJobs = useCallback(async (filters?: FilterState) => {
    setLoading(true);
    try {
      // Always using /jobs/search for consistency when handling this page logic, 
      // or at least when filters are involved. 
      // Initial load was using /jobs params type=freelance.
      // But user wants to use the search API for filters.
      // So we can use /jobs/search for everything here too.
      
      const params: any = { type: "freelance" }; // Force freelance type

      if (filters) {
          if (filters.keyword) params.keyword = filters.keyword;
          if (filters.category.length) params.category = filters.category.join(",");
          if (filters.experienceLevel.length) params.experienceLevel = filters.experienceLevel.join(",");
          if (filters.locationType.length) params.locationType = filters.locationType.join(",");
          if (filters.minBudget) params.minBudget = filters.minBudget;
          if (filters.maxBudget) params.maxBudget = filters.maxBudget;
          if (filters.skills) params.skills = filters.skills;
          // filters.type is ignored here since we enforce freelance
      }

      console.log("Fetching freelance jobs with params:", params);
      const response = await api.get("/jobs/search", { params });
      
      if (response.data.success) {
        setJobs(response.data.data.jobs); 
      } else {
           setJobs(MOCK_JOBS); // Fallback
      }
    } catch (error) {
      console.error("Failed to fetch freelance jobs:", error);
      setJobs(MOCK_JOBS); // Fallback for demo
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
             <div className="p-4 rounded-lg border border-border/50 bg-white/30 dark:bg-black/30 backdrop-blur-md max-h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <JobFilters hideJobType={true} onApplyFilters={fetchJobs} />
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold">Freelance Projects</h1>
                <p className="text-muted-foreground mt-1">Find the best freelance opportunities.</p>
            </div>
            
            {/* Mobile Filter Button */}
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="py-4">
                  <JobFilters hideJobType={true} onApplyFilters={(filters) => { fetchJobs(filters); setIsMobileFiltersOpen(false); }} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
              {jobs.length === 0 && (
                  <div className="text-center py-20 bg-muted/20 rounded-lg">
                      <p className="text-lg text-muted-foreground">No freelance opportunities found at the moment.</p>
                  </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
