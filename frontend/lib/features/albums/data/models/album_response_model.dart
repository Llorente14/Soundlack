import 'package:frontend/features/artists/data/models/artist_response_model.dart';

class AlbumResponseModel {
  final int id;
  final String title;
  final String artistId;
  final int releaseYear;
  final DateTime createdAt;
  final DateTime updatedAt;
  final ArtistResponseModel artist;
  final int songsCount;
  final bool hasCover;

  AlbumResponseModel({
    required this.id,
    required this.title,
    required this.artistId,
    required this.releaseYear,
    required this.createdAt,
    required this.updatedAt,
    required this.artist,
    required this.songsCount,
    required this.hasCover,
  });

  // fromJson
  factory AlbumResponseModel.fromJson(Map<String, dynamic> json) {
    return AlbumResponseModel(
      id: json['id'] as int,
      title: json['title'],
      artistId: json['artistId'],
      releaseYear: json['releaseYear'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      artist: ArtistResponseModel.fromJson(json['artist']),
      songsCount: json['_count']['songs'],
      hasCover: json['hasCover'],
    );
  }
  // toJson
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'artistId': artistId,
      'releaseYear': releaseYear,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'artist': artist.toJson(),
      '_count': {'songs': songsCount},
      'hasCover': hasCover,
    };
  }
}
