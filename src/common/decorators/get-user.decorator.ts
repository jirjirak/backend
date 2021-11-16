import { ExecutionContext, createParamDecorator, Logger } from '@nestjs/common';
import { isEmpty } from 'lodash';

const logger = new Logger();

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (isEmpty(request.user)) {
    logger.warn('Use << UserRolePermission >> Decorator on top of controller to get correct result', 'GetUser');
  }

  return data ? request?.user?.[data] : request?.user;
});
