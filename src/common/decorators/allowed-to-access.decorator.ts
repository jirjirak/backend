import { UseGuards, applyDecorators } from '@nestjs/common';

import { Source, Action, AllowedToAccessGuard } from '../../app/auth/guard/access.guard';

export function AllowedToAccess(action: Action, source: Source) {
  return applyDecorators(UseGuards(new AllowedToAccessGuard(action, source)));
}
