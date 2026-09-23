"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function createPriceGroup(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await prisma.priceGroup.create({ data: { name } });
  revalidatePath("/admin/harga");
}

export async function updatePriceGroup(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const active = formData.get("active") === "on";
  if (!name) return;
  await prisma.priceGroup.update({ where: { id }, data: { name, active } });
  revalidatePath("/admin/harga");
  revalidatePath("/admin/member");
}

export async function assignMemberPriceGroup(userId: string, formData: FormData) {
  await requireAdmin();
  const priceGroupId = String(formData.get("priceGroupId") ?? "").trim();
  await prisma.user.update({
    where: { id: userId },
    data: { priceGroupId: priceGroupId || null },
  });
  revalidatePath("/admin/member");
}
