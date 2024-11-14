/*
  Warnings:

  - You are about to drop the column `isGroup` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `replyToId` on the `Message` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BotType" AS ENUM ('openai', 'cohere');

-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('private', 'group');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_replyToId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "isGroup",
ADD COLUMN     "type" "ChatType" NOT NULL DEFAULT 'private';

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "replyToId";

-- AlterTable
ALTER TABLE "MessageReceipt" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "botType" "BotType",
ADD COLUMN     "isBot" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL;
