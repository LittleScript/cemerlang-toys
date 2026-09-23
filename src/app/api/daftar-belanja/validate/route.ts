import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { resolveMemberPrice } from "@/lib/pricing";

type InputItem = {
  key?: string;
  productId?: string;
  variantId?: string;
  quantity?: number;
  unit?: string;
  packageSummary?: string;
  availability?: string;
  price?: number;
};

function packageSummary(levels: { label: string; contentQuantity: number | null; contentUnit: string | null; minimumOrderQuantity: number | null }[]) {
  return levels
    .map((level) => {
      const content = level.contentQuantity && level.contentUnit ? `: ${level.contentQuantity} ${level.contentUnit}` : "";
      const minimum = level.minimumOrderQuantity ? ` (min. ${level.minimumOrderQuantity} ${level.label})` : "";
      return `${level.label}${content}${minimum}`;
    })
    .join("; ");
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { items?: InputItem[] } | null;
  if (!body?.items || !Array.isArray(body.items) || body.items.length === 0 || body.items.length > 100) {
    return NextResponse.json({ error: "Daftar tidak valid" }, { status: 400 });
  }

  const session = await auth();
  const changes: { key: string; message: string }[] = [];
  const result: { key: string; price?: number; priceVisible: boolean; priceBasis?: string | null }[] = [];

  for (const item of body.items) {
    if (!item.productId || !item.key) {
      changes.push({ key: item.key ?? "unknown", message: "Ada item yang tidak memiliki identitas produk." });
      continue;
    }

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: {
        id: true,
        name: true,
        published: true,
        stockStatus: true,
        unit: true,
        variants: { select: { id: true, name: true, stock: true } },
        packageLevels: {
          where: { isDefaultSellingUnit: true },
          select: { label: true, contentQuantity: true, contentUnit: true, minimumOrderQuantity: true },
          take: 1,
        },
      },
    });

    if (!product || !product.published) {
      changes.push({ key: item.key, message: "Produk sudah tidak tersedia di katalog." });
      continue;
    }

    const variant = item.variantId ? product.variants.find((candidate) => candidate.id === item.variantId) : undefined;
    if (item.variantId && !variant) {
      changes.push({ key: item.key, message: `${product.name}: varian sudah tidak tersedia.` });
      continue;
    }

    const unavailable = product.stockStatus === "OUT_OF_STOCK" || Boolean(variant && variant.stock <= 0);
    const availability = unavailable ? "Habis — Konfirmasi ke Sales" : "Tersedia";
    const unit = product.packageLevels[0]?.label ?? product.unit ?? undefined;
    const currentPackageSummary = packageSummary(product.packageLevels);
    if (item.unit !== unit || item.packageSummary !== currentPackageSummary || item.availability !== availability) {
      changes.push({ key: item.key, message: `${product.name}: unit, kemasan, atau status ketersediaan berubah.` });
    }

    const memberPrice = session?.user?.id
      ? await resolveMemberPrice({ userId: session.user.id, productId: product.id })
      : null;
    const priceVisible = memberPrice !== null;
    if (priceVisible && item.price !== undefined && item.price !== memberPrice.amount) {
      changes.push({ key: item.key, message: `${product.name}: harga member berubah.` });
    }

    result.push({
      key: item.key,
      priceVisible,
      ...(priceVisible ? { price: memberPrice.amount, priceBasis: unit ?? null } : {}),
    });
  }

  return NextResponse.json({ changes, items: result });
}
