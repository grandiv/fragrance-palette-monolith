-- AlterTable
ALTER TABLE "Formula" ADD COLUMN     "mixingInstructions" TEXT[],
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "totalVolume" DOUBLE PRECISION,
ADD COLUMN     "volumeUnit" TEXT;

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "description" TEXT,
ADD COLUMN     "properties" TEXT;
