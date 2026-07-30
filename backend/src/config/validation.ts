type Env = Record<string, string | undefined>;

const requiredKeys = [
  'DATABASE_URL',
  'JWT_SECRET',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD_HASH',
] as const;

export function validateConfig(config: Env): Env {
  const missing = requiredKeys.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return config;
}
