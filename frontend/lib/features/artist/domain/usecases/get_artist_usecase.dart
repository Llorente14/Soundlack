import 'package:dartz/dartz.dart';
import 'package:frontend/core/error/failure.dart';
import 'package:frontend/core/usecase/usecase.dart';
import 'package:frontend/features/artist/domain/entities/artist.dart';
import 'package:frontend/features/artist/domain/repositories/artist_repository.dart';

class GetArtistUsecase implements UseCase<List<Artist>, NoParams> {
  final ArtistRepository artistRepository;

  GetArtistUsecase({required this.artistRepository});

  @override
  Future<Either<Failure, List<Artist>>> call(NoParams params) {
    return artistRepository.getArtist();
  }
}
