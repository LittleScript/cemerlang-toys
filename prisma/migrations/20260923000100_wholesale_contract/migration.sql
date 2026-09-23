-- Phase 2D wholesale contract. Existing development product/pricing fields
-- remain untouched; no legacy pricing is copied into the new model.

ALTER TABLE "User" ADD COLUMN "cityArea" TEXT;
ALTER TABLE "User" ADD COLUMN "priceGroupId" TEXT;

CREATE TABLE "PriceGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PriceGroup_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductPackageLevel" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "parentId" TEXT,
    "label" TEXT NOT NULL,
    "contentQuantity" INTEGER,
    "contentUnit" TEXT,
    "minimumOrderQuantity" INTEGER,
    "isDefaultSellingUnit" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProductPackageLevel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductGroupPrice" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "priceGroupId" TEXT NOT NULL,
    "packageLevelId" TEXT,
    "amount" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProductGroupPrice_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductAlias" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "normalizedValue" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProductAlias_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductGroupPrice_productId_priceGroupId_packageLevelId_key"
  ON "ProductGroupPrice"("productId", "priceGroupId", "packageLevelId");
CREATE INDEX "ProductPackageLevel_productId_sortOrder_idx" ON "ProductPackageLevel"("productId", "sortOrder");
CREATE INDEX "ProductPackageLevel_parentId_idx" ON "ProductPackageLevel"("parentId");
CREATE INDEX "ProductGroupPrice_priceGroupId_active_idx" ON "ProductGroupPrice"("priceGroupId", "active");
CREATE INDEX "ProductAlias_normalizedValue_idx" ON "ProductAlias"("normalizedValue");
CREATE INDEX "ProductAlias_productId_active_idx" ON "ProductAlias"("productId", "active");
CREATE INDEX "User_priceGroupId_idx" ON "User"("priceGroupId");

ALTER TABLE "User" ADD CONSTRAINT "User_priceGroupId_fkey"
  FOREIGN KEY ("priceGroupId") REFERENCES "PriceGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProductPackageLevel" ADD CONSTRAINT "ProductPackageLevel_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductPackageLevel" ADD CONSTRAINT "ProductPackageLevel_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "ProductPackageLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductGroupPrice" ADD CONSTRAINT "ProductGroupPrice_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductGroupPrice" ADD CONSTRAINT "ProductGroupPrice_priceGroupId_fkey"
  FOREIGN KEY ("priceGroupId") REFERENCES "PriceGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductGroupPrice" ADD CONSTRAINT "ProductGroupPrice_packageLevelId_fkey"
  FOREIGN KEY ("packageLevelId") REFERENCES "ProductPackageLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProductAlias" ADD CONSTRAINT "ProductAlias_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
