const QA_DATABASE_NAME = "cemerlang_phase2d_qa";

function databaseName(connectionString: string | undefined): string | null {
  if (!connectionString) return null;
  try {
    return new URL(connectionString).pathname.replace(/^\//, "");
  } catch {
    return null;
  }
}

export function isQaAuthEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return (
    env.NODE_ENV !== "production" &&
    env.QA_AUTH_ENABLED === "true" &&
    databaseName(env.DATABASE_URL) === QA_DATABASE_NAME
  );
}

export function isQaUserId(userId: string): boolean {
  return userId.startsWith("qa-");
}

