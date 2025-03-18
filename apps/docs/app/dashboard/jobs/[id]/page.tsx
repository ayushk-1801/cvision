import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import JobDetailsClient from './job-details-client';
import { getSession } from '@/server/users';
import { redirect } from "next/navigation";

async function getJobDetails(id: string) {
  try {
    // Make sure we have an absolute URL for server-side requests
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/jobs/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: "no-store"
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch job details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching job details:', error);
    return null;
  }
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/login');
  }
  
  const job = await getJobDetails((await params).id);
  const userId = session.user.id;
  
  // Show error UI if job couldn't be fetched
  if (!job) {
    return (
      <div className="container py-10 mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-red-500 mb-2">
                Job not found
              </h3>
              <p className="text-slate-500 mb-6">
                We couldn't load this job posting. It may have been removed or there was an error.
              </p>
              <Button asChild>
                <a href="/dashboard/jobs">Go Back</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isRecruiter = userId === job.recruiter.id;

  return <JobDetailsClient job={job} isRecruiter={isRecruiter} />;
}
