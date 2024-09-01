import { Module } from '@nestjs/common';
import { LandBlogService } from './land_blog.service';
import { LandBlogController } from './land_blog.controller';

@Module({
  controllers: [LandBlogController],
  providers: [LandBlogService],
})
export class LandBlogModule {}
