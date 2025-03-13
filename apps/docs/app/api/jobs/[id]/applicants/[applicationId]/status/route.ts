import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getSession } from '@/server/users';
import { z } from 'zod';

// Schema for validating status updates
const statusUpdateSchema = z.object({
  status: z.enum([
    'pending', 
    'reviewing', 
    'shortlisted', 
    'interviewing', 
    'accepted', 
    'rejected'
  ]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; applicationId: string }> }
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
    const applicationId = (await params).applicationId;
    
    // First verify if the job exists and if the user is the recruiter
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { 
        recruiterId: true
      }
    });
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Only allow the recruiter to update application status
    if (job.recruiterId !== userId) {
      return NextResponse.json(
        { error: 'You are not authorized to update applications for this job' },
        { status: 403 }
      );
    }
    
    // Verify the application exists and is for this job
    const application = await prisma.application.findUnique({
      where: { 
        id: applicationId,
      },
      select: { 
        id: true,
        jobId: true
      }
    });
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    if (application.jobId !== jobId) {
      return NextResponse.json(
        { error: 'Application does not belong to this job' },
        { status: 400 }
      );
    }
    
    // Validate and parse the request body
    const body = await request.json();
    
    try {
      const { status } = statusUpdateSchema.parse(body);
      
      // Update application status
      const updatedApplication = await prisma.application.update({
        where: { id: applicationId },
        data: { 
          status: status,
          updatedAt: new Date()
        },
        include: {
          applicant: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        }
      });
      
      // If the status is "shortlisted", update the Job's topApplicants array
      if (status === 'shortlisted') {
        await prisma.job.update({
          where: { id: jobId },
          data: {
            topApplicants: {
              push: applicationId
            }
          }
        });
      }
      
      // If the status was "shortlisted" and is now something else, remove from topApplicants
      if (status !== 'shortlisted') {
        const currentJob = await prisma.job.findUnique({
          where: { id: jobId },
          select: { topApplicants: true }
        });
        
        if (currentJob && currentJob.topApplicants.includes(applicationId)) {
          await prisma.job.update({
            where: { id: jobId },
            data: {
              topApplicants: {
                set: currentJob.topApplicants.filter(id => id !== applicationId)
              }
            }
          });
        }
      }
      
      return NextResponse.json(updatedApplication);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Invalid status value', 
            details: validationError.format() 
          },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json(
      { error: 'Failed to update application status' },
      { status: 500 }
    );
  }
}
