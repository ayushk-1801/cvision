"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  description?: string;
  yearsOfExperience?: number;
  shortlistSize?: number;
}

interface JobApplicationFormProps {
  job: Job | null;
  error: string | null;
  jobId: string;
}

const applicationSchema = z.object({
  resume: z
    .instanceof(File, { message: "Please upload your resume" })
    .refine((file) => file.size < 5000000, "File size should be less than 5MB"),
  coverLetter: z.string().optional(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  linkedinProfile: z.string().optional(),
  portfolioWebsite: z.string().optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export default function JobApplicationForm({ job, error: initialError, jobId }: JobApplicationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(initialError);
  
  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: "",
      phoneNumber: "",
      linkedinProfile: "",
      portfolioWebsite: "",
    },
  });

  const onSubmit = async (data: ApplicationForm) => {
    try {
      setIsSubmitting(true);

      // Create form data for file upload
      const formData = new FormData();
      formData.append("resume", data.resume);
      formData.append("jobId", jobId);

      if (data.coverLetter) {
        formData.append("coverLetter", data.coverLetter);
      }

      formData.append("phoneNumber", data.phoneNumber);

      if (data.linkedinProfile) {
        formData.append("linkedinProfile", data.linkedinProfile);
      }

      if (data.portfolioWebsite) {
        formData.append("portfolioWebsite", data.portfolioWebsite);
      }

      // Send job details for backend processing
      if (job) {
        formData.append("jobTitle", job.title);
        formData.append("jobDescription", job.description || "");
        formData.append("yearsOfExperience", String(job.yearsOfExperience || 0));
        formData.append("shortlistSize", String(job.shortlistSize || 5));
      }

      // Submit the application (resume analysis will happen on the server)
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit application");
      }

      // Redirect to applications page
      router.push("/dashboard/applications");
    } catch (err: any) {
      console.error("Error submitting application:", err);
      setError(
        err.message || "Failed to submit application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (!job && !error) {
    return (
      <div className="container px-4 sm:px-6 py-6 sm:py-10 mx-auto">
        <div className="mb-4 sm:mb-6">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader className="px-4 sm:px-6">
            <Skeleton className="h-6 w-full sm:w-64 mb-2" />
            <Skeleton className="h-4 w-3/4 sm:w-48" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-24 sm:h-32 w-full" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-4 sm:px-6">
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error || !job) {
    return (
      <div className="container px-4 sm:px-6 py-6 sm:py-10 mx-auto">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center py-6 sm:py-10">
              <h3 className="text-lg font-medium text-red-500 mb-2">
                {error || "Job not found"}
              </h3>
              <p className="text-slate-500 mb-4 sm:mb-6">
                We couldn't load this job posting. It may have been removed or
                there was an error.
              </p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Normal form state
  return (
    <div className="container px-4 sm:px-6 py-6 sm:py-10 mx-auto">
      <div className="mb-4 sm:mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to job
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl break-words">Apply for {job.title}</CardTitle>
          <CardDescription className="text-sm sm:text-base">{job.company}</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-4 sm:space-y-6">
                <FormField
                  control={form.control}
                  name="resume"
                  render={({ field: { onChange, value, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Resume (PDF, DOC, DOCX) *</FormLabel>
                      <FormControl>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                onChange(e.target.files[0]);
                              }
                            }}
                            className="w-full"
                            {...fieldProps}
                          />
                          <Upload className="hidden sm:block h-5 w-5 text-slate-500 flex-shrink-0" />
                        </div>
                      </FormControl>
                      <FormMessage />
                      {form.getValues("resume") && (
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 break-words">
                          Selected file: {form.getValues("resume").name}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-medium text-sm sm:text-base">
                    Additional Information (Optional)
                  </h3>

                  <FormField
                    control={form.control}
                    name="linkedinProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn Profile</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://linkedin.com/in/yourprofile"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="portfolioWebsite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio Website</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://yourportfolio.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 p-2 sm:p-3 rounded border border-red-200 text-red-600 text-xs sm:text-sm">
                    {error}
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 p-4 sm:p-6 mt-2 sm:mt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
