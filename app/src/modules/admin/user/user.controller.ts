import { UserRepository } from './../../prisma/repository/user.repository';
import { Controller, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserAdminResponse, UserAdminResponseBase, UserFilterQuery, UserManyAdminResponse } from './dto/crud.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { ErrorCodeResponse } from 'src/dto/base.dto';

@Controller()
@ApiTags('User')
@UseGuards(AuthGuard('jwt-admin'))
@ApiBearerAuth()
@ApiResponse({
    status: 404,
    description: '要素がみつかりません',
    type: ErrorCodeResponse
})
export class UserAdminController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly prismaService: PrismaService
    ) {
    }

    @Get('/:userId')
    @ApiOperation({ summary: 'ユーザの情報をひとつ取得' })
    @ApiResponse({
        status: 200,
        description: '正常終了',
        type: UserAdminResponse
    })
    async read(
        @Param('userId') userId: number,
    ): Promise<UserAdminResponse> {
        const result = await this.userRepository.findFirst({
            where: {
                id: userId
            }
        });
        if (!result) {
            throw new NotFoundException();
        }
        return new UserAdminResponse(result);
    }

    @Get('/')
    @ApiOperation({ summary: 'ユーザの一覧を取得' })
    @ApiResponse({
        status: 200,
        description: '正常終了',
        type: UserManyAdminResponse
    })
    async readMany(
        @Query() filter: UserFilterQuery,
    ): Promise<UserManyAdminResponse> {
        const result = await this.userRepository.findMany({
            take: filter.perPage,
            skip: (filter.page - 1) * filter.perPage,
        });
        const count = await this.userRepository.count();
        return {
            count: count,
            users: result.map(item => new UserAdminResponseBase(item))
        };

    }
}
