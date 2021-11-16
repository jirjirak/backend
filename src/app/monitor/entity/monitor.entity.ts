import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Directory } from './directory.entity';

@Entity()
export class Monitor extends BasicEntity {
  @Column()
  name: string;

  @Column()
  type: string;

  @ManyToOne(() => Directory)
  @JoinColumn()
  directory: Directory;
}
