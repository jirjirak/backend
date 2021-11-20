import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { IsStringField } from '../../../common/decorators/common.decorator';
import { Directory } from '../../monitor/entity/directory.entity';
import { User } from './user.entity';

@Entity()
export class Team extends BasicEntity {
  @IsStringField()
  @Column()
  name: string;

  @OneToMany(() => Directory, (directory) => directory.team)
  directories: Directory[];

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  owner: User;
}
