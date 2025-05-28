import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const existingUser = await this.findByPhoneNumber(createUserDto.phoneNumber);
            if (existingUser) {
                throw new ConflictException('Số điện thoại đã được đăng ký');
            }

            const user = this.userRepository.create(createUserDto);
            const savedUser = await this.userRepository.save(user);
            
            return savedUser;
        } catch (error) {
            console.error('UserService.create error:', error);
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Lỗi khi tạo tài khoản');
        }
    }


 async findById(id: string): Promise<User | null> {
    try {
        return await this.userRepository.findOne({ 
            where: { id, isActive: true } 
        });
    } catch (error) {
        return null;
    }
}


    async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
        try {
            return await this.userRepository.findOne({ 
                where: { phoneNumber, isActive: true } 
            });
        } catch (error) {
            return null;
        }
    }

   
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            const user = await this.findById(id);
            if (!user) {
                throw new NotFoundException('Không tìm thấy người dùng');
            }
         
            Object.assign(user, updateUserDto);
            return await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Lỗi khi cập nhật thông tin');
        }
    }

    // Tìm kiếm user
    async search(keyword: string, page: number = 1, limit: number = 10) {
        try {
            const [users, total] = await this.userRepository
                .createQueryBuilder('user')
                .where('user.isActive = :isActive', { isActive: true })
                .andWhere('(user.fullName LIKE :keyword OR user.phoneNumber LIKE :keyword OR user.email LIKE :keyword)', 
                    { keyword: `%${keyword}%` })
                .select(['user.id', 'user.phoneNumber', 'user.fullName', 'user.email', 'user.createdAt'])
                .skip((page - 1) * limit)
                .take(limit)
                .orderBy('user.createdAt', 'DESC')
                .getManyAndCount();

            return {
                data: users,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                keyword
            };
        } catch (error) {
            throw new InternalServerErrorException('Lỗi khi tìm kiếm người dùng');
        }
    }

}