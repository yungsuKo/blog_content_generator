import { Controller, Get } from '@nestjs/common';
import { NaverDataService } from './naver_data.service';

@Controller('naver-data')
export class NaverDataController {
  constructor(private readonly naverDataService: NaverDataService) {}

  @Get()
  async getList(): Promise<[string]> {
    return await this.naverDataService.getList({ pageNum: 1 });
  }
}
