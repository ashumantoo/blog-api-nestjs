import { Injectable, forwardRef, Inject, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { HashingProvider } from './hashing.provider';
import { RefreshTokenDto } from '../dtos/refresh.token.dto';
import { RefreshTokenProvider } from './refresh.token.provider';
import { GenerateTokensProvider } from './generate.tokens.provider';

/**
 * Auth service class
 */
@Injectable()
export class AuthService {
  /**Circular dependancy injection using forwardRef()*/
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    //Injecting hashing provider
    private readonly hashingProvider: HashingProvider,

    // private readonly jwtService: JwtService,
    // private readonly configService: ConfigService,
    private readonly refreshTokenProvider: RefreshTokenProvider,
    private readonly generateTokenProvider: GenerateTokensProvider
  ) { }

  /**
   * User login
   */
  public async signin(signInDto: SignInDto) {
    try {
      const user = await this.usersService.findUserByEmail(signInDto.email);
      const passwordMached = await this.hashingProvider.comparePassword(signInDto.password, user.password);
      if (!passwordMached) {
        throw new UnauthorizedException("Password is incorrect.")
      }
      const { accessToken, refreshToken } = await this.generateTokenProvider.generateTokens(user)

      return {
        success: true,
        accessToken,
        refreshToken
      }
    } catch (error) {
      throw error;
    }
  }

  public async getRefreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokenProvider.refreshTokens(refreshTokenDto);
  }
}
