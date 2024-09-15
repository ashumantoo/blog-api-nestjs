import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { GoogleTokenDto } from '../dtos/googl.token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate.tokens.provider';

@Injectable()
export class GoogleAuthenticationService {
  private oauthClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly generateTokenProvider: GenerateTokensProvider
  ) { }

  onModuleInit() {
    const clientId = this.configService.get('jwt.googleClientId');
    const clientSecret = this.configService.get('jwt.googleClientSecret');
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      // Verify the Google Token Sent By User
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      // Extract the payload from Google Token
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = loginTicket.getPayload();
      // Find the user in the database using the googleId
      const user = await this.usersService.findOneByGoogleId(googleId);
      // If user id found generate the tokens
      if (user) {
        return this.generateTokenProvider.generateTokens(user);
      } else {
        // If not create a new user and generate the tokens
        const newUser = await this.usersService.createGoogleUser({
          email,
          firstName,
          lastName,
          googleId
        });

        return this.generateTokenProvider.generateTokens(newUser);
      }
    } catch (error) {
      // throw Unauthorised exception if not Authorised
      throw new UnauthorizedException(error)
    }
  }
}
