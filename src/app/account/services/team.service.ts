import { InjectableService } from '../../../common/decorators/common.decorator';
import { Team } from '../entities/team.entity';
import { User } from '../entities/user.entity';
import { TeamRepository } from '../repositories/team.repository';

@InjectableService()
export class TeamService {
  constructor(private teamRepository: TeamRepository) {}

  async createDefaultTeam(owner: User): Promise<Team> {
    const team = await this.teamRepository.createAndSave({
      owner,
      name: 'default',
    });

    return team;
  }
}
