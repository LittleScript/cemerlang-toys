import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function POST(request: Request): Promise<NextResponse> {
  const authError = await requireAdminApi();
  if (authError) return authError;

  const { name } = (await request.json()) as { name?: string };
  const trimmed = name?.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "Nama kategori wajib diisi." }, { status: 400 });
  }

  let slug = slugify(trimmed);
  if (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${slug}-${Date.now()}`;
  }

  const { _max } = await prisma.category.aggregate({ _max: { order: true } });
  const created = await prisma.category.create({
    data: { name: trimmed, slug, icon: "Boxes", order: (_max.order ?? 0) + 1 },
  });

  revalidatePath("/admin/kategori");
  revalidatePath("/katalog");

  return NextResponse.json({ id: created.id, name: created.name });
}
