import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsJWT, IsString, Length, IsBoolean } from 'class-validator';

export class LoginResponse {
    @ApiProperty({
        description: 'アクセストークン',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    })
    @IsJWT()
    readonly accessToken: string;

    @ApiProperty({
        description: 'リフレッシュトークン',
        example: '4bEB1Y9TAr4LB93p2vp3vnkNLXLa5JDA7lMGu96120XcYi3KUir+L48yIoc3aiPJ/ZUp2T+eIsXu2ETDK8Oc+HBOpZ+fZ3mfoZalRWNcG9ZeKKwCYVsNtENV5PQ+VfOs'
    })
    @IsJWT()
    readonly refreshToken: string;
}

export class ToeknCheckResponse {
    @ApiProperty({
        description: '有効性チェック',
        example: true
    })
    @IsBoolean()
    readonly valid: boolean;
}
