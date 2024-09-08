import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GetUserParamsDto } from "../dtos/get.user.params.dto";
import { AuthService } from "src/auth/providers/auth.service";

/**
 * User service 
 */
@Injectable()
export class UsersService {
  /**
   * Constructor to initialize different services/provides
   */
  constructor(
    //Circular dependancy injection
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) { }

  
  /**
   * Find all the users in the db
   */
  public findAll(
    getUserParamsDto: GetUserParamsDto,
    limit: number,
    page: number
  ) {
    return [
      {
        firstName: "Mantoo",
        lastName: "Ashutosh"
      },
      {
        firstName: "KK",
        lastName: "MM"
      }
    ]
  }

  /**
   * Find user by Id
   */
  public findOneById(id: string) {
    const authenticated = this.authService.isAuthenticated();
    return {
      id: 12345,
      firstName: "Mantoo",
      lastName: "Ashutosh",
      email: "ashumantoo@gmail.com"
    }
  }
}