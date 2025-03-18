"use client";

import React, { useState, useEffect } from 'react';
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
  Search,
  Download,
  Mail,
  FileDown,
  BarChart,
  Calendar,
  Phone,
  Link as LinkIcon,
  Linkedin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface ShortlistedApplicantsClientProps {
  job: JobSummary | null;
  applicants: Application[];
  jobId: string;
}

export function ShortlistedApplicantsClient({ job, applicants, jobId }: ShortlistedApplicantsClientProps) {
  const router = useRouter();
  const [filteredApplicants, setFilteredApplicants] = useState<Application[]>(applicants);
  
  // Filter states
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Declaration states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const declareResults = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/jobs/${jobId}/declare-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shortlistedApplicantIds: applicants.map(app => app.id)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to declare results');
      }

      // Redirect to the job details page
      router.push(`/dashboard/jobs/${jobId}`);
    } catch (err) {
      console.error('Error declaring results:', err);
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="sm:p-6 pb-2 sm:pb-3">
          <CardTitle className="text-xl sm:text-2xl">Shortlisted Applicants</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {job?.title} at {job?.company} — {filteredApplicants.length} of {job?.shortlistSize} shortlist positions filled
          </CardDescription>
        </CardHeader>
        
        <CardContent className="sm:p-6 pt-2 sm:pt-3">
          {/* Filters and search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-[260px] md:w-[320px]">
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
                <SelectTrigger className="w-full sm:w-[160px]">
                  <BarChart className="h-4 w-4 mr-2 flex-shrink-0" />
                  <SelectValue placeholder="Filter by score" className="text-sm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="high">High (80%+)</SelectItem>
                  <SelectItem value="medium">Medium (50-79%)</SelectItem>
                  <SelectItem value="low">Low (less than 50%)</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add Declare Result button */}
          {applicants.length > 0 && (
            <div className="border-t pt-3 sm:pt-4 flex justify-end">
              <Button 
                variant="default" 
                onClick={() => setShowConfirmDialog(true)}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                <CheckCircle className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span>Declare Results</span>
                {isSubmitting && <span className="ml-2">...</span>}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-[95%] w-[450px] p-4 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Declare Results</AlertDialogTitle>
            <AlertDialogDescription>
              This action will update the status of all applications for this job. 
              The {applicants.length} shortlisted applicants will be set to &quot;reviewing&quot; 
              and all other applicants will be marked as &quot;rejected&quot;.
              <div className="mt-2 flex items-center text-amber-600">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                This action cannot be undone.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel disabled={isSubmitting} className="mt-2 sm:mt-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                declareResults();
              }}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Processing..." : "Confirm & Declare Results"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {filteredApplicants.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4 bg-slate-50 border border-slate-100 rounded-md">
          <div className="mx-auto flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full bg-slate-100">
            <Users className="h-5 sm:h-6 w-5 sm:w-6 text-slate-600" />
          </div>
          <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-slate-900">No shortlisted applicants found</h3>
          <p className="mt-1 sm:mt-2 text-sm text-slate-500 max-w-sm mx-auto">
            {searchTerm || scoreFilter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'You have not shortlisted any candidates for this job yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredApplicants.map((application) => (
            <Card key={application.id} className="overflow-hidden">
              <CardHeader className="p-4 sm:p-6 pb-2">
                <div className="flex flex-wrap sm:flex-nowrap justify-between items-start gap-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                      {application.applicant.image ? (
                        <AvatarImage src={application.applicant.image} alt={application.applicant.name} />
                      ) : (
                        <AvatarFallback>{application.applicant.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="overflow-hidden">
                      <CardTitle className="text-base sm:text-lg truncate">{application.applicant.name}</CardTitle>
                      <CardDescription className="truncate text-xs sm:text-sm">{application.applicant.email}</CardDescription>
                    </div>
                  </div>
                  <Badge className={`${getMatchScoreColor(application.cvAnalysis?.similarity || null)} ml-auto sm:ml-0 mt-1 sm:mt-0 text-xs sm:text-sm`}>
                    {application.cvAnalysis?.similarity !== undefined 
                      ? `${Math.round(application.cvAnalysis.similarity * 100)}%` 
                      : 'N/A'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6 pt-0 pb-2">
                {/* Contact Information */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">
                  {application.phoneNumber && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 sm:h-3.5 w-3 sm:w-3.5 flex-shrink-0" />
                      <span className="truncate max-w-[140px] sm:max-w-none">{application.phoneNumber}</span>
                    </div>
                  )}
                  {application.linkedinProfile && (
                    <div className="flex items-center gap-1">
                      <Linkedin className="h-3 sm:h-3.5 w-3 sm:w-3.5 flex-shrink-0" />
                      <a href={application.linkedinProfile} target="_blank" rel="noreferrer" className="hover:underline truncate max-w-[80px] sm:max-w-none">LinkedIn</a>
                    </div>
                  )}
                  {application.portfolioWebsite && (
                    <div className="flex items-center gap-1">
                      <LinkIcon className="h-3 sm:h-3.5 w-3 sm:w-3.5 flex-shrink-0" />
                      <a href={application.portfolioWebsite} target="_blank" rel="noreferrer" className="hover:underline truncate max-w-[80px] sm:max-w-none">Portfolio</a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 sm:h-3.5 w-3 sm:w-3.5 flex-shrink-0" />
                    <span>Applied {formatDate(application.createdAt)}</span>
                  </div>
                </div>
                
                <Separator className="my-2 sm:my-3" />
                
                {application.cvAnalysis ? (
                  <div className="space-y-3 sm:space-y-4">
                    {/* Analysis Reason */}
                    <div>
                      <h4 className="font-medium text-xs sm:text-sm mb-0.5 sm:mb-1">Analysis</h4>
                      <p className="text-xs sm:text-sm text-slate-700 line-clamp-3">{application.cvAnalysis.reason}</p>
                    </div>
                    
                    {/* Experience */}
                    <div>
                      <h4 className="font-medium text-xs sm:text-sm mb-0.5 sm:mb-1">Experience</h4>
                      <p className="text-xs sm:text-sm text-slate-700">
                        {application.cvAnalysis.n_years} {application.cvAnalysis.n_years === 1 ? 'year' : 'years'} of relevant experience
                      </p>
                    </div>
                    
                    {/* Skills */}
                    {application.cvAnalysis.skills && (
                      <div>
                        <h4 className="font-medium text-xs sm:text-sm mb-1 sm:mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {formatSkills(application.cvAnalysis.skills).slice(0, 8).map((skill, index) => (
                            <Badge key={index} variant="outline" className="bg-slate-50 text-xs py-0">
                              {skill}
                            </Badge>
                          ))}
                          {formatSkills(application.cvAnalysis.skills).length > 8 && (
                            <Badge variant="outline" className="bg-slate-50 text-xs py-0">
                              +{formatSkills(application.cvAnalysis.skills).length - 8} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Projects - limit to 2 lines */}
                    {application.cvAnalysis.projects && (
                      <div>
                        <h4 className="font-medium text-xs sm:text-sm mb-0.5 sm:mb-1">Projects</h4>
                        <p className="text-xs sm:text-sm text-slate-700 line-clamp-2">
                          {application.cvAnalysis.projects}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm italic text-slate-500">No CV analysis available for this applicant.</p>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-end gap-2 p-4 sm:p-6 pt-2 sm:pt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={!application.resumeUrl}
                  title={application.resumeUrl ? "Download Resume" : "No resume available"}
                  onClick={() => application.resumeUrl && window.open(`${process.env.NEXT_PUBLIC_API_URL_WEB}${application.resumeUrl}`, '_blank')}
                  className="h-8 text-xs sm:text-sm"
                >
                  <FileDown className="h-3 sm:h-4 w-3 sm:w-4 mr-1 flex-shrink-0" />
                  Resume
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `mailto:${application.applicant.email}`}
                  className="h-8 text-xs sm:text-sm"
                >
                  <Mail className="h-3 sm:h-4 w-3 sm:w-4 mr-1 flex-shrink-0" />
                  Contact
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

// Export Users component explicitly to avoid webpack issues
export function Users(props: React.SVGProps<SVGSVGElement>) {
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
