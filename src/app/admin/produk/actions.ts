"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export interface ProductFormState {
  error?: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

interface ImageInput {
  url?: string;
  alt?: string;
}

interface VariantInput {
  name?: string;
  sku?: string;
  price?: string;
  stock?: string;
  image?: string;
}

function parseJsonArray<T>(raw: FormDataEntryValue | null): T[] {
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function readProductInput(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const discountPriceRaw = String(formData.get("discountPrice") ?? "").trim();
  const stockStatus = String(formData.get("stockStatus") ?? "IN_STOCK");
  const ageRangeRaw = String(formData.get("ageRange") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const published = formData.get("published") === "on";

  const images = parseJsonArray<ImageInput>(formData.get("imagesJson"))
    .map((img) => ({ url: img.url?.trim() ?? "", alt: img.alt?.trim() || null }))
    .filter((img) => img.url);

  const variants = parseJsonArray<VariantInput>(formData.get("variantsJson"))
    .map((variant) => ({
      name: variant.name?.trim() ?? "",
      sku: variant.sku?.trim() || null,
      price: variant.price ? Number(variant.price) : null,
      stock: variant.stock ? Number(variant.stock) : 0,
      image: variant.image?.trim() || null,
    }))
    .filter((variant) => variant.name);

  return {
    name,
    slug: slugify(slugInput || name),
    description: description || null,
    price: priceRaw ? Number(priceRaw) : null,
    discountPrice: discountPriceRaw ? Number(discountPriceRaw) : null,
    stockStatus,
    ageRange: ageRangeRaw || null,
    categoryId,
    published,
    images,
    variants,
  };
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const input = readProductInput(formData);
  if (!input.name) return { error: "Nama produk wajib diisi." };
  if (!input.slug) return { error: "Slug tidak valid." };
  if (!input.categoryId) return { error: "Kategori wajib dipilih." };

  const existing = await prisma.product.findUnique({ where: { slug: input.slug } });
  if (existing) return { error: "Slug sudah dipakai produk lain." };

  await prisma.product.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description,
      price: input.price,
      discountPrice: input.discountPrice,
      stockStatus: input.stockStatus,
      ageRange: input.ageRange,
      published: input.published,
      categoryId: input.categoryId,
      images: { create: input.images.map((img, index) => ({ ...img, order: index })) },
      variants: { create: input.variants },
    },
  });

  revalidatePath("/admin/produk");
  revalidatePath("/katalog");
  redirect("/admin/produk");
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const input = readProductInput(formData);
  if (!input.name) return { error: "Nama produk wajib diisi." };
  if (!input.slug) return { error: "Slug tidak valid." };
  if (!input.categoryId) return { error: "Kategori wajib dipilih." };

  const existing = await prisma.product.findUnique({ where: { slug: input.slug } });
  if (existing && existing.id !== id) return { error: "Slug sudah dipakai produk lain." };

  await prisma.product.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description,
      price: input.price,
      discountPrice: input.discountPrice,
      stockStatus: input.stockStatus,
      ageRange: input.ageRange,
      published: input.published,
      categoryId: input.categoryId,
      images: {
        deleteMany: {},
        create: input.images.map((img, index) => ({ ...img, order: index })),
      },
      variants: {
        deleteMany: {},
        create: input.variants,
      },
    },
  });

  revalidatePath("/admin/produk");
  revalidatePath("/katalog");
  revalidatePath(`/produk/${input.slug}`);
  redirect("/admin/produk");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/produk");
  revalidatePath("/katalog");
}

export async function toggleProductPublished(id: string, published: boolean) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { published } });
  revalidatePath("/admin/produk");
  revalidatePath("/katalog");
}
