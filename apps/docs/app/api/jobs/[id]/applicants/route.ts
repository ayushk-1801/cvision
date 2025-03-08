import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getSession } from '@/server/users';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const jobId = params.id;
    
    // First verify if the user is the recruiter for this job
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { 
        id: true,
        title: true,
        company: true,
        recruiterId: true
      }
    });
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Only allow the recruiter to see applicants
    if (job.recruiterId !== userId) {
      return NextResponse.json(
        { error: 'You are not authorized to view applicants for this job' },
        { status: 403 }
      );
    }
    
    // Get query parameters for filtering
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    
    // Build filter conditions
    const filterConditions: any = {
      jobId: jobId
    };
    
    if (status && status !== 'all') {
      filterConditions.status = status;
    }
    
    // Get applicants with pagination
    const applicants = await prisma.application.findMany({
      where: filterConditions,
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // If search is provided, filter results in memory
    let filteredApplicants = applicants;
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filteredApplicants = applicants.filter(app => 
        app.applicant.name.toLowerCase().includes(searchLower) ||
        app.applicant.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Return job details and applicants
    return NextResponse.json({
      job: {
        id: job.id,
        title: job.title,
        company: job.company
      },
      applicants: filteredApplicants
    });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applicants' },
      { status: 500 }
    );
  }
}
