import { PrismaClient } from "../generated/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  // First, make sure we have a recruiter user
  const recruiter = await prisma.user.findFirst({
    where: { email: "recruiter@example.com" },
  });

  const recruiterId =
    recruiter?.id ||
    (
      await prisma.user.create({
        data: {
          id: uuidv4(),
          name: "Demo Recruiter",
          email: "recruiter@example.com",
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    ).id;

  // Sample job data
  const jobs = [
    {
      id: uuidv4(),
      title: "Frontend Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      description: "We are looking for a skilled Frontend Developer...",
      requirements: "React, TypeScript, 3+ years experience",
      salary: "$120,000 - $150,000",
      contactEmail: "jobs@techcorp.com",
      isRemote: true,
      industry: "Technology",
      jobType: "Full-time",
      experienceLevel: "Mid-level",
      recruiterId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    {
      id: uuidv4(),
      title: "Backend Engineer",
      company: "DataSys",
      location: "New York, NY",
      description: "Join our backend team to build scalable APIs...",
      requirements: "Node.js, PostgreSQL, AWS experience",
      salary: "$130,000 - $160,000",
      contactEmail: "careers@datasys.io",
      isRemote: false,
      industry: "Software",
      jobType: "Full-time",
      experienceLevel: "Senior",
      recruiterId,
      expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    },
    {
      id: uuidv4(),
      title: "Data Scientist",
      company: "AnalyticsPro",
      location: "Remote",
      description:
        "Looking for a data scientist to analyze customer behavior...",
      requirements: "Python, SQL, Machine Learning experience",
      salary: "$110,000 - $140,000",
      contactEmail: "hr@analyticspro.com",
      isRemote: true,
      industry: "Data Science",
      jobType: "Contract",
      experienceLevel: "Senior",
      recruiterId,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    },
    // Add more job listings as needed
  ];

  // Insert jobs
  for (const job of jobs) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: job,
      create: job,
    });
  }

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
