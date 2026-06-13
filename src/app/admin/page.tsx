import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, whitelistCount, pendingCount, approvedCount, rejectedCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.whitelistWA.count(),
      prisma.user.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { status: "APPROVED" } }),
      prisma.user.count({ where: { status: "REJECTED" } }),
    ]);

  const stats = [
    { label: "Produk", value: productCount, href: "/admin/produk" },
    { label: "Kategori", value: categoryCount, href: "/admin/kategori" },
    { label: "Whitelist WA", value: whitelistCount, href: "/admin/whitelist" },
    { label: "Member Pending", value: pendingCount, href: "/admin/member?status=PENDING" },
    { label: "Member Approved", value: approvedCount, href: "/admin/member?status=APPROVED" },
    { label: "Member Rejected", value: rejectedCount, href: "/admin/member?status=REJECTED" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ct-blue">Dashboard</h1>
      <p className="mt-1 text-foreground/70">Ringkasan data Cemerlang Toys.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-ct-teal/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm text-foreground/60">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-ct-blue">{stat.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
