/*
  Warnings:

  - You are about to drop the column `mixingInstructions` on the `Formula` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Formula` table. All the data in the column will be lost.
  - You are about to drop the column `totalVolume` on the `Formula` table. All the data in the column will be lost.
  - You are about to drop the column `volumeUnit` on the `Formula` table. All the data in the column will be lost.
  - You are about to drop the `Component` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ingredient` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `baseNote` to the `Formula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fragranceFamilyId` to the `Formula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `middleNote` to the `Formula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mixing` to the `Formula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Formula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topNote` to the `Formula` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_formulaId_fkey";

-- DropForeignKey
ALTER TABLE "Component" DROP CONSTRAINT "Component_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_formulaId_fkey";

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_userId_fkey";

-- AlterTable
ALTER TABLE "Formula" DROP COLUMN "mixingInstructions",
DROP COLUMN "notes",
DROP COLUMN "totalVolume",
DROP COLUMN "volumeUnit",
ADD COLUMN     "baseNote" TEXT NOT NULL,
ADD COLUMN     "fragranceFamilyId" TEXT NOT NULL,
ADD COLUMN     "middleNote" TEXT NOT NULL,
ADD COLUMN     "mixing" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "topNote" TEXT NOT NULL;

-- DropTable
DROP TABLE "Component";

-- DropTable
DROP TABLE "Feedback";

-- DropTable
DROP TABLE "Ingredient";

-- CreateTable
CREATE TABLE "FragranceFamily" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT[],

    CONSTRAINT "FragranceFamily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FragranceFamily_name_key" ON "FragranceFamily"("name");

-- AddForeignKey
ALTER TABLE "Formula" ADD CONSTRAINT "Formula_fragranceFamilyId_fkey" FOREIGN KEY ("fragranceFamilyId") REFERENCES "FragranceFamily"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
