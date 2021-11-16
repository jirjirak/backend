import { InternalServerErrorException } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

export function Paginate(page: number, limit?: number) {
  if (page < 1) {
    throw new InternalServerErrorException('page must be  > 0 ');
  }

  return {
    skip: (page - 1) * limit,
    take: limit || 8,
  };
}

export async function PaginateQuery<T>(
  qb: SelectQueryBuilder<T>,
  params: { page: number; limit?: number; mode?: 'legacy' | 'modern' },
): Promise<[T[], number]> {
  const limit = params?.limit || 8;
  const mode = params?.mode || 'legacy';
  const page = params?.page || 1;

  if (page < 1) {
    throw new InternalServerErrorException('page must be  > 0 ');
  }

  if (mode === 'legacy') {
    qb.limit(limit).offset((page - 1) * limit);
  } else if (mode === 'modern') {
    qb.take(limit).skip((page - 1) * limit);
  } else {
    throw new InternalServerErrorException('mode is not valid');
  }

  return await qb.getManyAndCount();
}
