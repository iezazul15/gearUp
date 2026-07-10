/*
  Warnings:

  - The values [STRIPE] on the enum `PaymentProvider` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `pricePerDay` on the `gear_items` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `totalAmount` on the `rental_orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentProvider_new" AS ENUM ('SSLCOMMERZ');
ALTER TABLE "public"."payments" ALTER COLUMN "method" DROP DEFAULT;
ALTER TABLE "payments" ALTER COLUMN "method" TYPE "PaymentProvider_new" USING ("method"::text::"PaymentProvider_new");
ALTER TYPE "PaymentProvider" RENAME TO "PaymentProvider_old";
ALTER TYPE "PaymentProvider_new" RENAME TO "PaymentProvider";
DROP TYPE "public"."PaymentProvider_old";
ALTER TABLE "payments" ALTER COLUMN "method" SET DEFAULT 'SSLCOMMERZ';
COMMIT;

-- AlterTable
ALTER TABLE "gear_items" ALTER COLUMN "pricePerDay" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "method" SET DEFAULT 'SSLCOMMERZ';

-- AlterTable
ALTER TABLE "rental_orders" ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(65,30);
