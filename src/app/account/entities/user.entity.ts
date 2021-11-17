import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Session } from '../../auth/entities/session.entity';
import { Team } from './team.entity';

@Entity()
export class User extends BasicEntity {
  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Team, (team) => team.owner)
  teams: Team[];

  @OneToMany(() => Team, (team) => team.users)
  joinedTeams: Team[];

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

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  phoneNumberVerified: boolean;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: false })
  isSystemAdmin: boolean;

  @Column({ default: false })
  isSystemOwner: boolean;

  @Column({ default: false })
  blocked: boolean;
}
