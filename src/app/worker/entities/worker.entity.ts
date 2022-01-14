import { User } from 'src/app/account/entities/user.entity';
import { DataCenter } from 'src/app/data-center/entities/data-center.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Monitor } from '../../monitor/entity/monitor.entity';
import { WorkerStatus } from '../enum/worker.enum';

@Entity()
export class Worker extends BasicEntity {
  @Column()
  friendlyName: string;

  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;

  @Column({ nullable: true })
  identifier: string;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @Column({ nullable: true })
  ipv4: string;

  @Column({ nullable: true })
  ipv6: string;

  @Column({ default: false })
  connected: boolean;

  @Column({ type: 'enum', enum: WorkerStatus })
  status: WorkerStatus;

  @Column({ default: 1000, nullable: true })
  capacity: number;

  @ManyToOne(() => DataCenter, { nullable: false })
  @JoinColumn()
  dataCenter: DataCenter;

  @ManyToMany(() => Monitor)
  @JoinColumn()
  monitors: Monitor[];
}
