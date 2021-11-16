import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '../../account/entities/user.entity';
import { RolePermissionMetDataKey } from '../config/role-permission.config';
import { Role } from '../enum/role.enum';

@Injectable()
export class RolePermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const requiredRoles = this.reflector.get<Role[]>(RolePermissionMetDataKey, context.getHandler());

    if (requiredRoles.length === 0) {
      return true;
    }

    const hasPermission =
      (request.user.isSystemOwner && requiredRoles.includes(Role.Owner)) ||
      (request.user.isSystemAdmin && requiredRoles.includes(Role.Admin)) ||
      (request.user && requiredRoles.includes(Role.User));

    if (!hasPermission) {
      return false;
    }

    return true;
  }
}
