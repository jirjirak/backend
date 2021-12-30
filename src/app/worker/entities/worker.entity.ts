import { DataCenter } from 'src/app/data-center/entities/data-center.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Monitor } from '../../monitor/entity/monitor.entity';
import { WorkerStatus } from '../enum/worker.enum';

@Entity()
export class Worker extends BasicEntity {
  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @Column({ nullable: false })
  ipv4: string;

  @Column({ nullable: false })
  ipv6: string;

  @Column({ type: 'enum', enum: WorkerStatus })
  status: WorkerStatus;

  @Column({ default: 100000, nullable: true })
  requestPerSecond: number;

  @ManyToOne(() => DataCenter, { nullable: false })
  @JoinColumn()
  dataCenter: DataCenter;

  @ManyToMany(() => Monitor)
  @JoinColumn()
  monitors: Monitor[];
}
