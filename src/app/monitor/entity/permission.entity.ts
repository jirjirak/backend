import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Team } from '../../account/entities/team.entity';
import { User } from '../../account/entities/user.entity';
import { Monitor } from './monitor.entity';

@Index('USER-TEAM', ['user', 'team'], { unique: true })
@Index('USER-MONITOR', ['user', 'monitor'], { unique: true })
@Index('SEARCH', ['user', 'monitor', 'team', 'create', 'update', 'delete', 'read'])
@Entity()
export class Permission extends BasicEntity {
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Team)
  @JoinColumn()
  team: Team;

  @ManyToOne(() => Monitor)
  @JoinColumn()
  monitor: Monitor;

  @Column({ default: true })
  read: boolean;

  @Column({ default: false })
  update: boolean;

  @Column({ default: false })
  create: boolean;

  @Column({ default: false })
  delete: boolean;
}
