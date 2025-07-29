import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Slider } from './entities/slider.entity';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { CommonResponse } from 'src/common/functions/common.function';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SliderService {
  constructor(
    @InjectRepository(Slider)
    private readonly sliderRepository: Repository<Slider>,
     @InjectRepository(User)
    private readonly userRepository: Repository<User>  
  ) { }
  

async createSlider(dto: CreateSliderDto, userId: number) {
  try {
    // Step 1: Load the user from DB
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    //  Create slider and assign full user entity
    const slider = this.sliderRepository.create({
      ...dto,
      user, // This sets the foreign key user_id
    });

    console.log('Saving slider:', slider);

    await this.sliderRepository.save(slider);

    return CommonResponse(201, 'Slider created successfully', slider);
  } catch (error) {
    console.error('Slider create error:', error);
    throw new InternalServerErrorException(
      CommonResponse(500, 'Failed to create slider', error.message || error),
    );
  }
}

  async getAllSliders(
    page = 1,
    limit = 10,
    sortBy = 'id',
    order: 'ASC' | 'DESC' = 'ASC',
    search?: string,
  ) {
    try {
      const query: SelectQueryBuilder<Slider> = this.sliderRepository
        .createQueryBuilder('slider')
        .leftJoinAndSelect('slider.user', 'user');

      if (search) {
        query.andWhere(
          '(slider.title LIKE :search OR slider.description LIKE :search)',
          { search: `%${search}%` },
        );
      }

      const sortableColumns = ['id', 'title', 'createdAt', 'updatedAt'];
      if (!sortableColumns.includes(sortBy)) {
        sortBy = 'id';
      }

      query.orderBy(`slider.${sortBy}`, order);

      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);

      const [sliders, total] = await query.getManyAndCount();

      return CommonResponse(200, 'Sliders fetched successfully', {
        data: sliders,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to fetch sliders', error.message || error),
      );
    }
  }

  async getSliderById(id: number) {
    try {
      const slider = await this.sliderRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!slider) {
        return CommonResponse(404, `Slider with ID ${id} not found`);
      }

      return CommonResponse(200, 'Slider fetched successfully', slider);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to fetch slider', error.message || error),
      );
    }
  }

  async updateSlider(id: number, dto: UpdateSliderDto) {
    try {
      const slider = await this.sliderRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!slider) {
        return CommonResponse(404, `Slider with ID ${id} not found`);
      }

      const updatedSlider = this.sliderRepository.merge(slider, dto);
      await this.sliderRepository.save(updatedSlider);

      return CommonResponse(200, 'Slider updated successfully', updatedSlider);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to update slider', error.message || error),
      );
    }
  }

  async deleteSlider(id: number) {
    try {
      const result = await this.sliderRepository.delete(id);

      if (result.affected === 0) {
        return CommonResponse(404, `Slider with ID ${id} not found or already deleted`);
      }

      return CommonResponse(200, 'Slider deleted successfully');
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to delete slider', error.message || error),
      );
    }
  }
}
