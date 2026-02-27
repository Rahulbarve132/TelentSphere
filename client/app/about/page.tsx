"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  UserCircle,
  Search,
  ClipboardList,
  MessageCircle,
  Handshake,
  ThumbsUp,
  FileSignature,
  Trophy,
  Building2,
  Briefcase,
  CheckSquare,
  Users,
  Zap,
  ShieldCheck,
  Globe,
  Star,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const talentSteps = [
  {
    id: 1,
    title: "Create Your Profile",
    description:
      "Build a comprehensive profile highlighting your skills, experience, portfolio and availability. Let your work speak for itself.",
    icon: UserCircle,
    gradient: "from-blue-500 to-cyan-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-500",
    detail: ["Add skills & expertise", "Showcase past projects", "Set your availability & rate"],
  },
  {
    id: 2,
    title: "Discover Opportunities",
    description:
      "Browse thousands of curated job listings filtered by your expertise, location, and preferred engagement type.",
    icon: Search,
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-500",
    detail: ["Advanced filters & search", "Remote & on-site roles", "Real-time job alerts"],
  },
  {
    id: 3,
    title: "Apply with Ease",
    description:
      "Submit tailored applications in seconds, attach your cover letter, and track every application status from one dashboard.",
    icon: FileSignature,
    gradient: "from-orange-500 to-yellow-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-500",
    detail: ["One-click applications", "Live status tracking", "Recruiter messaging"],
  },
  {
    id: 4,
    title: "Get Hired & Grow",
    description:
      "Interview, negotiate, and land the role that fits your ambitions. Build your career with top-tier companies worldwide.",
    icon: Trophy,
    gradient: "from-green-500 to-emerald-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-500",
    detail: ["Interview scheduling", "Offer & rate negotiation", "Career growth tools"],
  },
];

const companySteps = [
  {
    id: 1,
    title: "Setup Your Company",
    description:
      "Create a verified company profile that acts as your employer brand — attract the best talent before posting a single job.",
    icon: Building2,
    gradient: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-500",
    detail: ["Company verification", "Employer branding page", "Team & culture showcase"],
  },
  {
    id: 2,
    title: "Post a Job",
    description:
      "Define role requirements, set your budget, and publish in minutes. Your listing reaches thousands of vetted professionals instantly.",
    icon: Briefcase,
    gradient: "from-rose-500 to-red-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-500",
    detail: ["Flexible job types", "Budget & timeline configs", "Visibility controls"],
  },
  {
    id: 3,
    title: "Review Applications",
    description:
      "Manage your hiring pipeline with an intuitive dashboard. Filter, shortlist and message candidates all from one place.",
    icon: CheckSquare,
    gradient: "from-amber-500 to-orange-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-500",
    detail: ["Pipeline management", "Shortlist & reject flows", "Applicant profiles & CVs"],
  },
  {
    id: 4,
    title: "Hire & Scale",
    description:
      "Schedule interviews, extend offers and onboard your new hires seamlessly. Build a world-class team at speed.",
    icon: Users,
    gradient: "from-teal-500 to-emerald-500",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    text: "text-teal-500",
    detail: ["Interview scheduling", "Offer management", "Team analytics"],
  },
];

const clientSteps = [
  {
    id: 1,
    title: "Define Your Project",
    description:
      "Describe exactly what you need — scope, budget, timeline and required skills. Our guided form makes it fast and clear.",
    icon: ClipboardList,
    gradient: "from-violet-500 to-indigo-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-500",
    detail: ["Guided project builder", "Budget & deadline setting", "Skill & category tags"],
  },
  {
    id: 2,
    title: "Receive Proposals",
    description:
      "Qualified freelancers reach out with tailored proposals. Compare rates, portfolios and experience side by side.",
    icon: MessageCircle,
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    text: "text-pink-500",
    detail: ["Freelancer proposals inbox", "Portfolio & skill comparison", "Direct messaging"],
  },
  {
    id: 3,
    title: "Collaborate Seamlessly",
    description:
      "Work with your chosen freelancer via built-in messaging, milestone tracking and file sharing — no external tools needed.",
    icon: Handshake,
    gradient: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-500",
    detail: ["Milestone-based workflow", "File & asset sharing", "Progress tracking"],
  },
  {
    id: 4,
    title: "Approve & Review",
    description:
      "Review deliverables, approve milestones and leave a rating. Build a trusted network of freelancers for future projects.",
    icon: ThumbsUp,
    gradient: "from-lime-500 to-green-500",
    bg: "bg-lime-500/10",
    border: "border-lime-500/20",
    text: "text-lime-600",
    detail: ["Milestone approvals", "Star ratings & reviews", "Re-hire favourites"],
  },
];

const stats = [
  { label: "Active Talent", value: "50K+", icon: Users },
  { label: "Jobs Posted", value: "12K+", icon: Briefcase },
  { label: "Companies", value: "2K+", icon: Building2 },
  { label: "Freelance Projects", value: "5K+", icon: ClipboardList },
  { label: "Hires Made", value: "8K+", icon: Trophy },
];

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Post jobs or apply in under 2 minutes. No lengthy forms, no friction.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Verified & Safe",
    desc: "Every company is verified. Every talent is screened. Zero fake listings.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Globe,
    title: "Global Reach",
    desc: "Connect with talent and companies across 50+ countries — remote-first.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Star,
    title: "Top Rated",
    desc: "Rated 4.9/5 by thousands of recruiters and talent professionals.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"talent" | "company" | "client">("talent");

  const activeSteps =
    activeTab === "talent" ? talentSteps : activeTab === "company" ? companySteps : clientSteps;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Zap className="w-3.5 h-3.5" />
            How TalentSphere Works
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            The Smarter Way to{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Hire & Get Hired
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            TalentSphere connects world-class talent with exceptional companies. Whether you&apos;re building a team or
            building a career — we make it effortless.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-13 px-8 text-base bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-xl shadow-primary/25 gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="h-13 px-8 text-base gap-2">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-card/30 backdrop-blur-sm py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <Icon className="w-6 h-6 text-primary mb-2" />
                <span className="text-3xl font-extrabold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground mt-1">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Tab Toggle */}
          <div className="flex justify-center mb-16">
            <div className="bg-muted/70 backdrop-blur-sm p-1.5 rounded-2xl flex gap-1 border border-border/50 shadow-inner">
              <button
                onClick={() => setActiveTab("talent")}
                className={[
                  "px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300",
                  activeTab === "talent"
                    ? "bg-background shadow-lg text-foreground border border-border/50"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                🧑‍💻 For Talent
              </button>
              <button
                onClick={() => setActiveTab("company")}
                className={[
                  "px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300",
                  activeTab === "company"
                    ? "bg-background shadow-lg text-foreground border border-border/50"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                🏢 For Companies
              </button>
              <button
                onClick={() => setActiveTab("client")}
                className={[
                  "px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300",
                  activeTab === "client"
                    ? "bg-background shadow-lg text-foreground border border-border/50"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                💼 For Clients
              </button>
            </div>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Vertical connector line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent -translate-x-1/2" />

            <div className="space-y-16 lg:space-y-0">
              {activeSteps.map((step, index) => {
                const Icon = step.icon;
                const isLeft = index % 2 === 0;

                return (
                  <div
                    key={step.id}
                    className={[
                      "relative flex flex-col lg:flex-row items-center gap-8 lg:gap-0",
                      "lg:mb-16",
                      isLeft ? "" : "lg:flex-row-reverse",
                    ].join(" ")}
                  >
                    {/* Card */}
                    <div className={["w-full lg:w-5/12", isLeft ? "lg:pr-12" : "lg:pl-12"].join(" ")}>
                      <div className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-500">
                        {/* Icon box */}
                        <div className={["w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300", step.bg].join(" ")}>
                          <Icon className={["w-7 h-7", step.text].join(" ")} />
                        </div>

                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          {step.description}
                        </p>

                        {/* Feature bullets */}
                        <ul className="space-y-2">
                          {step.detail.map((d) => (
                            <li key={d} className="flex items-center gap-2 text-sm text-foreground/80">
                              <CheckCircle2 className={["w-4 h-4 shrink-0", step.text].join(" ")} />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Centre node */}
                    <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
                      <div className={["w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-black text-xl shadow-xl ring-4 ring-background", step.gradient].join(" ")}>
                        {step.id}
                      </div>
                    </div>

                    {/* Spacer for the opposite side */}
                    <div className="hidden lg:block w-5/12" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-20 px-4 bg-muted/20 border-y border-border/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Teams Choose{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                TalentSphere
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Built for speed, trust, and scale — so you can focus on what matters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-card/50 border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
                >
                  <div className={["w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", f.bg].join(" ")}>
                    <Icon className={["w-6 h-6", f.color].join(" ")} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent p-12 text-center overflow-hidden shadow-2xl">
            {/* Glows */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-600/15 blur-3xl rounded-full pointer-events-none" />

            <span className="relative inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Star className="w-3.5 h-3.5 fill-primary" />
              Start for Free
            </span>

            <h2 className="relative text-4xl font-extrabold mb-4">
              Ready to Take the Next Step?
            </h2>
            <p className="relative text-muted-foreground text-lg max-w-lg mx-auto mb-8">
              {activeTab === "talent"
                ? "Join 50,000+ professionals already finding their dream roles on TalentSphere."
                : activeTab === "company"
                ? "Join 2,000+ companies already hiring the world's best talent."
                : "Post your first freelance project in minutes and get proposals from top talent."}
            </p>

            <div className="relative flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 text-base bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 shadow-lg shadow-primary/25 gap-2"
                >
                  {activeTab === "talent" ? "Join as Talent" : activeTab === "company" ? "Hire Talent Now" : "Post a Freelance Project"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-8 text-base"
                >
                  Explore Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
