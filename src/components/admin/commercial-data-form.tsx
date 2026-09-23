"use client";

import { useState } from "react";
import { SubmitButton } from "@/components/ui/submit-button";

type PackageRow = { key: string; parentKey: string; label: string; contentQuantity: string; contentUnit: string; minimumOrderQuantity: string; isDefaultSellingUnit: boolean };
type PriceRow = { priceGroupId: string; packageKey: string; amount: string };

export function CommercialDataForm({ action, groups, initialPackages, initialPrices, initialAliases }: {
  action: (formData: FormData) => Promise<void>;
  groups: { id: string; name: string }[];
  initialPackages: PackageRow[];
  initialPrices: PriceRow[];
  initialAliases: string[];
}) {
  const [packages, setPackages] = useState(initialPackages);
  const [prices, setPrices] = useState(initialPrices);
  const [aliases, setAliases] = useState(initialAliases.join("\n"));

  return (
    <form action={action} className="space-y-8">
      <section>
        <h2 className="font-heading text-lg font-semibold text-[var(--text-primary)]">Packaging & MOQ</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Masukkan tingkat kemasan sebagai baris biasa. Tidak perlu mengelola ID atau tree.</p>
        <div className="mt-4 space-y-3">
          {packages.map((row, index) => (
            <div key={row.key} className="grid gap-2 rounded-lg border border-[var(--border)] p-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
              <input aria-label="Label kemasan" value={row.label} onChange={(e) => setPackages((all) => all.map((item, i) => i === index ? { ...item, label: e.target.value } : item))} placeholder="Bal / Bungkus" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2" />
              <input aria-label="Jumlah isi" type="number" min="1" value={row.contentQuantity} onChange={(e) => setPackages((all) => all.map((item, i) => i === index ? { ...item, contentQuantity: e.target.value } : item))} placeholder="Isi, mis. 100" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2" />
              <input aria-label="Satuan isi" value={row.contentUnit} onChange={(e) => setPackages((all) => all.map((item, i) => i === index ? { ...item, contentUnit: e.target.value } : item))} placeholder="pcs / Bungkus" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2" />
              <input aria-label="Minimum order" type="number" min="1" value={row.minimumOrderQuantity} onChange={(e) => setPackages((all) => all.map((item, i) => i === index ? { ...item, minimumOrderQuantity: e.target.value } : item))} placeholder="MOQ optional" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={row.isDefaultSellingUnit} onChange={(e) => setPackages((all) => all.map((item, i) => i === index ? { ...item, isDefaultSellingUnit: e.target.checked } : item))} /> Default</label>
              {index > 0 ? <select aria-label="Kemasan induk" value={row.parentKey} onChange={(e) => setPackages((all) => all.map((item, i) => i === index ? { ...item, parentKey: e.target.value } : item))} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 md:col-span-2"><option value="">Tanpa induk</option>{packages.slice(0, index).map((parent) => <option key={parent.key} value={parent.key}>{parent.label || "Kemasan sebelumnya"}</option>)}</select> : null}
              <button type="button" onClick={() => setPackages((all) => all.filter((_, i) => i !== index))} className="text-sm text-[var(--danger)]">Hapus</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setPackages((all) => [...all, { key: crypto.randomUUID(), parentKey: "", label: "", contentQuantity: "", contentUnit: "", minimumOrderQuantity: "", isDefaultSellingUnit: all.length === 0 }])} className="mt-3 text-sm font-semibold text-[var(--brand)]">+ Tambah tingkat kemasan</button>
      </section>

      <section>
        <h2 className="font-heading text-lg font-semibold text-[var(--text-primary)]">Harga per Price Group</h2>
        <div className="mt-3 space-y-2">
          {groups.map((group) => {
            const existing = prices.find((item) => item.priceGroupId === group.id) ?? { priceGroupId: group.id, packageKey: packages.find((item) => item.isDefaultSellingUnit)?.key ?? "", amount: "" };
            return <div key={group.id} className="grid gap-2 md:grid-cols-[1fr_1fr_1fr]"><label className="py-2 font-medium">{group.name}</label><input type="number" min="0" value={existing.amount} onChange={(e) => setPrices((all) => [...all.filter((item) => item.priceGroupId !== group.id), { ...existing, amount: e.target.value }])} placeholder="Harga member" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2" /><select value={existing.packageKey} onChange={(e) => setPrices((all) => [...all.filter((item) => item.priceGroupId !== group.id), { ...existing, packageKey: e.target.value }])} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2"><option value="">Pilih basis</option>{packages.map((item) => <option key={item.key} value={item.key}>{item.label || "Kemasan"}</option>)}</select></div>;
          })}
        </div>
      </section>

      <section>
        <label htmlFor="aliases" className="font-heading text-lg font-semibold text-[var(--text-primary)]">Nama alternatif</label>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Satu nama per baris. Masukkan hanya istilah yang benar-benar digunakan buyer.</p>
        <textarea id="aliases" name="aliases" value={aliases} onChange={(e) => setAliases(e.target.value)} rows={4} className="mt-3 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2" />
      </section>

      <input type="hidden" name="packagesJson" value={JSON.stringify(packages.map(({ key, parentKey, label, contentQuantity, contentUnit, minimumOrderQuantity, isDefaultSellingUnit }) => ({ key, parentKey, label, contentQuantity: Number(contentQuantity) || undefined, contentUnit, minimumOrderQuantity: Number(minimumOrderQuantity) || undefined, isDefaultSellingUnit })))} readOnly />
      <input type="hidden" name="pricesJson" value={JSON.stringify(prices.map(({ priceGroupId, packageKey, amount }) => ({ priceGroupId, packageKey, amount: Number(amount) || undefined })))} readOnly />
      <SubmitButton className="rounded-lg px-5 py-2.5">Simpan Data Komersial</SubmitButton>
    </form>
  );
}
