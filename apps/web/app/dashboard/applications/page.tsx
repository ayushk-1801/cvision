"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Globe,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { formatDistance } from "date-fns";

interface Application {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  resumeUrl: string;
  coverLetter: string | null;
  job: {
    title: string;
    company: string;
    location: string;
    jobType: string | null;
    isRemote: boolean;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const statusEmojis: Record<string, React.ReactNode> = {
  pending: <Clock className="h-5 w-5 text-yellow-500" />,
  reviewing: <AlertCircle className="h-5 w-5 text-blue-500" />,
  rejected: <XCircle className="h-5 w-5 text-red-500" />,
  accepted: <CheckCircle2 className="h-5 w-5 text-green-500" />,
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  reviewing: "Under Review",
  rejected: "Rejected",
  accepted: "Accepted",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  reviewing: "bg-blue-100 text-blue-800 border-blue-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
};

export default function ApplicationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current status filter from URL or default to "all"
  const currentStatus = searchParams.get("status") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);

        let url = `/api/applications?page=${currentPage}&limit=10`;
        if (currentStatus !== "all") {
          url += `&status=${currentStatus}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();

        setApplications(data.applications);
        setPagination(data.pagination);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentStatus, currentPage]);

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams();
    if (status !== "all") {
      params.set("status", status);
    }
    params.set("page", "1");
    router.push(`/dashboard/applications?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/dashboard/applications?${params.toString()}`);
  };

  // Calculate counts for each status
  const statusCounts = applications.reduce(
    (counts, app) => {
      counts[app.status] = (counts[app.status] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>
  );

  const renderSkeletonCard = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );

  return (
    <div className="py-10 px-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <Link href="/dashboard/jobs">
          <Button>Browse Jobs</Button>
        </Link>
      </div>

      <Tabs
        defaultValue={currentStatus}
        className="mb-8"
        onValueChange={handleStatusChange}
      >
        <TabsList className="grid grid-cols-5 mb-4 w-full md:w-auto">
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2">
              {applications.length || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2">
              {statusCounts.pending || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="reviewing">
            Reviewing
            <Badge variant="secondary" className="ml-2">
              {statusCounts.reviewing || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted
            <Badge variant="secondary" className="ml-2">
              {statusCounts.accepted || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            <Badge variant="secondary" className="ml-2">
              {statusCounts.rejected || 0}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={currentStatus} className="mt-0">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx}>{renderSkeletonCard()}</div>
              ))}
            </div>
          ) : error ? (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          ) : applications.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applications.map((application) => (
                  <Card
                    key={application.id}
                    className="transition-all duration-200 hover:shadow-md"
                  >
                    <CardHeader>
                      <CardTitle className="line-clamp-1">
                        {application.job.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {application.job.company}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge
                          className={`${statusColors[application.status]} flex items-center gap-1.5 py-1.5`}
                          variant="outline"
                        >
                          {statusEmojis[application.status]}
                          {statusLabels[application.status]}
                        </Badge>

                        <span className="text-xs text-muted-foreground">
                          Applied{" "}
                          {formatDistance(
                            new Date(application.createdAt),
                            new Date(),
                            { addSuffix: true }
                          )}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {application.job.location}
                            {application.job.isRemote && " · Remote"}
                          </span>
                        </div>

                        {application.job.jobType && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span>{application.job.jobType}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Applied on{" "}
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex gap-2 justify-between">
                      {application.resumeUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={application.resumeUrl} target="_blank">
                            <Download className="h-4 w-4 mr-1" />
                            Resume
                          </Link>
                        </Button>
                      )}

                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/dashboard/applications/${application.id}`}
                        >
                          View Details
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                    >
                      Previous
                    </Button>

                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No applications found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {currentStatus === "all"
                    ? "You haven't applied to any jobs yet."
                    : `You don't have any applications with "${currentStatus}" status.`}
                </p>
                <Button asChild>
                  <Link href="/dashboard/jobs">Browse Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
