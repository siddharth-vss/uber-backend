import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthCaptain, AuthUser } from './middleware/auth.middleware';
import { AuthService } from './services/auth.service';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma.service';
import { CaptainModule } from './captain/captain.module';
import { CaptainService } from './captain/captain.service';

@Module({
  imports: [UserModule, CaptainModule],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    UserService,
    PrismaService,
    CaptainService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthUser).forRoutes({ path: '/users*', method: RequestMethod.GET });
    consumer.apply(AuthCaptain).forRoutes({ path: '/captains*', method: RequestMethod.GET });
  }
}