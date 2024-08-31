import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPostDTO } from './dtos/blogPost.dto';
import { BlogPost } from './entities/blogpost.entity';
import OpenAI from 'openai';

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
    const blogPost = await this.blogPostRepository.findOneBy({ id });
    const openai = new OpenAI();
    const prompt_answers = blogPost.answers.replace(/{/g, '').replace(/}/g, '');
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      stream: true,
      messages: [
        {
          role: 'system',
          content: `You are a blogger and write content in mdx format.
          You are writing content about health and workouts, so if user requests is not relate in the subject just answer in short.
          `,
        },
        {
          role: 'user',
          content: `
          사람들의 질문, 답변 데이터를 기반으로 건강에 관련한 블로그 글을 작성할거야
          질문과 답변을 바탕으로 사람들이 검색할만한 제목을 작성하고, 제목과 어울리는 글을 작성해줘.
          독자들에게 말을 건네는 식으로 말을 풀어서 작성해줘. 독자는 30~50 여성이야.
          문단을 서론, 본론, 결론 순으로 작성하되, 서론/ 본론/ 결론 단어는 사용하지 마.
          서론은 글의 주제와 독자가 기대할 수 있는 내용을 간략하게 소개해줘. 질문을 던지거나 통계, 인용구 등으로 독자의 관심을 끌어줘.
          본론은 소제목으로 글을 여러 섹션으로 나누어 주제를 세분화해줘. 각 섹션에서는 구체적인 정보, 사례, 데이터를 통해 글의 개성과 힘을 견고하게 해줘.
          결론에서는 서론과 본론의 핵심을 요약하고, 의견을 한 줄로 정리해 줘. 그리고 ‘다음 글을 기대해 주세요’라는 메시지를 포함해줘.
          서론 뒤에는 전체 글의 개요를 파악할 수 있도록 목차를 넣어줘.
          그리고 최종 답변은 mdx 파일 포맷에 맞게끔 아래와 같은 구성으로 작성해줘.
          <포맷 시작>
          ---
          title: 제목
          data: 오늘 날짜
          desc : 설명
          ---
          본문 내용
          <포맷 끝>

          질문 : ${blogPost.question_title}, ${blogPost.question_desc}
          답변 : ${prompt_answers}`,
        },
      ],
    });

    let data = '';
    for await (const part of stream) {
      const chunk = part.choices[0].delta.content || '';
      data += chunk;
      const endIndex = data.indexOf('}');
      if (endIndex !== -1) {
        const startIndex = data.indexOf('{');
        const jsonObject = data.slice(startIndex, endIndex + 1);
        data = data.slice(endIndex + 1);
        try {
          const parsedObject = JSON.parse(jsonObject);
          console.log(parsedObject); // Handle the parsed JSON object here

          // Make an API call
        } catch (err) {
          console.error('Error while parsing JSON:', err);
        }
      }
    }
    const newBlogPost = {
      ...blogPost,
      result_desc: data,
    };
    const result = await this.blogPostRepository.save(newBlogPost);

    return result;
  }
}
