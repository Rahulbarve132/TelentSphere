"use client";

import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    content: "TalentSphere transformed our hiring process. We found a Senior React Developer within 48 hours who was a perfect culture fit. The quality of candidates is unmatched.",
    author: "Sarah Johnson",
    role: "CTO",
    company: "TechFlow Inc.",
    image: "/candidate_female.png", // Reusing for demo
    rating: 5,
  },
  {
    content: "As a developer, I've never had a smoother experience. The platform highlights my skills perfectly, and I landed my dream remote job in just two weeks.",
    author: "David Chen",
    role: "Full Stack Developer",
    company: "Placed at InnovateSoft",
    image: "/candidate_male.png", // Reusing for demo
    rating: 5,
  },
  {
    content: "The premium vetting process saves us so much time. We skip the initial screening because we know TalentSphere has already done the heavy lifting.",
    author: "Elena Rodriguez",
    role: "Head of People",
    company: "StartUp Scale",
    image: "/candidate_female.png", // Reusing for demo
    rating: 4,
  }
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4">Success Stories</Badge>
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Trusted by Leaders and Developers
          </h2>
          <p className="text-xl text-muted-foreground">
            Don't just take our word for it. Hear from the community building the future with TalentSphere.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary ${className}`}>
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof TESTIMONIALS[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card p-8 rounded-3xl border border-border/50 shadow-sm relative flex flex-col h-full hover:shadow-md transition-shadow"
    >
      <Quote className="absolute top-8 right-8 text-primary/10 w-12 h-12 rotate-180" />
      
      <div className="flex gap-1 mb-6 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 ${i < testimonial.rating ? "fill-current" : "text-muted opacity-30"}`} 
          />
        ))}
      </div>

      <p className="text-foreground/80 leading-relaxed text-lg mb-8 flex-grow italic">
        "{testimonial.content}"
      </p>

      <div className="flex items-center gap-4 mt-auto">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/10">
          <Image 
            src={testimonial.image} 
            alt={testimonial.author} 
            fill 
            className="object-cover"
          />
        </div>
        <div>
          <div className="font-bold text-foreground">{testimonial.author}</div>
          <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
        </div>
      </div>
    </motion.div>
  );
};
