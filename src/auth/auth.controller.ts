import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dto';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { Auth } from './decorators/auth/auth.decorator';
import { AuthTypes } from './enums/auth.types.enum';

/**
 * Auth controller class
 */
@Controller('auth')
export class AuthController {
  /**
   * Injecting auth service
   */
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('/signin')
  @Auth(AuthTypes.None)
  @HttpCode(HttpStatus.OK)
  public singin(@Body() singInDto: SignInDto) {
    return this.authService.signin(singInDto);
  }
}
