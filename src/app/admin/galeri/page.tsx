import Image from "next/image";
import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { GalleryForm } from "@/components/admin/gallery-form";
import { SubmitButton } from "@/components/ui/submit-button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { deleteGalleryPhoto } from "./actions";

export default async function AdminGaleriPage() {
  await requireAdmin();

  const photos = await prisma.galleryPhoto.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Galeri Toko & Gudang"
        description="Foto-foto ini ditampilkan di halaman Tentang Kami untuk menunjukkan toko, gudang, dan proses packing asli."
      />

      <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
        style={{ borderRadius: "var(--radius-lg)" }}>
        <h2 className="font-heading font-semibold text-[var(--text-primary)]">Tambah Foto</h2>
        <div className="mt-3">
          <GalleryForm />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((photo) => (
          <div key={photo.id} className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="relative aspect-video w-full">
              <Image src={photo.url} alt={photo.caption ?? ""} fill className="object-cover" />
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <p className="truncate text-sm text-[var(--text-secondary)]">{photo.caption || "(tanpa keterangan)"}</p>
              <form
                action={async () => {
                  "use server";
                  await deleteGalleryPhoto(photo.id);
                }}
              >
                <SubmitButton
                  className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--danger-muted)] hover:text-[var(--danger)]"
                  aria-label="Hapus"
                >
                  <Trash2 size={16} />
                </SubmitButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
