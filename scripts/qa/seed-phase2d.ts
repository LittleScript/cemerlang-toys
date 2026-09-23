import "dotenv/config";
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const QA_DATABASE = "cemerlang_phase2d_qa";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const categories = [
  { id: "qa-category-kendaraan", name: "QA Kendaraan", slug: "qa-kendaraan", order: 1 },
  { id: "qa-category-grosir", name: "QA Grosir", slug: "qa-grosir", order: 2 },
];

const groups = [
  { id: "qa-group-a", name: "QA Group A", active: true },
  { id: "qa-group-b", name: "QA Group B", active: true },
  { id: "qa-group-c", name: "QA Group C Inactive", active: false },
];

const products = [
  { id: "qa-product-jagung", slug: "qa-jagung", name: "QA Jagung Group Pricing", categoryId: categories[0].id, stockStatus: "IN_STOCK", description: "Synthetic QA product." },
  { id: "qa-product-no-group-a", slug: "qa-no-group-a", name: "QA Tanpa Harga Group A", categoryId: categories[0].id, stockStatus: "IN_STOCK", description: "Synthetic QA product." },
  { id: "qa-product-no-group-b", slug: "qa-no-group-b", name: "QA Tanpa Harga Group B", categoryId: categories[0].id, stockStatus: "IN_STOCK", description: "Synthetic QA product." },
  { id: "qa-product-bal", slug: "qa-bal-100-pcs", name: "QA Bal 100 pcs", categoryId: categories[1].id, stockStatus: "IN_STOCK", description: "Synthetic simple packaging." },
  { id: "qa-product-ikat", slug: "qa-ikat-bungkus", name: "QA Ikat Bungkus Bertingkat", categoryId: categories[1].id, stockStatus: "IN_STOCK", description: "Synthetic multi-level packaging." },
  { id: "qa-product-oos", slug: "qa-habis", name: "QA Produk Habis", categoryId: categories[1].id, stockStatus: "OUT_OF_STOCK", description: "Synthetic unavailable product." },
  { id: "qa-product-variants", slug: "qa-varian", name: "QA Produk Dengan Varian", categoryId: categories[0].id, stockStatus: "IN_STOCK", description: "Synthetic variants." },
  { id: "qa-product-long", slug: "qa-produk-dengan-nama-yang-sangat-panjang-untuk-menguji-wrapping-di-kartu", name: "QA Produk dengan Nama yang Sangat Panjang untuk Menguji Wrapping di Kartu", categoryId: categories[1].id, stockStatus: "IN_STOCK", description: "Synthetic long-name product." },
  { id: "qa-product-no-image", slug: "qa-tanpa-gambar", name: "QA Produk Tanpa Gambar", categoryId: categories[1].id, stockStatus: "IN_STOCK", description: "Synthetic missing-image product." },
  { id: "qa-product-no-moq", slug: "qa-tanpa-moq", name: "QA Produk Tanpa MOQ", categoryId: categories[1].id, stockStatus: "IN_STOCK", description: "Synthetic product without MOQ." },
  { id: "qa-product-alias", slug: "qa-alias-jagoan", name: "QA Kendaraan Mini Jagoan", categoryId: categories[0].id, stockStatus: "IN_STOCK", description: "Synthetic alias-search product." },
];

async function main() {
  const [{ db }] = await prisma.$queryRaw<{ db: string }[]>`SELECT current_database() AS db`;
  if (db !== QA_DATABASE) throw new Error(`QA seed refused target database: ${db}`);

  await prisma.productGroupPrice.deleteMany();
  await prisma.productPackageLevel.deleteMany();
  await prisma.productAlias.deleteMany();
  await prisma.productVariant.deleteMany({ where: { productId: { startsWith: "qa-" } } });
  await prisma.productImage.deleteMany({ where: { productId: { startsWith: "qa-" } } });
  await prisma.product.deleteMany({ where: { id: { startsWith: "qa-" } } });
  await prisma.user.deleteMany({ where: { id: { startsWith: "qa-" } } });
  await prisma.priceGroup.deleteMany({ where: { id: { startsWith: "qa-" } } });
  await prisma.category.deleteMany({ where: { id: { startsWith: "qa-" } } });

  for (const category of categories) await prisma.category.create({ data: category });
  for (const group of groups) await prisma.priceGroup.create({ data: group });

  for (const product of products) {
    await prisma.product.create({ data: { ...product, price: 999999, discountPrice: 888888, unit: null } });
  }

  await prisma.productImage.create({ data: { productId: "qa-product-jagung", url: "https://placehold.co/600x600/2bc4c2/ffffff.png?text=QA+Jagung", alt: "QA Jagung" } });
  await prisma.productImage.create({ data: { productId: "qa-product-ikat", url: "https://placehold.co/600x600/ff9d3d/ffffff.png?text=QA+Ikat", alt: "QA Ikat" } });

  const bal = await prisma.productPackageLevel.create({ data: { productId: "qa-product-bal", label: "Bal", contentQuantity: 100, contentUnit: "pcs", minimumOrderQuantity: 1, isDefaultSellingUnit: true, sortOrder: 0 } });
  const ikat = await prisma.productPackageLevel.create({ data: { productId: "qa-product-ikat", label: "Ikat", contentQuantity: 10, contentUnit: "Bungkus", minimumOrderQuantity: 1, isDefaultSellingUnit: true, sortOrder: 0 } });
  await prisma.productPackageLevel.create({ data: { productId: "qa-product-ikat", label: "Bungkus", contentQuantity: 12, contentUnit: "pcs", minimumOrderQuantity: null, parentId: ikat.id, isDefaultSellingUnit: false, sortOrder: 1 } });
  await prisma.productPackageLevel.create({ data: { productId: "qa-product-no-moq", label: "Set", contentQuantity: 4, contentUnit: "pcs", minimumOrderQuantity: null, isDefaultSellingUnit: true, sortOrder: 0 } });

  await prisma.productGroupPrice.createMany({ data: [
    { productId: "qa-product-jagung", priceGroupId: groups[0].id, amount: 10000, packageLevelId: null },
    { productId: "qa-product-jagung", priceGroupId: groups[1].id, amount: 11000, packageLevelId: null },
    { productId: "qa-product-jagung", priceGroupId: groups[2].id, amount: 99000, packageLevelId: null },
    { productId: "qa-product-no-group-a", priceGroupId: groups[1].id, amount: 22000, packageLevelId: null },
    { productId: "qa-product-no-group-b", priceGroupId: groups[0].id, amount: 33000, packageLevelId: null },
    { productId: "qa-product-bal", priceGroupId: groups[0].id, amount: 50000, packageLevelId: bal.id },
    { productId: "qa-product-ikat", priceGroupId: groups[0].id, amount: 75000, packageLevelId: ikat.id },
  ] });

  await prisma.productAlias.create({ data: { productId: "qa-product-alias", value: "mobil jagoan", normalizedValue: "mobil jagoan" } });
  await prisma.productVariant.createMany({ data: [
    { id: "qa-variant-merah", productId: "qa-product-variants", name: "Merah", stock: 10, price: 777777 },
    { id: "qa-variant-biru", productId: "qa-product-variants", name: "Biru", stock: 0, price: 666666 },
  ] });

  await prisma.user.createMany({ data: [
    { id: "qa-user-pending", email: "pending@qa.invalid", name: "QA Pending", status: "PENDING", role: "USER" },
    { id: "qa-user-rejected", email: "rejected@qa.invalid", name: "QA Rejected", status: "REJECTED", role: "USER" },
    { id: "qa-user-approved-a", email: "group-a@qa.invalid", name: "QA Group A", status: "APPROVED", role: "USER", priceGroupId: groups[0].id },
    { id: "qa-user-approved-b", email: "group-b@qa.invalid", name: "QA Group B", status: "APPROVED", role: "USER", priceGroupId: groups[1].id },
    { id: "qa-user-approved-none", email: "no-group@qa.invalid", name: "QA No Group", status: "APPROVED", role: "USER" },
    { id: "qa-user-approved-inactive", email: "inactive-group@qa.invalid", name: "QA Inactive Group", status: "APPROVED", role: "USER", priceGroupId: groups[2].id },
    { id: "qa-admin", email: "admin@qa.invalid", name: "QA Admin", status: "APPROVED", role: "ADMIN" },
  ] });

  console.log(`QA fixtures seeded in ${db}: ${products.length} products, ${groups.length} groups, 6 users.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
