import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Checkout ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  checkout_id: number;

  @ApiProperty({
    description: 'Subtotal amount',
    example: 500.00,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({
    description: 'Discount amount (optional)',
    example: 50.00,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @ApiProperty({
    description: 'Delivery fee (optional)',
    example: 30.00,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  delivery_fee?: number;

  @ApiProperty({
    description: 'Total amount after discount and delivery',
    example: 480.00,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  total_amount: number;
}
