/*
  Warnings:

  - Added the required column `totalstock` to the `warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "warehouseIds" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "warehouse" ADD COLUMN     "totalstock" INTEGER NOT NULL;
