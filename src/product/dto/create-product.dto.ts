import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Enter product name', example: 'Cake' })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ description: 'Enter product image path', example: '/bakery/cupcake.jpg' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ description: 'Enter product price', example: 10.25 })
  @IsNumber()
  @IsNotEmpty()
  price?: number;

  @ApiProperty({ description: 'Enter product description', example: 'Fresh cream and chocolate cupcake' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Enter product weight in KG', example: 0.5 })
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({ description: 'Enter product quantity', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'Category ID to link the product', example: 3 })
  @IsNumber()
  @IsNotEmpty()
  categoryId?: number;
}
