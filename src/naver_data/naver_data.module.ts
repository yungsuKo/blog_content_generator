import { Module } from '@nestjs/common';
import { NaverDataService } from './naver_data.service';
import { NaverDataController } from './naver_data.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [NaverDataController],
  providers: [NaverDataService],
  imports: [ScheduleModule.forRoot()],
})
export class NaverDataModule {}
