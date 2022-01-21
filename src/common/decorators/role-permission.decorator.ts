import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

import { RolePermissionMetDataKey } from '../../app/auth/config/role-permission.config';
import { Role } from '../../app/auth/enum/role.enum';
import { RolePermissionGuard } from '../../app/auth/guard/permission.guard';

export const UserRolePermission = (...roles: Role[]): MethodDecorator => {
  if (roles.length === 0) {
    roles = [Role.Owner, Role.Admin, Role.User];
  }

  return applyDecorators(
    ApiBearerAuth(),
    SetMetadata(RolePermissionMetDataKey, roles),
    UseGuards(AuthGuard('jwt'), RolePermissionGuard),
  );
};
