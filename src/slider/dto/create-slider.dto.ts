import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSliderDto {
  @ApiProperty({
    description: 'Enter image URL',
    example: '/v/cat2.jpg',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({
    description: 'Enter slider title',
    example: 'Welcome Banner',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Enter slider description',
    example: 'This is the main homepage banner with summer offers',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
