/*
  Warnings:

  - The `cvAnalysis` column on the `application` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "application" DROP COLUMN "cvAnalysis",
ADD COLUMN     "cvAnalysis" JSONB;
