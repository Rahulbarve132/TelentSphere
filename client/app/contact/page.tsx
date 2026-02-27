"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, MapPin, Phone, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background glows */}
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
          {/* Left: Info */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Let&apos;s Talk
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Have a project in mind or just want to explore what&apos;s possible? We&apos;re here to help you build your dream team.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-6">
              <ContactInfoCard icon={<Mail className="w-6 h-6" />} title="Email Us" content="support@talentsphere.com" delay={0.2} />
              <ContactInfoCard icon={<Phone className="w-6 h-6" />} title="Call Us" content="+1 (555) 123-4567" delay={0.3} />
              <ContactInfoCard icon={<MapPin className="w-6 h-6" />} title="Visit Us" content="123 Tech Blvd, SF, CA" delay={0.4} />
              <ContactInfoCard icon={<MessageSquare className="w-6 h-6" />} title="Support" content="24/7 Live Chat" delay={0.5} />
            </motion.div>
          </div>

          {/* Right: Form Card */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-3xl blur-2xl opacity-10 -z-10 transform rotate-2 scale-105" />
            <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-primary to-blue-600" />
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Send a Message</CardTitle>
                <CardDescription>
                  Fill out the form and our team will get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Contact Form ────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = React.useState({
    firstName: "",
    lastName:  "",
    email:     "",
    message:   "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted,    setSubmitted]    = React.useState(false);
  const [error,        setError]        = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${baseUrl}/contact`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Something went wrong.");

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({ firstName: "", lastName: "", email: "", message: "" });
    setError("");
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="py-10 flex flex-col items-center text-center gap-5"
      >
        <div className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2">Message Sent! 🎉</h3>
          <p className="text-muted-foreground">
            Thanks,{" "}
            <span className="font-semibold text-foreground">{form.firstName}</span>!
            We&apos;ll get back to you within 24 hours.
          </p>
        </div>
        <button
          onClick={resetForm}
          className="text-sm text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-muted-foreground ml-1">
            First Name *
          </label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="John"
            value={form.firstName}
            onChange={handleChange}
            disabled={isSubmitting}
            className="bg-background/50 border-input/50 focus:bg-background transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-muted-foreground ml-1">
            Last Name *
          </label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Doe"
            value={form.lastName}
            onChange={handleChange}
            disabled={isSubmitting}
            className="bg-background/50 border-input/50 focus:bg-background transition-colors"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-muted-foreground ml-1">
          Email Address *
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange}
          disabled={isSubmitting}
          className="bg-background/50 border-input/50 focus:bg-background transition-colors"
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-muted-foreground ml-1">
          Message *
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your project..."
          value={form.message}
          onChange={handleChange}
          disabled={isSubmitting}
          className="min-h-[150px] resize-none bg-background/50 border-input/50 focus:bg-background transition-colors"
        />
      </div>

      {/* Inline error */}
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300 group"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </form>
  );
}

// ─── Info Card ────────────────────────────────────────────────────────────────

function ContactInfoCard({
  icon, title, content, delay,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  delay: number;
}) {
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
