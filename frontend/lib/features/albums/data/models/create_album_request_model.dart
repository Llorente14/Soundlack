import 'package:frontend/core/usecase/usecase.dart';

class CreateAlbumRequestModel {
  final String title;
  final String artistId;
  final String? coverKey;
  final int releaseYear;

  CreateAlbumRequestModel({
    required this.title,
    required this.artistId,
    required this.coverKey,
    required this.releaseYear,
  });

  // toJson
  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'artistId': artistId,
      'releaseYear': releaseYear,
      'coverKey': coverKey,
    };
  }

  factory CreateAlbumRequestModel.fromParams(CreateAlbumParams params) {
    return CreateAlbumRequestModel(
      title: params.title,
      artistId: params.artistId,
      coverKey: params.coverKey,
      releaseYear: params.releaseYear,
    );
  }
}
