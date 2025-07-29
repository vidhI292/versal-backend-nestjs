import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdatecontactDto } from './dto/update-contact.dto';
import { CommonResponse } from 'src/common/functions/common.function';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async createContact(dto: CreateContactDto, userId: number) {
    try {
      const contact = this.contactRepository.create({ ...dto, user: { id: userId } });
      await this.contactRepository.save(contact);
      return CommonResponse(201, 'Contact created successfully', contact);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to create contact', error.message || error),
      );
    }
  }


 async getAllContacts(
    page = 1,
    limit = 10,
    sortBy = 'id',
    order: 'ASC' | 'DESC' = 'ASC',
    search?: string,
  ) {
    try {
      const query: SelectQueryBuilder<Contact> = this.contactRepository
        .createQueryBuilder('contact')
        .leftJoinAndSelect('contact.user', 'user');

      // Searching by first_name, last_name, email
      if (search) {
        query.andWhere(
          `(contact.first_name LIKE :search OR contact.last_name LIKE :search OR contact.email LIKE :search)`,
          { search: `%${search}%` },
        );
      }

      // Valid sortable fields (prevent SQL injection)
      const sortableColumns = [
        'id',
        'first_name',
        'last_name',
        'email',
        'created_at',
        'updated_at',
      ];
      if (!sortableColumns.includes(sortBy)) {
        sortBy = 'id';
      }

      query.orderBy(`contact.${sortBy}`, order);

      // Pagination
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);

      const [contacts, total] = await query.getManyAndCount();

      return CommonResponse(200, 'Contacts fetched successfully', {
        data: contacts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to fetch contacts', error.message || error),
      );
    }
  }

  async getContactById(id: number) {
    try {
      const contact = await this.contactRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!contact) {
        return CommonResponse(404, `Contact with ID ${id} not found`);
      }

      return CommonResponse(200, 'Contact fetched successfully', contact);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to fetch contact', error.message || error),
      );
    }
  }

  async updateContact(id: number, dto: UpdatecontactDto) {
    try {
      const contact = await this.contactRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!contact) {
        return CommonResponse(404, `Contact with ID ${id} not found`);
      }

      const updatedContact = this.contactRepository.merge(contact, dto);
      await this.contactRepository.save(updatedContact);

      return CommonResponse(200, 'Contact updated successfully', updatedContact);
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to update contact', error.message || error),
      );
    }
  }

  async deleteContact(id: number) {
    try {
      const result = await this.contactRepository.delete(id);
      if (result.affected === 0) {
        return CommonResponse(404, `Contact with ID ${id} not found or already deleted`);
      }

      return CommonResponse(200, 'Contact deleted successfully');
    } catch (error) {
      throw new InternalServerErrorException(
        CommonResponse(500, 'Failed to delete contact', error.message || error),
      );
    }
  }
}
