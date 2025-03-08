import { NextRequest } from "next/server";
import { prisma } from "@repo/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
        isActive: true,
      },
      include: {
        recruiter: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      return new Response(
        JSON.stringify({ error: 'Job not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(job),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching job details:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch job details' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
