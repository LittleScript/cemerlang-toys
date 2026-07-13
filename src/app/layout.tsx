import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { SessionProvider } from "@/components/providers/session-provider";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SiteChrome } from "@/components/layout/site-chrome";
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
  title: "Cemerlang Toys Medan - Supplier Mainan Anak Terpercaya Sejak 2002",
  description:
    "Cemerlang Toys Medan - Supplier mainan anak terpercaya sejak 2002 dengan harga grosir kompetitif untuk reseller dan toko mainan di seluruh Indonesia. Bergabung dengan CT Squad sekarang!",
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
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (!location.pathname.startsWith('/admin')) return;
                var theme = localStorage.getItem('ct-admin-theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
                var collapsed = localStorage.getItem('ct-admin-sidebar-collapsed');
                if (collapsed === 'true') {
                  document.documentElement.classList.add('sidebar-collapsed');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <NextTopLoader color="#2bc4c2" showSpinner={false} />
        <SmoothScroll />
        <SessionProvider>
          <CartProvider>
            <SiteChrome header={<Header />} footer={<Footer />}>
              {children}
            </SiteChrome>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
