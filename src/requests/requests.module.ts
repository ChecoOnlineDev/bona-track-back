import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EventsGateway } from '../events/events.gateway'; // Importamos el gateway

@Module({
    imports: [PrismaModule],
    controllers: [RequestsController],
    providers: [RequestsService, EventsGateway], // Lo añadimos como provider
})
export class RequestsModule {}
