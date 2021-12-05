import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Monitor } from '../../monitor/entity/monitor.entity';
import { DataCenter } from './data-center.entity';

@Entity()
export class Worker extends BasicEntity {
  @ManyToMany(() => Monitor)
  @JoinColumn()
  monitors: Monitor[];

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
