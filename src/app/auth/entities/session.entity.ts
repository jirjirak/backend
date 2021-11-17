import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { User } from '../../account/entities/user.entity';

@Entity()
export class Session extends BasicEntity {
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @Column()
  expiresAt: Date;

  @Index()
  @Column()
  refreshToken: string;

  @Column({ nullable: true })
  ipv4: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  os: string;

  @Column({ nullable: true })
  device: string;

  @Column({ nullable: true })
  browser: string;
}
