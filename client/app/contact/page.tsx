"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, MapPin, Phone, MessageSquare, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] opacity-30 animate-pulse delay-700" />
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-20 lg:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
        >
          {/* Left Column: Info */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Let's Talk
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Have a project in mind or just want to explore what's possible? We're here to help you build your dream team.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-6">
              <ContactInfoCard
                icon={<Mail className="w-6 h-6" />}
                title="Email Us"
                content="support@talentsphere.com"
                delay={0.2}
              />
              <ContactInfoCard
                icon={<Phone className="w-6 h-6" />}
                title="Call Us"
                content="+1 (555) 123-4567"
                delay={0.3}
              />
              <ContactInfoCard
                icon={<MapPin className="w-6 h-6" />}
                title="Visit Us"
                content="123 Tech Blvd, SF, CA"
                delay={0.4}
              />
              <ContactInfoCard
                icon={<MessageSquare className="w-6 h-6" />}
                title="Support"
                content="24/7 Live Chat"
                delay={0.5}
              />
            </motion.div>
          </div>

          {/* Right Column: Form */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-3xl blur-2xl opacity-10 -z-10 transform rotate-2 scale-105" />
            <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-primary to-blue-600" />
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Send a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and our team will get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground ml-1">First Name</label>
                      <Input placeholder="John" className="bg-background/50 border-input/50 focus:bg-background transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground ml-1">Last Name</label>
                      <Input placeholder="Doe" className="bg-background/50 border-input/50 focus:bg-background transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">Email Address</label>
                    <Input type="email" placeholder="john@example.com" className="bg-background/50 border-input/50 focus:bg-background transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">Message</label>
                    <Textarea 
                        placeholder="Tell us about your project..." 
                        className="min-h-[150px] resize-none bg-background/50 border-input/50 focus:bg-background transition-colors" 
                    />
                  </div>
                  <Button className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300 group">
                    Send Message
                    <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function ContactInfoCard({ icon, title, content, delay }: { icon: React.ReactNode; title: string; content: string; delay: number }) {
  return (
    <motion.div
        whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:border-primary/50 transition-colors cursor-default"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{content}</p>
    </motion.div>
  );
}
