import { IsOptional, IsString, IsEmail, IsBoolean } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}