import { Controller, Get, Param } from '@nestjs/common';
import { NaverDataService } from './naver_data.service';

@Controller('naver-data')
export class NaverDataController {
  constructor(private readonly naverDataService: NaverDataService) {}

  @Get(':id')
  async getList(@Param() params: any): Promise<[string]> {
    return await this.naverDataService.getList({ pageNum: params.id });
  }
}
