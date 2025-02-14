-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CpHandles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeforces" TEXT,
    "leetcode" TEXT,
    "codechef" TEXT,
    "atcoder" TEXT,

    CONSTRAINT "CpHandles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CpHandles_userId_key" ON "CpHandles"("userId");

-- AddForeignKey
ALTER TABLE "CpHandles" ADD CONSTRAINT "CpHandles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
