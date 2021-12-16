import { DataCenter } from 'src/app/data-center/entities/data-center.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Monitor } from '../../monitor/entity/monitor.entity';

@Entity()
export class Worker extends BasicEntity {
  @Column({ nullable: false })
  ipv4: string;

  @Column({ nullable: false })
  ipv6: string;

  @Column()
  status: string;

  @Column({ default: 100000 })
  requestPerSecond: number;

  @Column({ type: 'uuid' })
  uuid: string;

  @ManyToOne(() => DataCenter, { nullable: false })
  @JoinColumn()
  dataCenter: DataCenter;

  @ManyToMany(() => Monitor)
  @JoinColumn()
  monitors: Monitor[];
}
