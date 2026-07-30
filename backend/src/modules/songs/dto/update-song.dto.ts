import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength } from 'class-validator';
import { SongFormatDto } from './query-songs.dto';

export class UpdateSongDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(220)
  title?: string;

  @IsOptional()
  @IsUUID()
  artistId?: string;

  @IsOptional()
  @IsUUID()
  albumId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  durationSeconds?: number;

  @IsOptional()
  @IsEnum(SongFormatDto)
  format?: SongFormatDto;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  trackNumber?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  discNumber?: number;
}
