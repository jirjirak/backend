import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { User } from './user.entity';

@Entity()
export class Team extends BasicEntity {
  @Column()
  name: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @ManyToOne(() => User)
  @JoinColumn()
  owner: User;
}
