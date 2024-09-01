import { Controller, Get, Param } from '@nestjs/common';
import { LandBlogService } from './land_blog.service';

@Controller('land-blog')
export class LandBlogController {
  constructor(private readonly landBlogService: LandBlogService) {}

  @Get(':date')
  async getNewsList(@Param() params: any) {
    return await this.landBlogService.getData({ date: params.date });
  }
}
