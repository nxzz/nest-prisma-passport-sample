import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class UserLocalSignupRequest {
    @ApiProperty({
        description: 'ログインメールアドレス',
        example: 'user02@example.com'
    })
    @IsString()
    @Length(1, 128)
    readonly email: string;
}

