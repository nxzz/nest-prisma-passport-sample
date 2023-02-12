import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, IsString, Length, Max, Min } from 'class-validator';

export class LocalLoginRequest {
    @ApiProperty({
        description: 'メールアドレス',
        example: 'user01@example.com'
    })
    @IsEmail()
    @Length(1, 64)
    readonly email: string;

    @ApiProperty({
        description: 'パスワード',
        example: 'password'
    })
    @IsString()
    @Length(1, 64)
    readonly password: string;

}

export class LocalSignupRequest {
    @ApiProperty({
        description: 'メールアドレス',
        example: 'user01@example.com'
    })
    @IsEmail()
    @Length(1, 64)
    readonly email: string;

    @ApiProperty({
        description: 'パスワード',
        example: 'password'
    })
    @IsString()
    @Length(1, 64)
    readonly password: string;

    @ApiProperty({
        description: '名前',
        example: 'name'
    })
    @IsString()
    @Length(1, 64)
    readonly name: string;
}