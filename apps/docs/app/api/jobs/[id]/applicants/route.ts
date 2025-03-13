import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@repo/database';
import { getSession } from '@/server/users';

export async function GET(
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
    
    // Get applicants with all fields including cvAnalysis
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
        // Order by CV similarity score if available (high to low)
        createdAt: 'desc'
      }
    });

    // Sort applicants by cvAnalysis.similarity if available
    const sortedApplicants = [...applicants].sort((a, b) => {
      const scoreA = a.cvAnalysis && typeof a.cvAnalysis === 'object' && 'similarity' in a.cvAnalysis 
                     ? (a.cvAnalysis as any).similarity 
                     : 0;
      const scoreB = b.cvAnalysis && typeof b.cvAnalysis === 'object' && 'similarity' in b.cvAnalysis 
                     ? (b.cvAnalysis as any).similarity 
                     : 0;
      return scoreB - scoreA;  // Sort by descending similarity score
    });
    
    // If shortlisted view is requested, return only the top shortlistSize applicants
    let filteredApplicants = shortlisted 
      ? sortedApplicants.slice(0, job.shortlistSize) 
      : sortedApplicants;
    
    // If search is provided, filter results in memory
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filteredApplicants = filteredApplicants.filter(app => {
        // Search in applicant name and email
        const nameMatch = app.applicant.name.toLowerCase().includes(searchLower);
        const emailMatch = app.applicant.email.toLowerCase().includes(searchLower);
        
        // Search in CV analysis text if available
        let cvAnalysisMatch = false;
        if (app.cvAnalysis && typeof app.cvAnalysis === 'object') {
          const cv = app.cvAnalysis as any;
          cvAnalysisMatch = 
            (cv.skills && cv.skills.toLowerCase().includes(searchLower)) ||
            (cv.reason && cv.reason.toLowerCase().includes(searchLower)) ||
            (cv.projects && cv.projects.toLowerCase().includes(searchLower));
        }
        
        return nameMatch || emailMatch || cvAnalysisMatch;
      });
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
