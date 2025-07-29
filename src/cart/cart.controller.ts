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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles('admin', 'user')
  @Post()
  async create(@Body() dto: CreateCartDto, @Request() req) {
    const userId = req.user.sub;
    return await this.cartService.createCart(dto, userId);
  }

  @Roles('admin', 'user')
  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'id' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'ASC', enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false, example: 'chocolate' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'id',
    @Query('sortOrder') sortOrder: 'DESC' | 'ASC' = 'DESC',
    @Query('search') search = '',
    @Request() req,
  ) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    return await this.cartService.getAllCart(
      { page, limit, sortBy, sortOrder, search },
      userId,
      userRole,
    );
  }

  @Roles('admin', 'user')
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    return await this.cartService.getCartById(Number(id), userId, userRole);
  }

  @Roles('admin', 'user')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCartDto, @Request() req) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    return await this.cartService.updateCart(Number(id), dto, userId, userRole);
  }

  @Roles('admin', 'user')
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    return await this.cartService.deleteCart(Number(id), userId, userRole);
  }
}
