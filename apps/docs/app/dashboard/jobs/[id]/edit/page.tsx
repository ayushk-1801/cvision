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
import { format } from 'date-fns'

interface JobEditPageProps {
  params: {
    id: string
  }
}

export default function JobEditPage({ params }: JobEditPageProps) {
  const router = useRouter()
  const jobId = params.id
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    jobType: 'Full Time',
    experienceLevel: 'Entry Level',
    industry: 'Technology',
    isRemote: false,
    requirements: '',
    applicationDeadline: '',
    contactEmail: '',
    isActive: true,
    yearsOfExperience: 0,
    numberOfRoles: 1,
    shortlistSize: 5,
    applicationUrl: '',
  })

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(`/api/jobs/${jobId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch job data')
        }
        
        const jobData = await response.json()
        
        // Format the date for the form input if it exists
        const formattedDeadline = jobData.expiresAt 
          ? format(new Date(jobData.expiresAt), 'yyyy-MM-dd')
          : ''
          
        setFormData({
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
        })
      } catch (err) {
        console.error('Error fetching job:', err)
        setError('Failed to load job data. Please try again.')
      } finally {
        setIsFetching(false)
      }
    }
    
    fetchJob()
  }, [jobId])

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
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update job')
      }

      router.push('/dashboard/jobs')
      router.refresh()
    } catch (err) {
      console.error('Error updating job:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return <div className="flex justify-center items-center h-96">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  placeholder="e.g. 2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfRoles">Number of Positions</Label>
                <Input
                  id="numberOfRoles"
                  name="numberOfRoles"
                  type="number"
                  min="1"
                  value={formData.numberOfRoles}
                  onChange={handleInputChange}
                  placeholder="e.g. 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortlistSize">Shortlist Size</Label>
                <Input
                  id="shortlistSize"
                  name="shortlistSize"
                  type="number"
                  min="1"
                  value={formData.shortlistSize}
                  onChange={handleInputChange}
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationUrl">Application URL (Optional)</Label>
              <Input
                id="applicationUrl"
                name="applicationUrl"
                type="url"
                value={formData.applicationUrl}
                onChange={handleInputChange}
                placeholder="https://company.com/job-application"
              />
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
                <Label htmlFor="isActive">Job is active</Label>
              </div>
            </div>

            <CardFooter className="flex justify-end space-x-4 px-0 pb-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/dashboard/jobs')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
