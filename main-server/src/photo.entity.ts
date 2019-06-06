import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Photos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;
}
