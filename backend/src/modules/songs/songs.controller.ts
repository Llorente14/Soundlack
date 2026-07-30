import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { OptionalApiKeyGuard } from '../../common/guards/optional-api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSongDto } from './dto/create-song.dto';
import { QuerySongsDto } from './dto/query-songs.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongsService } from './songs.service';

type SongUploadFiles = {
  file?: Express.Multer.File[];
  cover?: Express.Multer.File[];
};

@Controller()
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    private readonly config: ConfigService,
  ) {}

  @Get('songs')
  @UseGuards(OptionalApiKeyGuard)
  findAll(@Query() query: QuerySongsDto) {
    return this.songsService.findAll(query);
  }

  @Get('songs/:id')
  @UseGuards(OptionalApiKeyGuard)
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(id);
  }

  @Get('songs/:id/download')
  @UseGuards(OptionalApiKeyGuard)
  getDownloadUrl(@Param('id') id: string) {
    return this.songsService.getDownloadUrl(id);
  }

  @Post('admin/songs')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
      ],
      {
        limits: {
          fileSize: 100 * 1024 * 1024,
        },
      },
    ),
  )
  create(@Body() dto: CreateSongDto, @UploadedFiles() files: SongUploadFiles) {
    const audio = files.file?.[0];
    const cover = files.cover?.[0];

    this.validateAudio(audio);
    this.validateCover(cover);

    return this.songsService.create(dto, audio, cover);
  }

  @Patch('admin/songs/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateSongDto) {
    return this.songsService.update(id, dto);
  }

  @Delete('admin/songs/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.songsService.remove(id);
  }

  private validateAudio(file: Express.Multer.File | undefined): asserts file is Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }

    const maxBytes = (this.config.get<number>('upload.maxAudioUploadMb') ?? 100) * 1024 * 1024;
    const allowedMimeTypes = ['audio/mpeg', 'audio/flac', 'audio/x-flac'];
    const allowedExtensions = ['.mp3', '.flac'];
    const lowerName = file.originalname.toLowerCase();

    if (file.size > maxBytes) {
      throw new BadRequestException('Audio file is too large');
    }

    if (
      !allowedMimeTypes.includes(file.mimetype) &&
      !allowedExtensions.some((extension) => lowerName.endsWith(extension))
    ) {
      throw new BadRequestException('Audio file must be MP3 or FLAC');
    }
  }

  private validateCover(file: Express.Multer.File | undefined): void {
    if (!file) {
      return;
    }

    const maxBytes = (this.config.get<number>('upload.maxCoverUploadMb') ?? 5) * 1024 * 1024;
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxBytes) {
      throw new BadRequestException('Cover file is too large');
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Cover file must be JPG, PNG, or WEBP');
    }
  }
}
