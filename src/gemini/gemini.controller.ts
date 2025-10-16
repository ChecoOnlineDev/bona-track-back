import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { IsString, IsNotEmpty } from 'class-validator'; // <-- 1. IMPORTA LOS DECORADORES

// DTO para validar el cuerpo de la petición
class AskDto {
    @IsString() // <-- 2. AÑADE ESTOS DECORADORES
    @IsNotEmpty() // <-- 3. AÑADE ESTOS DECORADORES
    question: string;
}

@Controller('gemini')
export class GeminiController {
    constructor(private readonly geminiService: GeminiService) {}

    @Post('ask')
    @HttpCode(HttpStatus.OK)
    async askQuestion(@Body() askDto: AskDto) {
        // Ahora askDto.question tendrá el valor correcto
        const answer = await this.geminiService.askAI(askDto.question);
        return { answer };
    }
}
