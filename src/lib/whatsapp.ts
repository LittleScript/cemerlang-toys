import { STORE_WHATSAPP } from "./constants";
import { formatRupiah } from "./utils";

export function buildCartOrderMessage({
  customerName,
  items,
  total,
  showPrices,
}: {
  customerName: string;
  items: {
    name: string;
    variantName?: string;
    price: number;
    unit?: string;
    quantity: number;
    priceVisible?: boolean;
    priceBasis?: string;
    availability?: string;
    packageSummary?: string;
  }[];
  total: number;
  showPrices: boolean;
}) {
  const lines = [`Halo CT Rangers, saya ${customerName} ingin pesan:`, ""];

  items.forEach((item, index) => {
    const label = item.variantName ? `${item.name} (${item.variantName})` : item.name;
    lines.push(`${index + 1}. ${label}`);
    if (item.packageSummary) lines.push(`   Kemasan: ${item.packageSummary}`);
    if (item.availability) lines.push(`   Status: ${item.availability}`);
    if (showPrices && item.priceVisible) {
      const unitLabel = item.unit ? `/${item.unit}` : "";
      lines.push(
        `   ${item.quantity} x ${formatRupiah(item.price)}${unitLabel} = ${formatRupiah(item.price * item.quantity)}`
      );
    } else {
      lines.push(`   Jumlah: ${item.quantity}`);
    }
  });

  lines.push("");
  if (showPrices) {
    lines.push(`Total: ${formatRupiah(total)}`);
  } else {
  lines.push("Harga dan ketersediaan akan dikonfirmasi oleh tim sales. Terima kasih!");
  }

  return lines.join("\n");
}

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function buildVerificationMessage({
  name,
  email,
  whatsapp,
}: {
  name?: string | null;
  email?: string | null;
  whatsapp: string;
}) {
  return [
    "Halo CT Rangers, saya ingin verifikasi akun Cemerlang Toys Medan.",
    `- Nama: ${name ?? "-"}`,
    `- Email: ${email ?? "-"}`,
    `- No. WA: ${whatsapp}`,
  ].join("\n");
}
