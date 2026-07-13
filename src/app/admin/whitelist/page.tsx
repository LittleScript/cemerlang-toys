import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { WhitelistForm } from "@/components/admin/whitelist-form";
import { PageHeader } from "@/components/admin/ui/page-header";
import { DeleteButton } from "@/components/admin/ui/delete-button";
import { removeWhitelistNumber } from "./actions";

export default async function AdminWhitelistPage() {
  await requireAdmin();

  const entries = await prisma.whitelistWA.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="Whitelist WA"
        description="Member baru yang mendaftar dengan No. WhatsApp di daftar ini akan otomatis disetujui (approved)."
      />

      <div
        className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <WhitelistForm />
      </div>

      <div className="mt-6 space-y-2">
        {entries.length === 0 ? (
          <p
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--text-muted)]"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            Belum ada nomor di whitelist.
          </p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
            >
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{entry.phoneNumber}</p>
                {entry.note ? (
                  <p className="text-sm text-[var(--text-muted)]">{entry.note}</p>
                ) : null}
              </div>
              <DeleteButton
                itemLabel={`Whitelist ${entry.phoneNumber}`}
                onDelete={async () => {
                  "use server";
                  await removeWhitelistNumber(entry.id);
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
