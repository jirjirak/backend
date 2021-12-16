import { Monitor } from 'src/app/monitor/entity/monitor.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Team } from '../../account/entities/team.entity';
import { Tag } from '../../tag/entities/tag.entity';

@Entity()
export class DataCenter extends BasicEntity {
  @Column()
  name: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isPrivate: boolean;

  @ManyToMany(() => Team)
  teams: Team[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @ManyToMany(() => Monitor)
  @JoinColumn()
  monitors: Monitor[];
}
