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
        recruiterId: true,
        shortlistSize: true // Include shortlistSize for limiting results
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
    const shortlisted = url.searchParams.get('shortlisted') === 'true';
    
    // Build filter conditions
    const filterConditions: any = {
      jobId: jobId
    };
    
    // Only apply status filter when not requesting shortlisted applicants
    if (status && status !== 'all' && !shortlisted) {
      filterConditions.status = status;
    }
    
    // Get applicants
    let applicants = await prisma.application.findMany({
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
      // Different ordering based on whether we want shortlisted or regular applicants
      orderBy: shortlisted ? 
        { matchScore: 'desc' } :  // Order by match score for shortlisted view
        { createdAt: 'desc' }     // Default ordering by date
    });
    
    // If shortlisted view is requested, return only the top shortlistSize applicants
    if (shortlisted) {
      applicants = applicants.slice(0, job.shortlistSize);
    }
    
    // If search is provided, filter results in memory
    let filteredApplicants = applicants;
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filteredApplicants = applicants.filter(app => 
        app.applicant.name.toLowerCase().includes(searchLower) ||
        app.applicant.email.toLowerCase().includes(searchLower) ||
        (app.cvAnalysis && app.cvAnalysis.toLowerCase().includes(searchLower))
      );
    }
    
    // Return job details and applicants
    return NextResponse.json({
      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        shortlistSize: job.shortlistSize
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
