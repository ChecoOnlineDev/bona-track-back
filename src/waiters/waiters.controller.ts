import { Controller } from '@nestjs/common';
import { WaitersService } from './waiters.service';

@Controller('waiters')
export class WaitersController {
  constructor(private readonly waitersService: WaitersService) {}
}
