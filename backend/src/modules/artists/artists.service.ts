import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.artist.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        albums: {
          select: {
            id: true,
            title: true,
            releaseYear: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async create(dto: CreateArtistDto) {
    try {
      return await this.prisma.artist.create({
        data: {
          name: dto.name.trim(),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Artist already exists');
      }

      throw error;
    }
  }
}
