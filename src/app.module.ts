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
    MetaOptionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
