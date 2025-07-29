import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
          description: 'Enter Your Email',
          example: 'john123@gmail.com',
      })
  @IsEmail()
  email: string;

  @ApiProperty({
        description: 'Enter Your Password',
        example: 'password@123',
    })
  @IsString()
  password: string;
}
