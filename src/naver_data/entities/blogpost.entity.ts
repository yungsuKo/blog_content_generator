import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlogPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  detail_url: string;

  @Column()
  status: number;

  @Column({ default: '' })
  answer: string;

  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  description: string;
}
