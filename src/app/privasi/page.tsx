import Link from "next/link";
import { SITE_NAME, STORE_MAPS_URL, STORE_WHATSAPP } from "@/lib/constants";

export const metadata = {
  title: `Kebijakan Privasi - ${SITE_NAME}`,
};

export default function PrivasiPage() {
  const waLink = `https://wa.me/${STORE_WHATSAPP}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-ct-blue sm:text-4xl">Kebijakan Privasi</h1>
      <p className="mt-2 text-sm text-foreground/50">Terakhir diperbarui: 15 Juni 2026</p>

      <div className="mt-8 space-y-8 text-foreground/80">
        <p>
          {SITE_NAME} (&quot;kami&quot;) menghargai privasi setiap pengguna situs ini, baik pengunjung
          maupun reseller yang terdaftar (&quot;Anda&quot;). Kebijakan Privasi ini menjelaskan data
          pribadi apa yang kami kumpulkan, bagaimana data tersebut digunakan, disimpan, dan
          dilindungi, serta hak-hak Anda terkait data tersebut. Dengan menggunakan situs ini, Anda
          dianggap telah membaca dan memahami Kebijakan Privasi ini.
        </p>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">
            1. Informasi yang Kami Kumpulkan
          </h2>

          <h3 className="mt-4 font-heading font-semibold text-foreground">
            a. Informasi dari Akun Google
          </h3>
          <p className="mt-2">
            Saat Anda masuk atau mendaftar menggunakan akun Google, kami menerima sebagian informasi
            dari profil Google Anda, yaitu:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Nama</li>
            <li>Alamat email</li>
            <li>Foto profil (jika tersedia)</li>
          </ul>

          <h3 className="mt-4 font-heading font-semibold text-foreground">
            b. Informasi Pendaftaran Reseller
          </h3>
          <p className="mt-2">
            Untuk membuka akses harga grosir dan dapat melakukan pemesanan, Anda akan diminta
            melengkapi data berikut pada formulir pendaftaran:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Nama lengkap</li>
            <li>Nomor WhatsApp aktif</li>
            <li>Alamat lengkap</li>
            <li>Nama toko/usaha (opsional)</li>
          </ul>

          <h3 className="mt-4 font-heading font-semibold text-foreground">c. Data Penggunaan</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <span className="font-medium text-foreground">Keranjang belanja</span> disimpan di
              perangkat/browser Anda sendiri (local storage), dan tidak dikirim ke server kami
              sampai Anda menekan tombol &quot;Pesan via WhatsApp&quot;.
            </li>
            <li>
              <span className="font-medium text-foreground">Cookie sesi login</span> digunakan oleh
              sistem autentikasi untuk menjaga Anda tetap masuk ke akun Anda.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">
            2. Bagaimana Kami Menggunakan Informasi Anda
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Memverifikasi dan menyetujui akun reseller Anda.</li>
            <li>Menampilkan harga grosir khusus member yang telah disetujui.</li>
            <li>
              Memproses pesanan yang Anda kirim melalui WhatsApp — nama, daftar produk, jumlah, dan
              estimasi total akan disertakan dalam pesan yang dikirim ke CT Rangers.
            </li>
            <li>Menghubungi Anda terkait status akun (disetujui/ditolak) atau pesanan Anda.</li>
            <li>Menjaga keamanan situs dan mencegah penyalahgunaan platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">
            3. Dasar Pemrosesan Data
          </h2>
          <p className="mt-2">
            Kami memproses data pribadi Anda berdasarkan persetujuan yang Anda berikan secara aktif
            saat mendaftar (mengisi dan mengirimkan formulir pendaftaran reseller), serta untuk
            keperluan pelaksanaan layanan yang Anda minta, yaitu verifikasi akun reseller dan
            pemrosesan pesanan.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">
            4. Berbagi Data dengan Pihak Ketiga
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Kami <span className="font-medium text-foreground">tidak menjual, menyewakan, atau
              memperdagangkan</span> data pribadi Anda kepada pihak manapun untuk tujuan komersial.
            </li>
            <li>
              Proses masuk/pendaftaran menggunakan akun Google diproses melalui layanan autentikasi
              Google, dan tunduk pada kebijakan privasi Google.
            </li>
            <li>
              Saat Anda mengirim pesanan, isi pesan (termasuk nama dan daftar produk yang Anda
              pilih) akan terkirim ke nomor WhatsApp resmi CT Rangers (tim {SITE_NAME}) untuk
              diproses lebih lanjut. Ini adalah bagian inti dari layanan pemesanan kami dan tidak
              dapat dinonaktifkan selama Anda menggunakan fitur ini.
            </li>
            <li>
              Data dapat diungkapkan apabila diwajibkan oleh hukum, peraturan, proses hukum, atau
              permintaan resmi dari pihak yang berwenang di Indonesia.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">
            5. Penyimpanan dan Keamanan Data
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Data pribadi Anda disimpan dalam basis data milik {SITE_NAME} dan diakses hanya oleh
              admin yang berwenang untuk keperluan verifikasi dan pemrosesan pesanan.
            </li>
            <li>
              Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi data Anda dari
              akses, pengubahan, atau penghapusan yang tidak sah.
            </li>
            <li>
              Data Anda akan disimpan selama akun Anda aktif, atau selama diperlukan untuk tujuan
              yang dijelaskan dalam kebijakan ini. Anda dapat meminta penghapusan data dengan
              menghubungi kami melalui kontak pada bagian 9.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">6. Hak Anda</h2>
          <p className="mt-2">
            Sesuai dengan Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, Anda
            memiliki hak untuk:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Mengakses dan meminta salinan data pribadi yang kami simpan tentang Anda.</li>
            <li>Meminta koreksi atas data pribadi Anda yang tidak akurat atau sudah tidak berlaku.</li>
            <li>
              Meminta penghapusan data pribadi Anda dari sistem kami — dengan konsekuensi akun Anda
              tidak akan dapat lagi mengakses harga reseller dan riwayat data terkait.
            </li>
            <li>Menarik persetujuan Anda atas pemrosesan data kapan saja.</li>
            <li>Mengajukan keberatan atas pemrosesan data pribadi Anda untuk tujuan tertentu.</li>
          </ul>
          <p className="mt-2">
            Untuk menggunakan salah satu hak di atas, silakan hubungi kami melalui kontak pada
            bagian 9. Kami akan menindaklanjuti permintaan Anda dalam waktu yang wajar.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">
            7. Cookie dan Penyimpanan Lokal
          </h2>
          <p className="mt-2">
            Situs ini menggunakan cookie untuk keperluan autentikasi (menjaga sesi login Anda) dan
            local storage browser untuk menyimpan keranjang belanja Anda di perangkat masing-masing.
            Kami tidak menggunakan cookie untuk pelacakan iklan pihak ketiga. Jika Anda menghapus
            cookie atau data browser, sesi login dan isi keranjang Anda akan hilang dan perlu
            login/diisi ulang.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">
            8. Penggunaan oleh Anak-Anak
          </h2>
          <p className="mt-2">
            Meskipun produk yang kami jual adalah mainan anak, layanan pendaftaran dan pemesanan di
            situs ini ditujukan untuk reseller, toko mainan, dan pelaku usaha dewasa (berusia 18
            tahun atau lebih), bukan untuk digunakan secara langsung oleh anak-anak. Kami tidak
            secara sengaja mengumpulkan data pribadi dari anak-anak.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">
            9. Kontak Kami
          </h2>
          <p className="mt-2">
            Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, atau ingin menggunakan hak
            Anda atas data pribadi (akses, koreksi, atau penghapusan), silakan hubungi kami melalui:
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

        <section>
          <h2 className="font-heading text-xl font-semibold text-ct-blue">
            10. Perubahan Kebijakan Privasi
          </h2>
          <p className="mt-2">
            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu mengikuti perkembangan
            layanan kami atau perubahan peraturan yang berlaku. Perubahan akan berlaku sejak tanggal
            &quot;Terakhir diperbarui&quot; di bagian atas halaman ini direvisi. Kami menyarankan Anda
            untuk meninjau halaman ini secara berkala.
          </p>
        </section>

        <p className="text-sm text-foreground/50">
          Lihat juga{" "}
          <Link href="/syarat-ketentuan" className="font-medium text-ct-teal hover:underline">
            Syarat &amp; Ketentuan
          </Link>{" "}
          kami.
        </p>
      </div>
    </div>
  );
}
