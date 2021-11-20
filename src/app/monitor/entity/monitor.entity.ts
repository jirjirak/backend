import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Team } from '../../account/entities/team.entity';
import { DnsQueryType, MonitorStatus, MonitorType } from '../enum/monitor.enum';
import { Directory } from './directory.entity';
import { Permission } from './permission.entity';

@Entity()
export class Monitor extends BasicEntity {
  @ManyToOne(() => Directory, { nullable: false })
  @JoinColumn()
  directory: Directory;

  @ManyToOne(() => Team, { nullable: false })
  @JoinColumn()
  team: Team;

  @OneToMany(() => Permission, (permission) => permission.monitor)
  permissions: Permission[];

  @ManyToOne(() => Monitor)
  @JoinColumn()
  monitor: Monitor;

  @Column()
  friendlyName: string;

  @Column({ enum: MonitorType })
  type: MonitorType;

  @Column()
  address: string;

  @Column({ enum: MonitorStatus, default: MonitorStatus.Waiting })
  status: MonitorStatus;

  @Column({ nullable: true })
  description: string;

  @Column()
  timeInterval: number;

  @Column({ default: false })
  flipStatus: boolean;

  @Column({ default: 1 })
  errorTolerance: number;

  @Column({ nullable: true })
  method: string;

  @Column({ default: 5000 })
  timeOut: number;

  @Column({ default: 5000 })
  expectedResponseTime: number;

  @Column({ nullable: true })
  port: number;

  @Column({ enum: DnsQueryType, nullable: true })
  dnsQueryType: DnsQueryType;

  @Column({ nullable: true })
  dnsValue: string;
}
