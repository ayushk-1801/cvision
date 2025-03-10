"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Download,
  Mail,
  Eye,
  FileDown,
  BarChart,
  Calendar,
  Phone,
  Link as LinkIcon,
  Linkedin,
} from "lucide-react";
import { useUser } from "@/lib/hooks/use-user";

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

export default function ShortlistedApplicantsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<JobSummary | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Application[]>([]);
  
  // Filter states
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchShortlistedApplicants = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/jobs/${params.id}/applicants?shortlisted=true`);
        
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
        
        // The applicants are already sorted by matchScore in the API
        setApplicants(data.applicants);
        setFilteredApplicants(data.applicants);
      } catch (err) {
        console.error('Error fetching shortlisted applicants:', err);
        setError(err instanceof Error ? err.message : 'Failed to load shortlisted applicants');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShortlistedApplicants();
  }, [params.id, user]);

  // Update filtered applicants when search term or score filter changes
  useEffect(() => {
    let filtered = [...applicants];
    
    // Apply search term filter
    if (searchTerm.trim() !== "") {
      const normalizedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.applicant.name.toLowerCase().includes(normalizedSearch) ||
        app.applicant.email.toLowerCase().includes(normalizedSearch) ||
        (app.cvAnalysis && app.cvAnalysis.skills && app.cvAnalysis.skills.toLowerCase().includes(normalizedSearch)) ||
        (app.cvAnalysis && app.cvAnalysis.reason && app.cvAnalysis.reason.toLowerCase().includes(normalizedSearch))
      );
    }
    
    // Apply score filter
    if (scoreFilter !== "all") {
      switch (scoreFilter) {
        case "high":
          filtered = filtered.filter(app => 
            (app.cvAnalysis?.similarity || 0) >= 0.8);
          break;
        case "medium":
          filtered = filtered.filter(app => 
            (app.cvAnalysis?.similarity || 0) >= 0.5 && 
            (app.cvAnalysis?.similarity || 0) < 0.8);
          break;
        case "low":
          filtered = filtered.filter(app => 
            (app.cvAnalysis?.similarity || 0) < 0.5);
          break;
      }
    }
    
    setFilteredApplicants(filtered);
  }, [searchTerm, scoreFilter, applicants]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMatchScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-100 text-gray-800 hover:text-gray-900 hover:bg-gray-200";
    
    if (score >= 0.8) return "bg-green-100 text-green-800 hover:text-green-900 hover:bg-green-200";
    if (score >= 0.5) return "bg-yellow-100 text-yellow-800 hover:text-yellow-900 hover:bg-yellow-200";
    return "bg-red-100 text-red-800 hover:text-red-900 hover:bg-red-200";
  };
  
  const formatSkills = (skills: string) => {
    return skills.split(',').map(skill => skill.trim()).filter(Boolean);
  };

  // Loading and error states remain unchanged
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
        <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/jobs/${params.id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to job details
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Shortlisted Applicants</CardTitle>
          <CardDescription>
            {job?.title} at {job?.company} — {filteredApplicants.length} of {job?.shortlistSize} shortlist positions filled
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Filters and search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search by name, email or skills"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                value={scoreFilter}
                onValueChange={setScoreFilter}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <BarChart className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="high">High (80%+)</SelectItem>
                  <SelectItem value="medium">Medium (50-79%)</SelectItem>
                  <SelectItem value="low">Low (less than 50%)</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredApplicants.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 border border-slate-100 rounded-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Users className="h-6 w-6 text-slate-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-900">No shortlisted applicants found</h3>
          <p className="mt-2 text-sm text-slate-500">
            {searchTerm || scoreFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'You have not shortlisted any candidates for this job yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredApplicants.map((application) => (
            <Card key={application.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {application.applicant.image ? (
                        <AvatarImage src={application.applicant.image} alt={application.applicant.name} />
                      ) : (
                        <AvatarFallback>{application.applicant.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{application.applicant.name}</CardTitle>
                      <CardDescription>{application.applicant.email}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getMatchScoreColor(application.cvAnalysis?.similarity || null)}>
                    {application.cvAnalysis?.similarity !== undefined 
                      ? `${Math.round(application.cvAnalysis.similarity * 100)}%` 
                      : 'N/A'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                {/* Contact Information */}
                <div className="flex flex-wrap gap-3 mb-4 text-sm text-muted-foreground">
                  {application.phoneNumber && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{application.phoneNumber}</span>
                    </div>
                  )}
                  {application.linkedinProfile && (
                    <div className="flex items-center gap-1">
                      <Linkedin className="h-3.5 w-3.5" />
                      <a href={application.linkedinProfile} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
                    </div>
                  )}
                  {application.portfolioWebsite && (
                    <div className="flex items-center gap-1">
                      <LinkIcon className="h-3.5 w-3.5" />
                      <a href={application.portfolioWebsite} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Applied {formatDate(application.createdAt)}</span>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                {application.cvAnalysis ? (
                  <div className="space-y-4">
                    {/* Analysis Reason */}
                    <div>
                      <h4 className="font-medium text-sm mb-1">Analysis</h4>
                      <p className="text-sm text-slate-700">{application.cvAnalysis.reason}</p>
                    </div>
                    
                    {/* Experience */}
                    <div>
                      <h4 className="font-medium text-sm mb-1">Experience</h4>
                      <p className="text-sm text-slate-700">
                        {application.cvAnalysis.n_years} {application.cvAnalysis.n_years === 1 ? 'year' : 'years'} of relevant experience
                      </p>
                    </div>
                    
                    {/* Skills */}
                    {application.cvAnalysis.skills && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {formatSkills(application.cvAnalysis.skills).map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-slate-50">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Projects */}
                    {application.cvAnalysis.projects && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Projects</h4>
                        <p className="text-sm text-slate-700 whitespace-pre-line">
                          {application.cvAnalysis.projects}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm italic text-slate-500">No CV analysis available for this applicant.</p>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={!application.resumeUrl}
                  title={application.resumeUrl ? "Download Resume" : "No resume available"}
                  onClick={() => application.resumeUrl && window.open(`${process.env.NEXT_PUBLIC_API_URL_WEB}${application.resumeUrl}`, '_blank')}
                >
                  <FileDown className="h-4 w-4 mr-1" />
                  Resume
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `mailto:${application.applicant.email}`}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Contact
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push(`/dashboard/jobs/${params.id}/applicants/${application.id}`)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
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
