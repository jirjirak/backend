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
  startAt: number;

  @Column({ nullable: true })
  endAt: number;

  @Column({ default: false })
  isOk: boolean;

  @Column({ nullable: true })
  error: string;

  @Column({ nullable: true })
  errorCode: number;

  // http fields

  @Column({ nullable: true })
  dnsLookupAt: number;

  @Column({ nullable: true })
  tcpConnectionAt: number;

  @Column({ nullable: true })
  tlsHandshakeAt: number;

  @Column({ nullable: true })
  contentTransferAt: number;

  @Column({ nullable: true })
  firstByteAt: number;

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
