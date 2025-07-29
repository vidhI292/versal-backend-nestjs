import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Product')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //  Both Admin and User can create a product
  @Roles('admin', 'user')
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
  ) {
    return await this.productService.createProduct(createProductDto, req.user);
  }

  //  Admin can get all products with filters
  @Roles('admin')
  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'created_at' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @ApiQuery({ name: 'search', required: false, example: 'cake' })
  async getAllProduct(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'created_at',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
    @Query('search') search?: string,
  ) {
    return await this.productService.getAllProduct({
      page: Number(page),
      limit: Number(limit),
      sortBy,
      sortOrder,
      search,
    });
  }

  //  Admin and User both can get product by ID
  @Roles('admin', 'user')
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(Number(id));
  }

  //  Admin can update product
  @Roles('admin')
  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(
      Number(id),
      updateProductDto,
    );
  }

  //  Admin can delete product
  @Roles('admin')
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(Number(id));
  }
}
