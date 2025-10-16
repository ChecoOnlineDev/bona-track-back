import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dtos/create-request.dto';
import { UpdateRequestDto } from './dtos/update-request.dto';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class RequestsService {
    private readonly logger = new Logger(RequestsService.name);
    
    constructor(
        private prisma: PrismaService,
        private eventsGateway: EventsGateway, // Inyectamos el gateway
    ) {}

    async create(createRequestDto: CreateRequestDto) {
        try {
            this.logger.log(`📝 Creating new request for table ${createRequestDto.tableId}, type: ${createRequestDto.type}`);
            
            const newRequest = await this.prisma.request.create({
                data: createRequestDto,
            });
            
            this.logger.log(`✅ Request created successfully: ID ${newRequest.id}`);
            
            // Emitimos el evento de nueva petición usando el método seguro
            const emitted = this.eventsGateway.emitEvent('new_request', newRequest);
            
            if (!emitted) {
                this.logger.warn(`⚠️ WebSocket event "new_request" could not be emitted for request ID ${newRequest.id}`);
            }
            
            return newRequest;
        } catch (error) {
            this.logger.error(`❌ Error creating request:`, error);
            throw error;
        }
    }

    async update(id: number, updateRequestDto: UpdateRequestDto) {
        try {
            this.logger.log(`🔄 Updating request ID ${id}, new status: ${updateRequestDto.status}`);
            
            // Lógica para acceptedAt y completedAt
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
            
            this.logger.log(`✅ Request ${id} updated successfully`);
            
            // Emitimos el evento de actualización usando el método seguro
            const emitted = this.eventsGateway.emitEvent('request_update', updatedRequest);
            
            if (!emitted) {
                this.logger.warn(`⚠️ WebSocket event "request_update" could not be emitted for request ID ${id}`);
            }
            
            return updatedRequest;
        } catch (error) {
            this.logger.error(`❌ Error updating request ${id}:`, error);
            throw error;
        }
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
