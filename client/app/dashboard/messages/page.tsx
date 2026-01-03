"use client";

import { MessageSquare, Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-border/50 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden relative group">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-fullblur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-primary/20" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl -ml-12 -mb-12 transition-all duration-700 group-hover:bg-secondary/20" />

        <CardContent className="flex flex-col items-center text-center p-12 space-y-6 relative z-10">
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary opacity-20 blur-xl rounded-full" />
            <div className="bg-background/80 p-4 rounded-full border border-border/50 shadow-sm relative">
                <MessageSquare className="w-12 h-12 text-primary animate-pulse" />
                <Sparkles className="w-5 h-5 text-yellow-500 absolute -top-1 -right-1 animate-bounce delay-700" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Coming Soon
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We&apos;re crafting a powerful messaging experience for you. Connect with talent and employers seamlessly. Stay tuned!
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full">
            <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => router.back()}
            >
                Go Back
            </Button>
            <Button className="w-full gap-2 group-hover:scale-105 transition-transform">
                <Rocket className="w-4 h-4" />
                Notify Me
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
