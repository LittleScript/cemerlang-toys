import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Mainan Mobil-mobilan & Kendaraan", slug: "mobil-mobilan", icon: "Car" },
  { name: "Action Figure & Robot", slug: "action-figure-robot", icon: "Bot" },
  { name: "Boneka & Plushie", slug: "boneka-plushie", icon: "Heart" },
  { name: "Mainan Edukasi & Puzzle", slug: "edukasi-puzzle", icon: "Puzzle" },
  { name: "Masak-masakan & Peralatan Rumah Tangga Mini", slug: "masak-masakan", icon: "ChefHat" },
  { name: "Mainan Outdoor & Olahraga", slug: "outdoor-olahraga", icon: "Volleyball" },
  { name: "Senjata Mainan", slug: "senjata-mainan", icon: "Swords" },
  { name: "Mainan Bayi & Balita", slug: "bayi-balita", icon: "Baby" },
  { name: "Mainan Klasik/Jadul", slug: "klasik-jadul", icon: "Dice5" },
  { name: "Balon, Gelembung & Mainan Pesta", slug: "balon-pesta", icon: "PartyPopper" },
  { name: "Slime & Mainan Sensorik", slug: "slime-sensorik", icon: "Sparkles" },
  { name: "Lainnya / Grosir Campuran", slug: "lainnya-grosir", icon: "Boxes" },
];

const brandColors = ["2bc4c2", "ff9d3d", "4a90e2", "5cb85c", "e0524d", "9b59b6", "ffc93c"];

function placeholder(seed: string, label: string) {
  const color = brandColors[Math.abs(hashCode(seed)) % brandColors.length];
  return `https://placehold.co/600x600/${color}/ffffff?text=${encodeURIComponent(label)}`;
}

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

type SeedProduct = {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stockStatus?: "IN_STOCK" | "OUT_OF_STOCK";
  ageRange?: "0-2" | "3-5" | "6-8" | "9-12" | "12+";
  variants?: { name: string; price?: number; stock: number }[];
};

const productsByCategory: Record<string, SeedProduct[]> = {
  "mobil-mobilan": [
    {
      name: "Mobil Friction Truk Container",
      description:
        "Mobil truk container dengan sistem friction (tarik mundur lalu lepas), bodi plastik tebal, cocok untuk anak usia 3 tahun ke atas.",
      price: 35000,
      ageRange: "3-5",
    },
    {
      name: "Diecast Mobil Balap Mini",
      description:
        "Diecast mobil balap skala mini dengan berbagai pilihan warna ceria, bahan logam ringan dan roda karet halus.",
      price: 25000,
      discountPrice: 20000,
      ageRange: "6-8",
      variants: [
        { name: "Merah", stock: 40 },
        { name: "Biru", stock: 35 },
        { name: "Kuning", stock: 20 },
      ],
    },
  ],
  "action-figure-robot": [
    {
      name: "Robot Transformer Mini",
      description:
        "Robot mainan yang bisa diubah jadi mobil, bahan plastik keras dengan sambungan engsel yang kuat.",
      price: 45000,
      ageRange: "6-8",
    },
    {
      name: "Action Figure Superhero Set",
      description:
        "Set 4 action figure superhero dengan sendi yang bisa digerakkan, tinggi sekitar 12cm per figure.",
      price: 55000,
      ageRange: "6-8",
    },
  ],
  "boneka-plushie": [
    {
      name: "Boneka Beruang Lucu",
      description:
        "Boneka beruang bahan rasfur lembut, isi dakron padat, ukuran sedang cocok untuk hadiah.",
      price: 48000,
      ageRange: "0-2",
    },
    {
      name: "Plushie Karakter Kartun",
      description:
        "Boneka karakter kartun populer, bahan halus dan aman untuk anak, tersedia beberapa karakter.",
      price: 38000,
      stockStatus: "OUT_OF_STOCK",
      ageRange: "0-2",
    },
  ],
  "edukasi-puzzle": [
    {
      name: "Puzzle Kayu Angka & Huruf",
      description:
        "Puzzle kayu bergambar angka dan huruf untuk melatih motorik halus dan pengenalan dasar anak.",
      price: 22000,
      ageRange: "3-5",
    },
    {
      name: "Mainan Edukasi Menara Pelangi",
      description:
        "Menara susun pelangi dari plastik tebal, melatih koordinasi dan pengenalan warna & ukuran.",
      price: 30000,
      ageRange: "0-2",
    },
  ],
  "masak-masakan": [
    {
      name: "Set Masak-masakan Mini",
      description:
        "Set alat masak mini lengkap dengan panci, wajan, dan peralatan plastik warna-warni.",
      price: 42000,
      ageRange: "3-5",
    },
    {
      name: "Kompor Mainan Plastik",
      description:
        "Kompor mainan dengan suara dan lampu, dilengkapi panci dan tutup, bahan plastik aman.",
      price: 65000,
      discountPrice: 55000,
      ageRange: "3-5",
    },
  ],
  "outdoor-olahraga": [
    {
      name: "Bola Plastik Bergambar",
      description:
        "Bola plastik ringan bergambar karakter, cocok untuk bermain di dalam maupun luar ruangan.",
      price: 15000,
      ageRange: "3-5",
    },
    {
      name: "Lompat Tali Karakter",
      description:
        "Tali lompat dengan pegangan karakter lucu, panjang dapat disesuaikan.",
      price: 18000,
      ageRange: "6-8",
    },
  ],
  "senjata-mainan": [
    {
      name: "Pistol Air Jumbo",
      description:
        "Pistol air ukuran jumbo dengan jarak tembak jauh, tangki kapasitas besar, bahan plastik tebal.",
      price: 28000,
      ageRange: "6-8",
    },
    {
      name: "Pedang Ksatria Plastik",
      description:
        "Pedang mainan bahan plastik lentur dan aman, lengkap dengan sarung pedang.",
      price: 20000,
      ageRange: "3-5",
    },
  ],
  "bayi-balita": [
    {
      name: "Rattle Bayi Musik",
      description:
        "Mainan kerincingan bayi dengan suara musik lembut dan warna-warna cerah, bahan aman untuk digigit.",
      price: 25000,
      ageRange: "0-2",
    },
    {
      name: "Mainan Gantung Box Bayi",
      description:
        "Mainan gantung untuk box bayi dengan berbagai bentuk hewan lucu dan lonceng kecil.",
      price: 32000,
      ageRange: "0-2",
    },
  ],
  "klasik-jadul": [
    {
      name: "Gasing Kayu Tradisional",
      description:
        "Gasing kayu klasik dengan tali pemutar, mainan jadul yang melatih ketangkasan.",
      price: 12000,
      ageRange: "6-8",
    },
    {
      name: "Yoyo Klasik Warna-warni",
      description:
        "Yoyo plastik klasik dengan berbagai pilihan warna, cocok untuk nostalgia bermain.",
      price: 10000,
      ageRange: "6-8",
    },
  ],
  "balon-pesta": [
    {
      name: "Balon Latex Set 100pcs",
      description:
        "Set balon latex 100 pcs aneka warna, cocok untuk dekorasi pesta ulang tahun.",
      price: 17000,
      ageRange: "3-5",
    },
    {
      name: "Confetti Popper Pesta",
      description:
        "Confetti popper untuk perayaan, sekali tarik mengeluarkan confetti warna-warni.",
      price: 14000,
      stockStatus: "OUT_OF_STOCK",
      ageRange: "6-8",
    },
  ],
  "slime-sensorik": [
    {
      name: "Slime Glitter Aneka Warna",
      description:
        "Slime dengan tambahan glitter, tekstur lembut dan tidak lengket di tangan.",
      price: 13000,
      ageRange: "6-8",
    },
    {
      name: "Mainan Squishy Karakter",
      description:
        "Mainan squishy lembut dengan berbagai bentuk karakter lucu, slow rebound.",
      price: 16000,
      discountPrice: 12000,
      ageRange: "3-5",
    },
  ],
  "lainnya-grosir": [
    {
      name: "Paket Campur Mainan Anak Grosir",
      description:
        "Paket campuran mainan anak isi 50pcs aneka jenis, cocok untuk reseller dan hadiah event.",
      price: 150000,
      ageRange: "3-5",
    },
    {
      name: "Mainan Mini Hadiah Ulang Tahun",
      description:
        "Mainan mini aneka bentuk untuk goodie bag atau hadiah ulang tahun, dijual per pack.",
      price: 45000,
      ageRange: "3-5",
    },
  ],
};

const whitelistWA = [
  { phoneNumber: "6281234567890", note: "Toko Mainan Jaya (contoh data)" },
  { phoneNumber: "6285711112222", note: "Bunda Kiki Grosir (contoh data)" },
];

async function main() {
  for (const [index, category] of categories.entries()) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, icon: category.icon, order: index },
      create: { ...category, order: index },
    });

    const products = productsByCategory[category.slug] ?? [];

    for (const product of products) {
      const slug = slugify(product.name);

      const createdProduct = await prisma.product.upsert({
        where: { slug },
        update: {
          name: product.name,
          description: product.description,
          price: product.price,
          discountPrice: product.discountPrice,
          stockStatus: product.stockStatus ?? "IN_STOCK",
          ageRange: product.ageRange,
          categoryId: createdCategory.id,
        },
        create: {
          name: product.name,
          slug,
          description: product.description,
          price: product.price,
          discountPrice: product.discountPrice,
          stockStatus: product.stockStatus ?? "IN_STOCK",
          ageRange: product.ageRange,
          categoryId: createdCategory.id,
          images: {
            create: [{ url: placeholder(slug, product.name), alt: product.name, order: 0 }],
          },
          variants: product.variants
            ? {
                create: product.variants.map((variant) => ({
                  name: variant.name,
                  price: variant.price,
                  stock: variant.stock,
                })),
              }
            : undefined,
        },
      });

      void createdProduct;
    }
  }

  for (const entry of whitelistWA) {
    await prisma.whitelistWA.upsert({
      where: { phoneNumber: entry.phoneNumber },
      update: { note: entry.note },
      create: entry,
    });
  }

  const categoryCount = await prisma.category.count();
  const productCount = await prisma.product.count();
  console.log(`Seed selesai: ${categoryCount} kategori, ${productCount} produk.`);
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
