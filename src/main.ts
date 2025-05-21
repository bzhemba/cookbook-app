import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as hbs from 'hbs';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import * as session from 'express-session';
import { SessionOptions } from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('hbs');

  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

  const sessionConfig: SessionOptions = {
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  };

  app.use(session(sessionConfig));
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Cookbook API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  SwaggerModule.setup('swagger/api', app, document);

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on http://localhost:${port}`);
}
void bootstrap();
