-- AlterTable
ALTER TABLE "job" ADD COLUMN     "numberOfRoles" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "shortlistSize" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "yearsOfExperience" INTEGER NOT NULL DEFAULT 0;
