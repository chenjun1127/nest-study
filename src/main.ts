import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import { allMiddleware } from './middleware/all.middleware';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'nestjs-study', // 需要替换成更安全的密钥
      resave: false,
      name: 'nestjs-study.ssid',
      saveUninitialized: false,
      cookie: {
        secure: false, // 如果是 HTTPS 设置为 true
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600000, // 1小时
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(allMiddleware);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}

bootstrap();
