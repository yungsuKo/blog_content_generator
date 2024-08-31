import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPostDTO } from './dtos/blogPost.dto';
import { BlogPost } from './entities/blogpost.entity';

@Injectable()
export class NaverDataService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
  ) {}

  async getList({ pageNum }: { pageNum: number }): Promise<[BlogPostDTO]> {
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
      const question_title = $list('.title').text().trim();
      const detail_url = $list('.title > a').attr('href');
      result.push({ question_title, detail_url, pageNum });
    });
    await page.close();
    result.pop();
    // this.blogPostRepository.save(result);
    const promises = result.map(async (res) => {
      const page = await browser.newPage();
      await page.goto(`https://kin.naver.com${res.detail_url}`);
      const content = await page.content();
      const $ = cheerio.load(content);
      const question_desc = $('div.questionDetail').text().trim();
      const answersList = $('div.contentBox');
      const answers = [];
      answersList.map((idx, node) => {
        const $node = cheerio.load(node);
        const answer = $node('div.answerDetail').text().trim();
        answers.push(answer);
      });
      res.question_desc = question_desc;
      res.answers = answers;
      await page.close();
    });

    Promise.all(promises).then(async () => {
      await browser.close();
      return await this.blogPostRepository.save(result);
    });

    return;
    // 크롤러 성능 향상
  }

  async getContent({ id }: { id: number }) {
    const title = 'aa';
    return id;
  }
}
