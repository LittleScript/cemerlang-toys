"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export interface GalleryFormState {
  error?: string;
}

export async function createGalleryPhoto(
  _prevState: GalleryFormState,
  formData: FormData
): Promise<GalleryFormState> {
  await requireAdmin();

  const url = String(formData.get("url") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);

  if (!url) return { error: "Unggah foto terlebih dahulu." };

  // Validate URL is from our uploads or a known image CDN
  if (!url.startsWith("/uploads/") && !/^https:\/\/.*\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(url)) {
    return { error: "URL foto tidak valid. Gunakan foto dari uploader atau URL gambar yang valid." };
  }

  await prisma.galleryPhoto.create({ data: { url, caption: caption || null, order } });

  revalidatePath("/admin/galeri");
  revalidatePath("/tentang");

  return {};
}

export async function deleteGalleryPhoto(id: string) {
  await requireAdmin();

  await prisma.galleryPhoto.delete({ where: { id } });

  revalidatePath("/admin/galeri");
  revalidatePath("/tentang");
}
