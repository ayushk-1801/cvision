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

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
              <CardContent className="p-6">
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
              <CardContent className="p-6">
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
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to jobs
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-3">{job.title}</h1>
              
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
                    {job.salary}
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
          
          {job.responsibilities && (
            <Card>
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{job.responsibilities}</div>
                </div>
              </CardContent>
            </Card>
          )}
          
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
          <Card>
            <CardContent className="p-6">
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
              <div className="flex items-center gap-3 mb-4">
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
        </div>
      </div>
    </div>
  );
}
