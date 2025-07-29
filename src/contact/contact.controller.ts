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
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdatecontactDto } from './dto/update-contact.dto';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiBearerAuth('access-token') // Match with Swagger setup
@ApiTags('Contact')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Accessible to all authenticated users
  @Post()
  async create(@Body() dto: CreateContactDto, @Request() req) {
    return await this.contactService.createContact(dto, req.user.sub);
  }

  //  Admin only: pagination, sorting, searching
  @Roles('admin')
  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'first_name' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'ASC', enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'search', required: false, example: 'john' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query('search') search?: string,
  ) {
    return await this.contactService.getAllContacts(
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
    return await this.contactService.getContactById(Number(id));
  }

  @Roles('admin')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatecontactDto) {
    return await this.contactService.updateContact(Number(id), dto);
  }

  @Roles('admin')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.contactService.deleteContact(Number(id));
  }
}
