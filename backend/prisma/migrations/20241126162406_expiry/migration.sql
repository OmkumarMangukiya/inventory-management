-- DropIndex
DROP INDEX "product_name_key";

-- CreateTable
CREATE TABLE "expiredProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "warehouseId" TEXT NOT NULL,

    CONSTRAINT "expiredProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "expiredProduct" ADD CONSTRAINT "expiredProduct_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
