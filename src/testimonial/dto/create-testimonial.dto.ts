
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateTestimonialDto {

  @ApiProperty({
    description:"Enter Description ",
    example:"Soft, fresh, tasty, perfect cake!"
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description:"Enter person image",
    example:"user/bakery/cake.png"
  })
  @IsOptional()
  @IsString()
  person_image?: string;

  @ApiProperty({
    description:"Enter person name",
    example:"john doe"
  })
  @IsNotEmpty()
  @IsString()
  person_name: string;

  @ApiProperty({
    description:"Enter review ",
    example:"3"
  })
  @IsInt()
  @Min(1)
  @Max(5)
  review: number;
}
