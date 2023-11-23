/*
  Warnings:

  - You are about to drop the column `userId` on the `administrator` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[administratorId]` on the table `Administrator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[doctorId]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[patientId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `administratorId` to the `Administrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `administrator` DROP FOREIGN KEY `Administrator_userId_fkey`;

-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_patientId_fkey`;

-- DropForeignKey
ALTER TABLE `doctor` DROP FOREIGN KEY `Doctor_userId_fkey`;

-- DropForeignKey
ALTER TABLE `patient` DROP FOREIGN KEY `Patient_userId_fkey`;

-- AlterTable
ALTER TABLE `administrator` DROP COLUMN `userId`,
    ADD COLUMN `administratorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `doctor` DROP COLUMN `userId`,
    ADD COLUMN `doctorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `patient` DROP COLUMN `userId`,
    ADD COLUMN `patientId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Administrator_administratorId_key` ON `Administrator`(`administratorId`);

-- CreateIndex
CREATE UNIQUE INDEX `Doctor_doctorId_key` ON `Doctor`(`doctorId`);

-- CreateIndex
CREATE UNIQUE INDEX `Patient_patientId_key` ON `Patient`(`patientId`);

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Administrator` ADD CONSTRAINT `Administrator_administratorId_fkey` FOREIGN KEY (`administratorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`patientId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `Doctor`(`doctorId`) ON DELETE RESTRICT ON UPDATE CASCADE;
