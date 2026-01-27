"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    question: "How does TalentSphere verify developers?",
    answer:
      "Every developer on TalentSphere undergoes a rigorous vetting process. This includes identity verification, portfolio reviews, technical assessments, and live coding interviews to ensure top-tier quality.",
  },
  {
    question: "Is it free for job seekers?",
    answer:
      "Yes! TalentSphere is completely free for developers looking for jobs. You can create a profile, browse listings, and apply to unlimited jobs without any hidden fees.",
  },
  {
    question: "How do I post a job?",
    answer:
      "Posting a job is simple. Create a client account, navigate to your dashboard, and click 'Post a Job'. Our AI-assisted form helps you craft the perfect job description in minutes.",
  },
  {
    question: "What is the platform fee for hiring?",
    answer:
      "We offer transparent pricing. Clients pay a small percentage fee only upon successful hiring. There are no upfront costs to post jobs or view candidate profiles.",
  },
  {
    question: "Can I hire for short-term projects?",
    answer:
      "Absolutely. TalentSphere supports full-time confidence, part-time contracts, and freelance projects. You can specify the employment type when posting your job.",
  },
  {
    question: "What happens if a hire doesn't work out?",
    answer:
      "We offer a 30-day satisfaction guarantee. If a hire doesn't work out within the first 30 days, we'll help you find a replacement at no extra cost and refund any platform fees.",
  },
];

export const FAQ = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Content */}
          <div className="lg:col-span-5 text-left space-y-8 sticky top-24">
            <div>
              <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/20 text-primary bg-primary/5">
                Support & FAQ
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Questions? <br /> We've got answers.
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Everything you need to know about the product and billing. Can’t
                find the answer you’re looking for?
              </p>
            </div>

            <div className="flex flex-col gap-4">
               <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto rounded-full text-base h-12 shadow-lg hover:shadow-primary/20 transition-all">
                    <MessageCircle className="mr-2 h-5 w-5" /> Chat to our team
                  </Button>
               </Link>
               <p className="text-sm text-muted-foreground ml-2">
                   Usually replies within 2 hours
               </p>
            </div>
          </div>

          {/* Right Side: Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-2 sm:p-8 shadow-sm"
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {FAQS.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border/40 rounded-xl px-6 bg-card hover:bg-muted/30 transition-colors [&[data-state=open]]:bg-muted/30 [&[data-state=open]]:border-primary/20"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold py-6 hover:no-underline hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
