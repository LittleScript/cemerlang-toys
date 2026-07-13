import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { SiteContentForm } from "@/components/admin/site-content-form";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";
import { PageHeader } from "@/components/admin/ui/page-header";

export default async function AdminContentPage() {
  await requireAdmin();

  const content = await prisma.siteContent.findUnique({ where: { id: "default" } });

  return (
    <div>
      <PageHeader
        title="Konten Halaman Utama"
        description="Ubah teks yang tampil di halaman utama tanpa perlu mengubah kode."
      />

      <div className="mt-6">
        <SiteContentForm defaultValues={content ?? DEFAULT_SITE_CONTENT} />
      </div>
    </div>
  );
}
