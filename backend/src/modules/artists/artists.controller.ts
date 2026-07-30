import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OptionalApiKeyGuard } from '../../common/guards/optional-api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';

@Controller()
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get('artists')
  @UseGuards(OptionalApiKeyGuard)
  findAll() {
    return this.artistsService.findAll();
  }

  @Get('artists/:id')
  @UseGuards(OptionalApiKeyGuard)
  findOne(@Param('id') id: string) {
    return this.artistsService.findOne(id);
  }

  @Post('admin/artists')
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateArtistDto) {
    return this.artistsService.create(dto);
  }
}
