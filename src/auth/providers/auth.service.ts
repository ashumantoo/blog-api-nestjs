import { Injectable, forwardRef, Inject, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IActiveUser } from '../interfaces/active.user.interface';

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

    private readonly jwtService: JwtService,
    private readonly congiService: ConfigService

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
      const access_token = await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
      } as IActiveUser, {
        audience: this.congiService.get('jwt.tokenAudience'),
        issuer: this.congiService.get('jwt.tokenIssuer'),
        secret: this.congiService.get('jwt.secret'),
        expiresIn: this.congiService.get('jwt.accessTokenTTL'),
      }
      )
      return {
        success: true,
        message: "Authenicated successfully",
        access_token
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user is successfully logined or not
   */
  public isAuthenticated() {
    return true;
  }
}
