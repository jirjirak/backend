import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Team } from '../../account/entities/team.entity';
import { User } from '../../account/entities/user.entity';
import { Directory } from './directory.entity';
import { Monitor } from './monitor.entity';

@Entity()
export class Permission extends BasicEntity {
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Team, { nullable: false })
  @JoinColumn()
  team: Team;

  @ManyToOne(() => Directory)
  @JoinColumn()
  directory: Directory;

  @ManyToOne(() => Directory)
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
