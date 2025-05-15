import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SSEController } from './notification.controller';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [SSEController],
})
export class NotificationModule {}
