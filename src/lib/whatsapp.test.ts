import { describe, it, expect } from "vitest";
import { buildCartOrderMessage, buildWhatsAppLink, buildVerificationMessage } from "./whatsapp";
import { STORE_WHATSAPP } from "./constants";

describe("buildCartOrderMessage", () => {
  const items = [
    { name: "Mobil Balap", price: 25000, unit: "pcs", quantity: 2, variantName: undefined, priceVisible: true },
    { name: "Boneka Beruang", price: 48000, unit: "pcs", quantity: 1, variantName: "Coklat", priceVisible: true },
  ];

  it("generates order message with prices for members", () => {
    const message = buildCartOrderMessage({
      customerName: "Budi",
      items,
      total: 98000,
      showPrices: true,
    });

    expect(message).toContain("Halo CT Rangers, saya Budi ingin pesan:");
    expect(message).toContain("1. Mobil Balap");
    expect(message).toContain("2 x Rp 25.000/pcs = Rp 50.000");
    expect(message).toContain("2. Boneka Beruang (Coklat)");
    expect(message).toContain("1 x Rp 48.000/pcs = Rp 48.000");
    expect(message).toContain("Total: Rp 98.000");
  });

  it("generates order message without prices for non-members", () => {
    const message = buildCartOrderMessage({
      customerName: "Budi",
      items,
      total: 98000,
      showPrices: false,
    });

    expect(message).toContain("Halo CT Rangers, saya Budi ingin pesan:");
    expect(message).toContain("Jumlah: 2");
    expect(message).toContain("Jumlah: 1");
    expect(message).toContain("Harga dan ketersediaan akan dikonfirmasi oleh tim sales.");
    expect(message).not.toContain("Rp");
  });

  it("handles items with unit", () => {
    const message = buildCartOrderMessage({
      customerName: "Ani",
      items: [{ name: "Test", price: 10000, unit: "pack", quantity: 3, variantName: undefined, priceVisible: true }],
      total: 30000,
      showPrices: true,
    });
    expect(message).toContain("3 x Rp 10.000/pack = Rp 30.000");
  });

  it("does not include a hidden item's price when another item is priced", () => {
    const message = buildCartOrderMessage({
      customerName: "Budi",
      items: [
        { name: "Visible", price: 10000, quantity: 1, priceVisible: true },
        { name: "Hidden", price: 999999, quantity: 1, priceVisible: false },
      ],
      total: 10000,
      showPrices: true,
    });

    expect(message).toContain("1 x Rp 10.000");
    expect(message).toContain("Jumlah: 1");
    expect(message).not.toContain("Rp 999.999");
  });
});

describe("buildWhatsAppLink", () => {
  it("encodes the message for WhatsApp URL", () => {
    const link = buildWhatsAppLink("Halo CT Rangers");
    expect(link).toContain(`https://wa.me/${STORE_WHATSAPP}`);
    expect(link).toContain("?text=");
    expect(link).toContain("Halo%20CT%20Rangers");
  });
});

describe("buildVerificationMessage", () => {
  it("generates verification message", () => {
    const message = buildVerificationMessage({
      name: "Budi",
      email: "budi@example.com",
      whatsapp: "628123456789",
    });

    expect(message).toContain("verifikasi akun Cemerlang Toys Medan");
    expect(message).toContain("Budi");
    expect(message).toContain("budi@example.com");
    expect(message).toContain("628123456789");
  });
});
