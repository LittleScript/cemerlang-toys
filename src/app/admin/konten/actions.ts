"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export interface SiteContentFormState {
  error?: string;
  success?: boolean;
}

export async function updateSiteContent(
  _prevState: SiteContentFormState,
  formData: FormData
): Promise<SiteContentFormState> {
  await requireAdmin();

  const heroBadge = String(formData.get("heroBadge") ?? "").trim();
  const heroTitle = String(formData.get("heroTitle") ?? "").trim();
  const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
  const ctaTitle = String(formData.get("ctaTitle") ?? "").trim();
  const ctaSubtitle = String(formData.get("ctaSubtitle") ?? "").trim();

  if (!heroTitle || !heroSubtitle || !ctaTitle || !ctaSubtitle) {
    return { error: "Semua field wajib diisi." };
  }

  const data = { heroBadge, heroTitle, heroSubtitle, ctaTitle, ctaSubtitle };

  await prisma.siteContent.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  });

  revalidatePath("/admin/konten");
  revalidatePath("/");

  return { success: true };
}
