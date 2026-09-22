import { randomUUID } from "crypto";
import { mkdir, rename, unlink, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { requireAdminApi } from "@/lib/admin";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

// Magic-byte signatures for allowed image types.
// We check the first few bytes of the file buffer to prevent MIME-type
// spoofing (attacker sends .exe with Content-Type: image/jpeg).
const MAGIC_SIGNATURES: { ext: string; offset: number; bytes: number[] }[] = [
  { ext: ".jpg", offset: 0, bytes: [0xff, 0xd8, 0xff] },
  { ext: ".jpeg", offset: 0, bytes: [0xff, 0xd8, 0xff] },
  { ext: ".png", offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47] },
  { ext: ".webp", offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] },
  { ext: ".gif", offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] },
];

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function validateMagicBytes(buffer: Buffer, ext: string): boolean {
  const sigs = MAGIC_SIGNATURES.filter((s) => s.ext === ext);
  if (sigs.length === 0) return false;
  return sigs.some((sig) => {
    if (buffer.length < sig.offset + sig.bytes.length) return false;
    return sig.bytes.every((byte, i) => buffer[sig.offset + i] === byte);
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const authError = await requireAdminApi();
  if (authError) return authError;

  // Rate limit (H-8): prevent upload DoS
  const session = await auth();
  const rlKey = `upload:${session?.user?.id ?? "anonymous"}`;
  const rl = checkRateLimit(rlKey, RATE_LIMITS.upload.maxReqs, RATE_LIMITS.upload.windowMs);
  if (rl.limited) {
    return NextResponse.json(
      { error: `Terlalu banyak upload. Coba lagi dalam ${rl.retryAfter} detik.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        error: `File terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimal 10 MB.`,
      },
      { status: 400 }
    );
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json({ error: "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF." }, { status: 400 });
  }

  // Validate magic bytes before writing to disk
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!validateMagicBytes(buffer, ext)) {
    return NextResponse.json(
      { error: "File tidak valid — konten tidak sesuai dengan ekstensi." },
      { status: 400 }
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${randomUUID()}${ext}`;
  const finalPath = path.join(UPLOAD_DIR, filename);
  const tempPath = path.join(UPLOAD_DIR, `.${filename}.uploading`);

  try {
    // Complete the write before exposing the final URL. The UUID makes the
    // destination collision-safe, while rename keeps readers from observing
    // a partially written file during container or process interruption.
    await writeFile(tempPath, buffer, { flag: "wx" });
    await rename(tempPath, finalPath);
  } catch (error) {
    await unlink(tempPath).catch(() => undefined);
    throw error;
  }

  return NextResponse.json({ url: `/uploads/${filename}` });
}
