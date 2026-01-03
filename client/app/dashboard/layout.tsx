import { DashboardSidebar, MobileDashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen pt-16">
       {/* Desktop Sidebar */}
      <DashboardSidebar />
      
      <main className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
         {/* Mobile Header / Trigger */}
         <div className="lg:hidden p-4 border-b flex items-center gap-4 bg-background/50 backdrop-blur sticky top-0 z-40">
             <MobileDashboardSidebar />
             <span className="font-semibold text-lg">Dashboard</span>
        </div>

        <div className="p-4 md:p-8 overflow-y-auto flex-1">
            <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
                {children}
            </div>
        </div>
      </main>
    </div>
  );
}
