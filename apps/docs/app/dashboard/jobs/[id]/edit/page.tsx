import { JobEditForm } from '@/components/jobs/job-edit-form'
import { format } from 'date-fns'

interface JobEditPageProps {
  params: Promise<{ id: string }>
}

async function getJobData(jobId: string) {
  try {
    // This would typically use a server-side data fetching method
    // like a direct database call or an internal API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/jobs/${jobId}`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch job data')
    }
    
    const jobData = await response.json()
    
    // Format the date for the form input if it exists
    const formattedDeadline = jobData.expiresAt 
      ? format(new Date(jobData.expiresAt), 'yyyy-MM-dd')
      : ''
      
    return {
      title: jobData.title || '',
      company: jobData.company || '',
      location: jobData.location || '',
      description: jobData.description || '',
      salary: jobData.salary || '',
      jobType: jobData.jobType || 'Full Time',
      experienceLevel: jobData.experienceLevel || 'Entry Level',
      industry: jobData.industry || 'Technology',
      isRemote: jobData.isRemote || false,
      requirements: jobData.requirements || '',
      applicationDeadline: formattedDeadline,
      contactEmail: jobData.contactEmail || '',
      isActive: jobData.isActive !== undefined ? jobData.isActive : true,
      yearsOfExperience: jobData.yearsOfExperience || 0,
      numberOfRoles: jobData.numberOfRoles || 1,
      shortlistSize: jobData.shortlistSize || 5,
      applicationUrl: jobData.applicationUrl || '',
    }
  } catch (error) {
    console.error('Error fetching job data:', error)
    return null
  }
}

export default async function JobEditPage({ params }: JobEditPageProps) {
  const jobId = (await params).id
  const jobData = await getJobData(jobId)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Edit Job Position</h1>
      <div className="bg-background rounded-lg">
        <JobEditForm jobId={jobId} initialData={jobData || undefined} />
      </div>
    </div>
  )
}
