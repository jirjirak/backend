export interface UserIsOwnerOptionInterface {
  sourcePkField?: string;
  targetPkField?: string;
  area?: 'body' | 'params' | 'query';
  identify?: 'doctor' | 'user';
}
