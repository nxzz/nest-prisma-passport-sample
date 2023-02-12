import { UserRefreshTokenRepository } from './../prisma/repository/user-refresh-token.repository';
import { compare } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserRepository } from '../prisma/repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private userRefreshTokenRepository: UserRefreshTokenRepository,
  ) { }

  // ローカルログイン用
  async validateLocalUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findFirst({
      where: {
        email: email
      }
    });
    if (user && await compare(password, user.password)) {
      return user;
    }
    return null;
  }

}
