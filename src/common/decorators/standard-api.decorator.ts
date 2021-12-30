import { HttpCode, HttpStatus, Logger, RequestMethod, UsePipes, Version } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

import { SerializeRelationalFieldPipe } from '../pipes/serialize-relational-field.pipe';
import { CustomApiOperation } from './customApiOperation';
import { StandardSerializer } from './serializer.decorator';
import { StandardApiResponse } from './standard-api-response.decorator';

interface StandardApiInterface {
  type?: any;
  status?: HttpStatus;
  description?: string;
  isArray?: boolean;
  deprecated?: boolean;
  operationId?: string;
  summary?: string;
  isStandard?: boolean;
  ignoreWarning?: boolean;
  version?: number | number[];
  body?: {
    type?: any;
    isArray?: boolean;
  };
}

const logger = new Logger();
export const GlobalHandlerName: string[] = [];

function getMetaData(target: any, propertyKey: string, descriptor: any) {
  return {
    name: propertyKey,
    constructorName: target.constructor.name,
    params: Reflect.getMetadata('design:paramtypes', target, 'getHostSitMap'),
    return: Reflect.getMetadata('design:returntype', target, propertyKey),
    method: Reflect.getMetadata('method', descriptor.value),
  };
}

const getStatusCode = (code) => {
  let statusCode: number;
  switch (code) {
    case [RequestMethod.DELETE, RequestMethod.PUT, RequestMethod.GET].includes(code):
      statusCode = 200;
      break;
    case code === RequestMethod.POST:
      statusCode = 201;
      break;
    default:
      statusCode = 200;
  }

  return statusCode;
};

function defineDecorators(params: StandardApiInterface = {}, target, propertyKey, descriptor): any[] {
  let { status, version = 1, isArray, type } = params;

  const { description, deprecated, operationId, summary, isStandard = true, ignoreWarning, body } = params;

  // init
  isArray = type?.constructor?.name === 'Array';
  type = type?.constructor?.name === 'Array' ? type?.[0] : type;

  const metaData = getMetaData(target, propertyKey, descriptor);

  const convertedVersion = typeof version === 'number' ? String(version) : version.map((i) => String(i));

  let decorators = [HttpCode(status), Version(convertedVersion), UsePipes(new SerializeRelationalFieldPipe())];

  if (metaData.method === undefined && ignoreWarning !== false && !status) {
    logger.warn(
      `Use Standard Api upper than Method Decorators ( @GET , @POST , ...) ${metaData.name}-${metaData.constructorName}`,
      'INIT API',
    );
  }
  status ||= getStatusCode(metaData.method);

  if (isStandard !== false && type) {
    decorators = [
      ...decorators,
      StandardSerializer(type),
      CustomApiOperation({ deprecated, operationId, summary }),
      StandardApiResponse({
        type,
        status,
        description,
        isArray,
      }),
    ];
  }

  if (body?.type) {
    body.isArray ||= body?.type?.constructor?.name === 'Array';
    body.type = body.isArray ? body.type[0] : body.type;

    decorators = [...decorators, ApiBody({ type: body?.type, isArray: body?.isArray })];

    if (body.isArray) {
      // decorators.push(
      //   UsePipes(
      //     new ParseArrayPipe({
      //       whitelist: true,
      //       forbidUnknownValues: true,
      //       items: body?.type,
      //       stopAtFirstError: false,
      //       enableDebugMessages: true,
      //     }),
      //   ),
      // );
    }
  }

  return decorators;
}

export function StandardApi(params?: StandardApiInterface) {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return (target: any, propertyKey: string, descriptor: any) => {
    const decorators = defineDecorators(params, target, propertyKey, descriptor);
    for (const decorator of decorators) {
      if (target instanceof Function && !descriptor) {
        decorator(target);
        continue;
      }
      decorator(target, propertyKey, descriptor);
    }
  };
}
