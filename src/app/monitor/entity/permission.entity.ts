import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Team } from '../../account/entities/team.entity';
import { User } from '../../account/entities/user.entity';
import { PermissionType } from '../enum/permission.enum';
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

  @Index()
  @Column({ enum: PermissionType })
  type: PermissionType;

  @ManyToOne(() => Directory)
  @JoinColumn()
  directory: Directory;

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
