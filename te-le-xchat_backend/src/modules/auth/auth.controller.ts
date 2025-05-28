import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, Post , HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() dto : RegisterDto){
        return this.authService.register(dto);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    login(@Body() dto : LoginDto){
        return this.authService.login(dto);
    }

    @Post('accessToken')
    @HttpCode(HttpStatus.OK)
    getUserFromToken(@Body() dto: TokenDto) {
    return this.authService.getUserFromToken(dto.token);
  }
}
