import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkout } from './entities/checkout.entity';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { User } from 'src/user/entities/user.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CommonResponse } from 'src/common/functions/common.function';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Checkout)
    private readonly checkoutRepo: Repository<Checkout>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
  ) {}

  // Create checkout for logged-in user
  async createCheckout(dto: CreateCheckoutDto, userId: number) {
    try {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) return CommonResponse(404, 'User not found');

      const cart = await this.cartRepo.findOneBy({ id: dto.cart_id });
      if (!cart) return CommonResponse(404, 'Cart not found');

      const checkout = this.checkoutRepo.create({
        shippingAddress: dto.shipping_address,
        paymentMethod: dto.payment_method,
        cardDetails: dto.card_details,
        offerCode: dto.offer_code,
        user,
        cart,
      });

      await this.checkoutRepo.save(checkout);
      return CommonResponse(201, 'Checkout created successfully', checkout);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Checkout creation failed', error.message || error),
      );
    }
  }

  // Get all checkouts (user sees own, admin sees all)
  async getAllCheckouts(
    query: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    },
    userId: number,
    userRole: string,
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'id',
        sortOrder = 'DESC',
      } = query;

      const where: any = {};
      if (userRole === 'user') {
        where.user = { id: userId };
      }

      const [data, total] = await this.checkoutRepo.findAndCount({
        where,
        relations: ['user', 'cart'],
        order: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      });

      return CommonResponse(200, 'Checkout list fetched', {
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to fetch checkouts', error.message || error),
      );
    }
  }

  // Get checkout by ID with role-based access
  async getCheckoutById(id: number, userId: number, userRole: string) {
    try {
      const checkout = await this.checkoutRepo.findOne({
        where: { id },
        relations: ['user', 'cart'],
      });
      if (!checkout) return CommonResponse(404, 'Checkout not found');

      // If user role, ensure ownership
      if (userRole === 'user' && checkout.user.id !== userId) {
        throw new ForbiddenException(CommonResponse(403, 'Access denied'));
      }

      return CommonResponse(200, 'Checkout fetched', checkout);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to fetch checkout', error.message || error),
      );
    }
  }

  // Update checkout by ID (user can only update their own)
  async updateCheckout(
    id: number,
    dto: UpdateCheckoutDto,
    userId: number,
    userRole: string,
  ) {
    try {
      const checkout = await this.checkoutRepo.findOne({
        where: { id },
        relations: ['user', 'cart'],
      });
      if (!checkout) return CommonResponse(404, 'Checkout not found');

      if (userRole === 'user' && checkout.user.id !== userId) {
        throw new ForbiddenException(CommonResponse(403, 'Access denied'));
      }

      if (dto.shipping_address !== undefined) checkout.shippingAddress = dto.shipping_address;
      if (dto.payment_method !== undefined) checkout.paymentMethod = dto.payment_method;
      if (dto.card_details !== undefined) checkout.cardDetails = dto.card_details;
      if (dto.offer_code !== undefined) checkout.offerCode = dto.offer_code;

      const updated = await this.checkoutRepo.save(checkout);
      return CommonResponse(200, 'Checkout updated successfully', updated);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to update checkout', error.message || error),
      );
    }
  }

  // Delete checkout (user can only delete their own)
  async deleteCheckout(id: number, userId: number, userRole: string) {
    try {
      const checkout = await this.checkoutRepo.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!checkout) return CommonResponse(404, 'Checkout not found');

      if (userRole === 'user' && checkout.user.id !== userId) {
        throw new ForbiddenException(CommonResponse(403, 'Access denied'));
      }

      await this.checkoutRepo.remove(checkout);
      return CommonResponse(200, 'Checkout deleted successfully');
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to delete checkout', error.message || error),
      );
    }
  }
}
