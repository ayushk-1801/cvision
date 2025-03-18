"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

interface Recruiter {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

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
  recruiter: Recruiter;
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

interface JobDetailsClientProps {
  job: Job;
  isRecruiter: boolean;
}

export default function JobDetailsClient({ job: initialJob, isRecruiter }: JobDetailsClientProps) {
  const router = useRouter();
  const [job, setJob] = useState<Job>(initialJob);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

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

  return (
    <div className="container py-6 md:py-10 mx-auto px-4 sm:px-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="self-start">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to jobs
        </Button>
        
        {isRecruiter && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/jobs/${job.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Edit Job</span>
                <span className="sm:hidden">Edit</span>
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
                  <span className="hidden sm:inline">{job.isActive ? 'Deactivating...' : 'Activating...'}</span>
                  <span className="sm:hidden">Loading...</span>
                </>
              ) : job.isActive ? (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Deactivate</span>
                  <span className="sm:hidden">Deact.</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Activate</span>
                  <span className="sm:hidden">Act.</span>
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/jobs/${job.id}/applicants`}>
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">View Applicants</span>
                <span className="sm:hidden">Applicants</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      {!job.isActive && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-500 h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
            <p className="text-yellow-700 text-sm sm:text-base">
              This job listing is currently inactive and not visible to job seekers.
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                <h1 className="text-xl md:text-2xl font-bold">{job.title}</h1>
                <div className="flex-shrink-0">
                  {job.isActive && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                  )}
                  {!job.isActive && (
                    <Badge variant="outline" className="text-slate-500">Inactive</Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500 text-sm md:text-base">
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
                    {job.salary && `${job.salary}`}
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
              
              <Separator className="my-4 sm:my-6" />
              <div className="prose max-w-none text-sm sm:text-base">
                <div className="whitespace-pre-wrap">{job.description}</div>
              </div>
            </CardContent>
          </Card>
          
          {job.requirements && (
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-lg md:text-xl">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-sm sm:text-base">
                  <div className="whitespace-pre-wrap">{job.requirements}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-4 md:space-y-6">
          {isRecruiter ? (
            <>
              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-lg md:text-xl">Job Statistics</CardTitle>
                  <CardDescription className="text-sm">Performance metrics for this job listing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Total Applicants</span>
                      <span className="font-semibold">{job._count.applications}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Job Status</span>
                      <span>
                        {job.isActive ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-100">Inactive</Badge>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm">Posted On</span>
                      <span className="text-sm">{formatDate(job.createdAt)}</span>
                    </div>
                    {getApplicationDeadline(job) && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-sm">Application Deadline</span>
                        <div className="text-right">
                          <div className="text-sm">{formatDate(getApplicationDeadline(job))}</div>
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
                        <span className="text-slate-500 text-sm">Listing Expires</span>
                        <span className="text-sm">{formatDate(job.expiresAt)}</span>
                      </div>
                    )}
                  </div>
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full text-sm" asChild>
                      <Link href={`/dashboard/jobs/${job.id}/shortlisted-applicants`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Shortlisted Applicants
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-3 sm:mb-4">Apply for this position</h3>
                  <p className="text-slate-500 text-sm mb-4 sm:mb-6">
                    Submit your application now and hear back from the hiring team.
                  </p>
                  <Link href={`/dashboard/jobs/${job.id}/apply`}>
                    <Button className="w-full">Apply Now</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-lg">About the recruiter</CardTitle>
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
                      <p className="font-medium text-sm sm:text-base">{job.recruiter.name}</p>
                      <p className="text-xs sm:text-sm text-slate-500">{job.recruiter.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          
          {getApplicationDeadline(job) && !isRecruiter && (
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-lg">Application Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Deadline</p>
                    <p className="text-xs sm:text-sm text-slate-500">{formatDate(getApplicationDeadline(job))}</p>
                  </div>
                </div>
                
                {daysUntilDeadline(getApplicationDeadline(job)) !== null && daysUntilDeadline(getApplicationDeadline(job))! > 0 && (
                  <div className="mt-2 text-xs sm:text-sm text-slate-500">
                    {daysUntilDeadline(getApplicationDeadline(job))} days remaining to apply
                  </div>
                )}
                
                {daysUntilDeadline(getApplicationDeadline(job)) !== null && daysUntilDeadline(getApplicationDeadline(job))! <= 0 && (
                  <div className="mt-2 text-xs sm:text-sm text-red-500">
                    Application deadline has passed
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-lg">Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {job.salary && (
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 text-gray-500 flex-shrink-0">$</div>
                  <div>
                    <div className="font-medium text-sm sm:text-base">Salary</div>
                    <div className="text-xs sm:text-sm text-gray-500">{job.salary}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Location</div>
                  <div className="text-xs sm:text-sm text-gray-500">{job.location}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <BriefcaseBusiness className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Years of Experience</div>
                  <div className="text-xs sm:text-sm text-gray-500">{job.yearsOfExperience || 0} years</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Number of Positions</div>
                  <div className="text-xs sm:text-sm text-gray-500">{job.numberOfRoles || 1}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Shortlist Size</div>
                  <div className="text-xs sm:text-sm text-gray-500">{job.shortlistSize || 5} candidates</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Posted On</div>
                  <div className="text-xs sm:text-sm text-gray-500">{formatDate(job.createdAt)}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Application Deadline</div>
                  <div className="text-xs sm:text-sm text-gray-500">{formatDate(getApplicationDeadline(job))}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Contact Email</div>
                  <div className="text-xs sm:text-sm text-gray-500 break-all">{job.contactEmail}</div>
                </div>
              </div>
              
              {job.applicationUrl && (
                <div className="flex items-start space-x-3">
                  <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm sm:text-base">Application URL</div>
                    <div className="text-xs sm:text-sm text-blue-500 hover:text-blue-700 break-all">
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
