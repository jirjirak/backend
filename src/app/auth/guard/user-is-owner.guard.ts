import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { isArray, isEmpty } from 'lodash';
import { getManager, getRepository, In } from 'typeorm';

import { Team } from '../../account/entities/team.entity';
import { User } from '../../account/entities/user.entity';
import { UserIsOwnerOptionInterface } from '../interface/guard.interface';

const logger = new Logger();

export class UserIsOwner implements CanActivate {
  entity: any;
  user: any;

  options: UserIsOwnerOptionInterface = {
    targetPkField: 'id',
  };

  constructor(entity: unknown, options?: UserIsOwnerOptionInterface) {
    this.entity = entity;
    this.options = { ...this.options, ...options };
  }

  private checkTeamExist(data: any) {
    if (!data) {
      return;
    }

    const team = data?.team || data?.teamId || data?.teams;

    if (team && team?.constructor?.name === 'Array') {
      return team;
    } else if (team) {
      return [team];
    } else {
      return;
    }
  }

  private findTeamsId(req: Request) {
    let team: number[] = [];

    team = this.checkTeamExist(req?.params);
    team ||= this.checkTeamExist(req?.query);
    team = this.checkTeamExist(req?.body);

    return team;
  }

  private initialize(request: Request, entity: unknown): void {
    this.user = request.user;

    this.options.identify ||= 'team';

    const sourcePkField = `${entity?.['name']?.[0].toLowerCase()}${entity?.['name']?.slice(
      1,
      entity?.['name']?.length,
    )}`;

    this.options.sourcePkField ||= sourcePkField;
  }

  private extractDataFromRequest(request: Request): unknown[] {
    let data: any;

    if (this.options.area) {
      data = request[this.options.area];
    } else {
      data = !isEmpty(request?.params) ? request?.params : null;
      data ||= !isEmpty(request?.query) ? request?.query : null;
      data ||= !isEmpty(request?.body) ? request?.body : null;

      if (!data) {
        throw new InternalServerErrorException('cannot determine any data');
      }

      data = isArray(data) ? data : [data];

      return data;
    }
  }

  private async checkTeamOwner(owner: User, teamsId: number[]) {
    const teamRepository = getRepository(Team);

    const total = await teamRepository.count({ where: { owner, id: In(teamsId) } });

    if (total !== teamsId.length) {
      throw new ForbiddenException('you are not owner of team');
    }
  }

  private async checkIsOwner(entity: any, user: User, data: unknown[], teams: number[]): Promise<void> {
    const repo = getRepository(entity);

    const recordsId = [];

    data.forEach((item) => {
      if (item[this.options.sourcePkField]) {
        recordsId.push(item[this.options.sourcePkField]);
      }
    });

    if (!recordsId || recordsId.length !== data.length) {
      return;
    }

    const condition = {};

    condition[this.options.targetPkField] = In(recordsId);

    if (this.options.identify === 'user') {
      condition['user'] = user.id;
    } else if (this.options.identify === 'team') {
      condition['team'] = In(teams);
    } else {
      throw new InternalServerErrorException('cannot identifier user ot team');
    }

    const result = await repo.count({ where: condition });

    if (result !== recordsId.length) {
      throw new ForbiddenException(`${this.options.sourcePkField} must belong to user`);
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<any>();

    if (!req.user) {
      logger.error(`use IsOwner Decorator Upper than UserRolePermission Decorator `, 'Decorator');
      throw new InternalServerErrorException('IsOwner guard exception');
    }

    if (req?.user?.isSystemOwner) {
      // return true;
    }

    this.initialize(req, this.entity);

    const data = this.extractDataFromRequest(req);

    const teams = this.findTeamsId(req);

    if (!teams || teams?.length === 0) {
      throw new BadRequestException('cannot find team');
    }

    await this.checkTeamOwner(req.user, teams);

    await this.checkIsOwner(this.entity, req.user as User, data, teams);

    return true;
  }
}
