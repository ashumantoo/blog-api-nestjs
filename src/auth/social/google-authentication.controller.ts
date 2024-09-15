import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from '../decorators/auth/auth.decorator';
import { AuthTypes } from '../enums/auth.types.enum';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { GoogleTokenDto } from './dtos/googl.token.dto';

@Auth(AuthTypes.None)
@Controller('google-authentication')
export class GoogleAuthenticationController {
  constructor(
    /**
     * Inject googleAuthenticationService
     */
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) { }

  @Post()
  authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAuthenticationService.authenticate(googleTokenDto);
  }
}
