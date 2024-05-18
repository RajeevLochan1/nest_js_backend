import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //to use config module globally
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
  ],
  controllers: [AppController,AuthController],
  providers: [AppService,AuthService],
})
export class AppModule {}
