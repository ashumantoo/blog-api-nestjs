import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IActiveUser } from '../interfaces/active.user.interface';
import { User } from 'src/users/user.entity';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync({
      sub: userId,
      ...payload
    }, {
      audience: this.configService.get('jwt.tokenAudience'),
      issuer: this.configService.get('jwt.tokenIssuer'),
      secret: this.configService.get('jwt.secret'),
      expiresIn
    })
  }

  public async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      // Generate Access Token with Email
      this.signToken<Partial<IActiveUser>>(
        user.id,
        this.configService.get('jwt.accessTokenTTL'),
        { email: user.email },
      ),

      // Generate Refresh token without email
      this.signToken(user.id,  this.configService.get('jwt.refreshTokenTTL')),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
