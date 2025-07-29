import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CommonResponse } from 'src/common/functions/common.function';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createCart(createCartDto: CreateCartDto, userId: number) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) return CommonResponse(404, 'User not found');

      const product = await this.productRepository.findOneBy({ id: createCartDto.product_id });
      if (!product) return CommonResponse(404, 'Product not found');

      const cart = this.cartRepository.create({
        quantity: createCartDto.quantity,
        total_price: createCartDto.total_price,
        user,
        product,
      });

      await this.cartRepository.save(cart);
      return CommonResponse(201, 'Cart is created', cart);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Cart not created', error.message || error),
      );
    }
  }

  async getAllCart(
    query: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      search?: string;
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
        search = '',
      } = query;

      const whereClause: any = {};

      if (userRole === 'user') {
        whereClause.user = { id: userId };
      }

      const [data, total] = await this.cartRepository.findAndCount({
        where: whereClause,
        relations: ['user', 'product'],
        order: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      });

      return CommonResponse(200, 'Carts fetched successfully', {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to fetch carts', error.message || error),
      );
    }
  }

  async getCartById(id: number, userId: number, userRole: string) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { id },
        relations: ['user', 'product'],
      });

      if (!cart) return CommonResponse(404, 'Cart not found');

      if (userRole === 'user' && cart.user.id !== userId) {
        throw new ForbiddenException(CommonResponse(403, 'Access denied'));
      }

      return CommonResponse(200, 'Cart fetched', cart);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Cannot fetch cart', error.message || error),
      );
    }
  }

  async updateCart(id: number, dto: UpdateCartDto, userId: number, userRole: string) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { id },
        relations: ['user', 'product'],
      });
      if (!cart) return CommonResponse(404, 'Cart not found');

      if (userRole === 'user' && cart.user.id !== userId) {
        throw new ForbiddenException(CommonResponse(403, 'Access denied'));
      }

      if (dto.product_id) {
        const product = await this.productRepository.findOneBy({ id: dto.product_id });
        if (!product) return CommonResponse(404, 'Product not found');
        cart.product = product;
      }

      if (dto.quantity !== undefined) cart.quantity = dto.quantity;
      if (dto.total_price !== undefined) cart.total_price = dto.total_price;

      const updatedCart = await this.cartRepository.save(cart);
      return CommonResponse(200, 'Cart updated', updatedCart);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Cart not updated', error.message || error),
      );
    }
  }

  async deleteCart(id: number, userId: number, userRole: string) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!cart) return CommonResponse(404, 'Cart not found');

      if (userRole === 'user' && cart.user.id !== userId) {
        throw new ForbiddenException(CommonResponse(403, 'Access denied'));
      }

      await this.cartRepository.delete(id);
      return CommonResponse(200, 'Cart is deleted');
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Cart not deleted', error.message || error),
      );
    }
  }
}
