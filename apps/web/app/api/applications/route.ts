import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { uploadFile } from "@/lib/storage";
import { getSession } from "@/server/users";
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

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
    
    // Get job details passed from the client
    const jobTitle = formData.get("jobTitle") as string;
    const jobDescription = formData.get("jobDescription") as string;
    const yearsOfExperience = Number(formData.get("yearsOfExperience") || 0);
    const shortlistSize = Number(formData.get("shortlistSize") || 5);

    if (!jobId || !resume) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload resume to storage service
    const resumeUrl = await uploadFile(resume, `applications/${userId}/${jobId}/${Date.now()}`);

    // Perform resume analysis
    let cvAnalysis = null;
    try {
      console.log("🔍 Starting server-side resume analysis...");
      
      // Save file to temp storage to send to API
      const tempDir = os.tmpdir();
      const fileExtension = resume.name.split('.').pop();
      const tempFilePath = path.join(tempDir, `resume-${Date.now()}.${fileExtension}`);
      
      // Convert File to buffer and save
      const buffer = Buffer.from(await resume.arrayBuffer());
      await fs.writeFile(tempFilePath, buffer);
      
      console.log(`📄 Resume saved to temp location: ${tempFilePath}`);
      
      // Create FormData for CV analysis API
      const apiFormData = new FormData();
      const resumeFile = new File([buffer], resume.name, { type: resume.type });
      
      apiFormData.append("resume_file", resumeFile);
      apiFormData.append("job_title", jobTitle);
      apiFormData.append("job_description", jobDescription);
      apiFormData.append("application_id", "temp-id");
      apiFormData.append("job_id", jobId);
      apiFormData.append("n_years", String(yearsOfExperience));
      apiFormData.append("N", String(shortlistSize));

      console.log("📤 Sending to CV analysis API:", {
        job_title: jobTitle,
        job_description: jobDescription?.substring(0, 50) + "...",
        job_id: jobId,
        n_years: yearsOfExperience,
        N: shortlistSize,
      });

      const apiUrl = process.env.NEXT_PUBLIC_CV_API_URL || "http://localhost:8000";
      const endpoint = `${apiUrl}/submit_application/`;
      console.log("🚀 Sending request to:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        body: apiFormData,
      });

      // Clean up temp file
      await fs.unlink(tempFilePath).catch(err => {
        console.warn("Failed to clean up temp file:", err);
      });

      console.log("📥 Received CV API response with status:", response.status);
      
      if (!response.ok) {
        throw new Error(`CV analysis failed! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ CV Analysis Result:", result);
      
      // Create a properly structured cvAnalysis object
      if (result) {
        cvAnalysis = {
          similarity: result.similarity || 0,
          reason: result.reason || "No reason provided",
          projects: result.projects || "",
          n_years: result.n_years || 0,
          skills: result.skills || ""
        };
        
        console.log("✅ Structured CV analysis:", {
          similarity: cvAnalysis.similarity,
          reason: cvAnalysis.reason.substring(0, 50) + "...",
          n_years: cvAnalysis.n_years,
          hasSkills: !!cvAnalysis.skills,
          hasProjects: !!cvAnalysis.projects
        });
      }
    } catch (err) {
      console.error("Error during CV analysis:", err);
      // Create a default object when analysis fails
      cvAnalysis = {
        similarity: 0,
        reason: "CV analysis failed. Please try again later.",
        projects: "",
        n_years: 0,
        skills: ""
      };
    }

    // Create notes field with additional information
    const notes = JSON.stringify({
      phoneNumber: phoneNumber || null,
      linkedinProfile: linkedinProfile || null,
      portfolioWebsite: portfolioWebsite || null,
    });

    // Create the application with the cvAnalysis
    const application = await prisma.application.create({
      data: {
        jobId,
        applicantId: userId,
        resumeUrl,
        coverLetter: coverLetter || undefined,
        phoneNumber,
        linkedinProfile,
        portfolioWebsite,
        cvAnalysis,  // Store the object directly as Json
        notes
      },
    });

    // Update the job with applicant information
    if (cvAnalysis) {
      // Get existing job data
      const existingJob = await prisma.job.findUnique({ 
        where: { id: jobId },
        select: { applicants: true }
      });
      
      // Prepare updated applicants data
      const updatedApplicants = {
        ...(existingJob?.applicants as object || {}),
        [userId]: {
          applicationId: application.id,
          // Use the exact same fields as in cvAnalysis
          similarity: cvAnalysis.similarity,
          reason: cvAnalysis.reason,
          skills: cvAnalysis.skills,
          projects: cvAnalysis.projects,
          n_years: cvAnalysis.n_years,
          // Additional contact info
          phoneNumber,
          linkedinProfile,
          portfolioWebsite
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
      { error: "Failed to submit application", details: error.message },
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
