import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { GalleryForm } from "@/components/admin/gallery-form";
import { PageHeader } from "@/components/admin/ui/page-header";
import { DeleteButton } from "@/components/admin/ui/delete-button";
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
              <DeleteButton
                itemLabel={`Foto "${photo.caption || "tanpa keterangan"}"`}
                size="sm"
                onDelete={async () => {
                  "use server";
                  await deleteGalleryPhoto(photo.id);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
