import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dtos/create-request.dto';
import { UpdateRequestDto } from './dtos/update-request.dto';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class RequestsService {
    constructor(
        private prisma: PrismaService,
        private eventsGateway: EventsGateway, // Inyectamos el gateway
    ) {}

    async create(createRequestDto: CreateRequestDto) {
        const newRequest = await this.prisma.request.create({
            data: createRequestDto,
        });
        // Emitimos el evento de nueva petición
        this.eventsGateway.server.emit('new_request', newRequest);
        return newRequest;
    }

    async update(id: number, updateRequestDto: UpdateRequestDto) {
        // ... (lógica para acceptedAt y completedAt)
        const data = { ...updateRequestDto };
        if (updateRequestDto.status === 'EN_CAMINO') {
            data['acceptedAt'] = new Date();
        }
        if (updateRequestDto.status === 'COMPLETADO') {
            data['completedAt'] = new Date();
        }

        const updatedRequest = await this.prisma.request.update({
            where: { id },
            data,
        });
        // Emitimos el evento de actualización
        this.eventsGateway.server.emit('request_update', updatedRequest);
        return updatedRequest;
    }

    // ... findAll, findOne, remove no necesitan emitir eventos
    findAll() {
        return this.prisma.request.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    findOne(id: number) {
        return this.prisma.request.findUnique({ where: { id } });
    }
    remove(id: number) {
        return this.prisma.request.delete({ where: { id } });
    }
}
