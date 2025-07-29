import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/enums/User-Role.enum';
import { UserService } from './user.service';

@ApiBearerAuth('access-token') 
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard) // Apply guards at controller level or per route
export class UserController {
  constructor(private readonly userService: UserService) {}

//   @Get()
// @Roles('admin')
// @ApiOkResponse({ description: 'Fetch all users with pagination, search, sort' })
// async findAll(@Query() query: UserQueryDto) {
//   return await this.userService.getAllUsers(query);
// }

  @Get(':id')
  @Roles('admin', 'user') // Admin or the user themselves can get user by id 
  @ApiOkResponse({ description: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return await this.userService.getUserById(Number(id));
  }

  @Patch(':id')
  @Roles('admin', 'user') // Admin or user can update user info
  @ApiOkResponse({ description: 'Update user by ID' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(Number(id), updateUserDto);
  }

  @Delete(':id')
  @Roles('admin') // Only Admin can delete users
  @ApiOkResponse({ description: 'Delete user by ID' })
  async delete(@Param('id') id: string) {
    return await this.userService.deleteUser(Number(id));
  }
}
