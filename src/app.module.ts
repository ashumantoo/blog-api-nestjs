import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-option/meta-option.module';
import { MetaOptionService } from './meta-option/providers/meta-option.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';
import { appConfig } from './config/app.config';
import { envValidationSchema } from './config/environment.validation';
import { PaginationModule } from './common/pagination/pagination.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { DataResponseInterceptor } from './common/interceptors/data.response/data.response.interceptor';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig],
      validationSchema: envValidationSchema
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   entities: [],
    //   synchronize: true, //only use in dev env
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'postgres',
    //   host: 'localhost',
    //   database: 'nestjs-blog'
    // })
    /**
     * To Inject the different configration of the application as a module we need to user forRootAsync instead of forRoot
     */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        //entities: [User], //All entities which are defined within the application needs to be added here in this array then only nestjs will aware about the created entity and entitty is noting but definition of db tables
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        synchronize: configService.get('database.synchronize'), //only use in dev env
        port: +configService.get('database.port'), //WITH + converting string to number
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        host: configService.get('database.hots'),
        database: configService.get('database.name')
      })
    }),
    TagsModule,
    MetaOptionsModule,
    PaginationModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { //Applying accessTokenguard globally - it will protect all the routes even for those routes as well which should not be tristricted,
      //We need to make those routes public 
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    },
    { //Global interceptor
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor
    },
    AccessTokenGuard //Since AuthenticationGuard has dependancy we have to provide AccessTokenGuard inside the provider also
  ],
  exports: [ConfigModule]
})
export class AppModule { }
