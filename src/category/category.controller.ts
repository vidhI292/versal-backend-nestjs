import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Category')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}


  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateCategoryDto, @Request() req) {
    const userId = req.user.sub; // JWT user id from token
    return await this.categoryService.createCategory(dto, userId);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'category_name' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'ASC', enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false, example: 'Butterscotch' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'category_id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query('search') search?: string,
  ) {
    return await this.categoryService.getAllCategories(
      Number(page),
      Number(limit),
      sortBy,
      sortOrder,
      search,
    );
  }

  @Roles('admin')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.getCategoryById(Number(id));
  }

  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return await this.categoryService.updateCategory(Number(id), dto);
  }

  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.categoryService.deleteCategory(Number(id));
  }
}
