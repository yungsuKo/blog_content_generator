import { Controller, Get, Param } from '@nestjs/common';
import { NaverDataService } from './naver_data.service';
import { BlogPostDTO } from './dtos/blogPost.dto';

@Controller('naver-data')
export class NaverDataController {
  constructor(private readonly naverDataService: NaverDataService) {}

  @Get(':pageNum')
  async getList(@Param() params: any): Promise<[BlogPostDTO]> {
    return await this.naverDataService.getList({ pageNum: params.pageNum });
  }

  @Get('content/:id')
  async getTitle(@Param() params: any) {
    return await this.naverDataService.getContent({ id: params.id });
  }
}
