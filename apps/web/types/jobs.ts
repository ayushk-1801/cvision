export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary?: string;
  contactEmail: string;
  applicationUrl?: string;
  isRemote: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  recruiterId: string;
  industry?: string;
  jobType?: string;
  experienceLevel?: string;
}

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
}

export interface Application {
  id: string;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  jobId: string;
  applicantId: string;
  notes?: string;
  interviewDate?: Date;
}

// Job types for form handling
export type JobFormData = Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'recruiterId'>;

// Application types for form handling
export type ApplicationFormData = {
  coverLetter?: string;
  resumeUrl?: string;
};
