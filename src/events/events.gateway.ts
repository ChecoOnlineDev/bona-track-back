import { 
    WebSocketGateway, 
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*', // Permitir conexiones desde cualquier origen para la demo
    },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    
    private logger: Logger = new Logger('EventsGateway');

    afterInit(server: Server) {
        this.logger.log('✅ WebSocket Gateway initialized');
        this.logger.log(`🔌 WebSocket server is ready on port ${server.httpServer?.address() || 'unknown'}`);
    }

    handleConnection(client: Socket) {
        this.logger.log(`🔗 Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`🔌 Client disconnected: ${client.id}`);
    }
    
    // Helper method to safely emit events
    emitEvent(event: string, data: any) {
        if (!this.server) {
            this.logger.error(`❌ Cannot emit event "${event}": Server not initialized`);
            return false;
        }
        
        try {
            this.server.emit(event, data);
            this.logger.log(`📤 Event emitted: ${event}`, JSON.stringify(data));
            return true;
        } catch (error) {
            this.logger.error(`❌ Error emitting event "${event}":`, error);
            return false;
        }
    }
}
