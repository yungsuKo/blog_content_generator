import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from './entities/blogpost.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NaverDataService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
  ) {}

  async getList({ pageNum }: { pageNum: number }): Promise<[string]> {
    const url = `https://kin.naver.com/best/listaha.naver?svc=KIN&dirId=7&page=${pageNum}`;
    const browser = await puppeteer.launch({
      headless: false,
      waitForInitialPage: true,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url);
    const content = await page.content();
    const $ = cheerio.load(content);
    const lists = $('#au_board_list > tr');
    const result = [];
    lists.map((idx, list) => {
      const $list = cheerio.load(list);
      const question = $list('.title').text().trim();
      const detail_url = $list('.title > a').attr('href');
      result.push({ question, detail_url });
    });
    await page.close();

    console.log(result);
    // this.blogPostRepository.save(result);
    result.forEach(async (res) => {
      const page = await browser.newPage();
      await page.goto(`https://kin.naver.com${res.detail_url}`);
    });

    // 크롤러 성능 향상
    return ['aaa'];
  }
}
