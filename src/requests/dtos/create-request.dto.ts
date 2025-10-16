import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { RequestType } from '@prisma/client';

export class CreateRequestDto {
    @IsInt()
    @IsNotEmpty()
    tableId: number;

    @IsString() // Cambiado de IsEnum a IsString
    @IsNotEmpty()
    type: RequestType;

    @IsString()
    @IsOptional()
    notes?: string;
}
