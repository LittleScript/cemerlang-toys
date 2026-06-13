"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { normalizeWhatsApp } from "@/lib/phone";

export interface RegistrationState {
  error?: string;
}

export async function submitRegistration(
  _prevState: RegistrationState,
  formData: FormData
): Promise<RegistrationState> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const whatsappRaw = String(formData.get("whatsapp") ?? "");
  const address = String(formData.get("address") ?? "").trim();
  const storeName = String(formData.get("storeName") ?? "").trim();

  const whatsapp = normalizeWhatsApp(whatsappRaw);
  if (!whatsapp) {
    return {
      error: "Nomor WhatsApp tidak valid. Gunakan format 08xx, +628xx, atau 628xx.",
    };
  }

  if (!address) {
    return { error: "Alamat lengkap wajib diisi." };
  }

  const whitelisted = await prisma.whitelistWA.findUnique({
    where: { phoneNumber: whatsapp },
  });
  const status = whitelisted ? "APPROVED" : "PENDING";

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      whatsapp,
      address,
      storeName: storeName || null,
      status,
    },
  });

  redirect(status === "APPROVED" ? "/" : "/akun/menunggu-verifikasi");
}
