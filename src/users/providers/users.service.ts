import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GetUserParamsDto } from "../dtos/get.user.params.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create.user.dto";

/**==============================================================================================================================
 * 1) the create method of typeorm repository, it will not create the record in the db directly instead it will just create an 
 *    intance of the newUser dto once we call the save on the intance, then typeorm create the user finally in the db.
 *  
 */

/**
 * User service 
 */
@Injectable()
export class UsersService {
  /**
   * Constructor to initialize different services/provides
   */
  constructor(
    /** Injeting userRepository */
    @InjectRepository(User)
    private userRepository: Repository<User>,
    //Circular dependancy injection
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) { }

  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });
    let newUser = this.userRepository.create(createUserDto);
    newUser = await this.userRepository.save(newUser);
    return newUser;
  }

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
  public async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }
}