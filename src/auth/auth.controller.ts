import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dto';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { Auth } from './decorators/auth/auth.decorator';
import { AuthTypes } from './enums/auth.types.enum';
import { RefreshTokenDto } from './dtos/refresh.token.dto';

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

  @Post('refresh-tokens')
  @Auth(AuthTypes.None)
  @HttpCode(HttpStatus.OK) // changed since the default is 201
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.getRefreshTokens(refreshTokenDto);
  }
}
