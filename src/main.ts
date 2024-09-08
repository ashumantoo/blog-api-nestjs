import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Start the app
 */
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

  /**
   * Swagger API documentation setup
   */
  const config = new DocumentBuilder()
    .setTitle("NestJS - Blog API")
    .setDescription("Use the base url as http://localhost:300")
    .addServer("http://localhost:3000")
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

}
bootstrap();
