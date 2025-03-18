import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ApplicantsClient from './components/ApplicantsClient';

export default async function ApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await the params to extract the id
  return (
    <div className="container px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 mx-auto">
      <div className="mb-4 sm:mb-6">
        <Button variant="ghost" size="sm" asChild className="hover:bg-slate-100">
          <a href={`/dashboard/jobs/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to job details</span>
            <span className="sm:hidden">Back</span>
          </a>
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl">Applicants</CardTitle>
          <CardDescription className="text-sm">
            View and manage applicants for this job posting
          </CardDescription>
        </CardHeader>
        
        <ApplicantsClient jobId={id} />
      </Card>
    </div>
  );
}
