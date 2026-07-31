import 'package:dartz/dartz.dart';
import 'package:frontend/core/error/failure.dart';
import 'package:frontend/features/artists/data/models/artist_response_model.dart';

abstract class UseCase<Result, Params> {
  Future<Either<Failure, Result>> call(Params params);
}

class NoParams {
  const NoParams();
}

class CreateArtistParams {
  final String name;

  CreateArtistParams({required this.name});
}

class CreateAlbumParams {
  final String title;
  final String artistId;
  final String? coverKey;
  final int releaseYear;

  CreateAlbumParams({
    required this.title,
    required this.artistId,
    required this.coverKey,
    required this.releaseYear,
  });
}
