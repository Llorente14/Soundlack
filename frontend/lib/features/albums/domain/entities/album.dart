import 'package:frontend/features/artists/domain/entities/artist.dart';

class Album {
  final int id;
  final String title;
  final String artistId;
  final int releaseYear;
  final DateTime createdAt;
  final DateTime updatedAt;
  final Artist artist;
  final int songsCount;
  final bool hasCover;

  Album({
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
}
