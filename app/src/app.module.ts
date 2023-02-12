import { WebModule } from './modules/web/web.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { AuthRoutes } from './modules/auth/auth.route';
import { AdminModule } from './modules/admin/admin.module';

import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RouterModule } from 'nest-router';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminRoutes } from './modules/admin/admin.route';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { Request, Response, NextFunction } from 'express';
import { WebRoutes } from './modules/web/web.route';

@Module({
  imports: [
    PrismaModule,
    AdminModule,
    AuthModule,
    WebModule,
    RouterModule.forRoutes([
      {
        path: '/auth',
        children: AuthRoutes
      },
      // {
      //   path: '/admin',
      //   children: AdminRoutes
      // },
      // {
      //   path: '/web',
      //   children: WebRoutes
      // },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(
    private logger: Logger
  ) {

  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply((request: Request, response: Response, next: NextFunction) => {
      const { ip, method, originalUrl } = request;
      const userAgent = request.get('user-agent') || '';

      response.on('finish', () => {
        const { statusCode } = response;
        const contentLength = response.get('content-length');
        if (!userAgent.includes('ELB-HealthChecker')) {
          const msg = `${method} ${originalUrl} ${statusCode} ${contentLength}${ip}, ${JSON.stringify(request.headers)}`;
          if (statusCode >= 400) {
            this.logger.warn(msg, 'Request');
          } else if (statusCode >= 500) {
            this.logger.error(msg, 'Request');
          } else {
            this.logger.log(msg, 'Request');
          }
        }
      });

      next();
    }).forRoutes('*');
  }
}