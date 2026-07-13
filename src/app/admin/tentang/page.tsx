import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { AboutContentForm } from "@/components/admin/about-content-form";
import { DEFAULT_ABOUT_CONTENT } from "@/lib/about-content";

export default async function AdminAboutPage() {
  await requireAdmin();

  const content = await prisma.aboutContent.findUnique({ where: { id: "default" } });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-ct-blue">Konten Tentang Kami</h1>
      <p className="mt-1 text-foreground/70">
        Ubah teks yang tampil di halaman Tentang Kami tanpa perlu mengubah kode.
      </p>

      <div className="mt-6">
        <AboutContentForm defaultValues={content ?? DEFAULT_ABOUT_CONTENT} />
      </div>
    </div>
  );
}
