import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { IsNumberField } from '../decorators/common.decorator';

export class BasicEntity {
  @IsNumberField()
  @PrimaryGeneratedColumn()
  id: number;

  @DeleteDateColumn({ nullable: true, default: null })
  DeletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
