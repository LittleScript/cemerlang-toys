import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { AboutContentForm } from "@/components/admin/about-content-form";
import { DEFAULT_ABOUT_CONTENT } from "@/lib/about-content";
import { PageHeader } from "@/components/admin/ui/page-header";

export default async function AdminAboutPage() {
  await requireAdmin();

  const content = await prisma.aboutContent.findUnique({ where: { id: "default" } });

  return (
    <div>
      <PageHeader
        title="Konten Tentang Kami"
        description="Ubah teks yang tampil di halaman Tentang Kami tanpa perlu mengubah kode."
      />

      <div className="mt-6">
        <AboutContentForm defaultValues={content ?? DEFAULT_ABOUT_CONTENT} />
      </div>
    </div>
  );
}
