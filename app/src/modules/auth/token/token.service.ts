import { UserRefreshTokenRepository } from '../../prisma/repository/user-refresh-token.repository';
import { compare } from 'bcrypt';
import { randomBytes } from 'crypto';
import { DateTime } from "luxon";
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRefreshToken } from '@prisma/client';
import { AuthGuardPayload } from '../dto/authguard.payload';
import { LoginResponse } from '../dto/login.dto';

@Injectable()
export class TokenAuthService {
    constructor(
        private jwtService: JwtService,
        private userRefreshTokenRepository: UserRefreshTokenRepository,
    ) { }

    async validateRefreshToken(refreshToken: string): Promise<UserRefreshToken & { user: User; } | null> {
        const tokens = await this.userRefreshTokenRepository.findUnique({
            where: {
                refreshToken: refreshToken
            },
            include: {
                user: true
            }
        });
        if (tokens && DateTime.now().toUnixInteger() < DateTime.fromJSDate(tokens.expiresAt).toUnixInteger()) {
            return tokens;
        }
        return null;
    }


    async getNewToken(payload: AuthGuardPayload): Promise<LoginResponse> {
        const tokens = await this.userRefreshTokenRepository.create({
            data: {
                accessToken: this.signToken(payload),
                refreshToken: this.genRefreshToken(),
                expiresAt: DateTime.now().plus({ month: 3 }).toJSDate(),
                userId: payload.userId,
            }
        });
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        }
    }

    async updateToken(refreshToken: string, payload: AuthGuardPayload): Promise<LoginResponse> {
        const tokens = await this.userRefreshTokenRepository.update({
            where: {
                refreshToken: refreshToken
            },
            data: {
                accessToken: this.signToken({
                    userId: payload.userId,
                    permission: payload.permission
                }),
                refreshToken: this.genRefreshToken(),
                expiresAt: DateTime.now().plus({ second: Number(process.env.REFRESH_TOKEN_LIFESPAN) }).toJSDate(),
            }
        });
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        }
    }

    private genRefreshToken() {
        return randomBytes(128).toString('base64').substring(0, 128);
    }

    private signToken(payload: AuthGuardPayload): string {
        return this.jwtService.sign(payload);
    }
}
