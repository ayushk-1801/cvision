import { notFound } from "next/navigation";
import JobDetails from "./JobDetails";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  responsibilities: string;
  salary: string | null;
  isRemote: boolean;
  createdAt: string;
  industry: string | null;
  jobType: string | null;
  experienceLevel: string | null;
  expiresAt?: string;
  yearsOfExperience?: number;
  numberOfRoles?: number;
  contactEmail?: string;
  applicationUrl?: string;
  recruiter: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  _count: {
    applications: number;
  };
}

async function getJob(id: string): Promise<Job | null> {
  try {
    // Instead of using fetch, we'll directly pass null
    // The client component will handle the actual data fetching
    // This way we avoid ECONNREFUSED errors when building
    return null;

    // In a real app with proper API setup, you could use:
    /*
    const job = await db.job.findUnique({
      where: { id },
      include: {
        recruiter: true,
        _count: {
          select: { applications: true }
        }
      }
    });
    
    if (!job) return null;
    
    return {
      ...job,
      createdAt: job.createdAt.toISOString(),
      expiresAt: job.expiresAt?.toISOString(),
    };
    */
  } catch (error) {
    console.error("Error fetching job:", error);
    return null;
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params to get the jobId
  const jobId = (await params).id;

  // We'll pass undefined as initialJobData and let the client component fetch the data
  return <JobDetails jobId={jobId} initialJobData={undefined} />;
}
