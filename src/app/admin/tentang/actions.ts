"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export interface AboutContentFormState {
  error?: string;
  success?: boolean;
}

const FIELDS = [
  "heroBadge",
  "ceritaParagraph1",
  "ceritaParagraph2",
  "ceritaParagraph3",
  "visiText",
  "misi1",
  "misi2",
  "misi3",
  "misi4",
  "valueProp1Title",
  "valueProp1Desc",
  "valueProp2Title",
  "valueProp2Desc",
  "valueProp3Title",
  "valueProp3Desc",
  "contactTitle",
  "contactSubtitle",
  "stat1Value",
  "stat1Label",
  "stat2Value",
  "stat2Label",
  "stat3Value",
  "stat3Label",
  "stat4Value",
  "stat4Label",
  "keunggulan1",
  "keunggulan2",
  "keunggulan3",
  "keunggulan4",
  "keunggulan5",
  "caraOrder1",
  "caraOrder2",
  "caraOrder3",
  "faq1Question",
  "faq1Answer",
  "faq2Question",
  "faq2Answer",
  "faq3Question",
  "faq3Answer",
  "faq4Question",
  "faq4Answer",
  "faq5Question",
  "faq5Answer",
  "faq6Question",
  "faq6Answer",
  "faq7Question",
  "faq7Answer",
] as const;

export async function updateAboutContent(
  _prevState: AboutContentFormState,
  formData: FormData
): Promise<AboutContentFormState> {
  await requireAdmin();

  const data: Record<string, string> = {};
  for (const field of FIELDS) {
    data[field] = String(formData.get(field) ?? "").trim();
  }

  if (Object.values(data).some((value) => !value)) {
    return { error: "Semua field wajib diisi." };
  }

  await prisma.aboutContent.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  });

  revalidatePath("/admin/tentang");
  revalidatePath("/tentang");

  return { success: true };
}
