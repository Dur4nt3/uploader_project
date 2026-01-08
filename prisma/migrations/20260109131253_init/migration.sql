-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Folder" (
    "folderId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "visibilityId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("folderId")
);

-- CreateTable
CREATE TABLE "File" (
    "fileId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "visibilityId" INTEGER NOT NULL,
    "folderId" INTEGER NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "Visibility" (
    "visibilityId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Visibility_pkey" PRIMARY KEY ("visibilityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Visibility_name_key" ON "Visibility"("name");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_visibilityId_fkey" FOREIGN KEY ("visibilityId") REFERENCES "Visibility"("visibilityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_visibilityId_fkey" FOREIGN KEY ("visibilityId") REFERENCES "Visibility"("visibilityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("folderId") ON DELETE RESTRICT ON UPDATE CASCADE;
