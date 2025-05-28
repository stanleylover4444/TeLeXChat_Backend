import { IsNotEmpty, IsString, MinLength, Matches } from "class-validator";

export class RegisterDto {
    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    @Matches(/^(0)(3|5|7|8|9)[0-9]{8}$/, { message: 'Số điện thoại không hợp lệ' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @IsString()
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;

    @IsNotEmpty({ message: 'Họ tên không được để trống' })
    @IsString()
    fullName: string;
}
