import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [PrismaModule, EventsModule], // Importamos EventsModule
    controllers: [RequestsController],
    providers: [RequestsService], // Ya no proveemos EventsGateway aquí
})
export class RequestsModule {}

