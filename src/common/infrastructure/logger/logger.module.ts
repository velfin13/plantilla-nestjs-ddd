import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [
    {
      provide: 'LoggerService',
      useClass: LoggerService,
    },
    LoggerService,
  ],
  exports: ['LoggerService', LoggerService],
})
export class LoggerModule {}
