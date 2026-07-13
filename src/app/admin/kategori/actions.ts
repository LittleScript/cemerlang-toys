"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";

export interface CategoryFormState {
  error?: string;
}

function readCategoryInput(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);

  return { name, slug: slugify(slugInput || name), icon, order };
}

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const { name, slug, icon, order } = readCategoryInput(formData);
  if (!name) return { error: "Nama kategori wajib diisi." };
  if (!slug) return { error: "Slug tidak valid." };

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return { error: "Slug sudah dipakai kategori lain." };

  try {
    await prisma.category.create({ data: { name, slug, icon: icon || null, order } });
  } catch (error: unknown) {
    const code = (error as { code?: string }).code;
    if (code === "P2002") return { error: "Slug sudah dipakai kategori lain." };
    throw error;
  }

  revalidatePath("/admin/kategori");
  revalidatePath("/katalog");
  redirect("/admin/kategori");
}

export async function updateCategory(
  id: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  await requireAdmin();

  const { name, slug, icon, order } = readCategoryInput(formData);
  if (!name) return { error: "Nama kategori wajib diisi." };
  if (!slug) return { error: "Slug tidak valid." };

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing && existing.id !== id) return { error: "Slug sudah dipakai kategori lain." };

  try {
    await prisma.category.update({ where: { id }, data: { name, slug, icon: icon || null, order } });
  } catch (error: unknown) {
    const code = (error as { code?: string }).code;
    if (code === "P2002") return { error: "Slug sudah dipakai kategori lain." };
    if (code === "P2025") return { error: "Kategori tidak ditemukan atau sudah dihapus." };
    throw error;
  }

  revalidatePath("/admin/kategori");
  revalidatePath("/katalog");
  redirect("/admin/kategori");
}

export async function deleteCategory(id: string): Promise<CategoryFormState> {
  await requireAdmin();

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return { error: "Kategori tidak dapat dihapus karena masih memiliki produk." };
  }

  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    return { error: "Kategori tidak ditemukan atau sudah dihapus." };
  }

  revalidatePath("/admin/kategori");
  revalidatePath("/katalog");
  return {};
}
