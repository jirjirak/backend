import { Worker } from 'src/app/worker/entities/worker.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { User } from '../../account/entities/user.entity';
import { DnsQueryType, MonitorStatus, MonitorType, MonitorUptimeStatus } from '../enum/monitor.enum';
import { Directory } from './directory.entity';
import { Permission } from './permission.entity';

@Entity()
export class Monitor extends BasicEntity {
  @ManyToOne(() => Directory, { nullable: false })
  @JoinColumn()
  directory: Directory;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  creator: User;

  @ManyToMany(() => Worker)
  workers: Worker[];

  @OneToMany(() => Permission, (permission) => permission.monitor)
  permissions: Permission[];

  @Column({ type: 'enum', enum: MonitorUptimeStatus, default: MonitorUptimeStatus.Unknown })
  uptimeStatus: MonitorUptimeStatus;

  @Column()
  interval: number;

  @Column({ nullable: true })
  cronExpression: string;

  @Column()
  friendlyName: string;

  @Column({ enum: MonitorType })
  type: MonitorType;

  @Column()
  address: string;

  @Column({ type: 'enum', enum: MonitorStatus, default: MonitorStatus.Waiting })
  status: MonitorStatus;

  @Column({ default: false })
  flipStatus: boolean;

  @Column({ default: 1 })
  errorTolerance: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 5000 })
  timeOut: number;

  @Column({ default: 5000 })
  expectedResponseTime: number;

  // http fields
  @Column({ nullable: true })
  method: string;

  @Column({ nullable: true })
  ExpectedMinStatusCode: number;

  @Column({ nullable: true })
  ExpectedMaxStatusCode: number;

  @Column({ nullable: true })
  requestBody: string;

  @Column({ nullable: true })
  requestHeader: string;

  @Column({ nullable: true })
  requestParam: string;

  @Column({ nullable: true })
  requestQuery: string;

  @Column({ nullable: true })
  ExpectedResBody: string;

  @Column({ nullable: true })
  ExpectedResHeader: string;

  // ping fields

  @Column({ nullable: true })
  port: number;

  // dns fields

  @Column({ enum: DnsQueryType, nullable: true })
  dnsQueryType: DnsQueryType;

  @Column({ nullable: true })
  dnsValue: string;
}
