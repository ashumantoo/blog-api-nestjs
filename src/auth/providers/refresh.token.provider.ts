import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh.token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IActiveUser } from '../interfaces/active.user.interface';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from './generate.tokens.provider';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UsersService)) //This will throw error of Nest can't resolve dependencies of the RefreshTokenProvider if we don't add since RefreshTokenProvider will require userService
    private readonly usersService: UsersService,
    private readonly generateTokensProvider: GenerateTokensProvider
  ) { }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    // Verify the refresh token using jwtService
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<IActiveUser, 'sub'>
      >(refreshTokenDto.refreshToken, {
        audience: this.configService.get('jwt.tokenAudience'),
        issuer: this.configService.get('jwt.tokenIssuer'),
        secret: this.configService.get('jwt.secret'),
      });
      // Fetch the user from the database
      const user = await this.usersService.findOneById(sub);

      // Generate the tokens
      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
