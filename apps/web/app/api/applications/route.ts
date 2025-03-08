import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@repo/database";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized access" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // We'll assume form data for file upload
    const formData = await request.formData();
    const jobId = formData.get("jobId") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const coverLetter = formData.get("coverLetter") as string | null;
    const linkedinProfile = formData.get("linkedinProfile") as string | null;
    const portfolioWebsite = formData.get("portfolioWebsite") as string | null;
    const resumeFile = formData.get("resume") as File;

    if (!jobId || !resumeFile || !phoneNumber) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId, isActive: true },
    });

    if (!job) {
      return new Response(JSON.stringify({ error: "Job not found or inactive" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check if user has already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: jobId,
        userId: session.user.id,
      },
    });

    if (existingApplication) {
      return new Response(JSON.stringify({ error: "You have already applied to this job" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Handle file upload - in a real implementation, you'd upload to cloud storage
    // For this example, we'll just store the file name
    const resumeFileName = resumeFile.name;
    
    // In a real implementation, you would upload the file to a storage service
    // and get the URL or reference to store in the database
    const resumeUrl = `uploads/${Date.now()}-${resumeFileName}`;

    // Create application record
    const application = await prisma.application.create({
      data: {
        job: { connect: { id: jobId } },
        user: { connect: { id: session.user.id } },
        resumeUrl,
        coverLetter,
        phoneNumber,
        linkedinProfile,
        portfolioWebsite,
        status: 'PENDING',
      },
    });

    return new Response(JSON.stringify({ success: true, data: application }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error creating application:", error);
    
    return new Response(JSON.stringify({ error: "Failed to submit application" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized access" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || undefined;
    
    const skip = (page - 1) * limit;
    
    const where: any = { userId: session.user.id };
    if (status) {
      where.status = status;
    }
    
    // Get applications
    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          select: {
            title: true,
            company: true,
            location: true,
            jobType: true,
            isRemote: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    
    // Get total count for pagination
    const totalCount = await prisma.application.count({ where });
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return new Response(
      JSON.stringify({
        applications,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
    
  } catch (error) {
    console.error("Error fetching applications:", error);
    
    return new Response(JSON.stringify({ error: "Failed to fetch applications" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
