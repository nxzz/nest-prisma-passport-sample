import { TokenAuthService } from './token.service';
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiSecurity } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginResponse, ToeknCheckResponse } from '../dto/login.dto';
import { AuthGuardPayload } from '../dto/authguard.payload';
import { Request } from 'express';


@Controller('')
export class TokenAuthController {
    constructor(
        private tokenAuthService: TokenAuthService,
    ) { }


    @Post('refresh')
    @ApiTags('tokenAuth')
    @ApiSecurity('refresh-token')
    @UseGuards(AuthGuard('refresh-token'))
    @ApiResponse({
        status: 201,
        description: 'トークンリフレッシュ',
        type: LoginResponse,
    })
    async refresh(
        @Req() expressReq
    ): Promise<LoginResponse> {
        const payload = expressReq.user as AuthGuardPayload;

        // トークンを新規発行して返す
        return await this.tokenAuthService.updateToken(expressReq.headers['x-refresh-token'], payload);
    }

    // JWT有効性チェック
    @Get('check')
    @ApiTags('tokenAuth')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({
        status: 201,
        description: 'JWT有効性チェック',
        type: ToeknCheckResponse,
    })
    async checkToken(@Req() req: Request): Promise<ToeknCheckResponse> {
        // ここにはjwtログインが通ってないと来ない
        return {
            valid: true
        };
    }
}
