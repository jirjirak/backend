import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Team } from '../../account/entities/team.entity';
import { User } from '../../account/entities/user.entity';

@Entity()
export class Tag extends BasicEntity {
  @Column()
  type: string;

  @Column()
  label: string;

  @ManyToOne(() => Team)
  @JoinColumn()
  team: Team[];

  @ManyToOne(() => User)
  user: User;
}
