-- AlterTable
ALTER TABLE "product" ADD COLUMN     "warehouseIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
