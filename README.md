# JobWise

A brief description of your project. What it does and who it's for.

## Tech Stack

- **Framework**: Next.js
- **Monorepo**: Turborepo
- **ORM**: Prisma
- **Database**: MongoDB, PostgreSQL
- **Language**: TypeScript
- **Linting**: ESLint
- **Formatting**: Prettier
- **AI**: Python backend, GROQ, PyTorch, Modern Bert

## Features

- User Authentication (Sign-up, Sign-in)
- Job Listings
- Job Application Submission (potentially with resume upload)
- User Dashboard
- AI-powered features (e.g., resume review, job matching)
- Recruiter tools:
    - Shortlist candidates with best matching profiles
    - View extracted relevant information about candidates

## How to Run

1. **Clone the repository:**

   ```bash
   # Replace with your repository URL
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. **Install dependencies:**

   Choose your package manager and run the install command in the root directory. For example, with npm:

   ```bash
   npm install
   ```

   Or with yarn:

   ```bash
   yarn install
   ```

3. **Set up environment variables:**

   Copy the example environment files for the database and web app:

   ```bash
   cp .env.example ./packages/database/.env
   cp .env.example ./apps/web/.env
   cp .env.example ./apps/docs/.env
   ```

   Update the environment variables accordingly.

4. **Migrate your database:**

   Create and apply database migrations:

   ```bash
   # Using npm
   npm run db:migrate:dev
   ```

   (Or `yarn run db:migrate:dev`, `pnpm run db:migrate:dev`, `bun run db:migrate:dev`)

   You'll be prompted to name the migration.

5. **Build the application:**

   ```bash
   # Using npm
   npm run build
   ```

   (Or `yarn run build`, `pnpm run build`, `bun run build`)

6. **Start the development server:**

   ```bash
   # Using npm (from the root or apps/web)
   npm run dev
   ```

   ```bash
   cd model/
   python3 API.py
   ```

   The application will typically be available at `http://localhost:3001`.

## AI Usage Explanation

This project utilizes AI for [Please specify how AI is used. e.g., "processing and analyzing resumes uploaded by users", "matching candidates to job descriptions", "providing automated feedback on resume quality"].

The AI components are primarily located in:

- `model/API.py`: This seems to be the core Python backend for AI functionalities.
- `apps/web/lib/gemini.ts`: This might be a client-side library or service to interact with an AI model or the Python backend.

Please provide more details on the specific AI models used, their purpose, and how they integrate with the rest of the application.
