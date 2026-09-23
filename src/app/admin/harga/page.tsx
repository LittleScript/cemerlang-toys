import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SubmitButton } from "@/components/ui/submit-button";
import { createPriceGroup, updatePriceGroup } from "./actions";

export default async function AdminHargaPage() {
  await requireAdmin();
  const groups = await prisma.priceGroup.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <PageHeader title="Price Groups" />
      <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
        Kelompok harga untuk member. Harga tidak dipublikasikan dan tidak pernah fallback ke group lain.
      </p>

      <form action={createPriceGroup} className="mt-6 flex max-w-lg gap-2">
        <input name="name" required placeholder="Nama group, mis. Reseller A" className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5" />
        <SubmitButton className="rounded-lg px-4 py-2.5">Buat Group</SubmitButton>
      </form>

      <div className="mt-8 space-y-3">
        {groups.length === 0 ? <p className="text-sm text-[var(--text-muted)]">Belum ada Price Group.</p> : null}
        {groups.map((group) => (
          <form key={group.id} action={updatePriceGroup.bind(null, group.id)} className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <input name="name" defaultValue={group.name} required className="min-w-56 flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2" />
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" name="active" defaultChecked={group.active} /> Aktif
            </label>
            <SubmitButton variant="secondary" className="rounded-lg px-4 py-2">Simpan</SubmitButton>
          </form>
        ))}
      </div>
    </div>
  );
}
