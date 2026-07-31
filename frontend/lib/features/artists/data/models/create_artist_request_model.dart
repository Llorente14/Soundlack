import 'package:frontend/core/usecase/usecase.dart';

class CreateArtistRequestModel {
  final String name;

  CreateArtistRequestModel({required this.name});

  // toJson
  Map<String, dynamic> toJson() {
    return {'name': name};
  }

  //fromParams
  factory CreateArtistRequestModel.fromParams(CreateArtistParams json) {
    return CreateArtistRequestModel(name: json.name);
  }
}
