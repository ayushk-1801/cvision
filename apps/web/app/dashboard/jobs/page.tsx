"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchJobs } from "@/lib/api-helpers";
import JobCard from "@/components/jobs/job-card";
import { 
  Search, 
  Filter,
  PlusCircle,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  isRemote: boolean;
  createdAt: string;
  industry: string | null;
  jobType: string | null;
  experienceLevel: string | null;
  _count: {
    applications: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface JobsResponse {
  jobs: Job[];
  pagination: Pagination;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  
  // Search and filter state
  const [search, setSearch] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [jobType, setJobType] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [isRemote, setIsRemote] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const loadJobs = async (page = 1) => {
    try {
      setIsLoading(true);
      
      const queryParams: any = { page };
      
      if (search) queryParams.search = search;
      if (location) queryParams.location = location;
      if (industry) queryParams.industry = industry;
      if (jobType) queryParams.jobType = jobType;
      if (experienceLevel) queryParams.experienceLevel = experienceLevel;
      if (isRemote !== '') queryParams.isRemote = isRemote === 'true';
      
      const data: JobsResponse = await fetchJobs(queryParams);
      
      setJobs(data.jobs);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again.');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []); // Load jobs on initial render

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadJobs(1); // Reset to first page when searching
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setIndustry('');
    setJobType('');
    setExperienceLevel('');
    setIsRemote('');
    loadJobs(1);
  };

  return (
    <div className="container py-6 md:py-10 px-4 md:px-6 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Job Listings</h1>
          <p className="text-slate-500">Browse and manage job opportunities</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </div>
      
      {/* Search & Filters */}
      <div className="mb-6 md:mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs by title, company or keywords..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 sm:flex-none">Search</Button>
                <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={handleReset}>Reset</Button>
              </div>
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Location</label>
                  <Input
                    placeholder="Any location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Industry</label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Any industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any industry</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Job Type</label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Any job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any job type</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Experience Level</label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Any experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any experience</SelectItem>
                      <SelectItem value="Entry-level">Entry-level</SelectItem>
                      <SelectItem value="Mid-level">Mid-level</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Remote Work</label>
                  <Select value={isRemote} onValueChange={setIsRemote}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Any workplace" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any workplace</SelectItem>
                      <SelectItem value="true">Remote only</SelectItem>
                      <SelectItem value="false">On-site only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </form>
      </div>
      
      {/* Results */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="w-full">
              <CardContent className="p-4 md:p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 md:h-8 w-full md:w-1/3" />
                  <Skeleton className="h-4 w-2/3 md:w-1/4" />
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    <Skeleton className="h-4 w-1/3 md:w-1/5" />
                    <Skeleton className="h-4 w-1/4 md:w-1/6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="text-center">
              <p className="text-red-500">{error}</p>
              <Button onClick={() => loadJobs()} className="mt-4">Try Again</Button>
            </div>
          </CardContent>
        </Card>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="p-6 md:p-10">
            <div className="text-center">
              <h3 className="text-lg font-medium">No jobs found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your search filters</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} isDashboard={false} />
          ))}
          
          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center mt-6 md:mt-8 gap-2">
              <Button 
                variant="outline" 
                disabled={!pagination.hasPrevPage}
                onClick={() => loadJobs(pagination.page - 1)}
                size="sm"
                className="h-9"
              >
                Previous
              </Button>
              
              <div className="flex items-center px-2 md:px-4 text-sm">
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                disabled={!pagination.hasNextPage}
                onClick={() => loadJobs(pagination.page + 1)}
                size="sm"
                className="h-9"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}