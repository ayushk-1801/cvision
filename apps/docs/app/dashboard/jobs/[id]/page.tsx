"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  BriefcaseBusiness, 
  Users,
  Globe,
  ArrowLeft,
  CalendarDays,
  Clock,
  Edit,
  Eye,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  LinkIcon,
  UserIcon,
} from "lucide-react";
import { useUser } from "@/lib/hooks/use-user";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary: string | null;
  isRemote: boolean;
  createdAt: string;
  industry: string | null;
  jobType: string | null;
  experienceLevel: string | null;
  recruiter: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  _count: {
    applications: number;
  };
  applicationDeadline: string | null;
  isActive: boolean;
  expiresAt: string | null;
  applicationUrl: string | null;
  contactEmail: string;
  yearsOfExperience: number | null;
  numberOfRoles: number | null;
  shortlistSize: number | null;
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useUser();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecruiter, setIsRecruiter] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/jobs/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        
        const data = await response.json();
        setJob(data);
        
        // Check if current user is the recruiter for this job
        if (user?.id === data.recruiter.id) {
          setIsRecruiter(true);
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchJobDetails();
    }
  }, [params.id, user]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
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

  const handleToggleJobStatus = async () => {
    if (!job || isUpdating) return;
    
    try {
      setIsUpdating(true);
      
      // First update the UI optimistically
      setJob({
        ...job,
        isActive: !job.isActive
      });
      
      // Then make the API call
      const response = await fetch(`/api/jobs/${job.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !job.isActive }),
      });
      
      if (!response.ok) {
        // If the API call fails, revert the UI change
        setJob({
          ...job,
          isActive: job.isActive
        });
        throw new Error('Failed to update job status');
      }
      
      // No need to update state again as we've already updated it optimistically
    } catch (err) {
      console.error('Error updating job status:', err);
      setError(`Failed to ${job.isActive ? 'deactivate' : 'activate'} job. Please try again.`);
      
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  // Add a function to get the application deadline from either field
  const getApplicationDeadline = (job: Job) => {
    return job.applicationDeadline || job.expiresAt;
  };

  if (isLoading) {
    return (
      <div className="container py-10 mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="">
                <Skeleton className="h-8 w-3/4 mb-3" />
                <div className="flex flex-wrap gap-4 mb-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-4 w-1/6" />
                </div>
                <Separator className="my-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container py-10 mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-red-500 mb-2">
                {error || 'Job not found'}
              </h3>
              <p className="text-slate-500 mb-6">
                We couldn't load this job posting. It may have been removed or there was an error.
              </p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10 mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to jobs
        </Button>
        
        {isRecruiter && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/jobs/${job.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Job
              </Link>
            </Button>
            <Button 
              variant={job.isActive ? "destructive" : "default"} 
              size="sm"
              onClick={handleToggleJobStatus}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <span className="mr-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  {job.isActive ? 'Deactivating...' : 'Activating...'}
                </>
              ) : job.isActive ? (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/jobs/${job.id}/applicants`}>
                <Users className="h-4 w-4 mr-2" />
                View Applicants
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      {!job.isActive && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-500 h-5 w-5 mr-2" />
            <p className="text-yellow-700">
              This job listing is currently inactive and not visible to job seekers.
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="">
              <div className="flex justify-between items-start mb-3">
                <h1 className="text-2xl font-bold">{job.title}</h1>
                {job.isActive && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                )}
                {!job.isActive && (
                  <Badge variant="outline" className="text-slate-500">Inactive</Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-500">
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
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{job._count.applications} applicants</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {job.salary && (
                  <Badge variant="outline" className="bg-slate-50">
                    {job.salary && `₹${job.salary}`}
                  </Badge>
                )}
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
              </div>
              
              <Separator className="my-6" />
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{job.description}</div>
              </div>
            </CardContent>
          </Card>
          
          {job.requirements && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{job.requirements}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          {isRecruiter ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Job Statistics</CardTitle>
                  <CardDescription>Performance metrics for this job listing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Total Applicants</span>
                      <span className="font-semibold">{job._count.applications}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Job Status</span>
                      <span>
                        {job.isActive ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-100">Inactive</Badge>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Posted On</span>
                      <span>{formatDate(job.createdAt)}</span>
                    </div>
                    {getApplicationDeadline(job) && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Application Deadline</span>
                        <div className="text-right">
                          <div>{formatDate(getApplicationDeadline(job))}</div>
                          {daysUntilDeadline(getApplicationDeadline(job)) !== null && (
                            <div className="text-xs text-slate-500">
                              {daysUntilDeadline(getApplicationDeadline(job))! > 0
                                ? `${daysUntilDeadline(getApplicationDeadline(job))} days remaining`
                                : `Deadline passed`}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {job.expiresAt && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Listing Expires</span>
                        <span>{formatDate(job.expiresAt)}</span>
                      </div>
                    )}
                  </div>
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/dashboard/jobs/${job.id}/shortlisted-applicants`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Shortlisted Applicants
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-slate-500">Contact Email</span>
                      <p className="font-medium">{job.contactEmail}</p>
                    </div>
                    {job.applicationUrl && (
                      <div>
                        <span className="text-sm text-slate-500">Application URL</span>
                        <p className="font-medium break-all">
                          <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{job.applicationUrl}</a>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Apply for this position</h3>
                  <p className="text-slate-500 mb-6">
                    Submit your application now and hear back from the hiring team.
                  </p>
                  <Link href={`/dashboard/jobs/${job.id}/apply`}>
                    <Button className="w-full">Apply Now</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>About the recruiter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {job.recruiter.image ? (
                        <AvatarImage src={job.recruiter.image} alt={job.recruiter.name} />
                      ) : (
                        <AvatarFallback>{job.recruiter.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{job.recruiter.name}</p>
                      <p className="text-sm text-slate-500">{job.recruiter.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          
          {getApplicationDeadline(job) && !isRecruiter && (
            <Card>
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="font-medium">Deadline</p>
                    <p className="text-sm text-slate-500">{formatDate(getApplicationDeadline(job))}</p>
                  </div>
                </div>
                
                {daysUntilDeadline(getApplicationDeadline(job)) !== null && daysUntilDeadline(getApplicationDeadline(job))! > 0 && (
                  <div className="mt-2 text-sm text-slate-500">
                    {daysUntilDeadline(getApplicationDeadline(job))} days remaining to apply
                  </div>
                )}
                
                {daysUntilDeadline(getApplicationDeadline(job)) !== null && daysUntilDeadline(getApplicationDeadline(job))! <= 0 && (
                  <div className="mt-2 text-sm text-red-500">
                    Application deadline has passed
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.salary && (
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">$</div>
                  <div>
                    <div className="font-medium">Salary</div>
                    <div className="text-sm text-gray-500">{job.salary}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-gray-500">{job.location}</div>
                </div>
              </div>
              
              {/* New field: Years of Experience */}
              <div className="flex items-start space-x-3">
                <BriefcaseBusiness className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">Years of Experience</div>
                  <div className="text-sm text-gray-500">{job.yearsOfExperience || 0} years</div>
                </div>
              </div>
              
              {/* New field: Number of Roles */}
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">Number of Positions</div>
                  <div className="text-sm text-gray-500">{job.numberOfRoles || 1}</div>
                </div>
              </div>
              
              {/* New field: Shortlist Size */}
              <div className="flex items-start space-x-3">
                <UserIcon className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">Shortlist Size</div>
                  <div className="text-sm text-gray-500">{job.shortlistSize || 5} candidates</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">Posted On</div>
                  <div className="text-sm text-gray-500">{formatDate(job.createdAt)}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">Application Deadline</div>
                  <div className="text-sm text-gray-500">{formatDate(getApplicationDeadline(job))}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MessageSquare className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">Contact Email</div>
                  <div className="text-sm text-gray-500">{job.contactEmail}</div>
                </div>
              </div>
              
              {/* New field: Application URL */}
              {job.applicationUrl && (
                <div className="flex items-start space-x-3">
                  <LinkIcon className="h-5 w-5 mt-0.5 text-gray-500" />
                  <div>
                    <div className="font-medium">Application URL</div>
                    <div className="text-sm text-blue-500 hover:text-blue-700">
                      <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                        Apply externally
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
