/*
  Warnings:

  - You are about to drop the column `created_at` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `order_item_id` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "created_at",
DROP COLUMN "order_item_id",
DROP COLUMN "updated_at";
