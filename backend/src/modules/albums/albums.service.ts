import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const albums = await this.prisma.album.findMany({
      include: {
        artist: true,
        _count: {
          select: { songs: true },
        },
      },
      orderBy: { title: 'asc' },
    });

    return albums.map((album) => this.toPublicAlbum(album));
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
      include: {
        artist: true,
        songs: {
          select: {
            id: true,
            title: true,
            durationSeconds: true,
            format: true,
            trackNumber: true,
            discNumber: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return this.toPublicAlbum(album);
  }

  async create(dto: CreateAlbumDto) {
    const artist = await this.prisma.artist.findUnique({ where: { id: dto.artistId } });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return this.prisma.album.create({
      data: {
        title: dto.title.trim(),
        artistId: dto.artistId,
        coverKey: dto.coverKey,
        releaseYear: dto.releaseYear,
      },
      include: { artist: true },
    });
  }

  private toPublicAlbum<T extends { coverKey: string | null }>(
    album: T,
  ): Omit<T, 'coverKey'> & { hasCover: boolean } {
    const { coverKey, ...publicAlbum } = album;

    return {
      ...publicAlbum,
      hasCover: Boolean(coverKey),
    };
  }
}
