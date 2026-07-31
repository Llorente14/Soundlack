import 'package:dartz/dartz.dart';
import 'package:frontend/core/error/failure.dart';
import 'package:frontend/features/artist/domain/entities/artist.dart';

abstract class ArtistRepository {
  Future<Either<Failure, List<Artist>>> getArtist();
}
