"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import type { ProductFormState } from "@/app/admin/produk/actions";
import { AGE_RANGES } from "@/lib/constants";
import { SubmitButton } from "@/components/ui/submit-button";

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
    unit: string;
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
  const [state, formAction] = useActionState(action, initialState);
  const [categoryList, setCategoryList] = useState(categories);
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(null);
  const [images, setImages] = useState<ImageRow[]>(defaultValues?.images ?? []);
  const [variants, setVariants] = useState<VariantRow[]>(defaultValues?.variants ?? []);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryLoading, setNewCategoryLoading] = useState(false);
  const [newCategoryError, setNewCategoryError] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const categorySelectRef = useRef<HTMLSelectElement>(null);
  const ageRangeSelectRef = useRef<HTMLSelectElement>(null);
  const unitInputRef = useRef<HTMLInputElement>(null);

  async function handleAiSuggest() {
    const name = nameInputRef.current?.value.trim();
    if (!name) {
      setAiError("Isi nama produk terlebih dahulu.");
      return;
    }

    setAiError(null);
    setAiLoading(true);

    try {
      const priceValue = priceInputRef.current?.value;
      const price = priceValue ? Number(priceValue) : undefined;
      const res = await fetch("/api/admin/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, imageUrl: images[0]?.url, categories: categoryList, price }),
      });
      if (!res.ok) throw new Error("AI suggestion failed");
      const data = (await res.json()) as {
        description: string;
        categoryId: string;
        newCategory: { id: string; name: string } | null;
        ageRange: string;
        unit: string;
      };

      if (descriptionRef.current) descriptionRef.current.value = data.description;
      if (data.newCategory) {
        setCategoryList((list) => [...list, data.newCategory!]);
      }
      setPendingCategoryId(data.categoryId);
      if (ageRangeSelectRef.current && (AGE_RANGES as readonly string[]).includes(data.ageRange)) {
        ageRangeSelectRef.current.value = data.ageRange;
      }
      if (unitInputRef.current && data.unit) {
        unitInputRef.current.value = data.unit;
      }
    } catch {
      setAiError("Gagal mendapatkan saran AI.");
    }

    setAiLoading(false);
  }

  useEffect(() => {
    if (
      pendingCategoryId &&
      categorySelectRef.current &&
      categoryList.some((c) => c.id === pendingCategoryId)
    ) {
      categorySelectRef.current.value = pendingCategoryId;
      setPendingCategoryId(null);
    }
  }, [categoryList, pendingCategoryId]);

  async function handleCreateCategory() {
    const name = newCategoryName.trim();
    if (!name) return;

    setNewCategoryError(null);
    setNewCategoryLoading(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create category");
      const created = (await res.json()) as { id: string; name: string };

      setCategoryList((list) => [...list, created]);
      setPendingCategoryId(created.id);
      setNewCategoryName("");
      setShowNewCategory(false);
    } catch {
      setNewCategoryError("Gagal menambah kategori.");
    }

    setNewCategoryLoading(false);
  }

  async function handleImageFile(index: number, file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadError("File harus berupa gambar.");
      return;
    }

    setUploadError(null);
    setUploadingIndex(index);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = (await res.json()) as { url: string };

      setImages((rows) => rows.map((row, i) => (i === index ? { ...row, url } : row)));
    } catch {
      setUploadError("Gagal mengunggah foto.");
    }

    setUploadingIndex(null);
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="md:col-span-2 rounded-lg border border-ct-orange/25 bg-ct-orange/10 p-3 text-sm text-foreground/70">
          Harga dan Harga Diskon di bawah adalah field legacy dari data development. Field ini tidak dipakai untuk harga publik maupun harga member baru; gunakan halaman Data Komersial untuk Price Group.
        </div>

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            Nama Produk
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            ref={nameInputRef}
            defaultValue={defaultValues?.name}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 focus:border-[var(--border-focus)] focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="slug" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            Slug <span className="text-foreground/40">(opsional, otomatis dari nama)</span>
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={defaultValues?.slug}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 focus:border-[var(--border-focus)] focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            Kategori
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            ref={categorySelectRef}
            defaultValue={defaultValues?.categoryId ?? ""}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 focus:border-[var(--border-focus)] focus:outline-none"
          >
            <option value="" disabled>
              Pilih kategori
            </option>
            {categoryList.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {showNewCategory ? (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nama kategori baru"
                autoFocus
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-[var(--border-focus)] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={newCategoryLoading || !newCategoryName.trim()}
                className="rounded-lg bg-ct-teal px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {newCategoryLoading ? "..." : "Tambah"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewCategory(false);
                  setNewCategoryName("");
                  setNewCategoryError(null);
                }}
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--brand-muted)]"
              >
                Batal
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewCategory(true)}
              className="mt-1 text-xs font-semibold text-[var(--brand)] hover:underline"
            >
              + Tambah kategori baru
            </button>
          )}
          {newCategoryError ? (
            <p className="mt-1 text-xs font-medium text-[var(--danger)]">{newCategoryError}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ageRange" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            Rentang Usia
          </label>
          <select
            id="ageRange"
            name="ageRange"
            ref={ageRangeSelectRef}
            defaultValue={defaultValues?.ageRange ?? ""}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 focus:border-[var(--border-focus)] focus:outline-none"
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
          <label htmlFor="price" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            Harga (Rp)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            ref={priceInputRef}
            defaultValue={defaultValues?.price}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 focus:border-[var(--border-focus)] focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="discountPrice" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            Harga Diskon (Rp) <span className="text-foreground/40">(opsional)</span>
          </label>
          <input
            id="discountPrice"
            name="discountPrice"
            type="number"
            min={0}
            defaultValue={defaultValues?.discountPrice}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 focus:border-[var(--border-focus)] focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="unit" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            Satuan <span className="text-foreground/40">(opsional)</span>
          </label>
          <input
            id="unit"
            name="unit"
            type="text"
            ref={unitInputRef}
            placeholder="pcs, pack, lusin, set, dll"
            defaultValue={defaultValues?.unit}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 focus:border-[var(--border-focus)] focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="stockStatus" className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">
            Status Stok
          </label>
          <select
            id="stockStatus"
            name="stockStatus"
            defaultValue={defaultValues?.stockStatus ?? "IN_STOCK"}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 focus:border-[var(--border-focus)] focus:outline-none"
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
            className="h-4 w-4 rounded border-[var(--border)] text-[var(--brand)] focus:ring-[var(--brand)]"
          />
          <label htmlFor="published" className="text-sm font-medium text-[var(--text-secondary)]">
            Tampilkan di katalog (published)
          </label>
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)]">
            Deskripsi
          </label>
          <button
            type="button"
            onClick={handleAiSuggest}
            disabled={aiLoading}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--brand-muted)] disabled:opacity-60"
          >
            {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Isi dengan AI
          </button>
        </div>
        {aiError ? <p className="mb-1 text-sm font-medium text-[var(--danger)]">{aiError}</p> : null}
        <p className="mb-2 text-xs text-[var(--text-muted)]">
          AI akan mengisi deskripsi, kategori, rentang usia, dan satuan berdasarkan nama produk dan foto pertama. Anda tetap bisa mengubahnya secara manual jika kurang sesuai.
        </p>
        <textarea
          id="description"
          name="description"
          rows={4}
          ref={descriptionRef}
          defaultValue={defaultValues?.description}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 focus:border-[var(--border-focus)] focus:outline-none"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-heading font-semibold text-foreground">Foto Produk</h3>
          <button
            type="button"
            onClick={() => setImages((rows) => [...rows, { url: "", alt: "" }])}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1.5 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--brand-muted)]"
          >
            <Plus size={16} />
            Tambah Foto
          </button>
        </div>

        {uploadError ? (
          <p className="mb-2 text-sm font-medium text-[var(--danger)]">{uploadError}</p>
        ) : null}

        <div className="space-y-2">
          {images.map((image, index) => (
            <div key={index} className="flex gap-2 rounded-lg border border-[var(--border)] p-2">
              <label
                className="relative flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[var(--border)] bg-[var(--brand-muted)] text-center text-[11px] text-[var(--text-muted)] hover:border-ct-teal/50"
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
                    <Loader2 size={20} className="animate-spin text-[var(--brand)]" />
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
                  type="text"
                  placeholder="atau tempel link gambar https://..."
                  value={image.url}
                  onChange={(e) =>
                    setImages((rows) =>
                      rows.map((row, i) => (i === index ? { ...row, url: e.target.value } : row))
                    )
                  }
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm focus:border-[var(--border-focus)] focus:outline-none"
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
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm focus:border-[var(--border-focus)] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setImages((rows) => rows.filter((_, i) => i !== index))}
                className="self-start rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--danger-muted)] hover:text-[var(--danger)]"
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
            className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1.5 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--brand-muted)]"
          >
            <Plus size={16} />
            Tambah Varian
          </button>
        </div>

        <div className="space-y-2">
          {variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-2 gap-2 rounded-lg border border-[var(--border)] p-3 sm:grid-cols-5">
              <input
                type="text"
                placeholder="Nama varian"
                value={variant.name}
                onChange={(e) =>
                  setVariants((rows) =>
                    rows.map((row, i) => (i === index ? { ...row, name: e.target.value } : row))
                  )
                }
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-[var(--border-focus)] focus:outline-none sm:col-span-2"
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
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-[var(--border-focus)] focus:outline-none"
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
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-[var(--border-focus)] focus:outline-none"
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
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-[var(--border-focus)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setVariants((rows) => rows.filter((_, i) => i !== index))}
                  className="shrink-0 rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--danger-muted)] hover:text-[var(--danger)]"
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
        <p className="rounded-lg bg-[var(--danger-muted)] px-4 py-2 text-sm font-medium text-[var(--danger)]">
          {state.error}
        </p>
      ) : null}

      <SubmitButton
        pendingLabel="Menyimpan..."
        className="rounded-full px-6 py-2.5 shadow-sm"
      >
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
