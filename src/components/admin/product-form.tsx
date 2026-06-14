"use client";

import { useActionState, useState } from "react";
import { ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { uploadProductImage, type ProductFormState } from "@/app/admin/produk/actions";

const AGE_RANGES = ["0-2", "3-5", "6-8", "9-12", "12+"] as const;

interface ImageRow {
  url: string;
  alt: string;
}

interface VariantRow {
  name: string;
  sku: string;
  price: string;
  stock: string;
  image: string;
}

interface ProductFormProps {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  categories: { id: string; name: string }[];
  submitLabel: string;
  defaultValues?: {
    name: string;
    slug: string;
    description: string;
    price: string;
    discountPrice: string;
    stockStatus: string;
    ageRange: string;
    categoryId: string;
    published: boolean;
    images: ImageRow[];
    variants: VariantRow[];
  };
}

const initialState: ProductFormState = {};

export function ProductForm({ action, categories, submitLabel, defaultValues }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [images, setImages] = useState<ImageRow[]>(defaultValues?.images ?? []);
  const [variants, setVariants] = useState<VariantRow[]>(defaultValues?.variants ?? []);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleImageFile(index: number, file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadError("File harus berupa gambar.");
      return;
    }

    setUploadError(null);
    setUploadingIndex(index);

    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadProductImage(formData);

    if (result.url) {
      setImages((rows) =>
        rows.map((row, i) => (i === index ? { ...row, url: result.url! } : row))
      );
    } else {
      setUploadError(result.error ?? "Gagal mengunggah foto.");
    }

    setUploadingIndex(null);
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground/80">
            Nama Produk
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={defaultValues?.name}
            className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="slug" className="mb-1 block text-sm font-medium text-foreground/80">
            Slug <span className="text-foreground/40">(opsional, otomatis dari nama)</span>
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={defaultValues?.slug}
            className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-foreground/80">
            Kategori
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={defaultValues?.categoryId ?? ""}
            className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
          >
            <option value="" disabled>
              Pilih kategori
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ageRange" className="mb-1 block text-sm font-medium text-foreground/80">
            Rentang Usia
          </label>
          <select
            id="ageRange"
            name="ageRange"
            defaultValue={defaultValues?.ageRange ?? ""}
            className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
          >
            <option value="">(tidak ditentukan)</option>
            {AGE_RANGES.map((age) => (
              <option key={age} value={age}>
                {age} tahun
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="price" className="mb-1 block text-sm font-medium text-foreground/80">
            Harga (Rp)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            defaultValue={defaultValues?.price}
            className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="discountPrice" className="mb-1 block text-sm font-medium text-foreground/80">
            Harga Diskon (Rp) <span className="text-foreground/40">(opsional)</span>
          </label>
          <input
            id="discountPrice"
            name="discountPrice"
            type="number"
            min={0}
            defaultValue={defaultValues?.discountPrice}
            className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="stockStatus" className="mb-1 block text-sm font-medium text-foreground/80">
            Status Stok
          </label>
          <select
            id="stockStatus"
            name="stockStatus"
            defaultValue={defaultValues?.stockStatus ?? "IN_STOCK"}
            className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
          >
            <option value="IN_STOCK">Tersedia</option>
            <option value="OUT_OF_STOCK">Stok Habis</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-7">
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked={defaultValues?.published ?? true}
            className="h-4 w-4 rounded border-ct-teal/30 text-ct-teal focus:ring-ct-teal"
          />
          <label htmlFor="published" className="text-sm font-medium text-foreground/80">
            Tampilkan di katalog (published)
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-foreground/80">
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description}
          className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-heading font-semibold text-foreground">Foto Produk</h3>
          <button
            type="button"
            onClick={() => setImages((rows) => [...rows, { url: "", alt: "" }])}
            className="inline-flex items-center gap-1 rounded-full border border-ct-teal/20 px-3 py-1.5 text-sm font-semibold text-ct-blue hover:bg-ct-teal/10"
          >
            <Plus size={16} />
            Tambah Foto
          </button>
        </div>

        {uploadError ? (
          <p className="mb-2 text-sm font-medium text-ct-red">{uploadError}</p>
        ) : null}

        <div className="space-y-2">
          {images.map((image, index) => (
            <div key={index} className="flex gap-2 rounded-lg border border-ct-teal/10 p-2">
              <label
                className="relative flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-ct-teal/30 bg-ct-teal/5 text-center text-[11px] text-foreground/50 hover:border-ct-teal/50"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) void handleImageFile(index, file);
                }}
              >
                {image.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image.url} alt={image.alt || ""} className="h-full w-full object-cover" />
                ) : (
                  <>
                    <ImagePlus size={18} />
                    <span className="mt-1 px-1">Seret / klik</span>
                  </>
                )}
                {uploadingIndex === index ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <Loader2 size={20} className="animate-spin text-ct-teal" />
                  </span>
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleImageFile(index, file);
                    e.target.value = "";
                  }}
                />
              </label>

              <div className="flex flex-1 flex-col gap-2">
                <input
                  type="url"
                  placeholder="atau tempel link gambar https://..."
                  value={image.url}
                  onChange={(e) =>
                    setImages((rows) =>
                      rows.map((row, i) => (i === index ? { ...row, url: e.target.value } : row))
                    )
                  }
                  className="rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 text-sm focus:border-ct-teal focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Teks alternatif (opsional)"
                  value={image.alt}
                  onChange={(e) =>
                    setImages((rows) =>
                      rows.map((row, i) => (i === index ? { ...row, alt: e.target.value } : row))
                    )
                  }
                  className="rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 text-sm focus:border-ct-teal focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setImages((rows) => rows.filter((_, i) => i !== index))}
                className="self-start rounded-full p-2 text-foreground/50 hover:bg-ct-red/10 hover:text-ct-red"
                aria-label="Hapus foto"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <input type="hidden" name="imagesJson" value={JSON.stringify(images)} readOnly />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-heading font-semibold text-foreground">Varian</h3>
          <button
            type="button"
            onClick={() =>
              setVariants((rows) => [...rows, { name: "", sku: "", price: "", stock: "", image: "" }])
            }
            className="inline-flex items-center gap-1 rounded-full border border-ct-teal/20 px-3 py-1.5 text-sm font-semibold text-ct-blue hover:bg-ct-teal/10"
          >
            <Plus size={16} />
            Tambah Varian
          </button>
        </div>

        <div className="space-y-2">
          {variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-2 gap-2 rounded-lg border border-ct-teal/10 p-3 sm:grid-cols-5">
              <input
                type="text"
                placeholder="Nama varian"
                value={variant.name}
                onChange={(e) =>
                  setVariants((rows) =>
                    rows.map((row, i) => (i === index ? { ...row, name: e.target.value } : row))
                  )
                }
                className="rounded-lg border border-ct-teal/20 bg-white px-3 py-2 text-sm focus:border-ct-teal focus:outline-none sm:col-span-2"
              />
              <input
                type="text"
                placeholder="SKU (opsional)"
                value={variant.sku}
                onChange={(e) =>
                  setVariants((rows) =>
                    rows.map((row, i) => (i === index ? { ...row, sku: e.target.value } : row))
                  )
                }
                className="rounded-lg border border-ct-teal/20 bg-white px-3 py-2 text-sm focus:border-ct-teal focus:outline-none"
              />
              <input
                type="number"
                min={0}
                placeholder="Harga (opsional)"
                value={variant.price}
                onChange={(e) =>
                  setVariants((rows) =>
                    rows.map((row, i) => (i === index ? { ...row, price: e.target.value } : row))
                  )
                }
                className="rounded-lg border border-ct-teal/20 bg-white px-3 py-2 text-sm focus:border-ct-teal focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Stok"
                  value={variant.stock}
                  onChange={(e) =>
                    setVariants((rows) =>
                      rows.map((row, i) => (i === index ? { ...row, stock: e.target.value } : row))
                    )
                  }
                  className="w-full rounded-lg border border-ct-teal/20 bg-white px-3 py-2 text-sm focus:border-ct-teal focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setVariants((rows) => rows.filter((_, i) => i !== index))}
                  className="shrink-0 rounded-full p-2 text-foreground/50 hover:bg-ct-red/10 hover:text-ct-red"
                  aria-label="Hapus varian"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <input type="hidden" name="variantsJson" value={JSON.stringify(variants)} readOnly />
      </div>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ct-teal px-6 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-ct-teal-dark disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}
