import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./providers/users.service";
import { AuthModule } from "src/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { CreateGoogleUserProvider } from './providers/create.google.user.provider';

/**
 * Only Services or Providers can be exported from the module
 * exports: [UsersService] <-- so that UserService will be available to user for other services/provides
 * but to use this UserService those module should also import the UsersModule like follow
 * imports:[UserModule]
 * 
 * ----Circular Dependancy: where two or more than two module services depends upon each other
 * For circulary dependancy, we need to use forwardRef(), otherwise it will not work
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService, CreateGoogleUserProvider],
  exports: [UsersService],
  imports: [
    /**Importing typeorm entity to create diff reposity inside the services/provider class */
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ]
})

export class UsersModule { }