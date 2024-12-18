import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health(): string {
    return this.appService.getHealth(); // check vitals
  }

  @Get()
  hello(): string {
    return this.appService.getHello();
  }
}
