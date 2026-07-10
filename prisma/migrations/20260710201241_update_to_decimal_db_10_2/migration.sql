/*
  Warnings:

  - You are about to alter the column `pricePerDay` on the `gear_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `pricePerDay` on the `rental_order_items` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `totalAmount` on the `rental_orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "gear_items" ALTER COLUMN "pricePerDay" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "rental_order_items" ALTER COLUMN "pricePerDay" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "rental_orders" ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(10,2);
