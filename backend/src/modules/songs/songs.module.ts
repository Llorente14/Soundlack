import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

@Module({
  imports: [StorageModule],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
