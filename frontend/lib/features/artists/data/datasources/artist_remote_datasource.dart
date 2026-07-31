import 'package:frontend/features/artists/data/models/artist_response_model.dart';
import 'package:frontend/features/artists/data/models/create_artist_request_model.dart';

abstract class ArtistRemoteDataSource {
  Future<List<ArtistResponseModel>> getArtist();
  Future<ArtistResponseModel> createArtist(CreateArtistRequestModel params);
}
