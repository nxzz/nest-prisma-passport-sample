import { UserAuthService } from './user.service';
import { Body, Controller, Get, Post, Req, UseGuards, NotFoundException, Put, PreconditionFailedException, Delete, ConflictException } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoginResponse } from '../dto/login.dto';
import { TokenAuthService } from '../token/token.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardPayload } from '../dto/authguard.payload';
import { UserRepository } from 'src/modules/prisma/repository/user.repository';
import { LocalLoginRequest, LocalSignupRequest } from './dto/exec.dto';
import { Details } from 'express-useragent';

@Controller()
@ApiTags('user')
export class UserAuthController {
    constructor(
        private userAuthService: UserAuthService,
        private tokenAuthService: TokenAuthService,
        private userRepository: UserRepository,
    ) { }

    @Post('signup')
    @ApiOperation({ summary: '会員登録' })
    @ApiResponse({
        status: 200,
        description: '正常終了',
        type: LoginResponse
    })
    async signup(
        @Body() req: LocalSignupRequest,
    ): Promise<LoginResponse> {
        // 会員登録処理
        const user = await this.userAuthService.signup(req.name, req.email, req.password);
        const res = await this.tokenAuthService.getNewToken({
            userId: user.id,
            permission: user.permission
        });
        return res;
    }

    @Delete('destroy')
    @UseGuards(AuthGuard('jwt-strict'))
    @ApiOperation({ summary: 'アカウント関連データの削除' })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: '正常終了'
    })
    async destroy(
        @Req() request: Request & { user: AuthGuardPayload }
    ): Promise<void> {
        // 退会処理
        await this.userAuthService.destroy(request.user.userId);
    }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    @ApiOperation({ summary: 'ID/PW ログイン' })
    @ApiResponse({
        status: 201,
        type: LoginResponse,
    })
    async login(
        @Body() req: LocalLoginRequest,
        @Req() expressReq
    ): Promise<LoginResponse> {
        // ここにはローカルID認証が通ってないと来ない
        const payload = expressReq.user as AuthGuardPayload;

        const res = await this.tokenAuthService.getNewToken(payload);
        return res;
    }
}
