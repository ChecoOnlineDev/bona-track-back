import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { TablesModule } from './tables/tables.module';
import { WaitersModule } from './waiters/waiters.module';
import { RequestsModule } from './requests/requests.module';
import { EventsGateway } from './events/events.gateway';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        TablesModule,
        WaitersModule,
        RequestsModule,
    ],
    controllers: [],
    providers: [EventsGateway],
})
export class AppModule {}
