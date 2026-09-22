import { validateProductionEnv } from "@/lib/runtime-env";

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    validateProductionEnv();
  }
}
