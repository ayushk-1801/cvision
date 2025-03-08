import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/server/users';
import { prisma } from '@repo/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    
    const applicationId = params.id;
    
    // Fetch the application with job details
    const application = await prisma.application.findUnique({
      where: { 
        id: applicationId,
      },
      include: {
        job: true,
      },
    });
    
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    
    // Verify that the application belongs to the current user
    if (application.applicantId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    
    return NextResponse.json(application);
    
  } catch (error) {
    console.error("Error fetching application details:", error);
    return NextResponse.json(
      { error: "Failed to fetch application details" },
      { status: 500 }
    );
  }
}
