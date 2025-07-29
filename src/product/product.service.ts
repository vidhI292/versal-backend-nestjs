import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { CommonResponse } from 'src/common/functions/common.function';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createProduct(dto: CreateProductDto, user: User) {
    try {
      // Optional: restrict to only admin
      if (user.role !== 'admin') {
        throw new ForbiddenException(CommonResponse(403, 'Only admin can create products'));
      }

      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(CommonResponse(404, 'Category not found'));
      }

      const product = this.productRepository.create({
        ...dto,
        category,
        user,
      });

      await this.productRepository.save(product);

      const savedProduct = await this.productRepository.findOne({
        where: { id: product.id },
        relations: ['category'],
      });

      return CommonResponse(201, 'Product created', savedProduct);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Product not created', error.message || error),
      );
    }
  }

  async getAllProduct(query: {
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        search = '',
        sortBy = 'created_at',
        sortOrder = 'DESC',
        page = 1,
        limit = 10,
      } = query;

      const qb = this.productRepository.createQueryBuilder('product')
        .leftJoinAndSelect('product.user', 'user')
        .leftJoinAndSelect('product.category', 'category');

      if (search) {
        qb.where(
          'product.name LIKE :search OR product.description LIKE :search',
          { search: `%${search}%` },
        );
      }

      
      qb.orderBy(`product.${sortBy}`, sortOrder)
        .skip((page - 1) * limit)
        .take(limit);

      const [products, total] = await qb.getManyAndCount();

      return CommonResponse(200, 'Products fetched', {
        data: products,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Cannot find products', error.message || error),
      );
    }
  }

  async getProductById(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['user', 'category'],
      });
      if (!product) {
        return CommonResponse(404, `Product with ID ${id} not found`);
      }
      return CommonResponse(200, 'Product fetched', product);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Cannot find product', error.message || error),
      );
    }
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
  try {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      return CommonResponse(404, `Product with ID ${id} not found`);
    }

    // Handle category relation manually if categoryId exists
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        return CommonResponse(404, `Category with ID ${updateProductDto.categoryId} not found`);
      }

      product.category = category;
    }

    // Update other fields
    Object.assign(product, updateProductDto); // only assigns matching fields (like name, price)

    const updated = await this.productRepository.save(product);

    return CommonResponse(200, 'Product updated', updated);
  } catch (error) {
    throw new InternalServerErrorException(
      CommonResponse(500, 'Product not updated', error.message || error),
    );
  }
}


  async deleteProduct(id: number) {
    try {
      const result = await this.productRepository.delete(id);
      if (result.affected === 0) {
        return CommonResponse(404, `Product with ID ${id} not found or already deleted`);
      }
      return CommonResponse(200, 'Product deleted');
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Product not deleted', error.message || error),
      );
    }
  }
}
