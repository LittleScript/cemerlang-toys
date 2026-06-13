import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      status: string;
      whatsapp: string | null;
      address: string | null;
      storeName: string | null;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: string;
    status: string;
    whatsapp: string | null;
    address: string | null;
    storeName: string | null;
  }
}
