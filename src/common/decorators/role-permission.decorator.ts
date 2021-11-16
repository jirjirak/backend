import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

import { RolePermissionMetDataKey } from '../../app/auth/config/role-permission.config';
import { Role } from '../../app/auth/enum/role.enum';
import { RolePermissionGuard } from '../../app/auth/guard/permission.guard';

export const UserRolePermission = (...roles: Role[]) => {
  return applyDecorators(
    ApiBearerAuth(),
    SetMetadata(RolePermissionMetDataKey, [...roles, Role.Owner]),
    UseGuards(AuthGuard('jwt'), RolePermissionGuard),
  );
};
