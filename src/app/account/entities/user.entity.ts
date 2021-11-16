import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Team } from './team.entity';

@Entity()
export class User extends BasicEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: false })
  isSystemAdmin: boolean;

  @Column({ default: false })
  isSystemOwner: boolean;

  @OneToMany(() => Team, (team) => team.owner)
  teams: Team[];

  @OneToMany(() => Team, (team) => team.users)
  joinedTeams: Team[];
}
