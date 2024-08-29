import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

@Injectable()
export class NaverDataService {
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
    lists.map((idx, list) => {
      const $list = cheerio.load(list);
      console.log($list('.title').text().trim());
    });
    // 크롤러 성능 향상
    return ['aaa'];
  }
}
