-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('pending', 'accepted', 'ongoing', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('car', 'bike', 'auto');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullname" JSONB NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "socketId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Captain" (
    "id" TEXT NOT NULL,
    "fullname" JSONB NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "socketId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'inactive',
    "vehicle" JSONB NOT NULL,
    "location" JSONB NOT NULL,

    CONSTRAINT "Captain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlacklistToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlacklistToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ride" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "captainId" TEXT NOT NULL,
    "pickup" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "fare" INTEGER NOT NULL,
    "status" "RideStatus" NOT NULL DEFAULT 'pending',
    "duration" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "paymentId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "otp" TEXT NOT NULL,

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Captain_email_key" ON "Captain"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistToken_token_key" ON "BlacklistToken"("token");

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "Captain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
