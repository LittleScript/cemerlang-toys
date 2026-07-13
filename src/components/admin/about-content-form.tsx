"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateAboutContent, type AboutContentFormState } from "@/app/admin/tentang/actions";
import type { AboutContentValues } from "@/lib/about-content";

const initialState: AboutContentFormState = {};

export function AboutContentForm({ defaultValues }: { defaultValues: AboutContentValues }) {
  const [state, formAction] = useActionState(updateAboutContent, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded-2xl border border-ct-teal/10 bg-white p-4">
        <h2 className="font-heading font-semibold text-ct-blue">Hero</h2>
        <div className="mt-3 space-y-3">
          <div>
            <label htmlFor="heroBadge" className="mb-1 block text-sm font-medium text-foreground/80">
              Badge kecil
            </label>
            <input
              id="heroBadge"
              name="heroBadge"
              type="text"
              required
              defaultValue={defaultValues.heroBadge}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-ct-teal/10 bg-white p-4">
        <h2 className="font-heading font-semibold text-ct-blue">Cerita Kami</h2>
        <div className="mt-3 space-y-3">
          <div>
            <label htmlFor="ceritaParagraph1" className="mb-1 block text-sm font-medium text-foreground/80">
              Paragraf 1
            </label>
            <textarea
              id="ceritaParagraph1"
              name="ceritaParagraph1"
              rows={3}
              required
              defaultValue={defaultValues.ceritaParagraph1}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="ceritaParagraph2" className="mb-1 block text-sm font-medium text-foreground/80">
              Paragraf 2
            </label>
            <textarea
              id="ceritaParagraph2"
              name="ceritaParagraph2"
              rows={3}
              required
              defaultValue={defaultValues.ceritaParagraph2}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="ceritaParagraph3" className="mb-1 block text-sm font-medium text-foreground/80">
              Paragraf 3
            </label>
            <textarea
              id="ceritaParagraph3"
              name="ceritaParagraph3"
              rows={3}
              required
              defaultValue={defaultValues.ceritaParagraph3}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-ct-teal/10 bg-white p-4">
        <h2 className="font-heading font-semibold text-ct-blue">Visi & Misi</h2>
        <div className="mt-3 space-y-3">
          <div>
            <label htmlFor="visiText" className="mb-1 block text-sm font-medium text-foreground/80">
              Visi
            </label>
            <textarea
              id="visiText"
              name="visiText"
              rows={3}
              required
              defaultValue={defaultValues.visiText}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="misi1" className="mb-1 block text-sm font-medium text-foreground/80">
              Misi 1
            </label>
            <textarea
              id="misi1"
              name="misi1"
              rows={2}
              required
              defaultValue={defaultValues.misi1}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="misi2" className="mb-1 block text-sm font-medium text-foreground/80">
              Misi 2
            </label>
            <textarea
              id="misi2"
              name="misi2"
              rows={2}
              required
              defaultValue={defaultValues.misi2}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="misi3" className="mb-1 block text-sm font-medium text-foreground/80">
              Misi 3
            </label>
            <textarea
              id="misi3"
              name="misi3"
              rows={2}
              required
              defaultValue={defaultValues.misi3}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="misi4" className="mb-1 block text-sm font-medium text-foreground/80">
              Misi 4
            </label>
            <textarea
              id="misi4"
              name="misi4"
              rows={2}
              required
              defaultValue={defaultValues.misi4}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-ct-teal/10 bg-white p-4">
        <h2 className="font-heading font-semibold text-ct-blue">Mengapa Cemerlang Toys Medan? (3 kartu)</h2>
        <div className="mt-3 space-y-4">
          <div className="space-y-2 rounded-lg border border-ct-teal/10 p-3">
            <div>
              <label htmlFor="valueProp1Title" className="mb-1 block text-sm font-medium text-foreground/80">
                Kartu 1 - Judul
              </label>
              <input
                id="valueProp1Title"
                name="valueProp1Title"
                type="text"
                required
                defaultValue={defaultValues.valueProp1Title}
                className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="valueProp1Desc" className="mb-1 block text-sm font-medium text-foreground/80">
                Kartu 1 - Deskripsi
              </label>
              <textarea
                id="valueProp1Desc"
                name="valueProp1Desc"
                rows={2}
                required
                defaultValue={defaultValues.valueProp1Desc}
                className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-ct-teal/10 p-3">
            <div>
              <label htmlFor="valueProp2Title" className="mb-1 block text-sm font-medium text-foreground/80">
                Kartu 2 - Judul
              </label>
              <input
                id="valueProp2Title"
                name="valueProp2Title"
                type="text"
                required
                defaultValue={defaultValues.valueProp2Title}
                className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="valueProp2Desc" className="mb-1 block text-sm font-medium text-foreground/80">
                Kartu 2 - Deskripsi
              </label>
              <textarea
                id="valueProp2Desc"
                name="valueProp2Desc"
                rows={2}
                required
                defaultValue={defaultValues.valueProp2Desc}
                className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-ct-teal/10 p-3">
            <div>
              <label htmlFor="valueProp3Title" className="mb-1 block text-sm font-medium text-foreground/80">
                Kartu 3 - Judul
              </label>
              <input
                id="valueProp3Title"
                name="valueProp3Title"
                type="text"
                required
                defaultValue={defaultValues.valueProp3Title}
                className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="valueProp3Desc" className="mb-1 block text-sm font-medium text-foreground/80">
                Kartu 3 - Deskripsi
              </label>
              <textarea
                id="valueProp3Desc"
                name="valueProp3Desc"
                rows={2}
                required
                defaultValue={defaultValues.valueProp3Desc}
                className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-ct-teal/10 bg-white p-4">
        <h2 className="font-heading font-semibold text-ct-blue">Statistik Kepercayaan (4 kotak)</h2>
        <div className="mt-3 space-y-4">
          {([1, 2, 3, 4] as const).map((n) => (
            <div key={n} className="grid gap-2 rounded-lg border border-ct-teal/10 p-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`stat${n}Value`}
                  className="mb-1 block text-sm font-medium text-foreground/80"
                >
                  Statistik {n} - Angka
                </label>
                <input
                  id={`stat${n}Value`}
                  name={`stat${n}Value`}
                  type="text"
                  required
                  defaultValue={defaultValues[`stat${n}Value` as keyof AboutContentValues]}
                  className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor={`stat${n}Label`}
                  className="mb-1 block text-sm font-medium text-foreground/80"
                >
                  Statistik {n} - Label
                </label>
                <input
                  id={`stat${n}Label`}
                  name={`stat${n}Label`}
                  type="text"
                  required
                  defaultValue={defaultValues[`stat${n}Label` as keyof AboutContentValues]}
                  className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-ct-teal/10 bg-white p-4">
        <h2 className="font-heading font-semibold text-ct-blue">Keunggulan Kami (5 poin)</h2>
        <div className="mt-3 space-y-3">
          {([1, 2, 3, 4, 5] as const).map((n) => (
            <div key={n}>
              <label
                htmlFor={`keunggulan${n}`}
                className="mb-1 block text-sm font-medium text-foreground/80"
              >
                Poin {n}
              </label>
              <input
                id={`keunggulan${n}`}
                name={`keunggulan${n}`}
                type="text"
                required
                defaultValue={defaultValues[`keunggulan${n}` as keyof AboutContentValues]}
                className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-ct-teal/10 bg-white p-4">
        <h2 className="font-heading font-semibold text-ct-blue">Cara Order (3 langkah)</h2>
        <div className="mt-3 space-y-3">
          {([1, 2, 3] as const).map((n) => (
            <div key={n}>
              <label
                htmlFor={`caraOrder${n}`}
                className="mb-1 block text-sm font-medium text-foreground/80"
              >
                Langkah {n}
              </label>
              <input
                id={`caraOrder${n}`}
                name={`caraOrder${n}`}
                type="text"
                required
                defaultValue={defaultValues[`caraOrder${n}` as keyof AboutContentValues]}
                className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-ct-teal/10 bg-white p-4">
        <h2 className="font-heading font-semibold text-ct-blue">FAQ (7 pertanyaan)</h2>
        <div className="mt-3 space-y-4">
          {([1, 2, 3, 4, 5, 6, 7] as const).map((n) => (
            <div key={n} className="space-y-2 rounded-lg border border-ct-teal/10 p-3">
              <div>
                <label
                  htmlFor={`faq${n}Question`}
                  className="mb-1 block text-sm font-medium text-foreground/80"
                >
                  Pertanyaan {n}
                </label>
                <input
                  id={`faq${n}Question`}
                  name={`faq${n}Question`}
                  type="text"
                  required
                  defaultValue={defaultValues[`faq${n}Question` as keyof AboutContentValues]}
                  className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor={`faq${n}Answer`}
                  className="mb-1 block text-sm font-medium text-foreground/80"
                >
                  Jawaban {n}
                </label>
                <textarea
                  id={`faq${n}Answer`}
                  name={`faq${n}Answer`}
                  rows={2}
                  required
                  defaultValue={defaultValues[`faq${n}Answer` as keyof AboutContentValues]}
                  className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-ct-teal/10 bg-white p-4">
        <h2 className="font-heading font-semibold text-ct-blue">Lokasi & Kontak</h2>
        <div className="mt-3 space-y-3">
          <div>
            <label htmlFor="contactTitle" className="mb-1 block text-sm font-medium text-foreground/80">
              Judul
            </label>
            <input
              id="contactTitle"
              name="contactTitle"
              type="text"
              required
              defaultValue={defaultValues.contactTitle}
              className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="contactSubtitle" className="mb-1 block text-sm font-medium text-foreground/80">
              Deskripsi
            </label>
            <textarea
              id="contactSubtitle"
              name="contactSubtitle"
              rows={2}
              required
              defaultValue={defaultValues.contactSubtitle}
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
