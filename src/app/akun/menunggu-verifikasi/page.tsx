import { redirect } from "next/navigation";
import Link from "next/link";
import { Clock, MessageCircle } from "lucide-react";
import { auth } from "@/auth";
import { buildVerificationMessage, buildWhatsAppLink } from "@/lib/whatsapp";

export default async function MenungguVerifikasiPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;
  if (!user.whatsapp) redirect("/daftar");
  if (user.status === "APPROVED") redirect("/");
  if (user.status === "REJECTED") redirect("/akun/ditolak");

  const waLink = buildWhatsAppLink(
    buildVerificationMessage({ name: user.name, email: user.email, whatsapp: user.whatsapp })
  );

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ct-orange/10 text-ct-orange">
        <Clock size={32} />
      </span>
      <h1 className="mt-4 font-heading text-3xl font-bold text-ct-blue">Menunggu Verifikasi</h1>
      <p className="mt-2 text-foreground/70">
        Akunmu sudah terdaftar dan sedang menunggu verifikasi dari tim CT Rangers. Untuk
        mempercepat proses, kirim pesan verifikasi via WhatsApp menggunakan nomor{" "}
        <span className="font-semibold text-ct-blue">{user.whatsapp}</span> yang kamu daftarkan.
      </p>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-ct-teal px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-ct-teal-dark"
      >
        <MessageCircle size={18} />
        Verifikasi via WhatsApp
      </a>

      <Link href="/" className="mt-4 font-medium text-ct-blue/70 hover:text-ct-blue">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
