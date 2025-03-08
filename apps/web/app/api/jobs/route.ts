import { NextRequest } from "next/server";
import { prisma } from "@repo/database";

export interface JobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  isRemote?: boolean;
  industry?: string;
  jobType?: string;
  experienceLevel?: string;
  sortBy?: 'createdAt' | 'salary' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;
    const location = searchParams.get('location') || undefined;
    const isRemote = searchParams.get('isRemote') === 'true' ? true : 
                    searchParams.get('isRemote') === 'false' ? false : 
                    undefined;
    const industry = searchParams.get('industry') || undefined;
    const jobType = searchParams.get('jobType') || undefined;
    const experienceLevel = searchParams.get('experienceLevel') || undefined;
    const sortBy = searchParams.get('sortBy') as JobsQueryParams['sortBy'] || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') as JobsQueryParams['sortOrder'] || 'desc';
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build where clause for filtering
    const where: any = {
      isActive: true,
    };
    
    // Add optional filters
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    
    if (isRemote !== undefined) {
      where.isRemote = isRemote;
    }
    
    if (industry) {
      where.industry = { contains: industry, mode: 'insensitive' };
    }
    
    if (jobType) {
      where.jobType = { contains: jobType, mode: 'insensitive' };
    }
    
    if (experienceLevel) {
      where.experienceLevel = { contains: experienceLevel, mode: 'insensitive' };
    }
    
    // Fetch jobs with pagination and filtering
    const jobs = await prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        recruiter: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        _count: {
          select: { applications: true }
        }
      },
    });
    
    // Get total count for pagination
    const totalCount = await prisma.job.count({ where });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return new Response(
      JSON.stringify({
        jobs,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch jobs' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}