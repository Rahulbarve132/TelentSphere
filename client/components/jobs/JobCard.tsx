import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Job {
  _id: string;
  title: string;
  companyName?: string; // properties might vary based on API
  type: string;
  category: string;
  experienceLevel: string;
  location: {
    type: string;
    country: string;
    city?: string;
  };
  budget: {
    min: number;
    max: number;
    currency: string;
    type: string;
  };
  skillsRequired: string[];
  createdAt: string;
}

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border/50 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
              <Link href={`/jobs/${job._id}`}>{job.title}</Link>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {job.companyName || "Confidential Client"}
            </p>
          </div>
          <Badge variant="outline" className="capitalize">
            {job.type.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skillsRequired.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.skillsRequired.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{job.skillsRequired.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary/70" />
            <span className="capitalize">{job.location.type} {job.location.country && `(${job.location.country})`}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-primary/70" />
            <span>
              {job.budget.currency} {job.budget.min.toLocaleString()} - {job.budget.max.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-primary/70" />
            <span className="capitalize">{job.experienceLevel}</span>
          </div>
          <div className="flex items-center">
             <Calendar className="h-4 w-4 mr-2 text-primary/70" />
             <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/jobs/${job._id}`} className="w-full">
          <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white border-primary/20 border transition-all">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
