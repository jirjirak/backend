import { User } from 'src/app/account/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { IsStringField } from '../../../common/decorators/common.decorator';
import { Team } from '../../account/entities/team.entity';
import { Monitor } from './monitor.entity';

@Entity()
export class Directory extends BasicEntity {
  @ManyToOne(() => Directory)
  @JoinColumn()
  parent: Directory;

  @OneToMany(() => Directory, (directory) => directory.parent)
  children: Directory[];

  @OneToMany(() => Monitor, (monitor) => monitor.directory)
  monitors: Monitor[];

  @ManyToOne(() => Team, { nullable: false })
  @JoinColumn()
  team: Team;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  creator: User;

  @IsStringField()
  @Column()
  name: string;

  @Column({ default: false })
  isRootDirectory: boolean;
}
