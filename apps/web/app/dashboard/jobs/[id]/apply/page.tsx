import React from "react";
import JobApplicationForm from "./JobApplicationForm";

export default async function ApplyJobPage({ params }: { params: Promise<{ id: string }> }) {
  // Server-side job fetching
  let job = null;
  let error = null;
  
  try {
    const jobId = (await params).id;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/jobs/${jobId}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error("Failed to fetch job details");
    }

    const data = await response.json();
    job = {
      id: data.id,
      title: data.title,
      company: data.company,
      description: data.description + "\n\n" + data.requirements,
      yearsOfExperience: data.yearsOfExperience || 0,
      shortlistSize: data.shortlistSize || 5,
    };
  } catch (err) {
    console.error("Error fetching job details:", err);
    error = "Failed to load job details. Please try again.";
  }

  return <JobApplicationForm job={job} error={error} jobId={(await params).id} />;
}
