import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  
  app.enableCors({
    origin: process.env.CLIENT ?? 'http://localhost:5173',
    credentials: true,
  });

  // console.log(process.env.CLIENT)
  await app.listen(3000);
}
bootstrap();
