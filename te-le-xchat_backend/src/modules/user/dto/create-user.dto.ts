import { IsNotEmpty, IsPhoneNumber, IsString, MinLength } from "class-validator";


export class CreateUserDto {
    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @IsString()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;

    @IsNotEmpty({ message: 'Họ tên không được để trống' })
    @IsString()
    fullName: string;
   
}