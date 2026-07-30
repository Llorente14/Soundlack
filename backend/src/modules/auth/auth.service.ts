import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string; expiresIn: string }> {
    const adminUsername = this.config.getOrThrow<string>('admin.username');
    const passwordHash = this.config.getOrThrow<string>('admin.passwordHash');

    const usernameMatches = dto.username === adminUsername;
    const passwordMatches = await bcrypt.compare(dto.password, passwordHash);

    if (!usernameMatches || !passwordMatches) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return {
      accessToken: await this.jwt.signAsync({
        sub: adminUsername,
        username: adminUsername,
      }),
      expiresIn: this.config.get<string>('jwt.expiresIn') ?? '1h',
    };
  }
}
