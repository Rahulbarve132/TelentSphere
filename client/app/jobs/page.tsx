"use client";

import { useState, useEffect, useCallback } from "react";
import { JobFilters, FilterState } from "@/components/jobs/JobFilters";
import { JobCard } from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

// Mock data for initial display if API fails (Development fallback)
const MOCK_JOBS = [
  {
    _id: "1",
    title: "Senior React Developer",
    companyName: "TechCorp Inc.",
    type: "full-time",
    category: "web-development",
    experienceLevel: "senior",
    location: { type: "remote", country: "USA" },
    budget: { min: 80000, max: 120000, currency: "USD", type: "annual" },
    skillsRequired: ["React", "TypeScript", "Next.js", "TailwindCSS"],
    createdAt: "2023-11-16T12:00:00.000Z",
  },
  {
    _id: "2",
    title: "Backend Engineer (Node.js)",
    companyName: "StartupX",
    type: "contract",
    category: "web-development",
    experienceLevel: "mid",
    location: { type: "hybrid", country: "UK", city: "London" },
    budget: { min: 50, max: 80, currency: "GBP", type: "hourly" },
    skillsRequired: ["Node.js", "Express", "MongoDB", "Redis"],
    createdAt: "2023-11-15T10:00:00.000Z",
  },
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

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const fetchJobs = useCallback(async (filters?: FilterState) => {
    setLoading(true);
    try {
      let endpoint = "/jobs";
      const params: any = {};

      if (filters) {
          endpoint = "/jobs/search";
          if (filters.keyword) params.keyword = filters.keyword;
          if (filters.category.length) params.category = filters.category.join(",");
          if (filters.type.length) params.type = filters.type.join(",");
          if (filters.experienceLevel.length) params.experienceLevel = filters.experienceLevel.join(",");
          if (filters.locationType.length) params.locationType = filters.locationType.join(",");
          if (filters.minBudget) params.minBudget = filters.minBudget;
          if (filters.maxBudget) params.maxBudget = filters.maxBudget;
          if (filters.skills) params.skills = filters.skills;
      }

      console.log("Fetching jobs with params:", params); // Debug log
      const response = await api.get(endpoint, { params });
      
      if (response.data.success) {
        // Filter out freelance jobs client-side to ensure they don't show up here
        const filteredJobs = response.data.data.jobs.filter((job: any) => job.type !== 'freelance');
        setJobs(filteredJobs); 
      } else {
           setJobs(MOCK_JOBS.filter(job => job.type !== 'freelance')); // Fallback and filter mock data too
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      // toast.error("Failed to load jobs. Using demo data.");
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
                <JobFilters excludedTypes={['Freelance']} onApplyFilters={fetchJobs} />
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Latest Opportunities</h1>
            
            {/* Mobile Filter Button */}
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="py-4">
                  <JobFilters excludedTypes={['Freelance']} onApplyFilters={(filters) => { fetchJobs(filters); setIsMobileFiltersOpen(false); }} />
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
                      <p className="text-lg text-muted-foreground">No jobs found matching your criteria.</p>
                  </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
