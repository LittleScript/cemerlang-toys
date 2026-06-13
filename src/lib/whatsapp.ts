import { STORE_WHATSAPP } from "./constants";
import { formatRupiah } from "./utils";

export function buildOrderMessage({
  customerName,
  productName,
  variantName,
  price,
  productUrl,
}: {
  customerName: string;
  productName: string;
  variantName?: string;
  price: number;
  productUrl: string;
}) {
  const lines = [
    `Halo CT Rangers, saya ${customerName} ingin pesan:`,
    `- Produk: ${productName}`,
  ];

  if (variantName) {
    lines.push(`- Varian: ${variantName}`);
  }

  lines.push(`- Harga: ${formatRupiah(price)}`);
  lines.push(`- Link produk: ${productUrl}`);

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
