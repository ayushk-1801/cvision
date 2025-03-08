import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/server/users';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '@repo/database';

// Configure local upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'resumes');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse multipart form data using native FormData
    const formData = await req.formData();
    
    // Extract application data
    const jobId = formData.get('jobId')?.toString();
    const coverLetter = formData.get('coverLetter')?.toString() || null;
    const phoneNumber = formData.get('phoneNumber')?.toString();
    const linkedinProfile = formData.get('linkedinProfile')?.toString() || null;
    const portfolioWebsite = formData.get('portfolioWebsite')?.toString() || null;
    
    // Validate required fields
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }
    
    // Get the resume file
    const resumeFile = formData.get('resume') as File | null;
    if (!resumeFile) {
      return NextResponse.json({ error: 'Resume file is required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(resumeFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF, DOC, or DOCX file' },
        { status: 400 }
      );
    }

    // Create user directory if it doesn't exist
    const userUploadDir = path.join(UPLOAD_DIR, session.user.id);
    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir, { recursive: true });
    }

    // Generate a unique filename
    const fileExt = resumeFile.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExt}`;
    const filePath = path.join(userUploadDir, uniqueFileName);
    
    // Convert File to Buffer and save it
    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());
    fs.writeFileSync(filePath, fileBuffer);
    
    // Generate relative path for database storage
    // This creates a path like '/uploads/resumes/{userId}/{filename}'
    const relativePath = `/uploads/resumes/${session.user.id}/${uniqueFileName}`;
    
    // Check if user has already applied for this job
    const existingApplication = await prisma.application.findUnique({
      where: { 
        jobId_applicantId: {
          jobId: jobId,
          applicantId: session.user.id
        }
      }
    });

    if (existingApplication) {
      // Clean up the file we just saved
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 400 }
      );
    }

    // Create application record in database
    const application = await prisma.application.create({
      data: {
        jobId: jobId,
        applicantId: session.user.id,
        resumeUrl: relativePath,
        coverLetter: coverLetter,
        status: 'pending',
        notes: JSON.stringify({
          phoneNumber,
          linkedinProfile,
          portfolioWebsite,
          submittedAt: new Date().toISOString()
        })
      }
    });

    return NextResponse.json({ 
      success: true, 
      applicationId: application.id 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json(
      { error: 'Failed to process your application' },
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
