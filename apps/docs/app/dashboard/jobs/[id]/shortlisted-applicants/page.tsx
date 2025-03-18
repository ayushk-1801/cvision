import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { ShortlistedApplicantsClient } from './shortlisted-applicants-client';
import { cookies } from 'next/headers';

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface CVAnalysis {
  similarity: number;
  reason: string;
  n_years: number;
  skills: string;
  projects: string;
}

interface Application {
  id: string;
  status: string;
  coverLetter: string | null;
  resumeUrl: string | null;
  createdAt: string;
  updatedAt: string;
  notes: string | null;
  interviewDate: string | null;
  applicant: User;
  matchScore: number | null;
  phoneNumber: string | null;
  linkedinProfile: string | null;
  portfolioWebsite: string | null;
  cvAnalysis: CVAnalysis | null;
}

interface JobSummary {
  id: string;
  title: string;
  company: string;
  shortlistSize: number;
}

export default async function ShortlistedApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = cookies();
  const cookieString = await cookieStore.toString();
  const jobId = (await params).id;
  
  // Fetch data server-side
  let job: JobSummary | null = null;
  let applicants: Application[] = [];
  let error: string | null = null;
  
  try {
    // Use absolute URL for API calls from server components
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';
    const apiUrl = new URL(`/api/jobs/${jobId}/applicants`, baseUrl);
    apiUrl.searchParams.append('shortlisted', 'true');
    
    console.log('Fetching from URL:', apiUrl.toString());
    
    const response = await fetch(apiUrl.toString(), {
      cache: 'no-store',
      headers: {
        'Cookie': cookieString
      },
      next: { tags: [`job-${jobId}`] }
    });
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 403) {
        error = 'You are not authorized to view this job\'s applicants';
      } else if (response.status === 404) {
        error = 'Job not found';
      } else {
        error = 'Something went wrong';
      }
      
      // Log more details about the error
      const errorText = await response.text();
      console.error('Error response:', errorText);
    } else {
      const data = await response.json();
      job = data.job;
      applicants = data.applicants;
    }
  } catch (err) {
    console.error('Error fetching shortlisted applicants:', err);
    error = 'Failed to load shortlisted applicants';
  }
  
  // Error state
  if (error) {
    return (
      <div className="container py-4 sm:py-6 lg:py-10 mx-auto px-4 sm:px-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="text-center py-6 sm:py-10">
              <h3 className="text-lg font-medium text-red-500 mb-2">
                {error}
              </h3>
              <p className="text-slate-500 mb-4 sm:mb-6 max-w-md mx-auto">
                You might not have permission to view this page, or the job might not exist.
              </p>
              <Button asChild>
                <a href={`/dashboard/jobs/${jobId}`}>Go Back</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Pass data to the client component
  return (
    <div className="container py-4 sm:py-6 lg:py-10 mx-auto px-4 sm:px-6">
      <div className="mb-4 sm:mb-6">
        <Button variant="ghost" size="sm" asChild className="h-8 sm:h-9">
          <a href={`/dashboard/jobs/${jobId}`} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span>Back to job details</span>
          </a>
        </Button>
      </div>
      
      <ShortlistedApplicantsClient job={job} applicants={applicants} jobId={jobId} />
    </div>
  );
}

// Users icon component
function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
