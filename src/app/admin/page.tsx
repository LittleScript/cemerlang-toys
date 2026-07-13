import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/ui/stat-card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Package, Tags, ShieldCheck, Users } from "lucide-react";

const colorMap = ["default", "success", "warning", "danger"] as const;

export default async function AdminDashboardPage() {
  const [products, categories, whitelist, pending] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.whitelistWA.count(),
    prisma.user.count({ where: { status: "PENDING" } }),
  ]);

  const stats = [
    { label: "Produk", value: products, href: "/admin/produk", icon: Package },
    { label: "Kategori", value: categories, href: "/admin/kategori", icon: Tags },
    { label: "Whitelist WA", value: whitelist, href: "/admin/whitelist", icon: ShieldCheck },
    { label: "Member Pending", value: pending, href: "/admin/member?status=PENDING", icon: Users },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Ringkasan data Cemerlang Toys Medan."
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            href={s.href}
            icon={s.icon}
            variant={colorMap[i]}
          />
        ))}
      </div>
    </div>
  );
}
