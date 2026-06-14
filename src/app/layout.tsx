import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { SessionProvider } from "@/components/providers/session-provider";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cemerlang Toys - Grosir Mainan Anak",
  description:
    "Cemerlang Toys - Supplier & grosir mainan anak dengan ratusan pilihan produk. Bergabung dengan CT Squad sekarang!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextTopLoader color="#2bc4c2" showSpinner={false} />
        <SmoothScroll />
        <SessionProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
