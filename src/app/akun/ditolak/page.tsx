import { redirect } from "next/navigation";
import Link from "next/link";
import { CircleX, MessageCircle } from "lucide-react";
import { auth } from "@/auth";
import { buildVerificationMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export default async function DitolakPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;
  if (!user.whatsapp) redirect("/daftar");
  if (user.status === "APPROVED") redirect("/");
  if (user.status === "PENDING") redirect("/akun/menunggu-verifikasi");

  const waLink = buildWhatsAppLink(
    buildVerificationMessage({ name: user.name, email: user.email, whatsapp: user.whatsapp })
  );

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
        <CircleX size={32} />
      </span>
      <h1 className="mt-4 font-heading text-3xl font-bold text-ct-blue">Tidak Dapat Diverifikasi</h1>
      <p className="mt-2 text-foreground/70">
        Maaf, pendaftaran akunmu belum dapat diverifikasi oleh tim CT Rangers. Jika kamu merasa
        ini keliru, silakan hubungi kami via WhatsApp untuk mengajukan ulang.
      </p>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-ct-teal px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-ct-teal-dark"
      >
        <MessageCircle size={18} />
        Hubungi CT Rangers via WhatsApp
      </a>

      <Link href="/" className="mt-4 font-medium text-ct-blue/70 hover:text-ct-blue">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
