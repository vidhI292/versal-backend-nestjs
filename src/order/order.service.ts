import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/user/entities/user.entity';
import { Checkout } from 'src/checkout/entities/checkout.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CommonResponse } from 'src/common/functions/common.function';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Checkout)
    private checkoutRepository: Repository<Checkout>,

    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    const { checkout_id, discount = 0, delivery_fee = 0 } = createOrderDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return CommonResponse(404, 'User not found');

    const checkout = await this.checkoutRepository.findOne({
      where: { id: checkout_id },
    });
    if (!checkout) return CommonResponse(404, 'Checkout not found');

    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
    if (!cartItems.length) return CommonResponse(404, 'Cart is empty');

    const subtotal = cartItems.reduce((acc, item) => {
      const price = Number(item.product?.price || 0);
      const qty = Number(item.quantity || 1);
      return acc + price * qty;
    }, 0);

    const total_amount = subtotal - Number(discount) + Number(delivery_fee);

    const order = this.orderRepository.create({
      user,
      checkout,
      subtotal,
      discount,
      delivery_fee,
      total_amount,
    });

    const saved = await this.orderRepository.save(order);
    return CommonResponse(201, 'Order created successfully', saved);
  }

  async findAll(
    user: User,
    sort: 'ASC' | 'DESC' = 'DESC',
    search = '',
    page = 1,
    limit = 10,
  ) {
    const skip = (page - 1) * limit;

    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.checkout', 'checkout')
      .orderBy('order.created_at', sort)
      .skip(skip)
      .take(limit);

    if (search) {
      query.andWhere('user.name ILIKE :search', { search: `%${search}%` });
    }

    if (user.role !== 'admin') {
      query.andWhere('user.id = :id', { id: user.id });
    }

    const [data, total] = await query.getManyAndCount();

    return CommonResponse(200, 'Orders fetched successfully', {
      total,
      page,
      limit,
      data,
    });
  }

  async findOne(id: number, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'checkout'],
    });

    if (!order) return CommonResponse(404, 'Order not found');

    if (user.role !== 'admin' && order.user.id !== user.id) {
      return CommonResponse(403, 'Access denied');
    }

    return CommonResponse(200, 'Order fetched successfully', order);
  }

  async update(id: number, dto: UpdateOrderDto, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!order) return CommonResponse(404, 'Order not found');
    if (user.role !== 'admin' && order.user.id !== user.id) {
      return CommonResponse(403, 'Access denied');
    }

    Object.assign(order, dto);
    const updated = await this.orderRepository.save(order);
    return CommonResponse(200, 'Order updated successfully', updated);
  }

  async remove(id: number, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!order) return CommonResponse(404, 'Order not found');
    if (user.role !== 'admin' && order.user.id !== user.id) {
      return CommonResponse(403, 'Access denied');
    }

    await this.orderRepository.remove(order);
    return CommonResponse(200, 'Order deleted successfully');
  }
}
