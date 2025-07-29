import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token') 
@Controller('order')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles('user', 'admin')
  create(@Body() dto: CreateOrderDto, @Req() req: Request) {
    const user = req.user as User;
    return this.orderService.create(dto, user.id);
  }

  @Get()
  @Roles('user', 'admin')
  findAll(
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('sort') sort: 'ASC' | 'DESC' = 'DESC',
  ) {
    const user = req.user as User;
    return this.orderService.findAll(user, sort, search, +page, +limit);
  }

  @Get(':id')
  @Roles('user', 'admin')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.orderService.findOne(+id, user);
  }

  @Patch(':id')
  @Roles('user', 'admin')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.orderService.update(+id, dto, user);
  }

  @Delete(':id')
  @Roles('user', 'admin')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.orderService.remove(+id, user);
  }
}
