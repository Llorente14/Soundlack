import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OptionalApiKeyGuard } from '../../common/guards/optional-api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';

@Controller()
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get('albums')
  @UseGuards(OptionalApiKeyGuard)
  findAll() {
    return this.albumsService.findAll();
  }

  @Get('albums/:id')
  @UseGuards(OptionalApiKeyGuard)
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(id);
  }

  @Post('admin/albums')
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateAlbumDto) {
    return this.albumsService.create(dto);
  }
}
