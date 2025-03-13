"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent
} from "@/components/ui/hover-card";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Mail,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileDown,
  BarChart2,
} from "lucide-react";
import { useUser } from "@/lib/hooks/use-user";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

// Update interface to match actual data structure
interface CvAnalysis {
  reason?: string;         // Changed from matchReason
  skills?: string;         // This is a string of skills separated by commas
  n_years?: number;        // Number of years of experience
  similarity?: number;          // Changed from similarityScore
  // Add any other fields from the actual data
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
  cvAnalysis: CvAnalysis;  // Updated to match the data structure
}

interface JobSummary {
  id: string;
  title: string;
  company: string;
}

export default async function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<JobSummary | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Application[]>([]);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const paramss = await params;

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/jobs/${paramss.id}/applicants?status=${statusFilter}`);
        
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('You are not authorized to view this job\'s applicants');
          } else if (response.status === 404) {
            throw new Error('Job not found');
          } else {
            throw new Error('Something went wrong');
          }
        }
        
        const data = await response.json();
        setJob(data.job);
        
        // Debug: Log the structure of the first application to see how cvAnalysis is structured
        if (data.applicants.length > 0) {
          console.log('Sample applicant data:', data.applicants[0]);
        }
        
        setApplicants(data.applicants);
        setFilteredApplicants(data.applicants);
      } catch (err) {
        console.error('Error fetching applicants:', err);
        setError(err instanceof Error ? err.message : 'Failed to load applicants');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplicants();
  }, [paramss.id, user, statusFilter]);

  // Update filtered applicants when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredApplicants(applicants);
    } else {
      const normalizedSearch = searchTerm.toLowerCase();
      const filtered = applicants.filter(app => 
        app.applicant.name.toLowerCase().includes(normalizedSearch) ||
        app.applicant.email.toLowerCase().includes(normalizedSearch)
      );
      setFilteredApplicants(filtered);
    }
  }, [searchTerm, applicants]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-slate-100 text-slate-800">Pending</Badge>;
      case "reviewing":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Reviewing</Badge>;
      case "shortlisted":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Shortlisted</Badge>;
      case "interviewing":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Interviewing</Badge>;
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to parse skills string into an array
  const parseSkills = (skillsString?: string): string[] => {
    if (!skillsString) return [];
    return skillsString.split(',').map(skill => skill.trim()).filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="container py-10 mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10 mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-red-500 mb-2">
                {error}
              </h3>
              <p className="text-slate-500 mb-6">
                You might not have permission to view this page, or the job might not exist.
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
        <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/jobs/${paramss.id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to job details
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Applicants</CardTitle>
          <CardDescription>
            {job?.title} at {job?.company} — {filteredApplicants.length} applicant{filteredApplicants.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Filters and search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search by name or email"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {filteredApplicants.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 border border-slate-100 rounded-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Users className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-slate-900">No applicants found</h3>
              <p className="mt-2 text-sm text-slate-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No candidates have applied for this job yet.'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplicants.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className="flex items-center gap-3 cursor-help">
                              <Avatar>
                                {application.applicant.image ? (
                                  <AvatarImage src={application.applicant.image} alt={application.applicant.name} />
                                ) : (
                                  <AvatarFallback>{application.applicant.name.charAt(0)}</AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <div className="font-medium">{application.applicant.name}</div>
                                <div className="text-sm text-slate-500">{application.applicant.email}</div>
                              </div>
                              {application.cvAnalysis && typeof application.cvAnalysis === 'object' && application.cvAnalysis.similarity !== undefined && (
                                <Badge variant="outline" className="ml-2 bg-blue-50">
                                  <BarChart2 className="h-3 w-3 mr-1" />
                                  {Math.round(application.cvAnalysis.similarity * 100)}%
                                </Badge>
                              )}
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">Applicant Match Details</h4>
                              {application.cvAnalysis && typeof application.cvAnalysis === 'object' ? (
                                <>
                                  {application.cvAnalysis.similarity !== undefined && (
                                    <div className="flex flex-col gap-1 mb-2">
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium">Match score:</div>
                                        <div className="font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm">
                                          {Math.round(application.cvAnalysis.similarity * 100)}%
                                        </div>
                                      </div>
                                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                                        <div 
                                          className="bg-blue-600 h-1.5 rounded-full" 
                                          style={{ width: `${Math.round(application.cvAnalysis.similarity * 100)}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {application.cvAnalysis.reason && (
                                    <>
                                      <Separator className="my-2" />
                                      <div className="text-xs text-muted-foreground">
                                        <div className="max-h-28 overflow-y-auto pr-1 custom-scrollbar">
                                          <p className="whitespace-normal break-words">{application.cvAnalysis.reason}</p>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  
                                  {application.cvAnalysis.n_years !== undefined && (
                                    <>
                                      <Separator className="my-2" />
                                      <div className="flex items-center text-xs">
                                        <p className="font-medium mr-2">Experience:</p>
                                        <p>{application.cvAnalysis.n_years} {application.cvAnalysis.n_years === 1 ? 'year' : 'years'}</p>
                                      </div>
                                    </>
                                  )}
                                  
                                  {application.cvAnalysis.skills && (
                                    <>
                                      <Separator className="my-2" />
                                      <div className="text-xs">
                                        <p className="font-medium mb-1">Key skills:</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {parseSkills(application.cvAnalysis.skills).map((skill, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </>
                              ) : (
                                <p className="text-sm text-slate-500">No CV analysis available</p>
                              )}
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(application.status)}
                      </TableCell>
                      <TableCell>
                        {formatDate(application.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            disabled={!application.resumeUrl}
                            title={application.resumeUrl ? "Download Resume" : "No resume available"}
                            onClick={() => application.resumeUrl && window.open(`${process.env.NEXT_PUBLIC_API_URL_WEB}${application.resumeUrl}`, '_blank')}
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.location.href = `mailto:${application.applicant.email}`}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Missing Users icon definition
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
