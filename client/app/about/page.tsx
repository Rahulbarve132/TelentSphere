import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6">About TalentSphere</h1>
      <p className="text-xl text-muted-foreground mb-8">
        We are dealing with the future of work.
      </p>
      
      <div className="prose dark:prose-invert mx-auto">
        <p>
            TalentSphere is a premier platform dedicated to connecting the world's best talent with top-tier companies. 
            Whether you are a developer looking for your next challenge, or a company seeking to build a dream team, 
            we provide the tools and connections to make it happen.
        </p>
      </div>

       <div className="mt-12">
            <Link href="/register">
                <Button size="lg">Join Us Today</Button>
            </Link>
       </div>
    </div>
  );
}
