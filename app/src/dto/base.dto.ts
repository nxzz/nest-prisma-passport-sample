import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class SystemDate {
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

    @ApiProperty({
        description: '削除時刻',
        example: '2022-03-02T14:04:30.251Z'
    })
    @IsString()
    readonly deletedAt: Date | null;

    constructor(date: SystemDate) {
        this.createdAt = date.createdAt;
        this.updatedAt = date.updatedAt;
    }
}


export class ErrorCodeResponse {

    @ApiProperty({
        description: 'レスポンスコード',
        example: 418,
        type: "integer",
        format: "int64"
    })
    @IsNumber()
    readonly statusCode: number;


    @ApiProperty({
        description: 'エラーメッセージ',
        example: 'I\'m a teapot'
    })
    @IsString()
    readonly message: string;
}