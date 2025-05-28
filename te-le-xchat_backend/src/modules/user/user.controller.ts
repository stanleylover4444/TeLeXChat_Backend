import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe, NotFoundException, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('search')
    async search(
        @Query('keyword') keyword: string,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('limit', ParseIntPipe) limit: number = 10
    ) {
        return this.userService.search(keyword, page, limit);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: string) {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException('Không tìm thấy người dùng');
        }
        const { password, ...userInfo } = user;
        return userInfo;
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        const user = await this.userService.update(id, updateUserDto);
        const { password, ...userInfo } = user;
        return userInfo;
    }
}