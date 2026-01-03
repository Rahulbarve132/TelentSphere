"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // I might need to add Badge component if not added yet. Wait, I didn't add Badge. I'll use simple span or add Badge later. I'll use simple span for now.
import Link from "next/link";
import { ArrowRight, CheckCircle2, Search, Briefcase } from "lucide-react";
import { JobCard } from "@/components/jobs/JobCard";
import { PremiumCandidates } from "@/components/home/PremiumCandidates";
import { Testimonials } from "@/components/home/Testimonials";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl mix-blend-multiply animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 backdrop-blur-sm border border-primary/20">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
            The #1 Platform for Top Talent
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary via-blue-600 to-secondary bg-clip-text text-transparent pb-2">
            Find Your Dream Job <br className="hidden md:block" />
            <span className="text-foreground">Build the Future.</span>
          </h1>
          
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Connect with top-tier companies and talented developers. 
            TalentSphere bridges the gap between ambition and opportunity.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/jobs">
              <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg hover:shadow-primary/25 transition-all">
                Find Jobs <Search className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full backdrop-blur-md bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 border-primary/20">
                Hire Talent <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Stats / Trust */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: "Active Jobs", value: "500+" },
              { label: "Companies", value: "120+" },
              { label: "Developers", value: "10k+" },
              { label: "Placements", value: "95%" },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Features Preview */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose TalentSphere?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the tools and connections you need to succeed in the modern tech landscape.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
             {[
               {
                 title: "Quality Matches",
                 desc: "Our AI-driven matching ensures you find the perfect fit for your skills or requirements.",
                 icon: CheckCircle2
               },
               {
                 title: "Verified Profiles",
                 desc: "All developer profiles are verified to ensure high-quality talent and trust.",
                 icon: Briefcase
               },
               {
                 title: "Smooth Process",
                 desc: "From application to offer, our platform streamlines the entire hiring workflow.",
                 icon: ArrowRight
               }
             ].map((feature, i) => (
               <div key={i} className="p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                 <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                   <feature.icon className="h-6 w-6" />
                 </div>
                 <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                 <p className="text-muted-foreground">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Premium Candidates Section */}
      <PremiumCandidates />

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}
