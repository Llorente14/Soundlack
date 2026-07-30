import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './config/configuration';
import { validateConfig } from './config/validation';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { SongsModule } from './modules/songs/songs.module';
import { StorageModule } from './modules/storage/storage.module';
import { OptionalApiKeyGuard } from './common/guards/optional-api-key.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateConfig,
    }),
    PrismaModule,
    StorageModule,
    AuthModule,
    ArtistsModule,
    AlbumsModule,
    SongsModule,
  ],
  controllers: [AppController],
  providers: [AppService, OptionalApiKeyGuard],
})
export class AppModule {}
