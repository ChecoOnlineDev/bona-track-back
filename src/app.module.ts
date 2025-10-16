import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TablesModule } from './tables/tables.module';
import { WaitersModule } from './waiters/waiters.module';
import { RequestsModule } from './requests/requests.module';
import { EventsModule } from './events/events.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        TablesModule,
        WaitersModule,
        RequestsModule,
        EventsModule, // Importamos el nuevo módulo de eventos
    ],
    controllers: [],
    providers: [], // Ya no necesita proveer EventsGateway directamente
})
export class AppModule {}
