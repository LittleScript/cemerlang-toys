import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;
      session.user.status = user.status;
      session.user.whatsapp = user.whatsapp;
      session.user.address = user.address;
      session.user.storeName = user.storeName;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      const adminEmails = (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);

      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN", status: "APPROVED" },
        });
      }
    },
  },
});
