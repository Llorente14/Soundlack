import 'package:frontend/features/artist/data/models/artist_response_model.dart';

abstract class ArtistRemoteDataSource {
  Future<List<ArtistResponseModel>> getArtist();
}
