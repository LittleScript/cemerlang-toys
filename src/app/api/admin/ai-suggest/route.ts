import { readFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/auth";
import { requireAdminApi } from "@/lib/admin";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { AGE_RANGES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatRupiah, slugify } from "@/lib/utils";
import { CATEGORY_ICON_NAMES, type CategoryIconName } from "@/components/category-icon";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

interface SuggestRequest {
  name?: string;
  imageUrl?: string;
  categories?: { id: string; name: string }[];
  price?: number;
}

const UNIT_OPTIONS = ["pcs", "pack", "lusin", "set", "renteng", "box", "pasang", "lembar"] as const;

// Try to detect a per-pack quantity from the product name, e.g. "1 Papan Isi 20pcs" -> 20.
function extractPackQuantity(name: string): number | null {
  const unitMatch = name.match(/(\d+)\s*(pcs|pc|biji|buah|lusin|lsn|set|pak|pack)\b/i);
  if (unitMatch) return parseInt(unitMatch[1], 10);

  const isiMatch = name.match(/isi\s*(\d+)/i);
  if (isiMatch) return parseInt(isiMatch[1], 10);

  return null;
}

// Suggest an eceran (retail) price with >100% margin from modal, rounded up to the nearest Rp1.000.
function suggestRetailPrice(modalPerPcs: number): number {
  return Math.max(1000, Math.ceil((modalPerPcs * 2) / 1000) * 1000);
}

export async function POST(request: Request): Promise<NextResponse> {
  const authError = await requireAdminApi();
  if (authError) return authError;

  // Rate limit (C-5): protect against OpenAI credit drain
  const session = await auth();
  const rlKey = `ai:${session?.user?.id ?? "anonymous"}`;
  const rl = checkRateLimit(rlKey, RATE_LIMITS.ai.maxReqs, RATE_LIMITS.ai.windowMs);
  if (rl.limited) {
    return NextResponse.json(
      { error: `Terlalu banyak permintaan. Coba lagi dalam ${rl.retryAfter} detik.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY belum diatur di server." }, { status: 500 });
  }

  const { name, imageUrl, categories, price } = (await request.json()) as SuggestRequest;
  const trimmedName = name?.trim();
  if (!trimmedName) {
    return NextResponse.json({ error: "Nama produk wajib diisi." }, { status: 400 });
  }

  let retailPriceHint = "";
  if (price && price > 0) {
    const packQuantity = extractPackQuantity(trimmedName);
    const modalPerPcs = packQuantity && packQuantity > 0 ? price / packQuantity : price;
    const suggestedRetail = suggestRetailPrice(modalPerPcs);

    retailPriceHint = packQuantity
      ? `Harga modal: ${formatRupiah(price)} untuk isi ${packQuantity} pcs, atau sekitar ${formatRupiah(Math.round(modalPerPcs))}/pcs.`
      : `Harga modal sekitar ${formatRupiah(modalPerPcs)}/pcs.`;
    retailPriceHint += ` Sarankan reseller menjual eceran sekitar ${formatRupiah(suggestedRetail)}/pcs (margin lebih dari 100% dari modal per pcs, sudah dibulatkan ke atas).`;
  }

  let imageDataUrl: string | null = null;
  if (imageUrl?.startsWith("/uploads/")) {
    const filename = path.basename(imageUrl);
    const mime = MIME_TYPES[path.extname(filename).toLowerCase()];
    if (mime) {
      try {
        const buffer = await readFile(path.join(UPLOAD_DIR, filename));
        imageDataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
      } catch {
        imageDataUrl = null;
      }
    }
  } else if (imageUrl && /^https?:\/\//.test(imageUrl)) {
    imageDataUrl = imageUrl;
  }

  const categoryList = (categories ?? []).map((c) => `- ${c.id}: ${c.name}`).join("\n");

  const promptLines = [
    `Nama produk: ${trimmedName}`,
    categoryList
      ? `Daftar kategori yang tersedia (pilih ID yang paling sesuai):\n${categoryList}`
      : "",
    `Rentang usia yang tersedia: ${AGE_RANGES.join(", ")} (dalam tahun, contoh "3+" artinya cocok untuk usia 3 tahun ke atas). Pilih usia minimum yang paling sesuai.`,
    [
      "Tuliskan deskripsi produk dalam Bahasa Indonesia (3-5 kalimat) untuk toko grosir mainan anak yang menyasar reseller.",
      "Selain menjelaskan produknya, deskripsi harus juga membangkitkan semangat reseller untuk stok/beli lebih banyak:",
      "tonjolkan potensi jual kembali (anak-anak suka, laris, cocok untuk dijual di toko/online/sekolah),",
      "ajak beli dalam jumlah lebih banyak agar untung makin besar, dan beri kesan produk ini worth dijual ulang.",
      "Jangan mengarang harga, diskon, atau klaim stok spesifik yang tidak diketahui.",
    ].join(" "),
    retailPriceHint
      ? `${retailPriceHint} Sebutkan saran harga jual eceran ini secara natural di salah satu kalimat deskripsi sebagai motivasi tambahan untuk reseller, jangan mengarang angka modal atau eceran lain di luar yang disebutkan di sini.`
      : "",
    "Tentukan categoryId yang paling sesuai dari daftar kategori berdasarkan nama produk dan foto (jika ada).",
    [
      "Jika TIDAK ADA kategori yang benar-benar cocok, set categoryId menjadi null dan isi newCategory dengan kategori baru yang sesuai:",
      `name (nama kategori singkat dalam Bahasa Indonesia) dan icon (pilih SALAH SATU yang paling sesuai dari daftar ini: ${CATEGORY_ICON_NAMES.join(", ")}).`,
      "Jika salah satu kategori yang ada sudah cocok, set newCategory menjadi null.",
    ].join(" "),
    "Tentukan juga ageRange yang paling sesuai dari daftar rentang usia, berdasarkan nama produk dan foto (jika ada).",
    `Tentukan juga satuan jual (unit) yang paling sesuai dari daftar ini: ${UNIT_OPTIONS.join(", ")}, berdasarkan nama produk dan foto (jika ada).`,
  ].filter(Boolean);

  const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
    { type: "text", text: promptLines.join("\n\n") },
  ];
  if (imageDataUrl) {
    content.push({ type: "image_url", image_url: { url: imageDataUrl } });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah asisten admin toko mainan anak online bernama Cemerlang Toys Medan. Balas hanya dalam format JSON sesuai skema yang diminta.",
        },
        { role: "user", content },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "product_suggestion",
          schema: {
            type: "object",
            properties: {
              description: { type: "string" },
              categoryId: { type: ["string", "null"] },
              newCategory: {
                type: ["object", "null"],
                properties: {
                  name: { type: "string" },
                  icon: { type: "string", enum: [...CATEGORY_ICON_NAMES] },
                },
                required: ["name", "icon"],
                additionalProperties: false,
              },
              ageRange: { type: "string", enum: [...AGE_RANGES] },
              unit: { type: "string", enum: [...UNIT_OPTIONS] },
            },
            required: ["description", "categoryId", "newCategory", "ageRange", "unit"],
            additionalProperties: false,
          },
        },
      },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: "AI tidak memberikan respons." }, { status: 502 });
    }

    const parsed = JSON.parse(raw) as {
      description: string;
      categoryId: string | null;
      newCategory: { name: string; icon: string } | null;
      ageRange: string;
      unit: string;
    };

    let categoryId = parsed.categoryId;
    let newCategory: { id: string; name: string } | null = null;

    if (!categoryId && parsed.newCategory?.name) {
      const icon = CATEGORY_ICON_NAMES.includes(parsed.newCategory.icon as CategoryIconName)
        ? parsed.newCategory.icon
        : "Boxes";

      let slug = slugify(parsed.newCategory.name);
      if (await prisma.category.findUnique({ where: { slug } })) {
        slug = `${slug}-${Date.now()}`;
      }

      const { _max } = await prisma.category.aggregate({ _max: { order: true } });
      const created = await prisma.category.create({
        data: { name: parsed.newCategory.name, slug, icon, order: (_max.order ?? 0) + 1 },
      });

      categoryId = created.id;
      newCategory = { id: created.id, name: created.name };

      revalidatePath("/admin/kategori");
      revalidatePath("/katalog");
    }

    return NextResponse.json({
      description: parsed.description,
      categoryId,
      newCategory,
      ageRange: parsed.ageRange,
      unit: parsed.unit,
    });
  } catch {
    return NextResponse.json({ error: "Gagal menghubungi OpenAI." }, { status: 502 });
  }
}
