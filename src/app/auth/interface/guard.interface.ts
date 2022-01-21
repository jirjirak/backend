import { TeamRole } from 'src/app/account/enum/team.enum';

export interface UserIsOwnerOptionInterface {
  role?: TeamRole;
  area?: 'body' | 'params' | 'query';
  identify?: 'team' | 'monitor';
}
