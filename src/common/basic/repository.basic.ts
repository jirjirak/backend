import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { isBoolean, isEmpty, isObject, isUndefined, omitBy } from 'lodash';
import {
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  getRepository,
  ObjectID,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SaveOptions,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Paginate } from '../functions/pagination.func';

export interface PaginationInterface {
  page?: number;
  limit?: number;
}

interface SQB<Entity> extends SelectQueryBuilder<Entity> {
  pagination(this: SQB<Entity>, params: { page: number; limit?: number; mode?: 'legacy' | 'modern' }): SQB<Entity>;
}

interface CustomFindOneOptions<Entity> extends FindOneOptions<Entity> {
  where?:
    | FindConditions<Entity>[]
    | FindConditions<Entity>
    | ObjectLiteral
    | string
    | ((qb: SelectQueryBuilder<Entity>) => any);
}

export interface CustomFindManyOptions<Entity> extends CustomFindOneOptions<Entity> {
  skip?: number;
  take?: number;
}

export type FindType<Entity> =
  | (CustomFindManyOptions<Entity> & PaginationInterface)
  | (FindConditions<Entity> & PaginationInterface);

export type FindOneType<Entity> = FindConditions<Entity> | CustomFindOneOptions<Entity>;

export type FindManyType<Entity> =
  | (CustomFindManyOptions<Entity> & PaginationInterface)
  | (FindConditions<Entity> & PaginationInterface);

export type FindOneOptionsType<Entity> = CustomFindOneOptions<Entity>;

@Injectable()
export class BasicRepository<Entity> extends Repository<Entity> {
  private readonly logger = new Logger();
  private loggerIsLock = false;
  private t1: number;

  constructor() {
    super();
  }

  private logPerformanceStart(): void {
    if (this.loggerIsLock === false) {
      this.loggerIsLock = true;
      this.t1 = +new Date();
    }
  }

  private logPerformanceEnd(enabled = false): void {
    if (enabled && this.loggerIsLock) {
      this.logger.debug(`Execute sql query take ${+new Date() - this.t1} ms`, 'QueryPerformance');
      this.loggerIsLock = false;
    }
  }

  async isOwner(id: number, userId: number): Promise<boolean> {
    this.logPerformanceStart();
    const result = await this.count({ where: { id, user: userId } });
    this.logPerformanceEnd();
    return result > 0;
  }

  async createAndSave(
    data: QueryDeepPartialEntity<Entity>,
    options?: SaveOptions & { relations?: string[] },
  ): Promise<Entity> {
    this.logPerformanceStart();

    if (isEmpty(data)) {
      throw new InternalServerErrorException();
    }

    let savedEntity: any;

    delete data['id'];

    const clearedData = omitBy(data as any, (key) => isUndefined(key));
    const dataEntity = super.create(clearedData as any);

    try {
      savedEntity = await super.save(dataEntity, options);
    } catch (e) {
      this.logger.error(e.message, 'QUERY');
      throw new InternalServerErrorException();
    }

    const createdWithMedia = await this.findOne(savedEntity.id, {
      relations: options?.relations || [],
    });

    this.logPerformanceEnd();

    return createdWithMedia;
  }

  async updateById(
    id: number,
    data: QueryDeepPartialEntity<Entity> | any,
    options?: { returning?: boolean; relations?: string[] },
  ): Promise<Entity> {
    this.logPerformanceStart();

    if (isEmpty(data)) {
      throw new InternalServerErrorException();
    }

    data = { ...data, id };

    try {
      await super.save(data);
    } catch (e) {
      this.logger.error(e.message, 'QUERY');
      throw new InternalServerErrorException();
    }

    const returnData = isBoolean(options?.returning) ? options?.returning : true;

    if (!returnData) {
      return;
    }
    const record = await this.findOne(id, {
      relations: options?.relations || [],
    });

    this.logPerformanceEnd();

    return record;
  }

  async find(optionsOrConditions?: FindType<Entity>): Promise<Entity[]> {
    this.logPerformanceStart();

    let pagination = {};
    if (optionsOrConditions?.page) {
      pagination = Paginate(optionsOrConditions.page, optionsOrConditions.limit);
    }

    const result = await super.find({ ...optionsOrConditions, ...pagination });

    this.logPerformanceEnd();
    return result;
  }

  async findAndCount(optionsOrConditions?: FindManyType<Entity>): Promise<[Entity[], number]> {
    this.logPerformanceStart();

    let pagination = {};
    if (optionsOrConditions?.page) {
      pagination = Paginate(optionsOrConditions.page, optionsOrConditions.limit);
    }

    const [result, total] = await super.findAndCount({ ...optionsOrConditions, ...pagination });

    this.logPerformanceEnd();

    return [result, total];
  }

  async findOne(optionsOrConditions?: FindOneType<Entity>, maybeOptions?: FindOneOptionsType<Entity>): Promise<Entity> {
    this.logPerformanceStart();

    const result = await super.findOne(optionsOrConditions, maybeOptions);

    this.logPerformanceEnd();
    return result;
  }

  async count(optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>): Promise<number> {
    this.logPerformanceStart();
    const result = await super.count(optionsOrConditions);
    this.logPerformanceEnd();
    return result;
  }

  async update(
    criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ): Promise<UpdateResult> {
    this.logPerformanceStart();

    const result = await super.update(criteria, partialEntity);

    this.logPerformanceEnd();

    return result;
  }

  private customCreateQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<Entity> {
    return this.manager.createQueryBuilder<Entity>(
      this.metadata.target as any,
      alias || this.metadata.targetName,
      queryRunner || this.queryRunner,
    );
  }

  private queryBuilderCustomFunctions(qb: SQB<Entity>): void {
    //pagination function

    qb.pagination = function (
      this: SQB<Entity>,
      params: { page: number; limit?: number; mode?: 'legacy' | 'modern' },
    ): SQB<Entity> {
      const mode = params?.mode || 'modern';
      const limit = params?.limit || 8;

      const { page } = params;

      if (mode === 'modern') {
        this.take(limit).skip((page - 1) * limit);
      } else if (mode === 'legacy') {
        this.limit(limit).offset((page - 1) * limit);
      }

      return this;
    };
  }

  createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SQB<Entity> {
    const qb = this.customCreateQueryBuilder(alias, queryRunner);
    this.queryBuilderCustomFunctions(qb as SQB<Entity>);
    return qb as SQB<Entity>;
  }
}
