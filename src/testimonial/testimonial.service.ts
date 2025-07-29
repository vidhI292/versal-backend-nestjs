import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { CommonResponse } from 'src/common/functions/common.function';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
  ) {}

  async createTestimonial(dto: CreateTestimonialDto, userId: number) {
  try {
    const testimonial = this.testimonialRepository.create({
      ...dto,
      user: { id: userId },
    });

    const saved = await this.testimonialRepository.save(testimonial);

    // Custom response with only userId (no empty user object)
    const response = {
      id: saved.id,
      description: saved.description,
      person_name: saved.person_name,
      person_image: saved.person_image,
      review: saved.review,
      created_at: saved.created_at,
      updated_at: saved.updated_at,
      userId: userId, 
    };

    return CommonResponse(201, 'Testimonial created successfully', response);
  } catch (error) {
    throw new InternalServerErrorException(
      CommonResponse(500, 'Failed to create testimonial', error.message || error),
    );
  }
}


  async getAllTestimonials(
    page = 1,
    limit = 10,
    sortBy = 'id',
    order: 'ASC' | 'DESC' = 'ASC',
    search?: string,
  ) {
    try {
      const query: SelectQueryBuilder<Testimonial> = this.testimonialRepository
        .createQueryBuilder('testimonial')
        .leftJoinAndSelect('testimonial.user', 'user');

      if (search) {
        query.andWhere(
          `testimonial.person_name LIKE :search OR testimonial.description LIKE :search`,
          { search: `%${search}%` },
        );
      }

      const sortableFields = ['id', 'person_name', 'review', 'created_at', 'updated_at'];
      if (!sortableFields.includes(sortBy)) sortBy = 'id';

      query.orderBy(`testimonial.${sortBy}`, order);
      query.skip((page - 1) * limit).take(limit);

      const [data, total] = await query.getManyAndCount();

      return CommonResponse(200, 'Testimonials fetched successfully', {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to fetch testimonials', error.message || error),
      );
    }
  }

  async getTestimonialById(id: number) {
    try {
      const testimonial = await this.testimonialRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!testimonial) {
        return CommonResponse(404, `Testimonial with ID ${id} not found`);
      }

      return CommonResponse(200, 'Testimonial fetched successfully', testimonial);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to fetch testimonial', error.message || error),
      );
    }
  }

  async updateTestimonial(id: number, dto: UpdateTestimonialDto) {
    try {
      const testimonial = await this.testimonialRepository.findOneBy({ id });
      if (!testimonial) {
        return CommonResponse(404, `Testimonial with ID ${id} not found`);
      }

      await this.testimonialRepository.update(id, dto);
      const updated = await this.testimonialRepository.findOneBy({ id });

      return CommonResponse(200, 'Testimonial updated successfully', updated);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to update testimonial', error.message || error),
      );
    }
  }

  async deleteTestimonial(id: number) {
    try {
      const result = await this.testimonialRepository.delete(id);
      if (result.affected === 0) {
        return CommonResponse(404, `Testimonial with ID ${id} not found or already deleted`);
      }

      return CommonResponse(200, 'Testimonial deleted successfully');
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to delete testimonial', error.message || error),
      );
    }
  }
}
