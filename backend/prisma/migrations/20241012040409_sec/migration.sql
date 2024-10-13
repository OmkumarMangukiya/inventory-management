/*
  Warnings:

  - You are about to drop the `headmanager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `manager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `owner` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "headmanager";

-- DropTable
DROP TABLE "manager";

-- DropTable
DROP TABLE "owner";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "warehouseIds" TEXT[],

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
