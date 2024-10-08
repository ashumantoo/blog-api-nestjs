import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { JwtModule } from '@nestjs/jwt';
import { GenerateTokensProvider } from './providers/generate.tokens.provider';
import { RefreshTokenProvider } from './providers/refresh.token.provider';
import { GoogleAuthenticationController } from './social/google-authentication.controller';
import { GoogleAuthenticationService } from './social/providers/google-authentication.service';

@Module({
  controllers: [AuthController, GoogleAuthenticationController],
  providers: [
    AuthService, {
      provide: HashingProvider,
      useClass: BcryptProvider
    },
    GenerateTokensProvider,
    RefreshTokenProvider,
    GoogleAuthenticationService,
  ],
  //Circular dependancy
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({ global: true })
  ],
  exports: [AuthService, HashingProvider]
})
export class AuthModule { }
