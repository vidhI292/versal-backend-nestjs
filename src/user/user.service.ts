import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import * as bcrypt from 'bcrypt';
import { CommonResponse } from 'src/common/functions/common.function';
import { Role } from 'src/enums/User-Role.enum';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }


  async createUser(createUserDto: CreateUserDto) {
    try {
      const existUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existUser) {
        return CommonResponse(400, 'Duplicate entry is not allowed');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Convert incoming role string to Role enum value, default to Role.User if invalid
      const roleEnum: Role =
        (Object.values(Role) as string[]).includes(createUserDto.role)
          ? (createUserDto.role as Role)
          : Role.User;

      const user = this.userRepository.create({
        ...createUserDto,
        role: roleEnum,
        password: hashedPassword,
      });

      await this.userRepository.save(user);

      return CommonResponse(201, 'User created successfully', user);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) {
        return CommonResponse(404, 'User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return CommonResponse(401, 'Invalid credentials');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      const token = await this.jwtService.signAsync(payload);

      return CommonResponse(200, 'Login successful', {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      return CommonResponse(500, 'Login failed');
    }
  }


  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } }); // return null if not found
  }


  async getUserById(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        return CommonResponse(404, `User with ID ${id} not found`);
      }
      return CommonResponse(200, 'User fetched successfully', user);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to find user');
    }
  }

// async getAllUsers(query: UserQueryDto) {
//   try {
//     const { page, limit, search, sortBy, sortOrder } = query;

//     const skip = (page - 1) * limit;

//     const queryBuilder = this.userRepository.createQueryBuilder('user');

//     if (search) {
//       queryBuilder.where(
//         'user.name LIKE :search OR user.email LIKE :search',
//         { search: `%${search}%` },
//       );
//     }

//     queryBuilder.orderBy(`user.${sortBy}`, sortOrder);
//     queryBuilder.skip(skip).take(limit);

//     const [data, total] = await queryBuilder.getManyAndCount();

//     return CommonResponse(200, 'Users fetched successfully', {
//       data,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     console.error(error);
//     throw new InternalServerErrorException('Failed to fetch users');
//   }
// }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      //  check user exists
      const existingUser = await this.userRepository.findOneBy({ id });
      if (!existingUser) {
        return CommonResponse(404, 'User not found');
      }

      // Proceed to update
      await this.userRepository.update(id, updateUserDto);

      const updatedUser = await this.userRepository.findOneBy({ id });

      return CommonResponse(200, 'User updated successfully', updatedUser);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }


  async deleteUser(id: number) {
    try {
      // Check  user exists before deleting
      const existingUser = await this.userRepository.findOneBy({ id });
      if (!existingUser) {
        return CommonResponse(404, 'User not found');
      }

      await this.userRepository.delete(id);

      return CommonResponse(200, 'User deleted successfully');
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  // user.service.ts
  async createUserWithGoogle(email: string, name: string) {
    const newUser = this.userRepository.create({
      email,
      name,
      password: '', // or null if allowed
      provider: 'google', // optional field
    });
    return await this.userRepository.save(newUser);
  }


}


