/*
  Warnings:

  - A unique constraint covering the columns `[businessId,startsAt]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Appointment_businessId_startsAt_key" ON "Appointment"("businessId", "startsAt");
