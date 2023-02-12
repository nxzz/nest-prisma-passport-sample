import { AuthService } from './auth.service';
import { Controller, Req, UseGuards, Post, Body } from '@nestjs/common';
import { TokenAuthService } from './token/token.service';

@Controller('')
export class AuthController {
  constructor() { }

}

