import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuardPayload } from '../dto/authguard.payload';
import { TokenAuthService } from '../token/token.service';
import e from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: AuthGuardPayload) {
    return payload;
  }
}

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
      passReqToCallback: true
    }, async (req, payload: AuthGuardPayload, valid) => {
      if (payload.permission !== "ADMIN") {
        return valid(new UnauthorizedException());
      }
      return valid(null, payload);
    });
  }
}
