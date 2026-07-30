import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import { promises as fs } from 'fs';
import { join, normalize } from 'path';

type StorageDriver = 'local' | 'supabase';

type UploadInput = {
  file: Express.Multer.File;
  folder: 'audio' | 'covers';
  entityId?: string;
};

@Injectable()
export class StorageService {
  private readonly driver: StorageDriver;
  private readonly supabase?: SupabaseClient;

  constructor(private readonly config: ConfigService) {
    this.driver = this.config.get<StorageDriver>('storage.driver') ?? 'local';

    if (this.driver === 'supabase') {
      const url = this.config.get<string>('storage.supabaseUrl');
      const key = this.config.get<string>('storage.supabaseServiceRoleKey');

      if (!url || !key) {
        throw new InternalServerErrorException('Supabase storage is not configured');
      }

      this.supabase = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    }
  }

  async upload(input: UploadInput): Promise<string> {
    const key = this.makeObjectKey(input);

    if (this.driver === 'local') {
      const path = this.localPath(key);
      await fs.mkdir(join(path, '..'), { recursive: true });
      await fs.writeFile(path, input.file.buffer);
      return key;
    }

    const { error } = await this.supabaseClient()
      .storage
      .from(this.supabaseBucket())
      .upload(key, input.file.buffer, {
        contentType: input.file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return key;
  }

  async deleteObject(key: string | null | undefined): Promise<void> {
    if (!key) {
      return;
    }

    if (this.driver === 'local') {
      await fs.rm(this.localPath(key), { force: true });
      return;
    }

    const { error } = await this.supabaseClient()
      .storage
      .from(this.supabaseBucket())
      .remove([key]);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getPresignedDownloadUrl(key: string, expiresInSeconds: number): Promise<string> {
    if (this.driver === 'local') {
      const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
      const token = Buffer.from(JSON.stringify({ key, expires })).toString('base64url');
      const signature = this.sign(token);
      const baseUrl = this.config.get<string>('publicBaseUrl') ?? 'http://localhost:3000';

      return `${baseUrl}/storage/local/${token}?signature=${signature}`;
    }

    const { data, error } = await this.supabaseClient()
      .storage
      .from(this.supabaseBucket())
      .createSignedUrl(key, expiresInSeconds, {
        download: true,
      });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data.signedUrl;
  }

  async resolveLocalDownload(token: string, signature: string | undefined): Promise<string> {
    if (this.driver !== 'local') {
      throw new NotFoundException('Local storage is disabled');
    }

    if (!signature || !this.verify(token, signature)) {
      throw new UnauthorizedException('Invalid download signature');
    }

    const payload = JSON.parse(Buffer.from(token, 'base64url').toString('utf8')) as {
      key?: string;
      expires?: number;
    };

    if (!payload.key || !payload.expires || payload.expires < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Download URL expired');
    }

    const path = this.localPath(payload.key);

    try {
      await fs.access(path);
      return path;
    } catch {
      throw new NotFoundException('File not found');
    }
  }

  private supabaseClient(): SupabaseClient {
    if (!this.supabase) {
      throw new InternalServerErrorException('Supabase client is not configured');
    }

    return this.supabase;
  }

  private supabaseBucket(): string {
    return this.config.get<string>('storage.supabaseBucket') ?? 'songs';
  }

  private localPath(key: string): string {
    const baseDir = normalize(join(process.cwd(), this.config.get<string>('storage.localDir') ?? 'storage'));
    const targetPath = normalize(join(baseDir, key));

    if (!targetPath.startsWith(baseDir)) {
      throw new UnauthorizedException('Invalid storage key');
    }

    return targetPath;
  }

  private makeObjectKey(input: UploadInput): string {
    const safeName = input.file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '-')
      .replace(/-+/g, '-');

    return `${input.folder}/${input.entityId ?? randomUUID()}-${Date.now()}-${safeName}`;
  }

  private sign(value: string): string {
    return createHmac('sha256', this.config.getOrThrow<string>('jwt.secret'))
      .update(value)
      .digest('base64url');
  }

  private verify(value: string, signature: string): boolean {
    const expected = Buffer.from(this.sign(value));
    const actual = Buffer.from(signature);

    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }
}
