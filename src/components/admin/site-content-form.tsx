"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateSiteContent, type SiteContentFormState } from "@/app/admin/konten/actions";
import type { SiteContentValues } from "@/lib/site-content";

const initialState: SiteContentFormState = {};

export function SiteContentForm({ defaultValues }: { defaultValues: SiteContentValues }) {
  const [state, formAction] = useActionState(updateSiteContent, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded-2xl border border-ct-teal/10 bg-white p-4">
        <h2 className="font-heading font-semibold text-ct-blue">Hero (atas halaman)</h2>
        <div className="mt-3 space-y-3">
          <div>
            <label htmlFor="heroBadge" className="mb-1 block text-sm font-medium text-foreground/80">
              Badge kecil
            </label>
            <input
              id="heroBadge"
              name="heroBadge"
              type="text"
              defaultValue={defaultValues.heroBadge}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="heroTitle" className="mb-1 block text-sm font-medium text-foreground/80">
              Judul utama
            </label>
            <input
              id="heroTitle"
              name="heroTitle"
              type="text"
              required
              defaultValue={defaultValues.heroTitle}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="heroSubtitle" className="mb-1 block text-sm font-medium text-foreground/80">
              Deskripsi
            </label>
            <textarea
              id="heroSubtitle"
              name="heroSubtitle"
              rows={3}
              required
              defaultValue={defaultValues.heroSubtitle}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-ct-teal/10 bg-white p-4">
        <h2 className="font-heading font-semibold text-ct-blue">CTA (bawah halaman)</h2>
        <div className="mt-3 space-y-3">
          <div>
            <label htmlFor="ctaTitle" className="mb-1 block text-sm font-medium text-foreground/80">
              Judul
            </label>
            <input
              id="ctaTitle"
              name="ctaTitle"
              type="text"
              required
              defaultValue={defaultValues.ctaTitle}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="ctaSubtitle" className="mb-1 block text-sm font-medium text-foreground/80">
              Deskripsi
            </label>
            <textarea
              id="ctaSubtitle"
              name="ctaSubtitle"
              rows={3}
              required
              defaultValue={defaultValues.ctaSubtitle}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
        </div>
      </div>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="rounded-lg bg-ct-green/10 px-4 py-2 text-sm font-medium text-ct-green">
          Tersimpan.
        </p>
      ) : null}

      <SubmitButton
        className="rounded-full bg-ct-teal px-6 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-ct-teal-dark"
        pendingLabel="Menyimpan..."
      >
        Simpan Perubahan
      </SubmitButton>
    </form>
  );
}
