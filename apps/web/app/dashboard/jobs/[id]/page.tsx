"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const paramss = await params;

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/jobs/${paramss.id}`);
        
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
  }, [paramss.id]);

  if (isLoading) {
    return (
      <div className="container py-10 mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-3 mb-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-28" />
                </div>
                
                <div>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                
                <div>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <div>
                    <Skeleton className="h-5 w-20 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <div>
                    <Skeleton className="h-5 w-20 mb-1" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <div>
                    <Skeleton className="h-5 w-20 mb-1" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-40" />
                </div>
                
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <div>
                    <Skeleton className="h-5 w-20 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <div>
                    <Skeleton className="h-5 w-20 mb-1" />
                    <Skeleton className="h-4 w-36" />
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
      <div className="container py-10 mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'Job not found or no longer active.'}
        </div>
      </div>
    );
  }

  const formattedCreatedAt = format(new Date(job.createdAt), 'PPP');
  const formattedDeadline = job.expiresAt ? format(new Date(job.expiresAt), 'PPP') : 'No deadline';

  return (
    <div className="container py-10 mx-auto">
      <div className="mb-6">
        <Button variant="ghost" className="mb-4">
        <Link href="/dashboard/jobs">
          <ArrowLeft className="h-4 w-4 inline mr-1" />
          Back to Job Listings
        </Link>
        </Button>
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <div className="flex items-center space-x-2 mt-2">
          <Building2 className="h-4 w-4 text-gray-500" />
          <span>{job.company}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-3 mb-4">
                {job.jobType && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {job.jobType}
                  </Badge>
                )}
                {job.experienceLevel && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {job.experienceLevel}
                  </Badge>
                )}
                {job.industry && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {job.industry}
                  </Badge>
                )}
                {job.isRemote && (
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    Remote
                  </Badge>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </div>
              
              {job.requirements && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Requirements</h3>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{job.requirements}</p>
                  </div>
                </div>
              )}
              
              {job.responsibilities && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Responsibilities</h3>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{job.responsibilities}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.salary && (
                <div className="flex items-start space-x-3">
                  <span className="h-5 w-5 mt-0.5 text-gray-500">₹</span>
                  <div>
                  <div className="font-medium">Salary</div>
                  <div className="text-sm text-gray-500">{job.salary} Per Annum</div>
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
              
              <div className="flex items-start space-x-3">
                <BriefcaseBusiness className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">Years of Experience</div>
                  <div className="text-sm text-gray-500">{job.yearsOfExperience || 0} years</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">Number of Positions</div>
                  <div className="text-sm text-gray-500">{job.numberOfRoles || 1}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">Posted On</div>
                  <div className="text-sm text-gray-500">{formattedCreatedAt}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">Application Deadline</div>
                  <div className="text-sm text-gray-500">{formattedDeadline}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {job.applicationUrl ? (
                <Button className="w-full" asChild>
                  <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
                    Apply Now
                  </a>
                </Button>
              ) : (
                <Button className="w-full" asChild>
                  <Link href={`/dashboard/jobs/${job.id}/apply`}>
                    Apply Now
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Building2 className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">{job.company}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-gray-500">{job.location}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">Contact</div>
                  <div className="text-sm text-gray-500">{job.contactEmail || job.recruiter.email}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="font-medium">Recruiter</div>
                  <div className="text-sm text-gray-500">{job.recruiter.name}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
