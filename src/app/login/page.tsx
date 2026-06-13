import { redirect } from "next/navigation";
import Image from "next/image";
import { auth, signIn } from "@/auth";
import { SITE_NAME } from "@/lib/constants";
import { GoogleIcon } from "@/components/icons/google-icon";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    const { user } = session;
    if (!user.whatsapp) redirect("/daftar");
    if (user.status === "APPROVED") redirect("/");
    if (user.status === "REJECTED") redirect("/akun/ditolak");
    redirect("/akun/menunggu-verifikasi");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <Image
        src="/logo-cemerlang-toys.png"
        alt={SITE_NAME}
        width={72}
        height={72}
        className="h-18 w-18 object-contain"
      />
      <h1 className="mt-4 font-heading text-3xl font-bold text-ct-blue">Masuk / Daftar</h1>
      <p className="mt-2 text-foreground/70">
        Masuk dengan akun Google untuk melihat harga produk dan melakukan pemesanan.
      </p>

      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/daftar" });
        }}
        className="mt-8 w-full"
      >
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-full border border-ct-teal/20 bg-white px-5 py-3 font-semibold text-ct-blue shadow-sm transition-colors hover:bg-ct-teal/5"
        >
          <GoogleIcon className="h-5 w-5" />
          Masuk dengan Google
        </button>
      </form>
    </div>
  );
}
