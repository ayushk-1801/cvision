'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useUser } from "@/lib/hooks/use-user"

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary: string | null;
  isRemote: boolean;
  isActive: boolean;
  applicationDeadline: string | null;
  industry: string | null;
  jobType: string | null;
  experienceLevel: string | null;
  contactEmail: string;
  applicationUrl: string | null;
}

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [job, setJob] = useState<Job | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: '',
    jobType: '',
    experienceLevel: '',
    industry: '',
    isRemote: false,
    isActive: true,
    applicationDeadline: '',
    contactEmail: '',
    applicationUrl: '',
  })

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/jobs/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch job details')
        }
        
        const data = await response.json()
        setJob(data)
        
        // Use expiresAt as applicationDeadline if it's not available in the API response
        const deadlineField = data.applicationDeadline || data.expiresAt;
        
        // Convert dates to YYYY-MM-DD format for input fields
        const formattedDeadline = deadlineField
          ? new Date(deadlineField).toISOString().split('T')[0]
          : ''

        setFormData({
          title: data.title || '',
          company: data.company || '',
          location: data.location || '',
          description: data.description || '',
          requirements: data.requirements || '',
          salary: data.salary || '',
          jobType: data.jobType || '',
          experienceLevel: data.experienceLevel || '',
          industry: data.industry || '',
          isRemote: data.isRemote || false,
          isActive: data.isActive,
          applicationDeadline: formattedDeadline,
          contactEmail: data.contactEmail || '',
          applicationUrl: data.applicationUrl || '',
        })
      } catch (err) {
        console.error('Error fetching job details:', err)
        setError('Failed to load job details')
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchJobDetails()
    }
  }, [params.id, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Prepare the data for API submission
      const submissionData = {
        ...formData,
        // Make sure we're only sending null if empty
        applicationUrl: formData.applicationUrl.trim() || null,
      }
      
      const response = await fetch(`/api/jobs/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update job')
      }

      router.push(`/dashboard/jobs/${params.id}`)
    } catch (err) {
      console.error('Error updating job:', err)
      setError(err instanceof Error ? err.message : 'Failed to update job')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !job) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-red-500 mb-2">
                {error}
              </h3>
              <p className="text-slate-500 mb-6">
                We couldn't load this job. It may have been removed or you don't have permission to edit it.
              </p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to job
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Edit Job Position</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Inc."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. New York, NY"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select
                  name="industry"
                  value={formData.industry}
                  onValueChange={(value) => handleSelectChange('industry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type *</Label>
                <Select
                  name="jobType"
                  value={formData.jobType}
                  onValueChange={(value) => handleSelectChange('jobType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Time">Full Time</SelectItem>
                    <SelectItem value="Part Time">Part Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level *</Label>
                <Select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onValueChange={(value) => handleSelectChange('experienceLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry Level">Entry Level</SelectItem>
                    <SelectItem value="Mid Level">Mid Level</SelectItem>
                    <SelectItem value="Senior Level">Senior Level</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g. $60,000 - $80,000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the job responsibilities and details"
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements *</Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="List the skills, qualifications, and experience required"
                rows={5}
                required
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="applicationDeadline">Application Deadline</Label>
                <Input
                  id="applicationDeadline"
                  name="applicationDeadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="e.g. careers@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationUrl">External Application URL</Label>
              <Input
                id="applicationUrl"
                name="applicationUrl"
                type="url"
                value={formData.applicationUrl}
                onChange={handleInputChange}
                placeholder="e.g. https://yourcompany.com/careers/apply"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isRemote" 
                  checked={formData.isRemote}
                  onCheckedChange={(checked) => handleCheckboxChange('isRemote', checked === true)}
                />
                <Label htmlFor="isRemote">This is a remote position</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isActive" 
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleCheckboxChange('isActive', checked === true)}
                />
                <Label htmlFor="isActive">List as active job</Label>
              </div>
            </div>

            <CardFooter className="flex justify-end space-x-4 px-0 pb-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push(`/dashboard/jobs/${params.id}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
