import Link from "next/link";
import { Lock } from "lucide-react";

export function ProductAccessCta({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-ct-teal/10 bg-white p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ct-teal/10 text-ct-teal">
        <Lock size={20} />
      </span>
      <p className="text-foreground/70">
        Harga, deskripsi, varian, dan pemesanan via WhatsApp hanya tersedia untuk member yang
        sudah diverifikasi.
      </p>
      <Link
        href="/login"
        className="rounded-full bg-ct-teal px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-ct-teal-dark"
      >
        {loggedIn ? "Lihat Status Akun" : "Daftar / Masuk untuk Lihat Harga"}
      </Link>
    </div>
  );
}
