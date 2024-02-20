import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Enable CORS for a specific frontend URL
    app.enableCors({
      origin: 'https://add-bookmarks.netlify.app/',
      credentials: true, // if your frontend sends credentials (cookies, headers), set this to true
    });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  ); //globally use the validation pipes
  await app.listen(4000);
}
bootstrap();
