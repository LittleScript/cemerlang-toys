import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { CommercialDataForm } from "@/components/admin/commercial-data-form";
import { saveCommercialData } from "../komersial-actions";

export default async function AdminCommercialPage(props: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await props.params;
  const [product, groups] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { packageLevels: { orderBy: { sortOrder: "asc" } }, aliases: { where: { active: true }, orderBy: { value: "asc" } }, groupPrices: { where: { active: true } } } }),
    prisma.priceGroup.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();
  const initialPackages = product.packageLevels.map((item) => ({ key: item.id, parentKey: item.parentId ?? "", label: item.label, contentQuantity: item.contentQuantity?.toString() ?? "", contentUnit: item.contentUnit ?? "", minimumOrderQuantity: item.minimumOrderQuantity?.toString() ?? "", isDefaultSellingUnit: item.isDefaultSellingUnit }));
  const initialPrices = product.groupPrices.map((item) => ({ priceGroupId: item.priceGroupId, packageKey: item.packageLevelId ?? "", amount: item.amount.toString() }));
  return <div><h1 className="font-heading text-2xl font-bold text-ct-blue">Data Komersial: {product.name}</h1><p className="mt-2 text-sm text-foreground/70">Harga member, packaging, MOQ, dan nama alternatif. Legacy price fields tidak digunakan oleh public pricing.</p><div className="mt-6 rounded-2xl border border-ct-teal/10 bg-white p-4 sm:p-6"><CommercialDataForm action={saveCommercialData.bind(null, id)} groups={groups} initialPackages={initialPackages} initialPrices={initialPrices} initialAliases={product.aliases.map((item) => item.value)} /></div></div>;
}
