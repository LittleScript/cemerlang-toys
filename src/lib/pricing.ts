import { prisma } from "@/lib/prisma";

export type PriceVisibilityState =
  | "ANONYMOUS"
  | "AUTHENTICATED_NOT_APPLIED"
  | "PENDING"
  | "REJECTED"
  | "APPROVED_WITHOUT_PRICE_GROUP"
  | "APPROVED_WITH_PRICE_GROUP";

export type ResolvedMemberPrice = {
  amount: number;
  packageLevelId: string | null;
  priceGroupId: string;
} | null;

export function priceVisibilityState(input: {
  authenticated: boolean;
  status?: string | null;
  hasPriceGroup?: boolean;
}): PriceVisibilityState {
  if (!input.authenticated) return "ANONYMOUS";
  if (!input.status || input.status === "USER") return "AUTHENTICATED_NOT_APPLIED";
  if (input.status === "PENDING") return "PENDING";
  if (input.status === "REJECTED") return "REJECTED";
  if (input.status === "APPROVED" && !input.hasPriceGroup) {
    return "APPROVED_WITHOUT_PRICE_GROUP";
  }
  return "APPROVED_WITH_PRICE_GROUP";
}

/**
 * Resolve only the authenticated member's active group price. Legacy Product
 * price fields are deliberately not selected or used here.
 */
export async function resolveMemberPrice({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}): Promise<ResolvedMemberPrice> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true, priceGroupId: true, priceGroup: { select: { active: true } } },
  });

  if (
    !user ||
    user.status !== "APPROVED" ||
    !user.priceGroupId ||
    !user.priceGroup?.active
  ) {
    return null;
  }

  const [prices, packageLevels] = await Promise.all([
    prisma.productGroupPrice.findMany({
      where: { productId, priceGroupId: user.priceGroupId, active: true },
      select: { amount: true, packageLevelId: true },
    }),
    prisma.productPackageLevel.findMany({
      where: { productId },
      select: { id: true, isDefaultSellingUnit: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const defaultPackage = packageLevels.find((level) => level.isDefaultSellingUnit);
  const price = defaultPackage
    ? prices.find((candidate) => candidate.packageLevelId === defaultPackage.id)
    : prices.length === 1
      ? prices[0]
      : null;

  if (!price) return null;
  return { amount: price.amount, packageLevelId: price.packageLevelId, priceGroupId: user.priceGroupId };
}
