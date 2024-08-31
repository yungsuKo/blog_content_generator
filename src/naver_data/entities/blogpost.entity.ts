import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  answers: string;

  @Column()
  pageNum: number;

  @Column({ default: 0 })
  status: number;

  @Column({ default: '' })
  result_title: string;

  @Column({ default: '' })
  result_desc: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
