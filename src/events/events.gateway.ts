import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*', // Permitir conexiones desde cualquier origen para la demo
    },
})
export class EventsGateway {
    @WebSocketServer()
    server: Server;
}
