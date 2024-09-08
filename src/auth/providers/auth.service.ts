import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

/**
 * Auth service class
 */
@Injectable()
export class AuthService {
  /**Circular dependancy injection using forwardRef()*/
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) { }

  /**
   * User login
   */
  public login(email: string, password: string, userId: string) {
    //check if user exists in the database
    const user = this.usersService.findOneById(userId)
    //login

    //token
  }

  /**
   * Check if user is successfully logined or not
   */
  public isAuthenticated() {
    return true;
  }
}
