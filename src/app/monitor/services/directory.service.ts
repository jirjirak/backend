import { ForbiddenException } from '@nestjs/common';

import { InjectableService } from '../../../common/decorators/common.decorator';
import { ListToTree } from '../../../common/functions/list-to-tree.func';
import { Team } from '../../account/entities/team.entity';
import { User } from '../../account/entities/user.entity';
import { Directory } from '../entity/directory.entity';
import { DirectoryRepository } from '../repositories/directory.repository';

@InjectableService()
export class DirectoryService {
  constructor(private directoryRepository: DirectoryRepository) {}

  async create(team: Team, name: string, parent: Directory): Promise<Directory> {
    const directory = await this.directoryRepository.createAndSave({
      team,
      name,
      parent,
    });

    return directory;
  }

  async list(): Promise<Directory[]> {
    const directories = await this.directoryRepository.find({
      where: { team: 1 },
      relations: ['monitors'],
      loadRelationIds: { relations: ['parent'] },
    });

    const treeDirectory: Directory[] = ListToTree(directories);

    return treeDirectory;
  }
}
