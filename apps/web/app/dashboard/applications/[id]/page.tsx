"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Building, 
  Calendar, 
  Clock, 
  Download, 
  ExternalLink, 
  FileText, 
  Globe, 
  Loader2,
  MapPin, 
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { format } from 'date-fns';

interface Application {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  resumeUrl: string;
  coverLetter: string | null;
  notes: string | null;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    jobType: string | null;
    isRemote: boolean;
  };
}

const statusIcons: Record<string, React.ReactNode> = {
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

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsedNotes, setParsedNotes] = useState<any>(null);

  const paramss = await params;

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/applications/${paramss.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Application not found');
          }
          throw new Error('Failed to fetch application details');
        }
        
        const data = await response.json();
        setApplication(data);
        
        // Try to parse notes JSON if it exists
        if (data.notes) {
          try {
            setParsedNotes(JSON.parse(data.notes));
          } catch (e) {
            console.error('Failed to parse application notes');
          }
        }
        
      } catch (err: any) {
        console.error('Error fetching application details:', err);
        setError(err.message || 'Failed to load application details');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [paramss.id]);

  if (loading) {
    return (
      <div className="container py-10 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading application details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="container py-10 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.push('/dashboard/applications')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to applications
        </Button>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="text-center">
            <h3 className="text-lg font-medium text-red-700 mb-2">{error}</h3>
            <p className="text-red-600 mb-6">
              We couldn't find the application you're looking for.
            </p>
            <Button onClick={() => router.push('/dashboard/applications')}>
              View All Applications
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => router.push('/dashboard/applications')} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to applications
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Application details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{application.job.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Building className="h-4 w-4 mr-1" />
                    {application.job.company}
                  </CardDescription>
                </div>
                
                <Badge 
                  className={`${statusColors[application.status]} flex items-center gap-1.5 py-1.5 px-3`}
                  variant="outline"
                >
                  {statusIcons[application.status]}
                  {statusLabels[application.status]}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Location</p>
                    <p>{application.job.location}</p>
                    {application.job.isRemote && (
                      <Badge variant="secondary" className="mt-1">Remote</Badge>
                    )}
                  </div>
                </div>
                
                {application.job.jobType && (
                  <div className="flex items-start space-x-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Job Type</p>
                      <p>{application.job.jobType}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Applied On</p>
                    <p>{format(new Date(application.createdAt), 'PPP')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Last Updated</p>
                    <p>{format(new Date(application.updatedAt), 'PPP')}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Job Description</h3>
                  <div className="prose max-w-none">
                    <p>{application.job.description}</p>
                  </div>
                </div>
                
                {application.coverLetter && (
                  <div>
                    <h3 className="font-semibold mb-3">Your Cover Letter</h3>
                    <Card className="bg-gray-50 border-gray-200">
                      <CardContent className="pt-4 whitespace-pre-wrap">
                        {application.coverLetter}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <Link href={application.resumeUrl} target="_blank">
                  <Download className="h-4 w-4 mr-2" />
                  View Resume
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link href={`/dashboard/jobs/${application.job.id}`}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Job Posting
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Sidebar - Application status and additional details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">Current status:</span>
                  <Badge 
                    className={`${statusColors[application.status]} w-fit flex items-center gap-1.5 py-1.5`}
                    variant="outline"
                  >
                    {statusIcons[application.status]}
                    {statusLabels[application.status]}
                  </Badge>
                </div>
                
                {parsedNotes && (
                  <>
                    <Separator />
                    
                    {parsedNotes.phoneNumber && (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Phone Number:</span>
                        <span>{parsedNotes.phoneNumber}</span>
                      </div>
                    )}
                    
                    {parsedNotes.linkedinProfile && (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">LinkedIn Profile:</span>
                        <Link 
                          href={parsedNotes.linkedinProfile}
                          target="_blank"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          {parsedNotes.linkedinProfile}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    )}
                    
                    {parsedNotes.portfolioWebsite && (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Portfolio Website:</span>
                        <Link 
                          href={parsedNotes.portfolioWebsite}
                          target="_blank"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          {parsedNotes.portfolioWebsite}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    )}
                    
                    {parsedNotes.submittedAt && (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Submission Time:</span>
                        <span>{format(new Date(parsedNotes.submittedAt), 'PPP p')}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50">
            <CardContent className="">
              <h3 className="font-medium mb-2">Next Steps</h3>
              {application.status === 'pending' && (
                <p className="text-sm text-muted-foreground">
                  Your application is being processed. The employer will review your application soon.
                </p>
              )}
              
              {application.status === 'reviewing' && (
                <p className="text-sm text-muted-foreground">
                  Good news! The employer is currently reviewing your application. You may be contacted for an interview soon.
                </p>
              )}
              
              {application.status === 'accepted' && (
                <p className="text-sm text-muted-foreground">
                  Congratulations! Your application has been accepted. The employer should be in touch with you shortly.
                </p>
              )}
              
              {application.status === 'rejected' && (
                <p className="text-sm text-muted-foreground">
                  We're sorry, but the employer has decided not to move forward with your application at this time.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
