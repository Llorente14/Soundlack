import 'package:frontend/features/artists/domain/entities/artist.dart';

class ArtistResponseModel {
  final int id;
  final String name;
  final DateTime createdAt;
  final DateTime updatedAt;

  ArtistResponseModel({
    required this.id,
    required this.name,
    required this.createdAt,
    required this.updatedAt,
  });

  //fromJson
  factory ArtistResponseModel.fromJson(Map<String, dynamic> json) {
    return ArtistResponseModel(
      id: json['id'] as int,
      name: json['name'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  //toJson
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

extension ArtistModelMapper on ArtistResponseModel {
  Artist toEntity() {
    return Artist(
      id: id,
      name: name,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}
