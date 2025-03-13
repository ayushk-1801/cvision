import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getSession } from '@/server/users';

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
    const jobId = (await params) .id;
    
    // Get the request body
    const { isActive } = await request.json();
    
    // Find the job and check if the user is the recruiter
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { recruiterId: true }
    });
    
    // Job not found
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Not the recruiter
    if (job.recruiterId !== userId) {
      return NextResponse.json(
        { error: 'You are not authorized to update this job' },
        { status: 403 }
      );
    }
    
    // Update job status - only update isActive field
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { isActive },
    });
    
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Error updating job status:', error);
    return NextResponse.json(
      { error: 'Failed to update job status' },
      { status: 500 }
    );
  }
}
