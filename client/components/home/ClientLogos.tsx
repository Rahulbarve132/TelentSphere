"use client";

import { Building2, Briefcase, Globe, Code2, Laptop, Rocket, Zap, Cloud, Cpu, Database, Network, Shield, Terminal, Wifi, Anchor, Feather, Key, Layers, MousePointer2, Smartphone } from "lucide-react";
import React from "react";

const clients = [
  { name: "StartUp Inc", icon: Rocket, color: "text-rose-500" },
  { name: "EcoWorld", icon: Globe, color: "text-emerald-500" },
  { name: "CodeBase", icon: Code2, color: "text-indigo-500" },
  { name: "Pixels", icon: Laptop, color: "text-violet-500" },
  { name: "FastTrack", icon: Zap, color: "text-yellow-500" },
  { name: "Cloud9", icon: Cloud, color: "text-sky-500" },
  { name: "LogicGate", icon: Cpu, color: "text-orange-500" },
  { name: "DataMind", icon: Database, color: "text-cyan-500" },
  { name: "ConnectX", icon: Network, color: "text-blue-500" },
  { name: "CyberShield", icon: Shield, color: "text-red-500" },
  { name: "TerminalOps", icon: Terminal, color: "text-slate-500" },
  { name: "Wi-Fi Hub", icon: Wifi, color: "text-teal-500" },
  { name: "Harbor", icon: Anchor, color: "text-blue-400" },
  { name: "Lite", icon: Feather, color: "text-green-400" },
  { name: "SecureKey", icon: Key, color: "text-amber-500" },
  { name: "Stack", icon: Layers, color: "text-purple-400" },
  { name: "Click", icon: MousePointer2, color: "text-pink-500" },
  { name: "MobileFirst", icon: Smartphone, color: "text-fuchsia-500" },
  { name: "BuildIt", icon: Building2, color: "text-lime-500" },
  { name: "WorkSpace", icon: Briefcase, color: "text-stone-500" },
];

// Duplicate for seamless loop
const allClients = [...clients, ...clients];

export const ClientLogos = () => {
  return (
    <section className="py-24 bg-muted/20 overflow-hidden relative border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Top Clients Hiring Freelancers</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with forward-thinking companies looking for flexible talent.
        </p>
      </div>

      <div className="relative w-full overflow-hidden mask-linear-gradient-horizontal">
        {/* Mask for fading left and right */}
        <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col gap-8">
          {/* Row 1 - Left */}
          <div className="flex gap-8 animate-scroll-horizontal w-max">
            {allClients.map((client, i) => (
              <ClientCard key={`row1-${i}`} client={client} />
            ))}
          </div>

          {/* Row 2 - Right (Reverse) */}
          <div className="flex gap-8 animate-scroll-horizontal-reverse w-max ml-[-100px]"> {/* Offset to stagger */}
            {allClients.map((client, i) => (
              <ClientCard key={`row2-${i}`} client={client} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ClientCard = ({ client }: { client: typeof clients[0] }) => (
  <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all w-[200px] h-[140px]">
    <div className={`p-3 rounded-xl bg-muted/30 ${client.color}`}>
      <client.icon className="w-8 h-8" />
    </div>
    <span className="font-medium text-sm text-foreground/80">{client.name}</span>
  </div>
);
