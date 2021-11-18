import { UseGuards, applyDecorators } from '@nestjs/common';

import { UserIsOwner } from '../../app/auth/guard/user-is-owner.guard';
import { UserIsOwnerOptionInterface } from '../../app/auth/interface/guard.interface';

export function IsOwner<T>(entity: T, options?: UserIsOwnerOptionInterface) {
  return applyDecorators(UseGuards(new UserIsOwner(entity, options)));
}
