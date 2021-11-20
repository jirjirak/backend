import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Monitor } from '../../monitor/entity/monitor.entity';

@Entity()
export class Event extends BasicEntity {
  @ManyToOne(() => Monitor)
  @JoinColumn()
  monitor: Monitor;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column({ nullable: true })
  statusCode: number;

  @Column()
  status: string;
}
