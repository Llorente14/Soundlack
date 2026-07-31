part of 'artist_bloc.dart';

abstract class ArtistState extends Equatable {
  const ArtistState();  

  @override
  List<Object> get props => [];
}
class ArtistInitial extends ArtistState {}
