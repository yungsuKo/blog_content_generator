import { Controller, Get, Param } from '@nestjs/common';
import { LandBlogService } from './land_blog.service';

@Controller('land-blog')
export class LandBlogController {
  constructor(private readonly landBlogService: LandBlogService) {}

  // crom setting으로 변경 예정
  // getFormatDate
  @Get(':date')
  async getNewsList(@Param() params: any) {
    return await this.landBlogService.getData({ date: params.date });
  }
}
