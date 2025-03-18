import ApplicationDetail from "./ApplicationDetail";

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

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Server-side data fetching
  let application: Application | null = null;
  let error: string | null = null;
  
  try {
    const resolvedParams = await params;
    
    // Use an absolute URL for server-side fetching
    // This ensures the fetch works both in development and production environments
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const absoluteUrl = new URL(`/api/applications/${resolvedParams.id}`, apiUrl).toString();
    
    const response = await fetch(absoluteUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 0 // Don't cache this request
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Application not found');
      }
      throw new Error(`Failed to fetch application details: ${response.status} ${response.statusText}`);
    }
    
    application = await response.json();
    
  } catch (err: any) {
    console.error('Error fetching application details:', err);
    error = err.message || 'Failed to load application details';
  }

  // Pass the resolved application ID to the client component
  const applicationId = (await params).id;
  
  return (
    <ApplicationDetail 
      application={application} 
      error={error} 
      isLoading={false} 
      applicationId={applicationId} 
    />
  );
}
