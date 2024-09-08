import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
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
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        entities: [], //All entities which are defined within the application needs to be added here in this array then only nestjs will aware about the created entity and entitty is noting but definition of db tables
        synchronize: true, //only use in dev env
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        host: 'localhost',
        database: 'nestjs-blog'
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
