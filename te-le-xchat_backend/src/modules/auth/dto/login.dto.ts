import { IsNotEmpty, IsString, IsPhoneNumber, Matches } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @Matches(/^(0)(3|5|7|8|9)[0-9]{8}$/, { message: 'Số điện thoại không hợp lệ' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString()
  password: string;
}