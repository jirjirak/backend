import { applyDecorators, UseInterceptors, ClassSerializerInterceptor, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const BasicController = (route: string, isAdminController = false): any => {
  const path = isAdminController ? `admin/${route}` : route;
  const tag = isAdminController ? `${route}-admin` : route;

  return applyDecorators(UseInterceptors(ClassSerializerInterceptor), ApiTags(tag.toUpperCase()), Controller(path));
};
