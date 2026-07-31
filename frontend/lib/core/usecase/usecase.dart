import 'package:dartz/dartz.dart';
import 'package:frontend/core/error/failure.dart';

abstract class UseCase<Result, Params> {
  Future<Either<Failure, Result>> call(Params params);
}

class NoParams {
  const NoParams();
}
