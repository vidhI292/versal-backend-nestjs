import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserQueryDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 1)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Limit per page', example: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 10)
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search by name or email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Sort by column', example: 'id' })
  @IsOptional()
  @IsString()
  sortBy: string = 'id';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['ASC', 'DESC'], example: 'ASC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'ASC';
}
