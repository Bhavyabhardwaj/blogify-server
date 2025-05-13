/*
  Warnings:

  - A unique constraint covering the columns `[postId,userId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authorId,postId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_postId_userId_key" ON "Bookmark"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_authorId_postId_key" ON "Like"("authorId", "postId");
