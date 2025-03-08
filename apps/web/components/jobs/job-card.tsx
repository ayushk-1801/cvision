import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Calendar,
  BriefcaseBusiness,
  Users,
  Globe,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  isRemote: boolean;
  createdAt: string;
  industry: string | null;
  jobType: string | null;
  experienceLevel: string | null;
  _count: {
    applications: number;
  };
}

interface JobCardProps {
  job: Job;
  showActions?: boolean;
  isDashboard?: boolean;
}

const JobCard = ({
  job,
  showActions = true,
  isDashboard = false,
}: JobCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  isDashboard= true;

  // Set proper routing paths
  const jobDetailPath = isDashboard 
    ? `/dashboard/jobs/${job.id}`
    : `/jobs/${job.id}`;
    
  const applyPath = isDashboard 
    ? `/dashboard/jobs/${job.id}/apply`
    : `/jobs/${job.id}/apply`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold">
              <Link
                href={jobDetailPath}
                className="hover:underline"
              >
                {job.title}
              </Link>
            </h3>

            <div className="flex flex-wrap items-center mt-2 text-slate-500 gap-4">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                <span>{job.company}</span>
              </div>

              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
              </div>

              {job.isRemote && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  <span>Remote</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {job.jobType && (
                <Badge variant="outline" className="bg-slate-50">
                  <BriefcaseBusiness className="h-3 w-3 mr-1" />
                  {job.jobType}
                </Badge>
              )}

              {job.industry && (
                <Badge variant="outline" className="bg-slate-50">
                  {job.industry}
                </Badge>
              )}

              {job.experienceLevel && (
                <Badge variant="outline" className="bg-slate-50">
                  {job.experienceLevel}
                </Badge>
              )}

              {job.salary && (
                <Badge variant="outline" className="bg-slate-50">
                  {job.salary}
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <div className="flex items-center text-slate-500 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>

            <div className="flex items-center text-slate-500 mb-3">
              <Users className="h-4 w-4 mr-1" />
              <span>{job._count.applications} applicants</span>
            </div>

            {showActions && (
              <div className="flex gap-2">
                <Link href={applyPath}>
                  <Button size="sm">Apply Now</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
