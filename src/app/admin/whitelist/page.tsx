import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { WhitelistForm } from "@/components/admin/whitelist-form";
import { removeWhitelistNumber } from "./actions";

export default async function AdminWhitelistPage() {
  await requireAdmin();

  const entries = await prisma.whitelistWA.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ct-blue">Whitelist WA</h1>
      <p className="mt-1 text-foreground/70">
        Member baru yang mendaftar dengan No. WhatsApp di daftar ini akan otomatis disetujui
        (approved).
      </p>

      <div className="mt-6 rounded-2xl border border-ct-teal/10 bg-white p-4">
        <WhitelistForm />
      </div>

      <div className="mt-6 space-y-2">
        {entries.length === 0 ? (
          <p className="rounded-2xl border border-ct-teal/10 bg-white p-6 text-center text-foreground/60">
            Belum ada nomor di whitelist.
          </p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl border border-ct-teal/10 bg-white px-4 py-3"
            >
              <div>
                <p className="font-semibold text-ct-blue">{entry.phoneNumber}</p>
                {entry.note ? <p className="text-sm text-foreground/60">{entry.note}</p> : null}
              </div>
              <form
                action={async () => {
                  "use server";
                  await removeWhitelistNumber(entry.id);
                }}
              >
                <button
                  type="submit"
                  className="rounded-full p-2 text-foreground/50 hover:bg-ct-red/10 hover:text-ct-red"
                  aria-label="Hapus"
                >
                  <Trash2 size={18} />
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
