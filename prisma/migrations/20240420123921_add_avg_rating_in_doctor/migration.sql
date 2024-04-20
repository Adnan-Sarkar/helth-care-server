/*
  Warnings:

  - You are about to drop the column `PatientId` on the `prescriptions` table. All the data in the column will be lost.
  - You are about to drop the column `PatientId` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `patientId` to the `prescriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_PatientId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_PatientId_fkey";

-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "prescriptions" DROP COLUMN "PatientId",
ADD COLUMN     "patientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "PatientId",
ADD COLUMN     "patientId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
