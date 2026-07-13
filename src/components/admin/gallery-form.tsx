"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { SubmitButton } from "@/components/ui/submit-button";
import { createGalleryPhoto, type GalleryFormState } from "@/app/admin/galeri/actions";

const initialState: GalleryFormState = {};

export function GalleryForm() {
  const [state, formAction] = useActionState(createGalleryPhoto, initialState);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadError("File harus berupa gambar.");
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = (await res.json()) as { url: string };
      setUrl(data.url);
    } catch {
      setUploadError("Gagal mengunggah foto.");
    }

    setUploading(false);
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="url" value={url} />

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground/80">Foto</label>
        <label className="flex aspect-video w-full max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-ct-teal/30 bg-ct-cream/50">
          {uploading ? (
            <Loader2 className="animate-spin text-ct-teal" size={24} />
          ) : url ? (
            <div className="relative h-full w-full">
              <Image src={url} alt="" fill className="object-cover" />
            </div>
          ) : (
            <span className="flex flex-col items-center gap-1 text-foreground/50">
              <ImagePlus size={24} />
              <span className="text-sm">Pilih foto</span>
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </label>
      </div>

      <div>
        <label htmlFor="caption" className="mb-1 block text-sm font-medium text-foreground/80">
          Keterangan <span className="text-foreground/40">(opsional)</span>
        </label>
        <input
          id="caption"
          name="caption"
          type="text"
          placeholder="Contoh: Depan Toko, Area Stok, Packing Pesanan"
          className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="order" className="mb-1 block text-sm font-medium text-foreground/80">
          Urutan
        </label>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={0}
          className="w-full max-w-[8rem] rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
        />
      </div>

      {uploadError ? (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">{uploadError}</p>
      ) : null}
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">{state.error}</p>
      ) : null}

      <SubmitButton
        disabled={!url || uploading}
        className="rounded-full bg-ct-teal px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-ct-teal-dark disabled:opacity-60"
        pendingLabel="Menyimpan..."
      >
        Tambah Foto
      </SubmitButton>
    </form>
  );
}
