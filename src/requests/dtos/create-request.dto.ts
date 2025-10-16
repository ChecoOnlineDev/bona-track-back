import {
    IsEnum,
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

    @IsEnum(RequestType)
    @IsNotEmpty()
    type: RequestType;

    @IsString()
    @IsOptional()
    notes?: string;
}
