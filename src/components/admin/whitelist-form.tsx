"use client";

import { useActionState } from "react";
import { addWhitelistNumber, type WhitelistFormState } from "@/app/admin/whitelist/actions";

const initialState: WhitelistFormState = {};

export function WhitelistForm() {
  const [state, formAction, pending] = useActionState(addWhitelistNumber, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="phoneNumber" className="mb-1 block text-sm font-medium text-foreground/80">
          No. WhatsApp
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          required
          placeholder="08xx-xxxx-xxxx"
          className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="note" className="mb-1 block text-sm font-medium text-foreground/80">
          Catatan (opsional)
        </label>
        <input
          id="note"
          name="note"
          type="text"
          placeholder="Nama pelanggan"
          className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ct-teal px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-ct-teal-dark disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Tambah"}
      </button>
      {state.error ? (
        <p className="text-sm font-medium text-red-600 sm:basis-full">{state.error}</p>
      ) : null}
    </form>
  );
}
