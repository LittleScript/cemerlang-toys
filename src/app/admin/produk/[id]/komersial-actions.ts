"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

type PackageInput = { key: string; parentKey?: string; label: string; contentQuantity?: number; contentUnit?: string; minimumOrderQuantity?: number; isDefaultSellingUnit?: boolean };
type PriceInput = { priceGroupId: string; packageKey?: string; amount?: number };

export async function saveCommercialData(productId: string, formData: FormData) {
  await requireAdmin();
  const packages = JSON.parse(String(formData.get("packagesJson") ?? "[]")) as PackageInput[];
  const prices = JSON.parse(String(formData.get("pricesJson") ?? "[]")) as PriceInput[];
  const aliases = String(formData.get("aliases") ?? "").split("\n").map((value) => value.trim()).filter(Boolean);

  await prisma.$transaction(async (tx) => {
    await tx.productGroupPrice.deleteMany({ where: { productId } });
    await tx.productPackageLevel.deleteMany({ where: { productId } });
    await tx.productAlias.deleteMany({ where: { productId } });

    const packageIds = new Map<string, string>();
    for (const item of packages.filter((item) => item.label.trim())) {
      const created = await tx.productPackageLevel.create({
        data: {
          productId,
          label: item.label.trim(),
          contentQuantity: item.contentQuantity || null,
          contentUnit: item.contentUnit?.trim() || null,
          minimumOrderQuantity: item.minimumOrderQuantity || null,
          isDefaultSellingUnit: Boolean(item.isDefaultSellingUnit),
          parentId: item.parentKey ? packageIds.get(item.parentKey) ?? null : null,
          sortOrder: packageIds.size,
        },
      });
      packageIds.set(item.key, created.id);
    }

    for (const price of prices.filter((item) => item.amount && item.amount > 0)) {
      await tx.productGroupPrice.create({
        data: {
          productId,
          priceGroupId: price.priceGroupId,
          amount: price.amount!,
          packageLevelId: price.packageKey ? packageIds.get(price.packageKey) ?? null : null,
        },
      });
    }

    for (const value of aliases) {
      await tx.productAlias.create({
        data: {
          productId,
          value,
          normalizedValue: value.toLocaleLowerCase("id-ID").replace(/\s+/g, " "),
        },
      });
    }
  });

  revalidatePath(`/admin/produk/${productId}/komersial`);
  revalidatePath("/katalog");
  revalidatePath(`/produk`);
}
