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
  CalendarDays,
  Edit,
  Eye,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { useUser } from "@/lib/hooks/use-user";

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
  applicationDeadline: string | null;
  isActive: boolean;
  recruiterId: string;
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
  const { user } = useUser();
  const isRecruiter = user?.id === job.recruiterId;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const daysUntilDeadline = (dateString: string | null) => {
    if (!dateString) return null;
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Always use dashboard paths for now
  isDashboard = true;

  // Set proper routing paths
  const jobDetailPath = isDashboard
    ? `/dashboard/jobs/${job.id}`
    : `/jobs/${job.id}`;

  const applyPath = isDashboard
    ? `/dashboard/jobs/${job.id}/apply`
    : `/jobs/${job.id}/apply`;

  const editPath = `/dashboard/jobs/${job.id}/edit`;
  const applicantsPath = `/dashboard/jobs/${job.id}/applicants`;

  return (
    <Card
      className={`overflow-hidden ${!job.isActive ? "border-dashed border-gray-300" : ""}`}
    >
      <CardContent className="">
        {!job.isActive && isRecruiter && (
          <div className="mb-3 flex items-center gap-1.5 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium">
              Inactive - Not visible to job seekers
            </span>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">
                <Link href={jobDetailPath} className="hover:underline">
                  {job.title}
                </Link>
              </h3>

              {job.isActive ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-slate-500">
                  Inactive
                </Badge>
              )}
            </div>

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
                  {job.salary && `${job.salary}`}
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <div className="flex items-center text-slate-500 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>

            {job.applicationDeadline && (
              <div className="flex items-center text-slate-500 mb-2">
                <CalendarDays className="h-4 w-4 mr-1" />
                <span>Deadline {formatDate(job.applicationDeadline)}</span>
              </div>
            )}

            <div className="flex items-center text-slate-500 mb-3">
              <Users className="h-4 w-4 mr-1" />
              <span>{job._count.applications} applicants</span>
            </div>

            {showActions && (
              <div className="flex gap-2">
                <>
                  <Link href={applicantsPath}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Applicants
                    </Button>
                  </Link>
                  <Link href={editPath}>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </>

                <Link href={jobDetailPath}>
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    View
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {job.applicationDeadline &&
          daysUntilDeadline(job.applicationDeadline) !== null &&
          daysUntilDeadline(job.applicationDeadline)! <= 3 &&
          daysUntilDeadline(job.applicationDeadline)! > 0 &&
          !isRecruiter && (
            <div className="mt-3 text-amber-600 text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1.5" />
              <span>
                Closing soon - {daysUntilDeadline(job.applicationDeadline)} days
                left to apply
              </span>
            </div>
          )}

        {job.applicationDeadline &&
          daysUntilDeadline(job.applicationDeadline) !== null &&
          daysUntilDeadline(job.applicationDeadline)! <= 0 &&
          !isRecruiter && (
            <div className="mt-3 text-red-600 text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1.5" />
              <span>Application deadline has passed</span>
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default JobCard;
