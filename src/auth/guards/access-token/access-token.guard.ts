import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

//TODO: Go through this flow again - little bit complicated to understand
//https://www.udemy.com/course/nestjs-masterclass-complete-course/learn/lecture/44530713#overview
@Injectable()
export class AccessTokenGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly conffigService: ConfigService
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    //Extract the request from the execution context
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.conffigService.get('jwt.secret')
        }
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException("Invalid access token");
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
