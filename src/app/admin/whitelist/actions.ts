"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { normalizeWhatsApp } from "@/lib/phone";

export interface WhitelistFormState {
  error?: string;
}

export async function addWhitelistNumber(
  _prevState: WhitelistFormState,
  formData: FormData
): Promise<WhitelistFormState> {
  await requireAdmin();

  const raw = String(formData.get("phoneNumber") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  const phoneNumber = normalizeWhatsApp(raw);
  if (!phoneNumber) {
    return { error: "Nomor WhatsApp tidak valid. Gunakan format 08xx, +628xx, atau 628xx." };
  }

  const existing = await prisma.whitelistWA.findUnique({ where: { phoneNumber } });
  if (existing) {
    return { error: "Nomor ini sudah ada di whitelist." };
  }

  await prisma.whitelistWA.create({ data: { phoneNumber, note: note || null } });

  // Re-check pending members with this WA number -> auto-approve
  await prisma.user.updateMany({
    where: { whatsapp: phoneNumber, status: "PENDING" },
    data: { status: "APPROVED" },
  });

  revalidatePath("/admin/whitelist");
  revalidatePath("/admin/member");
  return {};
}

export async function removeWhitelistNumber(id: string) {
  await requireAdmin();
  await prisma.whitelistWA.delete({ where: { id } });
  revalidatePath("/admin/whitelist");
}
