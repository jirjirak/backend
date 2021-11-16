import { Global, Module } from '@nestjs/common';
import { BootstrapService } from './service/bootstrap.service';

@Global()
@Module({
  providers: [BootstrapService],
})
export class CommonModule {}
