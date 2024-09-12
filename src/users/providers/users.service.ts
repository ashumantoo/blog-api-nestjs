import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException, RequestTimeoutException } from "@nestjs/common";
import { GetUserParamsDto } from "../dtos/get.user.params.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { DataSource, Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create.user.dto";
import { ConfigService } from "@nestjs/config";
import { CreateManyUserDto } from "../dtos/create.many.user.dto";

/**==============================================================================================================================
 * 1) the create method of typeorm repository, it will not create the record in the db directly instead it will just create an 
 *    intance of the newUser dto once we call the save on the intance, then typeorm create the user finally in the db.
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
    /**Injecting Config service */
    private readonly configService: ConfigService,
    /** Injeting userRepository */
    @InjectRepository(User)
    private userRepository: Repository<User>,
    //Circular dependancy injection
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    /**Injecting Datasource from typeorm for transaxtions */
    private readonly dataSource: DataSource
  ) { }

  public async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email }
      });
      if (existingUser) {
        throw new BadRequestException("User already exists with the email");
      }
      let newUser = this.userRepository.create(createUserDto);
      newUser = await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find all the users in the db
   */
  public async findAll(
    limit: number,
    page: number
  ) {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by Id
   */
  public async findOneById(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException("User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * create many users at once
   */

  public async createMany(createManyUserDto: CreateManyUserDto) {
    const users: User[] = [];

    // Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      //Crate Database/Datasource connetion
      await queryRunner.connect();

      //Start the transactions
      await queryRunner.startTransaction()
    } catch (error) {
      throw new RequestTimeoutException("Could not connect to the database");
    }

    try {
      for (const user of createManyUserDto.users) {
        //User is Entity
        //user is the user element of the loop
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        users.push(result);
      }
      //Commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      //Rollback the transaction
      await queryRunner.rollbackTransaction();
      throw new ConflictException("Could not complete the transactions", {
        description: String(error)
      })
    } finally {
      try {
        //Release the connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException("Could not release the query runner connections")
      }
    }
    return users;
  }
}