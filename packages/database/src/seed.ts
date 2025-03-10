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
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      description: `
        We are looking for a skilled Frontend Developer to join our product team. 
        You will be responsible for building user interfaces, implementing features, and 
        ensuring a seamless experience across all devices.
        
        Key Responsibilities:
        - Develop responsive web applications using React and TypeScript
        - Collaborate with designers to implement UI/UX designs
        - Work with backend engineers to integrate frontend with APIs
        - Write clean, maintainable code following best practices
        - Participate in code reviews and contribute to technical discussions
      `,
      requirements: "React, TypeScript, Redux, CSS-in-JS, Testing frameworks",
      salary: "$120,000 - $150,000",
      contactEmail: "jobs@techcorp.com",
      yearsOfExperience: 3,
      numberOfRoles: 2,
      shortlistSize: 8,
      applicationUrl: "https://techcorp.com/careers/frontend-developer",
      isRemote: true,
      applicationDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      isActive: true,
      industry: "Technology",
      jobType: "Full-time",
      experienceLevel: "Mid-level",
      recruiterId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      applicants: JSON.stringify({
        total: 0,
        qualified: 0,
      }),
      topApplicants: [],
    },
    {
      id: uuidv4(),
      title: "Senior Backend Engineer",
      company: "DataSys",
      location: "New York, NY",
      description: `
        Join our backend team to build scalable APIs and microservices that power 
        our enterprise applications. You'll be working with cutting-edge technologies 
        to solve complex problems.
        
        Key Responsibilities:
        - Design and implement RESTful APIs and GraphQL services
        - Optimize database queries and architecture
        - Deploy and maintain cloud infrastructure on AWS
        - Implement security best practices and data protection measures
        - Mentor junior developers and contribute to architectural decisions
      `,
      requirements: "Node.js, PostgreSQL, AWS, Kubernetes, Microservices architecture",
      salary: "$130,000 - $160,000",
      contactEmail: "careers@datasys.io",
      yearsOfExperience: 5,
      numberOfRoles: 1,
      shortlistSize: 5,
      applicationUrl: "https://datasys.io/jobs/backend-engineer",
      isRemote: false,
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
      industry: "Software",
      jobType: "Full-time",
      experienceLevel: "Senior",
      recruiterId,
      expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      applicants: JSON.stringify({
        total: 0,
        qualified: 0,
      }),
      topApplicants: [],
    },
    {
      id: uuidv4(),
      title: "Senior Data Scientist",
      company: "AnalyticsPro",
      location: "Remote",
      description: `
        Looking for a data scientist to analyze customer behavior and build predictive models. 
        You'll work with our product and marketing teams to derive insights from large datasets
        and implement machine learning solutions.
        
        Key Responsibilities:
        - Analyze complex datasets to identify patterns and trends
        - Build and deploy machine learning models for prediction and classification
        - Create data visualizations and dashboards to communicate findings
        - Develop ETL pipelines to process and clean data
        - Collaborate with cross-functional teams to implement data-driven solutions
      `,
      requirements: "Python, SQL, Machine Learning, TensorFlow or PyTorch, Data Visualization",
      salary: "$110,000 - $140,000",
      contactEmail: "hr@analyticspro.com",
      yearsOfExperience: 4,
      numberOfRoles: 2,
      shortlistSize: 6,
      applicationUrl: "https://analyticspro.com/careers/data-scientist",
      isRemote: true,
      applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      isActive: true,
      industry: "Data Science",
      jobType: "Contract",
      experienceLevel: "Senior",
      recruiterId,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      applicants: JSON.stringify({
        total: 0,
        qualified: 0,
      }),
      topApplicants: [],
    },
    {
      id: uuidv4(),
      title: "DevOps Engineer",
      company: "CloudNative",
      location: "Austin, TX",
      description: `
        We're looking for a DevOps Engineer to help us build and maintain our cloud infrastructure.
        You'll be responsible for CI/CD pipelines, infrastructure as code, and ensuring system reliability.
        
        Key Responsibilities:
        - Implement and maintain CI/CD pipelines using GitHub Actions and Jenkins
        - Manage infrastructure using Terraform and Ansible
        - Monitor system performance and respond to incidents
        - Implement security best practices and compliance requirements
        - Collaborate with development teams to optimize deployment processes
      `,
      requirements: "AWS/Azure/GCP, Kubernetes, Terraform, Docker, CI/CD pipelines",
      salary: "$115,000 - $145,000",
      contactEmail: "jobs@cloudnative.tech",
      yearsOfExperience: 3,
      numberOfRoles: 1,
      shortlistSize: 4,
      applicationUrl: "https://cloudnative.tech/careers/devops",
      isRemote: true,
      applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      isActive: true,
      industry: "Cloud Computing",
      jobType: "Full-time",
      experienceLevel: "Mid-level",
      recruiterId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applicants: JSON.stringify({
        total: 0,
        qualified: 0,
      }),
      topApplicants: [],
    },
    {
      id: uuidv4(),
      title: "Product Manager",
      company: "ProductVision",
      location: "Seattle, WA",
      description: `
        Join our product team to lead the development of innovative software solutions.
        You'll work closely with engineers, designers, and stakeholders to define product
        strategy and drive execution.
        
        Key Responsibilities:
        - Define product vision, strategy, and roadmap
        - Gather and prioritize requirements from stakeholders and customers
        - Work with engineering and design teams to deliver features
        - Analyze market trends and competition to inform product decisions
        - Track and measure product performance using data-driven approaches
      `,
      requirements: "3+ years in product management, technical background, agile methodologies, data analysis",
      salary: "$125,000 - $155,000",
      contactEmail: "careers@productvision.com",
      yearsOfExperience: 3,
      numberOfRoles: 1,
      shortlistSize: 7,
      applicationUrl: "https://productvision.com/jobs/product-manager",
      isRemote: false,
      applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
      isActive: true,
      industry: "Software",
      jobType: "Full-time",
      experienceLevel: "Mid-level",
      recruiterId,
      expiresAt: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      applicants: JSON.stringify({
        total: 0,
        qualified: 0,
      }),
      topApplicants: [],
    }
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
