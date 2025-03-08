/*
  Warnings:

  - The `topApplicants` column on the `job` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "job" ADD COLUMN     "applicants" JSONB,
DROP COLUMN "topApplicants",
ADD COLUMN     "topApplicants" TEXT[];
