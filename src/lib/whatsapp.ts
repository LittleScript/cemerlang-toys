import { STORE_WHATSAPP } from "./constants";
import { formatRupiah } from "./utils";

export function buildCartOrderMessage({
  customerName,
  items,
  total,
  showPrices,
}: {
  customerName: string;
  items: { name: string; variantName?: string; price: number; quantity: number }[];
  total: number;
  showPrices: boolean;
}) {
  const lines = [`Halo CT Rangers, saya ${customerName} ingin pesan:`, ""];

  items.forEach((item, index) => {
    const label = item.variantName ? `${item.name} (${item.variantName})` : item.name;
    lines.push(`${index + 1}. ${label}`);
    if (showPrices) {
      lines.push(`   ${item.quantity} x ${formatRupiah(item.price)} = ${formatRupiah(item.price * item.quantity)}`);
    } else {
      lines.push(`   Jumlah: ${item.quantity}`);
    }
  });

  lines.push("");
  if (showPrices) {
    lines.push(`Total: ${formatRupiah(total)}`);
  } else {
    lines.push("Mohon info harga & totalnya ya. Terima kasih!");
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
    "Halo CT Rangers, saya ingin verifikasi akun Cemerlang Toys.",
    `- Nama: ${name ?? "-"}`,
    `- Email: ${email ?? "-"}`,
    `- No. WA: ${whatsapp}`,
  ].join("\n");
}
