/*
  Warnings:

  - You are about to drop the column `administratorId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_administratorId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_doctorId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_patientId_fkey`;

-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `appointment_time` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `administratorId`,
    DROP COLUMN `doctorId`,
    DROP COLUMN `patientId`;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Administrator` ADD CONSTRAINT `Administrator_administratorId_fkey` FOREIGN KEY (`administratorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
