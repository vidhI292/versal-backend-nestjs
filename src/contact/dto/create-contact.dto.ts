import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateContactDto {
    @ApiProperty({
        description: "Enter your First Name",
        example: "John",
    })
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @ApiProperty({
        description: "Enter your Last Name",
        example: "Doe",
    })
    @IsString()
    @IsNotEmpty()
    last_name: string;

    @ApiProperty({
        description: "Enter your Email ID",
        example: "johndoe@gmail.com",
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: "Enter your Phone Number (with country code)",
        example: "+919824588457",
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[+][0-9]{1,3}\s?[0-9]{10}$/, {
        message: "Phone number must be valid and include country code",
    })
    phone: string;

    @ApiProperty({
        description: "Enter your Subject",
        example: "Billing Question",
    })
    @IsString()
    @IsNotEmpty()
    subject: string;

    @ApiProperty({
        description: "Enter your Message",
        example: "Issue with my payment",
    })
    @IsString()
    @IsNotEmpty()
    message: string;
}
