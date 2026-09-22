const baseUrl = (process.env.SMOKE_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const productSlug = process.env.SMOKE_PRODUCT_SLUG ?? "skateboard-finger";

const routes = [
  "/",
  "/katalog",
  `/produk/${productSlug}`,
  "/tentang",
  "/login",
  "/daftar",
  "/keranjang",
  "/privasi",
  "/syarat-ketentuan",
  "/robots.txt",
  "/sitemap.xml",
];

let failed = false;

for (const route of routes) {
  try {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
    const ok = response.status >= 200 && response.status < 400;
    console.log(`${ok ? "PASS" : "FAIL"} ${response.status} ${route}`);
    if (!ok) failed = true;
  } catch (error) {
    failed = true;
    console.log(`FAIL network ${route}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failed) process.exitCode = 1;
