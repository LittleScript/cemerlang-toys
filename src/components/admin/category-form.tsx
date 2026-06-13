"use client";

import { useActionState } from "react";
import type { CategoryFormState } from "@/app/admin/kategori/actions";
import type { CategoryIconName } from "@/components/category-icon";

const ICON_OPTIONS: CategoryIconName[] = [
  "Car",
  "Bot",
  "Heart",
  "Puzzle",
  "ChefHat",
  "Volleyball",
  "Swords",
  "Baby",
  "Dice5",
  "PartyPopper",
  "Sparkles",
  "Boxes",
];

const initialState: CategoryFormState = {};

interface CategoryFormProps {
  action: (prevState: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  defaultValues?: {
    name: string;
    slug: string;
    icon: string | null;
    order: number;
  };
  submitLabel: string;
}

export function CategoryForm({ action, defaultValues, submitLabel }: CategoryFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground/80">
          Nama Kategori
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name}
          placeholder="Mainan Mobil-mobilan & Kendaraan"
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
          placeholder="mobil-mobilan"
          className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="icon" className="mb-1 block text-sm font-medium text-foreground/80">
            Ikon
          </label>
          <select
            id="icon"
            name="icon"
            defaultValue={defaultValues?.icon ?? ""}
            className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
          >
            <option value="">(default)</option>
            {ICON_OPTIONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="order" className="mb-1 block text-sm font-medium text-foreground/80">
            Urutan
          </label>
          <input
            id="order"
            name="order"
            type="number"
            defaultValue={defaultValues?.order ?? 0}
            className="w-full rounded-lg border border-ct-teal/20 bg-white px-4 py-2.5 focus:border-ct-teal focus:outline-none"
          />
        </div>
      </div>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ct-teal px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-ct-teal-dark disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}
