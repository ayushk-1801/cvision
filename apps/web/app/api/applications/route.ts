import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { uploadFile } from "@/lib/storage";
import { getSession } from "@/server/users";
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be signed in to submit an application" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const formData = await req.formData();

    // Get form fields
    const jobId = formData.get("jobId") as string;
    const resume = formData.get("resume") as File;
    const coverLetter = formData.get("coverLetter") as string | null;
    const phoneNumber = formData.get("phoneNumber") as string;
    const linkedinProfile = formData.get("linkedinProfile") as string | null;
    const portfolioWebsite = formData.get("portfolioWebsite") as string | null;
    const cvAnalysisResultsJson = formData.get("cvAnalysisResults") as string | null;
    const matchScore = formData.get("matchScore") ? parseFloat(formData.get("matchScore") as string) : null;
    
    // Get the CV analysis text which is in the cvAnalysis field
    const cvAnalysis = formData.get("cvAnalysis") as string | null;
    
    console.log("Received application with analysis:", {
      cvAnalysis,
      matchScore
    });

    if (!jobId || !resume) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload resume to storage service
    const resumeUrl = await uploadFile(resume, `applications/${userId}/${jobId}/${Date.now()}`);

    // Parse CV analysis results if available
    let cvAnalysisResults = null;
    if (cvAnalysisResultsJson) {
      try {
        cvAnalysisResults = JSON.parse(cvAnalysisResultsJson);
      } catch (error) {
        console.error("Failed to parse CV analysis results:", error);
      }
    }

    // Create notes field that includes all the information we want to store
    const notes = JSON.stringify({
      phoneNumber: phoneNumber || null,
      linkedinProfile: linkedinProfile || null,
      portfolioWebsite: portfolioWebsite || null,
      cvAnalysis: cvAnalysis || null,
      cvAnalysisResults: cvAnalysisResults || null,
    });

    // Create the application - include the CV analysis data
    const application = await prisma.application.create({
      data: {
        jobId,
        applicantId: userId,
        resumeUrl,
        coverLetter: coverLetter || undefined,
        phoneNumber,
        linkedinProfile,
        portfolioWebsite,
        cvAnalysis,  // Include cv analysis directly if the field exists in schema
        notes,
        ...(typeof matchScore === 'number' ? { matchScore } : {}),
      },
    });

    // Update the job with applicant information if CV analysis provided data
    if (cvAnalysisResults || cvAnalysis) {
      // Get existing job data
      const existingJob = await prisma.job.findUnique({ 
        where: { id: jobId },
        select: { applicants: true }
      });
      
      // Prepare updated applicants data
      const updatedApplicants = {
        ...(existingJob?.applicants as object || {}),
        [userId]: {
          similarity: matchScore,
          reason: cvAnalysis,  // Store the analysis text
          applicationId: application.id,
          phoneNumber,
          linkedinProfile,
          portfolioWebsite,
          ...cvAnalysisResults
        }
      };
      
      await prisma.job.update({
        where: { id: jobId },
        data: {
          applicants: updatedApplicants
        }
      });
    }

    return NextResponse.json({ success: true, applicationId: application.id });
  } catch (error: any) {
    console.error("Error submitting application:", error);
    
    // Check if it's a duplicate application
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
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
    
    // Fix: Use applicantId instead of userId
    const where: any = { applicantId: session.user.id };
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
