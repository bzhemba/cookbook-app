import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const hbs = require('hbs')

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('hbs');

  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

  const session = require('express-session');
  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
  }));

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

  SwaggerModule.setup('swagger/api', app, document);

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log("Application is running on http://localhost:", port);
}
bootstrap();
