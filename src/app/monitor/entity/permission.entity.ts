import { TeamRole } from 'src/app/account/enum/team.enum';
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

  @ManyToOne(() => Team)
  @JoinColumn()
  team: Team;

  @ManyToOne(() => Monitor)
  @JoinColumn()
  monitor: Monitor;

  @Column({ type: 'enum', enum: TeamRole, nullable: true })
  role: TeamRole;

  @ManyToOne(() => Directory)
  @JoinColumn()
  directory: Directory;

  @Column({ nullable: true })
  read: boolean;

  @Column({ nullable: true })
  update: boolean;

  @Column({ nullable: true })
  create: boolean;

  @Column({ nullable: true })
  delete: boolean;
}
