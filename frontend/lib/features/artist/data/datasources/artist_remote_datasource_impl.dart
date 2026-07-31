import 'package:dio/dio.dart';
import 'package:frontend/core/error/exception.dart';
import 'package:frontend/features/artist/data/datasources/artist_remote_datasource.dart';
import 'package:frontend/features/artist/data/models/artist_response_model.dart';

class ArtistRemoteDatasourceImpl implements ArtistRemoteDataSource {
  final Dio dio;

  ArtistRemoteDatasourceImpl({required this.dio});

  @override
  Future<List<ArtistResponseModel>> getArtist() async {
    try {
      final response = await dio.get('/artist');
      final Map<String, dynamic> data = response.data;
      final List<dynamic> body = data['body'];

      return body
          .map((artistJson) => ArtistResponseModel.fromJson(artistJson))
          .toList();
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.connectionError) {
        throw NetworkException();
      } else {
        throw ServerException();
      }
    }
  }
}
