// src/gemini/gemini.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GeminiService {
    private readonly logger = new Logger(GeminiService.name);
    private ai: GoogleGenAI;

    constructor(private prisma: PrismaService) {
        if (!process.env.GEMINI_API_KEY) {
            this.logger.error('La API KEY no esta definida en el entorno');
            throw new Error('GEMINI_API_KEY no está definida');
        }
        this.ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
    }

    async askAI(userQuestion: string): Promise<string> {
        this.logger.log(`Recibida pregunta para la IA: "${userQuestion}"`);

        // 1. Obtener datos relevantes de la base de datos usando Prisma
        // Usamos tus modelos: Request, Table, Waiter.
        const requests = await this.prisma.request.findMany({
            take: 100, // Limitamos a los últimos 100 para no exceder el contexto
            orderBy: { createdAt: 'desc' },
            include: {
                table: true, // Incluimos la info de la mesa
                waiter: true, // y del mesero
            },
        });

        const tables = await this.prisma.table.findMany();
        const waiters = await this.prisma.waiter.findMany();

        // 2. Construir el prompt con el contexto de tus datos
        const prompt = `
            Eres un asistente experto en análisis de datos para el restaurante "BonaTrack".
            Tu tarea es responder preguntas en lenguaje natural basadas en los datos que te proporcionaré en formato JSON.
            Sé claro, conciso y amigable en tus respuestas.

            Aquí están los datos actuales del sistema:

            ---
            ### MESAS DISPONIBLES (${tables.length} en total):
            ${JSON.stringify(tables, null, 2)}

            ---
            ### MESEROS REGISTRADOS (${waiters.length} en total):
            ${JSON.stringify(waiters, null, 2)}

            ---
            ### ÚLTIMAS 100 SOLICITUDES:
            ${JSON.stringify(requests, null, 2)}
            ---

            Basado EXCLUSIVAMENTE en los datos anteriores, por favor responde la siguiente pregunta:
            
            PREGUNTA: "${userQuestion}"
        `;

        // 3. Llamar a la API de Gemini
        try {
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const text = response.text;

            if (!text) {
                this.logger.warn('⚠️ La IA no generó una respuesta válida.');
                throw new Error('La IA no pudo generar una respuesta.');
            }

            this.logger.log(`✅ Respuesta generada por la IA.`);
            return text;
        } catch (error) {
            this.logger.error('❌ Error al contactar la API de Gemini:', error);
            throw new Error('No se pudo obtener una respuesta de la IA.');
        }
    }

    async getAvailableTables(): Promise<any[]> {
        this.logger.log('Obteniendo mesas disponibles...');
        const tables = await this.prisma.table.findMany();
        return tables;
    }
}
