-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('MENU', 'CUENTA', 'SERVILLETAS', 'CUBIERTOS', 'SALSAS', 'RETIRAR_PLATOS', 'LIMPIAR_MESA', 'OTRO');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDIENTE', 'EN_CAMINO', 'COMPLETADO');

-- CreateTable
CREATE TABLE "tables" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waiters" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "waiters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" SERIAL NOT NULL,
    "tableId" INTEGER NOT NULL,
    "type" "RequestType" NOT NULL,
    "notes" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "waiterId" INTEGER,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tables_name_key" ON "tables"("name");

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_waiterId_fkey" FOREIGN KEY ("waiterId") REFERENCES "waiters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
