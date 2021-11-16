import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from '@nestjs/common';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { serialize } from 'class-transformer';
import { isArray, isEmpty, isObject } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CustomSerializerInterceptor implements NestInterceptor {
  type: any;
  customOptions: ClassTransformOptions;

  TypeOfData = 'type';

  private defaultOptions: ClassTransformOptions = {
    enableCircularCheck: true, // circle check fot nested class
    strategy: 'excludeAll', // default strategy to strip all field expect exposed property
    excludeExtraneousValues: true, // strip unexposed property
    enableImplicitConversion: true, // check type
    excludePrefixes: ['_'],
    exposeDefaultValues: undefined,
  };

  constructor(type: ClassConstructor<unknown>, options?: ClassTransformOptions) {
    this.type = type;
    this.customOptions = options;
  }

  private serializeResponse(
    type: ClassConstructor<unknown>,
    data: any | any[],
    options: ClassTransformOptions,
  ): any | any[] {
    data = data?.data || data;

    let serializedData = plainToClass(type, data, options);

    serializedData = JSON.parse(serialize(serializedData));

    if (isArray(serializedData)) {
      serializedData = serializedData.filter((item) => !isEmpty(item));
    }

    return serializedData;
  }

  private TypeOf(data: any): string {
    if (isArray(data)) return 'array';
    else if (isObject(data)) return 'object';
    else return typeof data;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data) => {
        if (!data) {
          throw new NotFoundException();
        }

        const result = { meta: {}, data: null };

        const serializedData = this.serializeResponse(this.type, data, this.customOptions || this.defaultOptions);

        result.data = serializedData;

        if (data.meta) {
          data.meta[this.TypeOfData] = this.TypeOf(serializedData);
          data.meta['len'] = serializedData.length || null;

          result.meta = data.meta;
        } else {
          result.meta[this.TypeOfData] = this.TypeOf(serializedData);
          result.meta['len'] = serializedData.length || null;
        }

        return result;
      }),
    );
  }
}
