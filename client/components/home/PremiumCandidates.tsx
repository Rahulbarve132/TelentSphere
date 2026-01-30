"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, ExternalLink, Sparkles } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  role: string;
  location: string;
  experience: string;
  skills: string[];
  image: string;
  available: boolean;
}

// Mock Data (Unchanged)
const CANDIDATES: Candidate[] = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "Senior Full Stack Dev",
    location: "San Francisco, CA",
    experience: "7+ Years",
    skills: ["React", "Node.js", "AWS"],
    image: "/candidate_male.png",
    available: true,
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "Lead Product Designer",
    location: "New York, NY",
    experience: "5+ Years",
    skills: ["Figma", "UX Research", "Prototyping"],
    image: "/candidate_female.png",
    available: true,
  },
  {
    id: "3",
    name: "Jordan Taylor",
    role: "DevOps Engineer",
    location: "Remote",
    experience: "6+ Years",
    skills: ["Docker", "Kubernetes", "CI/CD"],
    image: "/candidate_male.png",
    available: false,
  },
  {
    id: "4",
    name: "Emily Davis",
    role: "Frontend Specialist",
    location: "London, UK",
    experience: "4 Years",
    skills: ["Vue.js", "Tailwind", "GSAP"],
    image: "/candidate_female.png",
    available: true,
  },
  {
    id: "5",
    name: "Michael Chang",
    role: "Backend Architect",
    location: "Toronto, CA",
    experience: "10+ Years",
    skills: ["Go", "Python", "Microservices"],
    image: "/candidate_male.png",
    available: true,
  },
  {
    id: "6",
    name: "Priya Patel",
    role: "AI/ML Engineer",
    location: "Austin, TX",
    experience: "3+ Years",
    skills: ["PyTorch", "TensorFlow", "NLP"],
    image: "/candidate_female.png",
    available: true,
  }
];

// Double the candidates for infinite loop effect
const INFINITE_CANDIDATES = [...CANDIDATES, ...CANDIDATES];

export const PremiumCandidates = () => {
  const controls = useAnimationControls();
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      controls.start({
        x: "-50%",
        transition: {
          duration: 20, // Adjust speed here (higher = slower)
          ease: "linear",
          repeat: Infinity,
        },
      });
    } else {
      controls.stop();
    }
  }, [controls, isPaused]);


  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Dynamic Background - Static now */}
      <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[128px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3 h-3 mr-2" />
              World Class Talent
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Premium Candidates
            </h2>
            <p className="text-xl text-muted-foreground">
              Pre-vetted, top 1% talent ready to join your team.
            </p>
          </div>
          
          <div className="hidden md:flex gap-4">
            <div className="flex items-center text-sm text-muted-foreground mr-4">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"/>
              {CANDIDATES.length} Candidates available now
            </div>
             <Button variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5">
              View All Candidates <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Auto Scrolling Container */}
      <div 
        className="relative z-20 w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div 
          animate={controls}
          initial={{ x: 0 }}
          className="flex gap-6 w-max px-4"
        >
          {INFINITE_CANDIDATES.map((candidate, i) => (
            <GlassCandidateCard key={`${candidate.id}-${i}`} candidate={candidate} />
          ))}
        </motion.div>
      </div>
      
       <div className="md:hidden px-4 mt-8 relative z-20 pb-12">
          <Button variant="outline" className="w-full h-12 rounded-full border-primary/20">
            View All Candidates <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
       </div>
    </section>
  );
};

const GlassCandidateCard = ({ candidate }: { candidate: Candidate }) => {
  return (
    <div 
      className="relative min-w-[300px] h-[450px] rounded-3xl group dark overflow-hidden border border-border/50 bg-card/30" 
    >
        {/* Simple Glass Container */}
        <div className="absolute inset-0 rounded-3xl bg-black/40 backdrop-blur-md overflow-hidden">
            
            {/* Background Image - Static */}
            <div className="absolute inset-0 z-0">
                 <Image 
                    src={candidate.image} 
                    alt={candidate.name} 
                    fill
                    className="object-cover opacity-80"
                />
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-10" />
            </div>

            {/* Content Pane - Static */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-lg relative overflow-hidden">
                    
                    <div className="flex justify-between items-start mb-3">
                         <div>
                            <h3 className="text-xl font-bold text-white mb-1">{candidate.name}</h3>
                            <p className="text-white/70 text-sm flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5" /> {candidate.role}
                            </p>
                         </div>
                         <Badge variant={candidate.available ? "default" : "destructive"} className="h-6 text-[10px] uppercase tracking-wide border-none bg-white text-black hover:bg-white/90">
                           {candidate.available ? "Open" : "Busy"}
                         </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {candidate.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="text-[10px] uppercase font-medium tracking-wider px-2 py-1 rounded bg-black/30 text-white/90 border border-white/10">
                            {skill}
                        </span>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <Button size="sm" className="w-full bg-white text-black hover:bg-white/90 font-medium h-9 rounded-xl">
                            View Profile
                        </Button>
                        <Button size="icon" variant="outline" className="w-9 h-9 rounded-xl border-white/20 bg-transparent text-white hover:bg-white/20 hover:text-white">
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Floating Stats - Static top positions */}
            <div className="absolute top-4 right-4 z-20">
                <div className="bg-black/30 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-lg">
                    {candidate.experience} Exp
                </div>
            </div>
             <div className="absolute top-4 left-4 z-20">
                <div className="bg-black/30 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium text-white shadow-lg flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {candidate.location.split(',')[0]}
                </div>
            </div>

        </div>
    </div>
  );
};
