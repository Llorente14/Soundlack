import 'package:dartz/dartz.dart';
import 'package:frontend/core/error/exception.dart';
import 'package:frontend/core/error/failure.dart';
import 'package:frontend/core/usecase/usecase.dart';
import 'package:frontend/features/artists/data/datasources/artist_remote_datasource.dart';
import 'package:frontend/features/artists/data/models/artist_response_model.dart';
import 'package:frontend/features/artists/data/models/create_artist_request_model.dart';
import 'package:frontend/features/artists/domain/entities/artist.dart';
import 'package:frontend/features/artists/domain/repositories/artist_repository.dart';

class ArtistRepositoryImpl implements ArtistRepository {
  final ArtistRemoteDataSource artistRemoteDataSource;

  ArtistRepositoryImpl({required this.artistRemoteDataSource});
  @override
  Future<Either<Failure, List<Artist>>> getArtist() async {
    try {
      final model = await artistRemoteDataSource.getArtist();
      return Right(model.map((artist) => artist.toEntity()).toList());
    } on ServerException {
      return Left(ServerFailure());
    } on NetworkException {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, Artist>> createArtist(
    CreateArtistParams params,
  ) async {
    try {
      final model = CreateArtistRequestModel.fromParams(params);
      final result = await artistRemoteDataSource.createArtist(model);
      return Right(result.toEntity());
    } on ServerException {
      return Left(ServerFailure());
    } on NetworkException {
      return Left(NetworkFailure());
    }
  }
}
