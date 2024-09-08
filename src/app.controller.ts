import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * App controller class
 */
@Controller()
export class AppController {
  /**
   * contructor to inject different services
   */
  constructor(private readonly appService: AppService) { }
}
