import { IsBooleanField } from '../decorators/common.decorator';

export class DeleteResDto {
  @IsBooleanField()
  sucess: boolean;
}
