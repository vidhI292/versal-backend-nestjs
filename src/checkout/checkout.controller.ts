import {Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request,Query,} from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Checkout')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  //  Create checkout (admin/user)
  @Roles('admin', 'user')
  @Post()
  async create(@Body() dto: CreateCheckoutDto, @Request() req: any) {
    const userId = req.user.sub;
    return this.checkoutService.createCheckout(dto, userId);
  }

  //  Get all checkouts (admin sees all, user sees only their own)
  @Roles('admin', 'user')
  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'created_at' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], example: 'DESC' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'created_at',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
    @Request() req: any,
  ) {
    return this.checkoutService.getAllCheckouts(
      { page, limit, sortBy, sortOrder },
      req.user.sub,
      req.user.role,
    );
  }

  // Get single checkout
  @Roles('admin', 'user')
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.checkoutService.getCheckoutById(+id, req.user.sub, req.user.role);
  }

  //  Update checkout
  @Roles('admin', 'user')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCheckoutDto,
    @Request() req: any,
  ) {
    return this.checkoutService.updateCheckout(+id, dto, req.user.sub, req.user.role);
  }

  //  Delete checkout
  @Roles('admin', 'user')
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.checkoutService.deleteCheckout(+id, req.user.sub, req.user.role);
  }
}
