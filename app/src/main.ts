import { WebRoutes } from './modules/web/web.route';
import { AuthRoutes } from './modules/auth/auth.route';
import { config } from 'dotenv';
import * as bodyParser from 'body-parser';
import * as useragent from 'express-useragent';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, ApiHeader } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { Routes } from 'nest-router';
import { AdminRoutes } from './modules/admin/admin.route';

async function bootstrap() {
  config();

  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug"],
    bodyParser: false,
  });
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: true
  }));
  app.setGlobalPrefix('api');

  // TODO: AngularでCORS例外が起きたため、記述
  // 他にもっといい解決策があるかも
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
  });

  // UA parser
  app.use(useragent.express());

  // bodyParser Apple ID required
  app.use(bodyParser.urlencoded({ extended: true }));

  // OPENAPI
  if (process.env.NODE_ENV === 'development') {
    const searchModuleFromRoute = (routes: Routes, modules: Function[] = []): Function[] => {
      for (const route of routes) {
        if (route.module) modules.push(route.module as Function);
        if (route.children) {
          modules = [...modules, ...searchModuleFromRoute(route.children as Routes, modules)];
        }
      }
      return modules;
    }
    // AdminModule
    {
      const frontendOptions = new DocumentBuilder()
        .setTitle('Admin')
        .setDescription('Admin API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
      const frontendDocument = SwaggerModule.createDocument(app, frontendOptions, {
        include: searchModuleFromRoute(AdminRoutes),
        deepScanRoutes: true
      });
      SwaggerModule.setup('api/admin/docs', app, frontendDocument);
    }
    // AuthModule
    {
      const frontendOptions = new DocumentBuilder()
        .setTitle('Auth')
        .setDescription('Auth API description')
        .setVersion('1.0')
        .addBearerAuth()
        .addSecurity('refresh-token', {
          name: 'x-refresh-token',
          description: 'リフレッシュトークン',
          type: 'apiKey',
          in: 'header',
        })
        .build();
      const frontendDocument = SwaggerModule.createDocument(app, frontendOptions, {
        include: searchModuleFromRoute(AuthRoutes),
        deepScanRoutes: true
      });
      SwaggerModule.setup('api/auth/docs', app, frontendDocument);
    }
    // WebModule
    {
      const frontendOptions = new DocumentBuilder()
        .setTitle('Web')
        .setDescription('Web API description')
        .setVersion('1.0')
        .addBearerAuth()
        .addSecurity('refresh-token', {
          name: 'x-refresh-token',
          description: 'リフレッシュトークン',
          type: 'apiKey',
          in: 'header',
        })
        .build();
      const frontendDocument = SwaggerModule.createDocument(app, frontendOptions, {
        include: searchModuleFromRoute(WebRoutes),
        deepScanRoutes: true
      });
      SwaggerModule.setup('api/web/docs', app, frontendDocument);
    }
  }

  // ==== OPENAPI ====

  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
