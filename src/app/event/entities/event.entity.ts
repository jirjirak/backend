import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Monitor } from '../../monitor/entity/monitor.entity';

@Entity()
export class Event extends BasicEntity {
  @ManyToOne(() => Monitor, { nullable: false })
  @JoinColumn()
  monitor: Monitor;

  @Column()
  triggeredAt: Date;

  @Column({ nullable: true })
  startAt: Date;

  @Column({ nullable: true })
  endAt: Date;

  @Column({ default: false })
  isOk: boolean;

  @Column({ nullable: true })
  errorMessage: string;

  @Column({ nullable: true })
  errorCode: number;

  // http fields

  @Column({ nullable: true })
  dnsLookup: number;

  @Column({ nullable: true })
  tcpConnection: number;

  @Column({ nullable: true })
  tlsHandshake: number;

  @Column({ nullable: true })
  contentTransfer: number;

  @Column({ nullable: true })
  firstByte: number;

  @Column({ nullable: true })
  statusCode: number;

  @Column({ nullable: true })
  resBody: string;

  @Column({ nullable: true })
  reqBody: string;

  @Column({ nullable: true })
  resHeader: string;

  @Column({ nullable: true })
  reqHeader: string;

  @Column({ nullable: true })
  reqQuery: string;
}
