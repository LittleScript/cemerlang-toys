"use client";

import Image from "next/image";
import { useActionState } from "react";
import { User as UserIcon } from "lucide-react";
import { submitRegistration, type RegistrationState } from "@/app/daftar/actions";

interface RegistrationFormProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const initialState: RegistrationState = {};

export function RegistrationForm({ name, email, image }: RegistrationFormProps) {
  const [state, formAction, pending] = useActionState(submitRegistration, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div className="flex items-center gap-3 rounded-xl border border-ct-teal/10 bg-white p-4">
        {image ? (
          <Image
            src={image}
            alt={name ?? "Pengguna"}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ct-teal/10 text-ct-teal">
            <UserIcon size={24} />
          </span>
        )}
        <div>
          <p className="font-semibold text-ct-blue">{name}</p>
          <p className="text-sm text-foreground/60">{email}</p>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="mb-1 block font-medium text-foreground/80">
          Nama Lengkap <span className="text-ct-orange">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={name ?? ""}
          placeholder="Nama lengkap kamu"
          className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className="mb-1 block font-medium text-foreground/80">
          No. WhatsApp <span className="text-ct-orange">*</span>
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          required
          placeholder="08xx-xxxx-xxxx"
          className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="address" className="mb-1 block font-medium text-foreground/80">
          Alamat Lengkap <span className="text-ct-orange">*</span>
        </label>
        <textarea
          id="address"
          name="address"
          required
          rows={3}
          placeholder="Jl. ..., Kecamatan, Kota, Provinsi"
          className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="storeName" className="mb-1 block font-medium text-foreground/80">
          Nama Toko/Usaha <span className="text-foreground/40">(opsional)</span>
        </label>
        <input
          id="storeName"
          name="storeName"
          type="text"
          placeholder="Toko ABC"
          className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ct-teal px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-ct-teal-dark disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Simpan & Lanjutkan"}
      </button>
    </form>
  );
}
