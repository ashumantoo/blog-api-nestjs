import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthTypes } from 'src/auth/enums/auth.types.enum';
import { AUTH_TYPE } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard
  ) { }

  //Default auth stratgey for all route is require authentication
  private static readonly defaultAuthType = AuthTypes.Bearer;

  private readonly authTypeGuardMap: Record<
    AuthTypes,
    CanActivate | CanActivate[]
  > = {
      [AuthTypes.Bearer]: this.accessTokenGuard,
      [AuthTypes.None]: { canActivate: () => true } //if auth type is None that means public route and for those routes I am returning guard as always true
    }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // Print authTypeGuardMap - reflector has access to all the routes meta data
    const authTypes = this.reflector.getAllAndOverride<AuthTypes[]>(
      AUTH_TYPE,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];


    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    // Declare the default error
    let error = new UnauthorizedException();

    for (const instance of guards) {
      // Decalre a new constant
      const canActivate = await Promise.resolve(
        // Here the AccessToken Guard Will be fired and check if user has permissions to acces
        // Later Multiple AuthTypes can be used even if one of them returns true
        // The user is Authorised to access the resource
        instance.canActivate(context),
      ).catch((err) => {
        error = err;
      });

      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
