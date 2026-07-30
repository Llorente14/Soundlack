import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('local/:token')
  async downloadLocal(
    @Param('token') token: string,
    @Query('signature') signature: string | undefined,
    @Res() response: Response,
  ): Promise<void> {
    const path = await this.storageService.resolveLocalDownload(token, signature);
    response.download(path);
  }
}
