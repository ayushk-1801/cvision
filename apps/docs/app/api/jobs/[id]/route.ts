import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getSession } from '@/server/users';
import { z } from 'zod';

// Schema for validating job updates
const jobUpdateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().min(1, "Requirements are required"),
  salary: z.string().optional().nullable(),
  jobType: z.string().optional().nullable(),
  experienceLevel: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  isRemote: z.boolean().default(false),
  isActive: z.boolean().default(true),
  contactEmail: z.string().email("Invalid email address"),
  applicationUrl: z.string().url("Invalid URL").optional().nullable().or(z.literal('')),
  applicationDeadline: z.string().optional().nullable(),
  yearsOfExperience: z.number().nonnegative().default(0).or(z.string().regex(/^\d+$/).transform(Number)),
  numberOfRoles: z.number().positive().default(1).or(z.string().regex(/^\d+$/).transform(Number)),
  shortlistSize: z.number().positive().default(5).or(z.string().regex(/^\d+$/).transform(Number)),
});

// Get job details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const jobId = (await params).id;
    
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        _count: {
          select: {
            applications: true,
          }
        }
      }
    });
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    );
  }
}

// Update job
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getSession();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const jobId = (await params).id;
    
    // Get the job to check ownership
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
      select: { recruiterId: true }
    });
    
    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Verify the user is the recruiter who created this job
    if (existingJob.recruiterId !== userId) {
      return NextResponse.json(
        { error: 'You are not authorized to update this job' },
        { status: 403 }
      );
    }
    
    // Parse and validate the request body
    const body = await request.json();
    
    // Handle empty strings for optional fields
    if (body.applicationUrl === '') {
      body.applicationUrl = null;
    }
    
    // Convert applicationDeadline to Date object if provided
    let deadline = null;
    if (body.applicationDeadline) {
      deadline = new Date(body.applicationDeadline);
    }
    
    try {
      const validatedData = jobUpdateSchema.parse(body);
      
      // Create a data object that only includes fields in the Prisma schema
      const updateData = {
        title: validatedData.title,
        company: validatedData.company,
        location: validatedData.location,
        description: validatedData.description,
        requirements: validatedData.requirements,
        salary: validatedData.salary,
        jobType: validatedData.jobType,
        experienceLevel: validatedData.experienceLevel,
        industry: validatedData.industry,
        isRemote: validatedData.isRemote,
        isActive: validatedData.isActive,
        contactEmail: validatedData.contactEmail,
        applicationUrl: validatedData.applicationUrl,
        // Use expiresAt to store applicationDeadline since that's in the schema
        expiresAt: deadline,
        // Add new fields
        yearsOfExperience: validatedData.yearsOfExperience,
        numberOfRoles: validatedData.numberOfRoles,
        shortlistSize: validatedData.shortlistSize,
      };
      
      // Update job
      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: updateData,
      });
      
      // Map back to our expected response format
      return NextResponse.json({
        ...updatedJob,
        applicationDeadline: updatedJob.expiresAt
      });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid data provided', details: validationError.format() },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// Delete job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getSession();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const jobId = (await params).id;
    
    // Get the job to check ownership
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
      select: { recruiterId: true }
    });
    
    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Verify the user is the recruiter who created this job
    if (existingJob.recruiterId !== userId) {
      return NextResponse.json(
        { error: 'You are not authorized to delete this job' },
        { status: 403 }
      );
    }
    
    // Delete job
    await prisma.job.delete({
      where: { id: jobId },
    });
    
    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
