import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateCheckoutDto {
  @ApiProperty({ example: 5, description: 'Cart ID' })
  @IsInt()
  @IsNotEmpty()
  cart_id: number;

  @ApiProperty({
    example: '123, MG Road, Mumbai',
    description: 'Shipping address',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  shipping_address: string;

  @ApiProperty({
    example: 'Credit Card',
    description: 'Payment method',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  payment_method: string;

  @ApiProperty({
    example: '**** **** **** 1234',
    description: 'Card details',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  card_details?: string;

  @ApiProperty({
    example: 'SUMMER50',
    description: 'Offer code',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  offer_code?: string;
}
