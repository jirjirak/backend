import { User } from 'src/app/account/entities/user.entity';
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

  async createRootDirectory(creator: User, team: Team): Promise<Directory> {
    const directory = await this.directoryRepository.createAndSave({
      team,
      creator,
      name: 'root',
      isRootDirectory: true,
    });

    return directory;
  }

  async create(team: Team, creator: User, name: string, parent: Directory): Promise<Directory> {
    const directory = await this.directoryRepository.createAndSave({
      team,
      name,
      creator,
      parent,
    });

    return directory;
  }

  async list(teamId: number, userId: number): Promise<Directory[]> {
    const directories = await this.directoryRepository
      .createQueryBuilder('directory')
      .where('directory.team = :team', { team: teamId })
      .leftJoinAndSelect('directory.monitors', 'monitor')
      .leftJoinAndSelect('monitor.permissions', 'monitorPermission', 'monitorPermission.user = :userId', {
        userId,
      })
      .leftJoinAndSelect('directory.permissions', 'directoryPermission', 'directoryPermission.user = :userId', {
        userId,
      })
      .loadRelationIdAndMap('directory.parent', 'directory.parent')
      .getMany();

    const treeDirectory: Directory[] = ListToTree(directories);

    return treeDirectory;
  }
}
