import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { SiteContentForm } from "@/components/admin/site-content-form";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";

export default async function AdminContentPage() {
  await requireAdmin();

  const content = await prisma.siteContent.findUnique({ where: { id: "default" } });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ct-blue">Konten Halaman Utama</h1>
      <p className="mt-1 text-foreground/70">
        Ubah teks yang tampil di halaman utama tanpa perlu mengubah kode.
      </p>

      <div className="mt-6">
        <SiteContentForm defaultValues={content ?? DEFAULT_SITE_CONTENT} />
      </div>
    </div>
  );
}
