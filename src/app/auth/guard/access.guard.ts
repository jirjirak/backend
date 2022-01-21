import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { isNumber } from 'class-validator';
import { Request } from 'express';
import { isArray, isEmpty } from 'lodash';
import { Permission } from 'src/app/monitor/entity/permission.entity';
import { getRepository, In } from 'typeorm';

import { User } from '../../account/entities/user.entity';

export type Action = 'read' | 'create' | 'update' | 'delete';
export type Source = 'team' | 'monitor';

export class AllowedToAccessGuard implements CanActivate {
  user: any;
  action: Action;
  source: Source;

  teamKey: string[] = ['team', 'teams'];
  monitorKey: string[] = ['monitor', 'monitors'];

  private logger = new Logger(AllowedToAccessGuard.name);

  constructor(action: Action, source: Source) {
    this.action = action;
    this.source = source;
  }

  private findIdsFromSource(data: any): number[] {
    const keys = this.source === 'team' ? this.teamKey : this.monitorKey;

    const ids = [];

    if (isArray(data)) {
      data.forEach((item) => {
        //

        keys.forEach((key) => {
          const value = item[key];

          if (isArray(value)) {
            value.forEach((id) => {
              if (isNumber(+id)) {
                ids.push(+id);
              }
            });
          } else {
            if (isNumber(+value)) {
              ids.push(+value);
            }
          }
        });

        //
      });
    } else {
      keys.forEach((key) => {
        const value = data[key];

        if (isArray(value)) {
          value.forEach((id) => {
            if (isNumber(+id)) {
              ids.push(+id);
            }
          });
        } else {
          if (isNumber(+value)) {
            ids.push(+value);
          }
        }
      });
    }

    return ids;
  }

  private getIds(request: Request): number[] {
    let data: any;

    let ids: number[] = [];

    data = !isEmpty(request?.params) ? request?.params : [];
    ids = this.findIdsFromSource(data);

    if (isEmpty(ids)) {
      data = !isEmpty(request?.body) ? request?.body : [];
      ids = this.findIdsFromSource(data);
    }

    if (isEmpty(ids)) {
      data = !isEmpty(request?.query) ? request?.query : [];
      ids = this.findIdsFromSource(data);
    }

    if (!ids) {
      throw new InternalServerErrorException('cannot find any team/monitor id');
    }

    return ids;
  }

  private async allowedToAccess(user: User, ids: number[]): Promise<boolean> {
    const permissionRepository = getRepository(Permission);

    const where = {
      user,
      ...(this.source === 'team' ? { team: In(ids) } : { monitor: In(ids) }),
      [this.action]: true,
    };

    const permissions = await permissionRepository.count({ where });

    return ids.length === permissions;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.user) {
      this.logger.error(`use IsOwner Decorator Upper than UserRolePermission Decorator `);
      throw new InternalServerErrorException('IsOwner guard exception');
    }

    if (req?.user?.isSystemOwner || req?.user?.isSystemAdmin) {
      return true;
    }

    const ids = this.getIds(req);

    if (isEmpty(ids)) {
      throw new BadRequestException('cannot find any team/monitor id');
    }

    const allowedToAccess = await this.allowedToAccess(req.user, ids);

    if (!allowedToAccess) {
      throw new ForbiddenException(`you are not allowed to access ${this.action} ${this.source}`);
    }

    return true;
  }
}
