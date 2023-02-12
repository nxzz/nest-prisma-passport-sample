import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UserAdminResponseBase {

    @ApiProperty({
        description: 'ID',
        example: 1,
        type: "integer",
        format: "int64"
    })
    @IsInt()
    readonly id: number;

    @ApiProperty({
        description: 'ニックネーム',
        example: 'hogehogehoge',
        nullable: true
    })
    @IsString()
    @Length(1, 128)
    readonly name: string | null;

    @ApiProperty({
        description: '作成時刻',
        example: '2022-03-02T14:04:30.251Z'
    })
    @IsString()
    readonly createdAt: Date;

    @ApiProperty({
        description: '更新時刻',
        example: '2022-03-02T14:04:30.251Z'
    })
    @IsString()
    readonly updatedAt: Date;

    constructor(user: User) {
        this.id = user.id;
        this.createdAt = user.updatedAt;
        this.updatedAt = user.updatedAt;
    }
}

export class UserAdminResponse extends UserAdminResponseBase {

    constructor(user: User) {
        super(user);
    }
}

export class UserManyAdminResponse {
    @ApiProperty({
        description: '全体の件数',
        example: 0,
        type: "integer",
        format: "int64"
    })
    @IsInt()
    readonly count: number;

    @ApiProperty({
        description: 'ユーザ',
        type: [UserAdminResponse],
    })
    @IsArray({ context: UserAdminResponse })
    readonly users: UserAdminResponse[];
}

export class UserFilterQuery {
    @ApiPropertyOptional({
        description: 'ページ',
        example: 1
    })
    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    readonly page?: number = 1;

    @ApiPropertyOptional({
        description: '1ページ当たりの件数',
        example: 100
    })
    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    readonly perPage?: number = 100;
}