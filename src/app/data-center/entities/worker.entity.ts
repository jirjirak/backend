import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { DataCenter } from './data-center.entity';

@Entity()
export class Worker extends BasicEntity {
  @Column()
  ipv4: string;

  @Column()
  status: string;

  @Column({ default: 100000 })
  requestPerSecond: number;

  @Column({ default: 'asdsadasdsadasdasdasdas' })
  token: string;

  @ManyToOne(() => DataCenter)
  @JoinColumn()
  dataCenter: DataCenter;
}
