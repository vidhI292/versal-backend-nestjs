import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    description: 'Enter quantity',
    example: 2,
  })
  @IsInt()
  quantity: number;

  @ApiProperty({
    description: 'Enter total price',
    example: 199.99,
  })
  @IsNumber()
  total_price: number;

  @ApiProperty({
    description: 'User ID who owns the cart',
    example: 1,
  })
  @IsInt()
  user_id: number;

  @ApiProperty({
    description: 'Product ID to add in cart',
    example: 1,
  })
  @IsInt()
  product_id: number;
}
