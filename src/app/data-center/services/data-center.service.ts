import { Team } from 'src/app/account/entities/team.entity';
import { User } from 'src/app/account/entities/user.entity';
import { InjectableService } from 'src/common/decorators/common.decorator';
import { FindConditions, In } from 'typeorm';
import { RegisterDataCenterBodyDto } from '../dto/data-center/register.dto';
import { DataCenter } from '../entities/data-center.entity';
import { DataCenterStatus } from '../enum/data-center.enum';
import { DataCenterRepository } from '../repositories/data-center.repository';

@InjectableService()
export class DataCenterService {
  constructor(private dataCenterRepository: DataCenterRepository) {}

  async add(creator: User, data: RegisterDataCenterBodyDto): Promise<DataCenter> {
    const dataCenter = await this.dataCenterRepository.createAndSave(
      { ...data, creator },
      { relations: ['teams', 'tags'] },
    );
    return dataCenter;
  }

  async findDataCenters(teams: Team[]): Promise<DataCenter[]> {
    const teamsId = teams?.map((team) => team.id);

    const dataCenters = await this.dataCenterRepository.find({
      join: {
        alias: 'dataCenter',
        innerJoin: {
          teams: 'dataCenter.teams',
        },
      },
      where: (qb) => {
        if (teamsId) {
          qb.where('teams.id IN (:...teamsId)', { teamsId });
        }
        // qb.andWhere('dataCenter.status = :status', { status: DataCenterStatus.Active });
        qb.orWhere('dataCenter.isPrivate = :isPrivate', { isPrivate: false });
      },
      order: { country: 'ASC', city: 'ASC' },
    });

    return dataCenters;
  }
}
