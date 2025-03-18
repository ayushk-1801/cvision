"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
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
  Mail,
  User,
  DollarSign
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  responsibilities: string;
  salary: string | null;
  isRemote: boolean;
  createdAt: string;
  industry: string | null;
  jobType: string | null;
  experienceLevel: string | null;
  expiresAt?: string;
  yearsOfExperience?: number;
  numberOfRoles?: number;
  contactEmail?: string;
  applicationUrl?: string;
  recruiter: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  _count: {
    applications: number;
  };
}

interface JobDetailsProps {
  jobId: string;
  initialJobData?: Job;
}

export default function JobDetails({ jobId, initialJobData }: JobDetailsProps) {
  const [job, setJob] = useState<Job | null>(initialJobData || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialJobData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialJobData) return; // Skip fetching if we have initial data

    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/jobs/${jobId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        
        const data = await response.json();
        setJob(data);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, initialJobData]);

  if (isLoading) {
    return (
      <div className="container px-4 sm:px-6 py-6 sm:py-10 mx-auto">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <Skeleton className="h-3 sm:h-4 w-28 sm:w-40" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <Skeleton className="h-5 sm:h-6 w-32 sm:w-40" />
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Skeleton className="h-5 sm:h-6 w-20 sm:w-24" />
                  <Skeleton className="h-5 sm:h-6 w-24 sm:w-32" />
                  <Skeleton className="h-5 sm:h-6 w-20 sm:w-28" />
                </div>
                
                <div>
                  <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 mb-2" />
                  <Skeleton className="h-3 sm:h-4 w-full mb-1" />
                  <Skeleton className="h-3 sm:h-4 w-full mb-1" />
                  <Skeleton className="h-3 sm:h-4 w-3/4" />
                </div>
                
                <div>
                  <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 mb-2" />
                  <Skeleton className="h-3 sm:h-4 w-full mb-1" />
                  <Skeleton className="h-3 sm:h-4 w-full mb-1" />
                  <Skeleton className="h-3 sm:h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <Skeleton className="h-5 sm:h-6 w-32 sm:w-40" />
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5" />
                  <div>
                    <Skeleton className="h-4 sm:h-5 w-16 sm:w-20 mb-1" />
                    <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5" />
                  <div>
                    <Skeleton className="h-4 sm:h-5 w-16 sm:w-20 mb-1" />
                    <Skeleton className="h-3 sm:h-4 w-20 sm:w-28" />
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5" />
                  <div>
                    <Skeleton className="h-4 sm:h-5 w-16 sm:w-20 mb-1" />
                    <Skeleton className="h-3 sm:h-4 w-28 sm:w-36" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 sm:h-10 w-full" />
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 sm:pb-4">
                <Skeleton className="h-5 sm:h-6 w-24 sm:w-32" />
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5" />
                  <Skeleton className="h-4 sm:h-5 w-32 sm:w-40" />
                </div>
                
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5" />
                  <div>
                    <Skeleton className="h-4 sm:h-5 w-16 sm:w-20 mb-1" />
                    <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5" />
                  <div>
                    <Skeleton className="h-4 sm:h-5 w-16 sm:w-20 mb-1" />
                    <Skeleton className="h-3 sm:h-4 w-28 sm:w-36" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container px-4 sm:px-6 py-6 sm:py-10 mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Job not found or no longer active.'}
        </div>
      </div>
    );
  }

  const formattedCreatedAt = format(new Date(job.createdAt), 'PPP');
  const formattedDeadline = job.expiresAt ? format(new Date(job.expiresAt), 'PPP') : 'No deadline';

  return (
    <div className="container px-4 sm:px-6 py-6 sm:py-10 mx-auto">
      <div className="mb-4 sm:mb-6">
        <Button variant="ghost" className="mb-2 sm:mb-4 px-2 sm:px-4 h-8 sm:h-10" asChild>
          <Link href="/dashboard/jobs" className="flex items-center">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Back to Job Listings</span>
          </Link>
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">{job.title}</h1>
        <div className="flex items-center space-x-2 mt-1 sm:mt-2">
          <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
          <span className="text-sm sm:text-base">{job.company}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                {job.jobType && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm">
                    {job.jobType}
                  </Badge>
                )}
                {job.experienceLevel && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs sm:text-sm">
                    {job.experienceLevel}
                  </Badge>
                )}
                {job.industry && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs sm:text-sm">
                    {job.industry}
                  </Badge>
                )}
                {job.isRemote && (
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs sm:text-sm">
                    Remote
                  </Badge>
                )}
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Description</h3>
                <div className="prose max-w-none prose-sm sm:prose-base">
                  <p className="whitespace-pre-wrap text-sm sm:text-base">{job.description}</p>
                </div>
              </div>
              
              {job.requirements && (
                <div>
                  <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Requirements</h3>
                  <div className="prose max-w-none prose-sm sm:prose-base">
                    <p className="whitespace-pre-wrap text-sm sm:text-base">{job.requirements}</p>
                  </div>
                </div>
              )}
              
              {job.responsibilities && (
                <div>
                  <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Responsibilities</h3>
                  <div className="prose max-w-none prose-sm sm:prose-base">
                    <p className="whitespace-pre-wrap text-sm sm:text-base">{job.responsibilities}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {job.salary && (
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <span className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0">₹</span>
                  <div>
                    <div className="font-medium text-sm sm:text-base">Salary</div>
                    <div className="text-xs sm:text-sm text-gray-500">{job.salary} Per Annum</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-2 sm:space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Location</div>
                  <div className="text-xs sm:text-sm text-gray-500 break-words">{job.location}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3">
                <BriefcaseBusiness className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Years of Experience</div>
                  <div className="text-xs sm:text-sm text-gray-500">{job.yearsOfExperience || 0} years</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Number of Positions</div>
                  <div className="text-xs sm:text-sm text-gray-500">{job.numberOfRoles || 1}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Posted On</div>
                  <div className="text-xs sm:text-sm text-gray-500">{formattedCreatedAt}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Application Deadline</div>
                  <div className="text-xs sm:text-sm text-gray-500">{formattedDeadline}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {job.applicationUrl ? (
                <Button className="w-full text-sm sm:text-base h-9 sm:h-10" asChild>
                  <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                    Apply Now
                  </a>
                </Button>
              ) : (
                <Button className="w-full text-sm sm:text-base h-9 sm:h-10" asChild>
                  <Link href={`/dashboard/jobs/${job.id}/apply`}>
                    Apply Now
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">{job.company}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Location</div>
                  <div className="text-xs sm:text-sm text-gray-500 break-words">{job.location}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Contact</div>
                  <div className="text-xs sm:text-sm text-gray-500 break-words">{job.contactEmail || job.recruiter.email}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 sm:space-x-3">
                <User className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Recruiter</div>
                  <div className="text-xs sm:text-sm text-gray-500">{job.recruiter.name}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
