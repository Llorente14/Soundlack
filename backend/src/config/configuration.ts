export const configuration = () => ({
  port: Number(process.env.PORT ?? 3000),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  },
  admin: {
    username: process.env.ADMIN_USERNAME,
    passwordHash: process.env.ADMIN_PASSWORD_HASH,
  },
  publicApiKey: process.env.PUBLIC_API_KEY,
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`,
  storage: {
    driver: process.env.STORAGE_DRIVER ?? 'local',
    localDir: process.env.LOCAL_STORAGE_DIR ?? 'storage',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseBucket: process.env.SUPABASE_STORAGE_BUCKET ?? 'songs',
  },
  downloadUrlTtlSeconds: Number(process.env.DOWNLOAD_URL_TTL_SECONDS ?? 900),
  upload: {
    maxAudioUploadMb: Number(process.env.MAX_AUDIO_UPLOAD_MB ?? 100),
    maxCoverUploadMb: Number(process.env.MAX_COVER_UPLOAD_MB ?? 5),
  },
});
