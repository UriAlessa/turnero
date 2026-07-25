/*
  Warnings:

  - Added the required column `ownerEmail` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "ownerEmail" TEXT NOT NULL;
