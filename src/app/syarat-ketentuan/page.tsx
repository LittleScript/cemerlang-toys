import Link from "next/link";
import { SITE_NAME, STORE_MAPS_URL, STORE_WHATSAPP } from "@/lib/constants";

export const metadata = {
  title: `Syarat & Ketentuan - ${SITE_NAME}`,
};

export default function SyaratKetentuanPage() {
  const waLink = `https://wa.me/${STORE_WHATSAPP}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-ct-blue sm:text-4xl">Syarat &amp; Ketentuan</h1>
      <p className="mt-2 text-sm text-foreground/50">Terakhir diperbarui: 15 Juni 2026</p>

      <div className="mt-8 space-y-8 text-foreground/80">
        <p>
          Selamat datang di {SITE_NAME}. Halaman ini menjelaskan syarat dan ketentuan
          (&quot;Syarat&quot;) yang berlaku atas penggunaan situs ini. Dengan mengakses atau
          menggunakan situs ini — termasuk mendaftar, melihat harga reseller, atau mengirim
          pesanan — Anda dianggap telah membaca, memahami, dan menyetujui Syarat ini secara
          penuh.
        </p>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">1. Tentang Layanan</h2>
          <p className="mt-2">
            {SITE_NAME} adalah platform katalog grosir mainan anak yang ditujukan untuk reseller,
            toko mainan, dan pelaku usaha. Situs ini berfungsi sebagai katalog produk dan sarana
            komunikasi pemesanan. Transaksi akhir — meliputi konfirmasi harga, jumlah, ongkos
            kirim, metode pembayaran, dan pengiriman — diproses secara manual melalui WhatsApp
            oleh tim CT Rangers, dan bukan diproses secara otomatis melalui situs ini.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">2. Akun &amp; Pendaftaran</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Untuk melihat harga grosir dan melakukan pemesanan, Anda harus masuk menggunakan akun
              Google dan melengkapi data pendaftaran (nama lengkap, nomor WhatsApp, alamat lengkap,
              dan nama toko/usaha jika ada).
            </li>
            <li>
              Anda wajib memberikan informasi yang benar, akurat, dan terkini. Kami berhak menolak,
              menangguhkan, atau menghapus akun yang memberikan informasi palsu, tidak lengkap, atau
              tidak dapat diverifikasi.
            </li>
            <li>
              Setiap pendaftaran akan ditinjau oleh admin kami. Status akun Anda dapat berupa:{" "}
              <span className="font-medium text-foreground">Menunggu Verifikasi</span>,{" "}
              <span className="font-medium text-foreground">Disetujui</span>, atau{" "}
              <span className="font-medium text-foreground">Ditolak</span>.
            </li>
            <li>
              Akun yang telah <span className="font-medium text-foreground">Disetujui</span> (member)
              dapat melihat harga reseller dan melakukan pemesanan. Akun yang belum disetujui hanya
              dapat melihat katalog produk tanpa informasi harga.
            </li>
            <li>
              Anda bertanggung jawab untuk menjaga kerahasiaan akun Google yang digunakan untuk
              masuk ke situs ini.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">
            3. Harga &amp; Ketersediaan Produk
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Seluruh harga ditampilkan dalam mata uang Rupiah (IDR) dan hanya terlihat oleh member yang telah disetujui.</li>
            <li>
              Harga, satuan (pcs/pack/lusin/set/dll), dan ketersediaan stok dapat berubah sewaktu-waktu
              tanpa pemberitahuan sebelumnya, mengikuti kondisi pasar dan pemasok kami.
            </li>
            <li>
              Harga, deskripsi, dan foto produk yang tercantum di situs bersifat referensi sebaik
              mungkin sesuai kondisi terkini. Harga, jumlah, dan ketersediaan akhir akan dikonfirmasi
              oleh tim CT Rangers melalui WhatsApp sebelum pesanan diproses.
            </li>
            <li>
              Beberapa produk mungkin memiliki minimal jumlah pembelian (misalnya per lusin/pack/box).
              Informasi ini dapat ditanyakan langsung kepada CT Rangers via WhatsApp.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">4. Proses Pemesanan</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Pemesanan dilakukan dengan menambahkan produk ke keranjang, lalu menekan tombol
              &quot;Pesan via WhatsApp&quot;, yang akan membuka percakapan WhatsApp berisi rincian
              pesanan Anda (daftar produk, jumlah, dan estimasi total bagi member yang disetujui).
            </li>
            <li>
              Mengirim pesan tersebut <span className="font-medium text-foreground">bukan merupakan
              transaksi final atau mengikat secara hukum</span>. Pesanan akan diproses dan
              dikonfirmasi secara manual oleh tim kami, termasuk pengecekan ketersediaan stok,
              minimal pembelian, dan ongkos kirim.
            </li>
            <li>
              Kami berhak menyesuaikan, membatalkan, atau menolak pesanan yang tidak memenuhi syarat
              minimal pembelian, ketersediaan stok, atau ketentuan lain yang berlaku.
            </li>
            <li>
              Keranjang belanja disimpan secara lokal di perangkat/browser Anda dan tidak otomatis
              tersinkron ke server kami sampai Anda mengirimkannya melalui WhatsApp.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">5. Pembayaran &amp; Pengiriman</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Metode pembayaran, ongkos kirim, ekspedisi, dan estimasi waktu pengiriman akan dibahas
              dan disepakati langsung melalui WhatsApp antara Anda dan tim CT Rangers.
            </li>
            <li>Kami melayani pengiriman ke seluruh Indonesia menggunakan ekspedisi pilihan Anda.</li>
            <li>
              Biaya pengiriman ditanggung oleh pembeli, kecuali disepakati lain antara Anda dan tim
              kami.
            </li>
            <li>
              {SITE_NAME} tidak bertanggung jawab atas keterlambatan, kerusakan, atau kehilangan
              barang yang terjadi di luar kendali kami selama proses pengiriman oleh pihak ekspedisi.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">6. Hak Kekayaan Intelektual</h2>
          <p className="mt-2">
            Seluruh konten yang terdapat di situs ini — termasuk namun tidak terbatas pada logo,
            nama &quot;{SITE_NAME}&quot;, teks, tata letak, dan foto produk/galeri toko — adalah
            milik {SITE_NAME} atau digunakan dengan izin dari pemiliknya. Anda tidak diperkenankan
            menyalin, mendistribusikan ulang, memodifikasi, atau menggunakan konten kami untuk
            tujuan komersial tanpa izin tertulis dari kami.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">
            7. Penangguhan &amp; Penyalahgunaan Akun
          </h2>
          <p className="mt-2">
            Kami berhak menangguhkan atau menghapus akun yang terindikasi melakukan penyalahgunaan,
            termasuk namun tidak terbatas pada: pendaftaran dengan identitas palsu, percobaan akses
            tidak sah ke bagian admin situs, atau penggunaan akses harga reseller untuk tujuan yang
            merugikan {SITE_NAME} atau pihak lain.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">8. Pembatasan Tanggung Jawab</h2>
          <p className="mt-2">
            Situs ini disediakan &quot;sebagaimana adanya&quot; (as is) dan &quot;sebagaimana
            tersedia&quot; (as available). Kami berupaya menjaga informasi (harga, stok, deskripsi,
            dan foto produk) tetap akurat dan terkini, namun tidak menjamin bahwa situs ini akan
            selalu bebas dari kesalahan, gangguan, atau ketidaksesuaian. Sejauh diizinkan oleh hukum
            yang berlaku, {SITE_NAME} tidak bertanggung jawab atas kerugian tidak langsung, kerugian
            khusus, atau kehilangan keuntungan yang timbul dari penggunaan atau ketidakmampuan
            menggunakan situs ini.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">9. Privasi</h2>
          <p className="mt-2">
            Pengumpulan dan penggunaan data pribadi Anda diatur dalam{" "}
            <Link href="/privasi" className="font-medium text-ct-teal hover:underline">
              Kebijakan Privasi
            </Link>{" "}
            kami, yang merupakan bagian tidak terpisahkan dari Syarat &amp; Ketentuan ini.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">
            10. Perubahan Syarat &amp; Ketentuan
          </h2>
          <p className="mt-2">
            Kami dapat memperbarui Syarat &amp; Ketentuan ini dari waktu ke waktu mengikuti
            perkembangan layanan kami atau perubahan peraturan yang berlaku. Perubahan akan berlaku
            sejak tanggal &quot;Terakhir diperbarui&quot; di bagian atas halaman ini direvisi. Dengan
            tetap menggunakan situs ini setelah perubahan tersebut dipublikasikan, Anda dianggap
            menyetujui Syarat &amp; Ketentuan yang telah diperbarui.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">11. Hukum yang Berlaku</h2>
          <p className="mt-2">
            Syarat &amp; Ketentuan ini diatur dan ditafsirkan berdasarkan hukum yang berlaku di
            Republik Indonesia. Setiap perselisihan yang timbul akan diselesaikan secara
            musyawarah terlebih dahulu antara Anda dan {SITE_NAME}.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">12. Kontak Kami</h2>
          <p className="mt-2">
            Pertanyaan terkait Syarat &amp; Ketentuan ini dapat disampaikan melalui:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              WhatsApp:{" "}
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="font-medium text-ct-teal hover:underline">
                0812-6019-2002
              </a>
            </li>
            <li>
              Lokasi toko:{" "}
              <a href={STORE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-ct-teal hover:underline">
                Lihat di Google Maps
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
