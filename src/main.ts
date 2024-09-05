import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    //by using this nestjs will remove any extra fields send from the client which are not part of the DTO
    //this allow us to save our application from any malicious data sent from any user
    whitelist: true,
    //This will throw an error if we send anything which not part of the DTO but sill we getting in the request body
    forbidNonWhitelisted: true,
    //it's transform the incoing request body to an instance of defined DTO class after validation, by default request is not the instance of DTO class instead it is an object
    transform: true
  }));
  await app.listen(3000);

}
bootstrap();
