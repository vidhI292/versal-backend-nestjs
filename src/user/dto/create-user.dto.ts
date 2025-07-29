import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsDateString, IsEmail, IsInt, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: 'Enter Your Name',
        example: 'john doe',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Enter DOB',
        example: '2024-07-17',
    })
    @IsDateString()
    date_of_birth: Date;

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

    @ApiProperty({     
        description: 'Enter Your role',
        example: 'admin',
    })
    @IsString()
    role: string; 
}   