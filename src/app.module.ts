import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NaverDataModule } from './naver_data/naver_data.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { LandBlogModule } from './land_blog/land_blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    NaverDataModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    LandBlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
