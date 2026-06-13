import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RegistrationForm } from "@/components/daftar/registration-form";

export default async function DaftarPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;

  if (user.whatsapp) {
    if (user.status === "APPROVED") redirect("/");
    if (user.status === "REJECTED") redirect("/akun/ditolak");
    redirect("/akun/menunggu-verifikasi");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-ct-blue">Lengkapi Pendaftaran</h1>
      <p className="mt-2 text-foreground/70">
        Sedikit info lagi sebelum kamu bisa melihat harga & melakukan pemesanan.
      </p>

      <RegistrationForm name={user.name} email={user.email} image={user.image} />
    </div>
  );
}
