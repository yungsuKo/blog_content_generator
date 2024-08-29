import { Module } from '@nestjs/common';
import { NaverDataService } from './naver_data.service';
import { NaverDataController } from './naver_data.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './entities/blogpost.entity';

@Module({
  controllers: [NaverDataController],
  providers: [NaverDataService],
  imports: [TypeOrmModule.forFeature([BlogPost]), ScheduleModule.forRoot()],
})
export class NaverDataModule {}
