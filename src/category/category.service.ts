import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CommonResponse } from 'src/common/functions/common.function';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(dto: CreateCategoryDto, userId: number) {
    try {
      const category = this.categoryRepository.create({ ...dto, user: { id: userId } });
      await this.categoryRepository.save(category);
      return CommonResponse(201, 'Category created successfully', category);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to create category', error.message || error),
      );
    }
  }

  async getAllCategories(
    page = 1,
    limit = 10,
    sortBy = 'category_id',
    order: 'ASC' | 'DESC' = 'ASC',
    search?: string,
  ) {
    try {
      const query: SelectQueryBuilder<Category> = this.categoryRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.user', 'user'); // if you have user relation

      if (search) {
        query.andWhere('category.category_name LIKE :search', { search: `%${search}%` });
      }

      const sortableColumns = ['category_id', 'category_name', 'created_at', 'updated_at'];
      if (!sortableColumns.includes(sortBy)) {
        sortBy = 'category_id';
      }

      query.orderBy(`category.${sortBy}`, order);

      query.skip((page - 1) * limit).take(limit);

      const [categories, total] = await query.getManyAndCount();

      return CommonResponse(200, 'Categories fetched successfully', {
        data: categories,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to fetch categories', error.message || error),
      );
    }
  }

  async getCategoryById(id: number) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['user'], // if you have user relation
      });

      if (!category) {
        return CommonResponse(404, `Category with ID ${id} not found`);
      }

      return CommonResponse(200, 'Category fetched successfully', category);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to fetch category', error.message || error),
      );
    }
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    try {
      const existingCategory = await this.categoryRepository.findOneBy({ id });

      if (!existingCategory) {
        return CommonResponse(404, `Category with ID ${id} not found`);
      }

      const updatedCategory = this.categoryRepository.merge(existingCategory, dto);
      await this.categoryRepository.save(updatedCategory);

      return CommonResponse(200, 'Category updated successfully', updatedCategory);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to update category', error.message || error),
      );
    }
  }

  async deleteCategory(id: number) {
    try {
      const result = await this.categoryRepository.delete(id);
      if (result.affected === 0) {
        return CommonResponse(404, `Category with ID ${id} not found or already deleted`);
      }

      return CommonResponse(200, 'Category deleted successfully');
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to delete category', error.message || error),
      );
    }
  }
}
