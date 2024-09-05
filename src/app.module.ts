import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { usersModule } from './users/users.module';

@Module({
  imports: [usersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
