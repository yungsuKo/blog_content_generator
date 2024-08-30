import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlogPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question_title: string;

  @Column()
  question_desc: string;

  @Column()
  detail_url: string;

  @Column()
  status: number;

  @Column({ default: '' })
  answer: string;

  @Column({ default: '' })
  result_title: string;

  @Column({ default: '' })
  result_desc: string;
}
