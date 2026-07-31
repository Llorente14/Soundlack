import 'package:dartz/dartz.dart';
import 'package:frontend/core/error/failure.dart';
import 'package:frontend/core/usecase/usecase.dart';
import 'package:frontend/features/artist/domain/entities/artist.dart';
import 'package:frontend/features/artist/domain/repositories/artist_repository.dart';

class CreateArtistUsecase implements UseCase<Artist, CreateArtistParams> {
  final ArtistRepository artistRepository;

  CreateArtistUsecase({required this.artistRepository});

  @override
  Future<Either<Failure, Artist>> call(CreateArtistParams params) {
    return artistRepository.createArtist(params);
  }
}
