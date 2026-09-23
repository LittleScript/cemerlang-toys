"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isQaAuthEnabled, isQaUserId } from "@/lib/qa-auth";

export async function qaSignIn(formData: FormData) {
  if (!isQaAuthEnabled()) return;

  const userId = String(formData.get("userId") ?? "");
  if (!isQaUserId(userId)) return;

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!user) return;

  const sessionToken = randomUUID();
  await prisma.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
    },
  });

  const cookieStore = await cookies();
  cookieStore.set("authjs.session-token", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  redirect("/");
}

