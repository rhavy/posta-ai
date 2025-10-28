/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rg]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `image` TEXT NULL,
    ADD COLUMN `imagePosition` TEXT NULL,
    ADD COLUMN `titleAlignment` TEXT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `banner` TEXT NULL,
    ADD COLUMN `bio` TEXT NULL,
    ADD COLUMN `cpf` VARCHAR(191) NULL,
    ADD COLUMN `dataNascimento` DATETIME(3) NULL,
    ADD COLUMN `genero` TEXT NULL,
    ADD COLUMN `rg` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `perfil` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `rua` TEXT NULL,
    `numero` TEXT NULL,
    `referencia` TEXT NULL,
    `bairro` TEXT NULL,
    `cidade` TEXT NULL,
    `estado` TEXT NULL,
    `pais` TEXT NULL,
    `cep` TEXT NULL,

    UNIQUE INDEX `perfil_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pessoal` (
    `id` VARCHAR(191) NOT NULL,
    `telefone` TEXT NULL,
    `celular` TEXT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `pessoal_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `user_cpf_key` ON `user`(`cpf`);

-- CreateIndex
CREATE UNIQUE INDEX `user_rg_key` ON `user`(`rg`);

-- AddForeignKey
ALTER TABLE `perfil` ADD CONSTRAINT `perfil_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pessoal` ADD CONSTRAINT `pessoal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
