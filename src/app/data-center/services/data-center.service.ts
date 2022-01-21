import { User } from 'src/app/account/entities/user.entity';
import { InjectableService } from 'src/common/decorators/common.decorator';
import { RegisterDataCenterBodyDto } from '../dto/data-center/register.dto';
import { DataCenter } from '../entities/data-center.entity';
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
}
