"use client";

import { Building2, Globe, Briefcase, Code2, Laptop, Rocket, Zap, Cloud, Cpu, Database, Network, Shield, Terminal, Wifi } from "lucide-react";
import React from "react";

const companies = [
  { name: "TechNova", icon: Rocket, color: "text-blue-500" },
  { name: "GlobalSys", icon: Globe, color: "text-green-500" },
  { name: "CodeCraft", icon: Code2, color: "text-purple-500" },
  { name: "CiliconValley", icon: Cpu, color: "text-orange-500" },
  { name: "DataFlow", icon: Database, color: "text-cyan-500" },
  { name: "NetWorks", icon: Network, color: "text-indigo-500" },
  { name: "SecurityFirst", icon: Shield, color: "text-red-500" },
  { name: "DevOps Inc", icon: Terminal, color: "text-slate-500" },
  { name: "CloudNine", icon: Cloud, color: "text-sky-500" },
  { name: "FastTech", icon: Zap, color: "text-yellow-500" },
  { name: "FutureLabs", icon: Laptop, color: "text-pink-500" },
  { name: "Enterprise", icon: Building2, color: "text-emerald-500" },
  { name: "Connect", icon: Wifi, color: "text-violet-500" },
  { name: "NextGen", icon: Briefcase, color: "text-amber-500" },
];

// Duplicate for seamless loop
const allCompanies = [...companies, ...companies, ...companies];

export const RecruiterLogos = () => {
  return (
    <section className="py-24 bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Trusted by Industry Leaders</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of companies hiring top talent on TalentSphere.
          </p>
        </div>

        <div className="relative h-[600px] overflow-hidden mask-linear-gradient">
           {/* Mask for fading top and bottom */}
           <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 h-full">
            {/* Column 1 - Down */}
            <div className="flex flex-col gap-6 animate-scroll-vertical">
              {allCompanies.map((company, i) => (
                <LogoCard key={`col1-${i}`} company={company} />
              ))}
            </div>

            {/* Column 2 - Up (Reverse) */}
             <div className="flex flex-col gap-6 animate-scroll-vertical-reverse">
              {allCompanies.map((company, i) => (
                <LogoCard key={`col2-${i}`} company={company} />
              ))}
            </div>

            {/* Column 3 - Down */}
            <div className="hidden md:flex flex-col gap-6 animate-scroll-vertical">
              {allCompanies.slice(2).map((company, i) => (
                <LogoCard key={`col3-${i}`} company={company} />
              ))}
            </div>
            
             {/* Column 4 - Up (Reverse) */}
             <div className="hidden md:flex flex-col gap-6 animate-scroll-vertical-reverse">
              {allCompanies.slice(4).map((company, i) => (
                <LogoCard key={`col4-${i}`} company={company} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LogoCard = ({ company }: { company: typeof companies[0] }) => (
  <div className="flex items-center gap-4 p-6 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm hover:bg-muted/50 transition-colors">
    <div className={`p-3 rounded-xl bg-background shadow-sm ${company.color}`}>
      <company.icon className="w-8 h-8" />
    </div>
    <span className="font-semibold text-lg text-foreground/80">{company.name}</span>
  </div>
);
