"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User as UserIcon, LogOut, Loader2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface AuthStatusProps {
  variant?: "desktop" | "mobile";
}

export function AuthStatus({ variant = "desktop" }: AuthStatusProps) {
  const { data: session, status } = useSession();
  const [signingOut, setSigningOut] = useState(false);
  const mobile = variant === "mobile";

  if (status === "loading") {
    return (
      <div
        className={cn(
          "h-9 w-28 animate-pulse rounded-full bg-ct-teal/10",
          mobile && "w-full"
        )}
      />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className={cn(
          "rounded-full bg-ct-teal px-5 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-ct-teal-dark",
          mobile && "block text-center"
        )}
      >
        Daftar / Masuk
      </Link>
    );
  }

  const { user } = session;
  const name = user.name ?? "Pengguna";

  let statusHref: string | null = null;
  let statusLabel: string | null = null;
  if (user.status === "PENDING") {
    statusHref = "/akun/menunggu-verifikasi";
    statusLabel = "Menunggu Verifikasi";
  } else if (user.status === "REJECTED") {
    statusHref = "/akun/ditolak";
    statusLabel = "Pendaftaran Ditolak";
  }

  return (
    <div className={cn("flex items-center gap-3", mobile && "flex-col items-stretch gap-2")}>
      <div className="flex items-center gap-2">
        {user.image ? (
          <Image
            src={user.image}
            alt={name}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ct-teal/10 text-ct-teal">
            <UserIcon size={18} />
          </span>
        )}
        <span className="font-medium text-foreground/80">{name}</span>
      </div>

      {user.role === "ADMIN" && (
        <Link
          href="/admin"
          className={cn(
            "rounded-full bg-ct-blue/10 px-3 py-1 text-sm font-semibold text-ct-blue",
            mobile && "text-center"
          )}
        >
          Admin Panel
        </Link>
      )}

      {statusLabel && statusHref && (
        <Link
          href={statusHref}
          className={cn(
            "rounded-full bg-ct-orange/10 px-3 py-1 text-sm font-semibold text-ct-orange",
            mobile && "text-center"
          )}
        >
          {statusLabel}
        </Link>
      )}

      <button
        type="button"
        disabled={signingOut}
        onClick={() => {
          setSigningOut(true);
          void signOut({ redirectTo: "/" });
        }}
        aria-busy={signingOut}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-ct-teal/20 px-4 py-2 text-sm font-semibold text-ct-blue transition-colors hover:bg-ct-teal/10",
          signingOut && "opacity-60 cursor-wait",
          mobile && "w-full justify-center"
        )}
      >
        {signingOut ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <LogOut size={16} />
            Keluar
          </>
        )}
      </button>
    </div>
  );
}
