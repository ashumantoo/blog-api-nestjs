import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService, {
      provide: HashingProvider,
      useClass: BcryptProvider
    }
  ],
  //Circular dependancy
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({ global: true })
  ],
  exports: [AuthService, HashingProvider]
})
export class AuthModule { }
