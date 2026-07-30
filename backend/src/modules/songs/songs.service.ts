import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, SongFormat } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateSongDto } from './dto/create-song.dto';
import { QuerySongsDto } from './dto/query-songs.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly config: ConfigService,
  ) {}

  async findAll(query: QuerySongsDto) {
    const where: Prisma.SongWhereInput = {
      artistId: query.artistId,
      albumId: query.albumId,
      format: query.format,
      title: query.search
        ? {
            contains: query.search,
            mode: 'insensitive',
          }
        : undefined,
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.song.findMany({
        where,
        include: {
          artist: true,
          album: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.song.count({ where }),
    ]);

    return {
      data: data.map((song) => this.toPublicSong(song)),
      page: query.page,
      limit: query.limit,
      total,
    };
  }

  async findOne(id: string) {
    const song = await this.prisma.song.findUnique({
      where: { id },
      include: {
        artist: true,
        album: true,
      },
    });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    return this.toPublicSong(song);
  }

  async create(
    dto: CreateSongDto,
    audio: Express.Multer.File,
    cover?: Express.Multer.File,
  ) {
    await this.ensureRelations(dto.artistId, dto.albumId);

    const audioKey = await this.storage.upload({
      file: audio,
      folder: 'audio',
    });
    const coverKey = cover
      ? await this.storage.upload({
          file: cover,
          folder: 'covers',
        })
      : undefined;

    const song = await this.prisma.song.create({
      data: {
        title: dto.title.trim(),
        artistId: dto.artistId,
        albumId: dto.albumId,
        durationSeconds: dto.durationSeconds,
        format: dto.format as SongFormat,
        audioKey,
        fileSizeBytes: BigInt(audio.size),
        coverKey,
        trackNumber: dto.trackNumber,
        discNumber: dto.discNumber,
      },
      include: {
        artist: true,
        album: true,
      },
    });

    return this.toPublicSong(song);
  }

  async update(id: string, dto: UpdateSongDto) {
    const existing = await this.prisma.song.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Song not found');
    }

    await this.ensureRelations(dto.artistId, dto.albumId);

    const song = await this.prisma.song.update({
      where: { id },
      data: {
        title: dto.title?.trim(),
        artistId: dto.artistId,
        albumId: dto.albumId,
        durationSeconds: dto.durationSeconds,
        format: dto.format as SongFormat | undefined,
        trackNumber: dto.trackNumber,
        discNumber: dto.discNumber,
      },
      include: {
        artist: true,
        album: true,
      },
    });

    return this.toPublicSong(song);
  }

  async remove(id: string) {
    const song = await this.prisma.song.findUnique({ where: { id } });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    await this.prisma.song.delete({ where: { id } });
    await this.storage.deleteObject(song.audioKey);
    await this.storage.deleteObject(song.coverKey);

    return { deleted: true };
  }

  async getDownloadUrl(id: string) {
    const song = await this.prisma.song.findUnique({ where: { id } });

    if (!song) {
      throw new NotFoundException('Song not found');
    }

    const ttlSeconds = this.config.get<number>('downloadUrlTtlSeconds') ?? 900;
    const url = await this.storage.getPresignedDownloadUrl(song.audioKey, ttlSeconds);

    return {
      url,
      expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
    };
  }

  private async ensureRelations(artistId?: string, albumId?: string): Promise<void> {
    if (artistId) {
      const artist = await this.prisma.artist.findUnique({ where: { id: artistId } });

      if (!artist) {
        throw new NotFoundException('Artist not found');
      }
    }

    if (albumId) {
      const album = await this.prisma.album.findUnique({ where: { id: albumId } });

      if (!album) {
        throw new NotFoundException('Album not found');
      }
    }
  }

  private toPublicSong<T extends { fileSizeBytes: bigint; audioKey: string; coverKey: string | null }>(
    song: T,
  ): Omit<T, 'audioKey' | 'coverKey' | 'fileSizeBytes'> & { fileSizeBytes: string; hasCover: boolean } {
    const { audioKey: _audioKey, coverKey, fileSizeBytes, ...publicSong } = song;

    return {
      ...publicSong,
      fileSizeBytes: fileSizeBytes.toString(),
      hasCover: Boolean(coverKey),
    };
  }
}
