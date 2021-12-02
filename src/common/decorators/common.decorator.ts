import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

export const RelationalFieldMetaDataKey = 'RelationalFieldMetaDataKey';

export interface relationalFieldMetaData {
  property: string;
  entity: string;
}

function getPropMetaData(
  params: { type?: any; isArray?: boolean; [k: string]: any },
  target: any,
  propertyKey: string,
): { propertyType: any; type: any; isArray: boolean } {
  const propertyType = Reflect.getMetadata('design:type', target, propertyKey);

  const isArray = params?.isArray || propertyType?.name === 'Array';
  const type = params?.type || propertyType;

  return { propertyType, type, isArray };
}

interface CommonDecoratorParam {
  type?: any;
  isArray?: boolean;
  required?: boolean;
}

export function IsPrimaryField(params?: {
  transferTo?: any;
  isArray?: boolean;
  required?: boolean;
  convert?: boolean;
}): PropertyDecorator {
  return function (target: any, propertyKey: string): void {
    params ||= {};

    const { isArray } = getPropMetaData(params, target, propertyKey);

    IsInt({ each: isArray })(target, propertyKey);
    Type(() => Number)(target, propertyKey);
    Expose()(target, propertyKey);
    ApiProperty({ required: params?.required, type: Number, isArray })(target, propertyKey);

    if (params?.required === false) {
      IsOptional()(target, propertyKey);
    }

    if (params.convert !== false) {
      let relationalFields: relationalFieldMetaData[] = Reflect.getMetadata(
        RelationalFieldMetaDataKey,
        target.constructor,
      );

      relationalFields ||= [];

      relationalFields.push({ entity: params?.transferTo?.name, property: propertyKey });

      Reflect.defineMetadata(RelationalFieldMetaDataKey, relationalFields, target.constructor);
    }
  };
}

export function IsReferenceField(params?: { type?: any; isArray?: boolean; required?: boolean }) {
  return function (target: any, propertyKey: string): void {
    const { isArray, type, propertyType } = getPropMetaData(params, target, propertyKey);

    ApiProperty({ type, isArray })(target, propertyKey);
    Type(() => type)(target, propertyKey);
    Expose()(target, propertyKey);

    if (isArray) {
      IsArray()(target, propertyKey);
      ValidateNested()(target, propertyKey);
    }

    if (params?.required === false) {
      IsOptional()(target, propertyKey);
    }
  };
}

export function IsStringField(params?: { type?: any; isArray?: boolean; required?: boolean }) {
  return function (target: any, propertyKey: string): void {
    params ||= {};
    const { isArray } = getPropMetaData(params, target, propertyKey);

    ApiProperty({ type: String, required: params.required, isArray })(target, propertyKey);
    IsString({ each: isArray })(target, propertyKey);
    Type(() => String)(target, propertyKey);
    IsNotEmpty({ each: isArray })(target, propertyKey);
    Expose()(target, propertyKey);

    if (params?.required === false) {
      IsOptional()(target, propertyKey);
    }
  };
}

export function IsRegExpField(pattern: RegExp, params?: { type?: any; isArray?: boolean; required?: boolean }) {
  return function (target: any, propertyKey: string): void {
    params ||= {};
    const { isArray } = getPropMetaData(params, target, propertyKey);

    ApiProperty({ type: String, required: params.required, isArray })(target, propertyKey);
    Matches(pattern, { each: isArray })(target, propertyKey);
    Expose()(target, propertyKey);

    if (params?.required === false) {
      IsOptional()(target, propertyKey);
    }
  };
}

export function IsNumberField(params?: { type?: any; isArray?: boolean; required?: boolean }) {
  return function (target: any, propertyKey: string) {
    params ||= {};
    const { isArray } = getPropMetaData(params, target, propertyKey);

    ApiProperty({ type: Number, required: params.required, isArray })(target, propertyKey);
    IsNumber({}, { each: isArray })(target, propertyKey);
    Type(() => Number)(target, propertyKey);
    IsNotEmpty({ each: isArray })(target, propertyKey);
    Expose()(target, propertyKey);

    if (params?.required === false) {
      IsOptional()(target, propertyKey);
    }
  };
}

export function IsBooleanField(params?: { type?: any; isArray?: boolean; required?: boolean }) {
  return function (target: any, propertyKey: string) {
    params ||= {};
    const { isArray } = getPropMetaData(params, target, propertyKey);

    ApiProperty({ type: Boolean, required: params.required, isArray })(target, propertyKey);
    IsBoolean({ each: isArray })(target, propertyKey);
    Type(() => Boolean)(target, propertyKey);
    Expose()(target, propertyKey);

    if (params?.required === false) {
      IsOptional()(target, propertyKey);
    }
  };
}

export function IsDateField(params?: { type?: any; isArray?: boolean; required?: boolean }) {
  return function (target: any, propertyKey: string) {
    params ||= {};
    const { isArray } = getPropMetaData(params, target, propertyKey);

    ApiProperty({ type: Date, required: params.required, isArray })(target, propertyKey);
    IsDate({ each: isArray })(target, propertyKey);
    Type(() => Date)(target, propertyKey);
    IsNotEmpty({ each: isArray })(target, propertyKey);
    Expose()(target, propertyKey);

    if (params?.required === false) {
      IsOptional()(target, propertyKey);
    }
  };
}

export function IsEnumField(params?: { type?: any; isArray?: boolean; required?: boolean }) {
  return function (target: any, propertyKey: string): void {
    params ||= {};
    const { isArray, type } = getPropMetaData(params, target, propertyKey);

    ApiProperty({ enum: type, required: params.required, isArray })(target, propertyKey);
    IsEnum(type, { each: isArray })(target, propertyKey);
    Expose()(target, propertyKey);

    if (params?.required === false) {
      IsOptional()(target, propertyKey);
    }
  };
}

export function IsPrimaryKeyField(params?: { type?: any; isArray?: boolean; required?: boolean }): PropertyDecorator {
  return function (target: any, propertyKey: string): void {
    params ||= {};

    const { isArray, type } = getPropMetaData(params, target, propertyKey);

    IsInt({ each: isArray })(target, propertyKey);
    Type(() => Number)(target, propertyKey);
    Expose()(target, propertyKey);
    Min(1)(target, propertyKey);
    ApiProperty({ required: params?.required, type: Number, isArray })(target, propertyKey);

    if (params?.required === false) {
      IsOptional()(target, propertyKey);
    }

    let relationalFields: relationalFieldMetaData[] = Reflect.getMetadata(
      RelationalFieldMetaDataKey,
      target.constructor,
    );

    relationalFields ||= [];

    relationalFields.push({ entity: type?.name, property: propertyKey });

    Reflect.defineMetadata(RelationalFieldMetaDataKey, relationalFields, target.constructor);
  };
}

export function IsTimeField(params?: CommonDecoratorParam) {
  return function (target: any, propertyKey: string): void {
    params ||= {};

    const pattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    const { isArray } = getPropMetaData(params, target, propertyKey);
    ApiProperty({ required: params.required, isArray, type: 'string', pattern: String(pattern) })(target, propertyKey);
    Matches(pattern);
    Expose()(target, propertyKey);

    if (params?.required === false) {
      IsOptional()(target, propertyKey);
    }
  };
}

export function InjectableService() {
  return function (target: any): void {
    Injectable()(target);
  };
}

export const ReflectMultiLanguagePropertyKey = 'MultiLanguagePropertyKey';

export interface MultiLanguageReflectInterface {
  type: string;
  propertyName: string;
  targetEntity: string;
}

export function MultiLanguageColumn(targetEntity: any) {
  return function (target: any, propertyKey: string): void {
    const data: MultiLanguageReflectInterface = {
      type: target.constructor.name,
      propertyName: propertyKey,
      targetEntity: targetEntity.name,
    };
    Reflect.defineMetadata(ReflectMultiLanguagePropertyKey, data, target.constructor);
  };
}
