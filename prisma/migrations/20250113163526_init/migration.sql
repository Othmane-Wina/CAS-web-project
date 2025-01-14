-- AlterTable
ALTER TABLE "User" ADD COLUMN     "grade" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "member" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stream" TEXT NOT NULL DEFAULT 'none';
