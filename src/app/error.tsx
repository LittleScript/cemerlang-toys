"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-bold text-ct-blue">
        Ups, ada yang tidak beres
      </h1>
      <p className="mt-2 text-foreground/70">
        Terjadi kesalahan saat memuat halaman ini. Silakan coba lagi.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-ct-teal px-6 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-ct-teal-dark"
        >
          Coba Lagi
        </button>
        <Link
          href="/"
          className="rounded-full border border-ct-teal/20 px-6 py-2.5 font-semibold text-ct-blue transition-colors hover:bg-ct-teal/5"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
