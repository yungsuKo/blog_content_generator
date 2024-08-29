import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NaverDataModule } from './naver_data/naver_data.module';

@Module({
  imports: [NaverDataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
