
import { Strategy } from 'passport-strategy';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuardPayload } from '../dto/authguard.payload';
import { Request } from 'express';
import { TokenAuthService } from '../token/token.service';

class _RefreshTokenStrategy extends Strategy {

  name: string;
  verify: (apiKey: string, verified: (err: Error | null, user?: Object, info?: Object) => void, req?: Request) => void;

  constructor(header: { header: string, prefix: string }, passReqToCallback: boolean,
    verify: (apiKey: string, verified: (err: Error | null, user?: Object, info?: Object) => void, req?: Request) => void) {
    super();
    this.verify = verify;
  }

  authenticate(req: Request): void {
    // ヘッダーからリフレッシュトークンを取る
    const apiKey: string = req.headers['x-refresh-token'] as string;
    if (!apiKey) {
      // 無ければエラー
      throw new UnauthorizedException();
    }

    let verified = (err: Error | null, user?: Object, info?: Object) => {
      if (err) {
        return this.error(err);
      }
      if (!user) {
        return this.fail(info, null);
      }
      this.success(user, info);
    };

    this.verify(apiKey, verified);
  }
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(_RefreshTokenStrategy, 'refresh-token') {
  constructor(
    private tokenAuthService: TokenAuthService
  ) {
    super({}, req => {
    });
  }

  async validate(payload: string): Promise<AuthGuardPayload> {
    // リフレッシュトークンを検索
    const userRefreshToken = await this.tokenAuthService.validateRefreshToken(payload);
    // 無ければエラー
    if (!userRefreshToken) throw new UnauthorizedException();
    return {
      userId: userRefreshToken.userId,
      permission: userRefreshToken.user.permission
    };
  }
}
