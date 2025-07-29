import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Testimonial')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('testimonial')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Post()
  @Roles('user', 'admin') // Allow both admin and user to post
  async create(@Body() dto: CreateTestimonialDto, @Req() req) {
    return await this.testimonialService.createTestimonial(dto, req.user.sub);
  }

  @Get()
  @Roles('admin', 'user')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'id',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Query('search') search?: string,
  ) {
    return await this.testimonialService.getAllTestimonials(+page, +limit, sortBy, order, search);
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id') id: string) {
    return await this.testimonialService.getTestimonialById(+id);
  }

  @Patch(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return await this.testimonialService.updateTestimonial(+id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return await this.testimonialService.deleteTestimonial(+id);
  }
}
