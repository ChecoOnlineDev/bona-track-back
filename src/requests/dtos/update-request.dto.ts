import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { RequestStatus } from '@prisma/client';

export class UpdateRequestDto {
    @IsEnum(RequestStatus)
    @IsOptional()
    status?: RequestStatus;

    @IsInt()
    @IsOptional()
    waiterId?: number;
}
