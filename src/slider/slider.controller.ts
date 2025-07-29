import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SliderService } from './slider.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiBearerAuth('access-token')
@ApiTags('Slider')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sliders')
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Post()
  @Roles('admin')
  async create(@Body() dto: CreateSliderDto, @Req() req) {
    return await this.sliderService.createSlider(dto, req.user.sub);
  }

  @Get()
  @Roles('admin', 'user')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'id' })
  @ApiQuery({ name: 'order', required: false, example: 'ASC', enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false, example: 'sample' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'id',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Query('search') search?: string,
  ) {
    return await this.sliderService.getAllSliders(+page, +limit, sortBy, order, search);
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id') id: string) {
    return await this.sliderService.getSliderById(Number(id));
  }

  @Patch(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() dto: UpdateSliderDto) {
    return await this.sliderService.updateSlider(Number(id), dto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return await this.sliderService.deleteSlider(Number(id));
  }
}
