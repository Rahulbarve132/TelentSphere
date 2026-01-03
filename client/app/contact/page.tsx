"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
            <h1 className="text-4xl font-bold mb-6">Get in touch</h1>
            <p className="text-muted-foreground mb-8 text-lg">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Email</h3>
                        <p className="text-muted-foreground">support@talentsphere.com</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Phone className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Phone</h3>
                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                         <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Office</h3>
                        <p className="text-muted-foreground">123 Tech Blvd, San Francisco, CA</p>
                    </div>
                </div>
            </div>
        </div>

        <Card className="bg-white/50 dark:bg-black/20 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <label className="text-sm font-medium">First Name</label>
                             <Input placeholder="John" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium">Last Name</label>
                             <Input placeholder="Doe" />
                        </div>
                    </div>
                    <div className="space-y-2">
                         <label className="text-sm font-medium">Email</label>
                         <Input type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                         <label className="text-sm font-medium">Message</label>
                         <Textarea placeholder="How can we help?" className="min-h-[120px]" />
                    </div>
                    <Button className="w-full">Send Message</Button>
                </form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
