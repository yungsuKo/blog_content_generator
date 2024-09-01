import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LandPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  news_list: string;
}
