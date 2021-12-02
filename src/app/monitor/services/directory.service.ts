
import { InjectableService } from '../../../common/decorators/common.decorator';
import { ListToTree } from '../../../common/functions/list-to-tree.func';
import { Team } from '../../account/entities/team.entity';
import { Directory } from '../entity/directory.entity';
import { DirectoryRepository } from '../repositories/directory.repository';

@InjectableService()
export class DirectoryService {
  constructor(private directoryRepository: DirectoryRepository) {}

  async IsDirectoryNameUniq(team: Team, name: string): Promise<boolean> {
    const count = await this.directoryRepository.count({ team, name });
    return !count;
  }

  async create(team: Team, name: string, parent: Directory): Promise<Directory> {
    const directory = await this.directoryRepository.createAndSave({
      team,
      name,
      parent,
    });

    return directory;
  }

  async list(): Promise<Directory[]> {
    // const directories = await this.directoryRepository.find({
    //   where: { team: 7 },
    //   relations: ['monitors', 'monitors.permissions', 'permissions'],
    //   loadRelationIds: { relations: ['parent'] },
    // });

    let directories = await this.directoryRepository
      .createQueryBuilder('directory')
      .where('directory.team = :team', { team: 7 })
      .leftJoinAndSelect('directory.monitors', 'monitor')
      .leftJoinAndSelect('monitor.permissions', 'monitorPermission', 'monitorPermission.user = :userId', {
        userId: 7,
      })
      .leftJoinAndSelect('directory.permissions', 'directoryPermission', 'directoryPermission.user = :userId', {
        userId: 7,
      })
      .loadRelationIdAndMap('directory.parent', 'directory.parent')
      .getMany();

    directories = directories.filter((item) => item?.permissions?.[0]?.read !== false);

    const treeDirectory: Directory[] = ListToTree(directories);

    return treeDirectory;
  }
}
