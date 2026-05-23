/*
  Warnings:

  - You are about to drop the column `slug` on the `Audit` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Audit_slug_key";

-- AlterTable
ALTER TABLE "Audit" DROP COLUMN "slug";
