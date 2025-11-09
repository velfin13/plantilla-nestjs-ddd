import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('tasks')
export class TaskEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ default: false })
  completed: boolean;
}
