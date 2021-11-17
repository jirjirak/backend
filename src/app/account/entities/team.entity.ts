import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { IsStringField } from '../../../common/decorators/common.decorator';
import { User } from './user.entity';

@Entity()
export class Team extends BasicEntity {
  @IsStringField()
  @Column()
  name: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  owner: User;
}
