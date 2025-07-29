import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';
import { Role } from 'src/enums/User-Role.enum';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Enter Your Name',
    example: 'john doe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Enter DOB',
    example: '2024-07-17',
  })
  @IsDateString()
  @IsOptional()
  date_of_birth?: Date;

  @ApiProperty({
    description: 'Enter Your Email',
    example: 'john123@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Enter Your Password',
    example: 'password@123',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Enter Your role',
    example: 'admin',
    enum: Role,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
