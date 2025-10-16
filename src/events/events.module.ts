import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway], // Exportamos el Gateway para que otros módulos puedan usarlo
})
export class EventsModule {}