import { User } from 'src/app/account/entities/user.entity';
import { Monitor } from 'src/app/monitor/entity/monitor.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { BasicEntity } from '../../../common/basic/entity.basic';
import { Team } from '../../account/entities/team.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { DataCenterStatus } from '../enum/data-center.enum';

@Entity()
export class DataCenter extends BasicEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: DataCenterStatus })
  status: DataCenterStatus;

  @Column({ nullable: false })
  country: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isPrivate: boolean;

  @ManyToMany(() => Team, { nullable: false })
  @JoinTable()
  teams: Team[];

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  creator: User;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @ManyToMany(() => Monitor)
  @JoinColumn()
  monitors: Monitor[];
}
