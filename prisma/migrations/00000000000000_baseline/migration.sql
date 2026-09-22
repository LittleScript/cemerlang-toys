-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "storeName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER,
    "discountPrice" INTEGER,
    "unit" TEXT,
    "stockStatus" TEXT NOT NULL DEFAULT 'IN_STOCK',
    "ageRange" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "price" INTEGER,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "heroBadge" TEXT NOT NULL DEFAULT 'Halo, CT Squad! 👋',
    "heroTitle" TEXT NOT NULL DEFAULT 'Grosir Mainan Anak, Harga Bersahabat untuk Reseller',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Cemerlang Toys Medan menyediakan ribuan pilihan mainan anak ekonomis & jadul. Daftar gratis untuk membuka harga, deskripsi lengkap, dan pesan langsung lewat WhatsApp.',
    "ctaTitle" TEXT NOT NULL DEFAULT 'Gabung CT Squad Sekarang',
    "ctaSubtitle" TEXT NOT NULL DEFAULT 'Daftar dengan akun Google, lengkapi data toko/usaha Anda, dan dapatkan akses penuh ke harga grosir & pemesanan langsung via WhatsApp.',
    "footerTagline" TEXT NOT NULL DEFAULT 'Grosir mainan anak, harga bersahabat untuk reseller',
    "footerGreeting" TEXT NOT NULL DEFAULT 'Halo, CT Squad! 👋 Daftar untuk lihat harga & pesan langsung via WhatsApp.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutContent" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "heroBadge" TEXT NOT NULL DEFAULT 'Sejak 2002 • Generasi ke-2',
    "ceritaParagraph1" TEXT NOT NULL DEFAULT 'Semua berawal dari sebuah toko kecil di tahun 2002, dengan satu misi sederhana: menghadirkan mainan anak yang seru dengan harga bersahabat, terutama untuk teman-teman pedagang yang ingin menjualnya kembali.',
    "ceritaParagraph2" TEXT NOT NULL DEFAULT 'Dari rak yang awalnya hanya berisi beberapa jenis mainan, perlahan tapi pasti kami terus menambah variasi, menjalin kepercayaan dengan reseller dari berbagai kota, dan belajar dari setiap tren mainan yang datang dan pergi. Lebih dari dua dekade berlalu, dan toko kecil itu kini menjadi rumah bagi ribuan pilihan mainan & ribuan reseller di seluruh Indonesia.',
    "ceritaParagraph3" TEXT NOT NULL DEFAULT 'Saat ini, Cemerlang Toys Medan dikelola oleh generasi kedua, dengan semangat yang sama seperti awal berdiri: terus tumbuh, terus berkembang, dan terus jadi tempat yang pas buat reseller mencari stok mainan terbaru dengan harga bersaing.',
    "visiText" TEXT NOT NULL DEFAULT 'Menjadi mitra grosir mainan anak yang terus tumbuh dan berkembang, serta menjadi pilihan utama reseller untuk mendapatkan mainan-mainan terbaru dengan harga terbaik.',
    "misi1" TEXT NOT NULL DEFAULT 'Terus tumbuh dan berkembang mengikuti perubahan zaman dan tren mainan anak.',
    "misi2" TEXT NOT NULL DEFAULT 'Menyediakan dan menyuplai mainan-mainan terbaru serta model yang sedang digemari.',
    "misi3" TEXT NOT NULL DEFAULT 'Menjaga harga tetap bersahabat dan kompetitif agar reseller mendapat untung lebih besar.',
    "misi4" TEXT NOT NULL DEFAULT 'Membangun hubungan jangka panjang dengan reseller, dari generasi ke generasi.',
    "valueProp1Title" TEXT NOT NULL DEFAULT 'Grosir Harga Bersahabat',
    "valueProp1Desc" TEXT NOT NULL DEFAULT 'Harga khusus untuk pembelian dalam jumlah lebih banyak, cocok untuk reseller.',
    "valueProp2Title" TEXT NOT NULL DEFAULT 'Dipercaya Sejak 2002',
    "valueProp2Desc" TEXT NOT NULL DEFAULT 'Lebih dari 20 tahun melayani reseller mainan anak di seluruh Indonesia.',
    "valueProp3Title" TEXT NOT NULL DEFAULT 'Bisnis Keluarga Generasi ke-2',
    "valueProp3Desc" TEXT NOT NULL DEFAULT 'Dikelola dengan sepenuh hati, terus berkembang demi pelayanan yang konsisten.',
    "contactTitle" TEXT NOT NULL DEFAULT 'Kunjungi & Hubungi Kami',
    "contactSubtitle" TEXT NOT NULL DEFAULT 'CT Rangers siap bantu pesanan grosir kamu. Datang langsung atau hubungi kami via WhatsApp.',
    "stat1Value" TEXT NOT NULL DEFAULT '20+',
    "stat1Label" TEXT NOT NULL DEFAULT 'Tahun melayani reseller sejak 2002',
    "stat2Value" TEXT NOT NULL DEFAULT '1000+',
    "stat2Label" TEXT NOT NULL DEFAULT 'Produk mainan anak berbagai kategori',
    "stat3Value" TEXT NOT NULL DEFAULT 'Generasi ke-2',
    "stat3Label" TEXT NOT NULL DEFAULT 'Bisnis keluarga terpercaya',
    "stat4Value" TEXT NOT NULL DEFAULT 'Seluruh Indonesia',
    "stat4Label" TEXT NOT NULL DEFAULT 'Melayani pengiriman antar kota',
    "keunggulan1" TEXT NOT NULL DEFAULT 'Update produk mengikuti tren mainan terbaru',
    "keunggulan2" TEXT NOT NULL DEFAULT 'Harga grosir kompetitif untuk reseller',
    "keunggulan3" TEXT NOT NULL DEFAULT 'Stok selalu diperbarui',
    "keunggulan4" TEXT NOT NULL DEFAULT 'Pengiriman ke seluruh Indonesia',
    "keunggulan5" TEXT NOT NULL DEFAULT 'Pengalaman lebih dari 20 tahun di industri mainan anak',
    "caraOrder1" TEXT NOT NULL DEFAULT 'Pilih produk yang dibutuhkan di Katalog',
    "caraOrder2" TEXT NOT NULL DEFAULT 'Kirim pesanan via WhatsApp',
    "caraOrder3" TEXT NOT NULL DEFAULT 'Tim kami konfirmasi & proses pesanan Anda',
    "faq1Question" TEXT NOT NULL DEFAULT 'Apakah bisa beli eceran?',
    "faq1Answer" TEXT NOT NULL DEFAULT 'Bisa, namun harga terbaik dan stok paling lengkap kami siapkan untuk pembelian dalam jumlah grosir/reseller.',
    "faq2Question" TEXT NOT NULL DEFAULT 'Apakah ada harga khusus untuk reseller?',
    "faq2Answer" TEXT NOT NULL DEFAULT 'Ada. Daftar gratis di website untuk membuka harga reseller di setiap produk.',
    "faq3Question" TEXT NOT NULL DEFAULT 'Berapa minimal pembelian?',
    "faq3Answer" TEXT NOT NULL DEFAULT 'Minimal pembelian bisa berbeda tiap produk, silakan tanyakan ke CT Rangers via WhatsApp untuk produk yang Anda minati.',
    "faq4Question" TEXT NOT NULL DEFAULT 'Apakah bisa kirim ke luar kota?',
    "faq4Answer" TEXT NOT NULL DEFAULT 'Bisa, kami melayani pengiriman ke seluruh Indonesia menggunakan ekspedisi pilihan Anda.',
    "faq5Question" TEXT NOT NULL DEFAULT 'Mau lihat produk terbaru setiap hari, gimana caranya?',
    "faq5Answer" TEXT NOT NULL DEFAULT 'Setelah akun Anda disetujui, simpan nomor WhatsApp CT Rangers — kami rutin membagikan produk-produk terbaru setiap hari lewat Status WhatsApp.',
    "faq6Question" TEXT NOT NULL DEFAULT 'Apakah harus daftar untuk melihat harga?',
    "faq6Answer" TEXT NOT NULL DEFAULT 'Ya, harga grosir hanya dapat dilihat oleh member yang telah disetujui.',
    "faq7Question" TEXT NOT NULL DEFAULT 'Bagaimana cara memesan?',
    "faq7Answer" TEXT NOT NULL DEFAULT 'Pilih produk, kirim ke WhatsApp, lalu tim kami memproses pesanan Anda.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryPhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhitelistWA" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhitelistWA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_whatsapp_idx" ON "User"("whatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_published_idx" ON "Product"("published");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "ProductImage_productId_idx" ON "ProductImage"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "WhitelistWA_phoneNumber_key" ON "WhitelistWA"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
