import { redirect } from "next/navigation";
import Image from "next/image";
import { auth, signIn } from "@/auth";
import { SITE_NAME } from "@/lib/constants";
import { GoogleIcon } from "@/components/icons/google-icon";
import { SubmitButton } from "@/components/ui/submit-button";
import { isQaAuthEnabled } from "@/lib/qa-auth";
import { prisma } from "@/lib/prisma";
import { qaSignIn } from "./qa-actions";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    const { user } = session;
    if (!user.whatsapp) redirect("/daftar");
    if (user.status === "APPROVED") redirect("/");
    if (user.status === "REJECTED") redirect("/akun/ditolak");
    redirect("/akun/menunggu-verifikasi");
  }

  const qaUsers = isQaAuthEnabled()
    ? await prisma.user.findMany({
        where: { id: { startsWith: "qa-" } },
        select: { id: true, name: true, status: true, role: true, priceGroup: { select: { name: true, active: true } } },
        orderBy: { id: "asc" },
      })
    : [];

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
        <SubmitButton
          className="flex w-full items-center justify-center gap-3 rounded-full border border-ct-teal/20 bg-white px-5 py-3 font-semibold text-ct-blue shadow-sm transition-colors hover:bg-ct-teal/5"
          pendingLabel="Mengarahkan ke Google..."
        >
          <GoogleIcon className="h-5 w-5" />
          Masuk dengan Google
        </SubmitButton>
      </form>
      {qaUsers.length > 0 ? (
        <section className="mt-8 w-full border-t border-[var(--border)] pt-6 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/50">QA browser session</p>
          <p className="mt-1 text-xs text-foreground/60">Hanya tersedia pada database QA terisolasi.</p>
          <div className="mt-3 grid gap-2">
            {qaUsers.map((user) => (
              <form action={qaSignIn} key={user.id}>
                <input type="hidden" name="userId" value={user.id} />
                <button type="submit" className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-left text-sm hover:border-ct-teal">
                  <span className="font-semibold">{user.name ?? user.id}</span>
                  <span className="ml-2 text-xs text-foreground/60">
                    {user.role} · {user.status} · {user.priceGroup?.name ?? "tanpa price group"}
                  </span>
                </button>
              </form>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
