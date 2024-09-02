import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

@Injectable()
export class LandBlogService {
  async getData({ date }: { date: string }) {
    const url = `https://news.naver.com/breakingnews/section/101/260?date=${date}`;
    const browser = await puppeteer.launch({
      headless: false,
      waitForInitialPage: true,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(url);

    // autoscroll while content exists
    const buttonSelector =
      '#newsct > div.section_latest > div > div.section_more > a';
    while (true) {
      try {
        // 버튼이 존재하는지 확인
        await page.waitForSelector(buttonSelector);
        // 버튼이 존재하면 클릭
        await page.click(buttonSelector);
        await sleep(1000);
      } catch (e) {
        // 버튼이 더 이상 존재하지 않으면 while 루프를 종료
        console.log('더 이상 버튼이 존재하지 않습니다.');
        break;
      }
    }

    const content = await page.content();
    const $ = cheerio.load(content);
    const lists = $(
      '#newsct > div.section_latest > div > div.section_latest_article._CONTENT_LIST._PERSIST_META > div:nth-child(n) > ul > li:nth-child(n) > div',
    );
    const filteredList = [];
    lists.map((idx, list) => {
      const $list = cheerio.load(list);
      const title = $list('div.sa_text > a > strong').text().trim();
      const url = $list('a.sa_text_title').attr('href');
      const company = $list('div.sa_text_info_left > div.sa_text_press')
        .text()
        .trim();
      const time = $list('div.sa_text_info_left > div.sa_text_datetime')
        .text()
        .trim();
      if (company == '매일경제' || company == '한국경제') {
        filteredList.push({
          title,
          url,
          time,
        });
      }
    });
    await page.close();
    const promises = filteredList.map(async (article) => {
      const page = await browser.newPage();
      await page.goto(article.url);
      const content = await page.content();
      const $ = cheerio.load(content);
      let p = $('#dic_area').text().trim();
      p = p
        .split('+')
        .filter((str) => str.length > 10)
        .join(' ');
      if (p.length > 500) {
        article.desc =
          p.substr(0, 250) + '...중략...' + p.substr(p.length - 250);
      } else {
        article.desc = p;
      }

      await page.close();
    });

    Promise.all(promises).then(async () => {
      await browser.close();
      console.log(filteredList);
      console.log(filteredList.length);
    });

    return 'success';
  }
}
