import { BadRequestException } from '@nestjs/common';

import { InjectableService } from '../../../common/decorators/common.decorator';
import { Team } from '../entities/team.entity';
import { User } from '../entities/user.entity';
import { TeamRepository } from '../repositories/team.repository';

@InjectableService()
export class TeamService {
  constructor(private teamRepository: TeamRepository) {}

  async isUserMemberofTeam(user: User, team: Team): Promise<boolean> {
    const teamInfo = await this.teamRepository.count({
      join: {
        alias: 'team',
        innerJoin: {
          user: 'team.users',
          owner: 'team.owner',
        },
      },
      where: (qb) => {
        qb.where('team.id = :id', { id: team.id });
        qb.andWhere((qb) => {
          qb.where('user.id = :userId', { userId: user.id }).orWhere('owner.id = :userId', { userId: user.id });
        });
      },
    });

    return !!teamInfo;
  }

  async createDefaultTeam(owner: User): Promise<Team> {
    const team = await this.teamRepository.createAndSave({
      owner,
      name: 'default',
    });

    return team;
  }

  async addUserToTeam(teamId: number, userId: number): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id: teamId }, relations: ['users'] });

    const userAlreadyExist = team.users.find((user) => user.id === userId);

    if (userAlreadyExist) {
      throw new BadRequestException('User already exist');
    }

    team.users.push({ id: userId } as User);

    const updatedTeam = await this.teamRepository.updateById(team.id, { users: team.users });

    return updatedTeam;
  }
}
