import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Team } from '../../account/entities/team.entity';
import { User } from '../../account/entities/user.entity';
import { DataCenter } from '../../data-center/entities/data-center.entity';

@Entity()
export class Tag extends BasicEntity {
  @Column()
  type: string;

  @Column()
  label: string;

  @ManyToMany(() => DataCenter)
  @JoinTable()
  DataCenter: DataCenter;

  @ManyToOne(() => Team)
  @JoinColumn()
  team: Team[];

  @ManyToOne(() => User)
  user: User;
}
